import requests
from datetime import datetime
from functools import lru_cache
from typing import Union

from django.conf import settings
from Redis.classes import Redis

from .utils import timescale_is_valid, parse_data
from .decorators import valid_equity_required, valid_timescale_required
from .constants import equity_symbols, timescales
from .exceptions import *


@lru_cache
def is_valid_equity(equity_symbol):
    try:
        if equity_symbol.upper() in equity_symbols:
            return True

    except AttributeError:
        raise AttributeError("The equity symbol must be a string.")


def compare_dates(date):
    current_date = datetime.now()
    passed_data = date.split('-')
    try:
        passed_year, passed_month, passed_day = passed_data[0], passed_data[1], passed_data[2]
        compare_date = datetime(year=int(passed_year), month=int(passed_month), day=int(passed_day))
        if (current_date - compare_date).days == 1:
            return True

        else:
            return False

    except AttributeError:
        raise AttributeError("Passed datetime objects are not dates.")


class Equity:
    # Todo: Add method for retrieving yesterday's data (and updating historical_data with this data).
    @valid_equity_required
    def __init__(self, equity):
        self.equity = equity
        self.db = Redis()
        self.IEX_TOKEN = settings.IEXCLOUD_TOKEN
        self.sort_by_date = lambda date_str: datetime.strptime(date_str, "%Y-%m-%d")

    @property
    def price(self):
        try:
            return self.db.get(f"{self.equity}-price")
        except KeyError:
            return MissingPriceData(f"Price data for {self.equity} is unavailable.")

    @price.setter
    def price(self, payload: Union[float, int]):
        self.db.set(key=f"{self.equity}-price", value=payload, permanent=True)

    @property
    def close(self):
        """
        Returns closing information (close price, timestamp) for a specified equity symbol.
        :return: dict {'close': float, 'timestamp' int}
        """
        return self.db.get(key=f"{self.equity}-close")

    @close.setter
    def close(self, payload: dict):
        self.db.set(key=f"{self.equity}-close", value=payload, permanent=True)

    @property
    def historical_data(self):
        return self.db.get(key=f"{self.equity}")

    @valid_timescale_required
    def set_historical_data(self, timescale):
        historical_data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/chart/{timescale}/?token={self.IEX_TOKEN}").json()
        parsed_data = parse_data(data=historical_data, timescale=timescale)
        self.db.set(key=f"{self.equity}", value=parsed_data, permanent=True)

    @property
    def intraday_data(self):
        return self.db.get(key=f"{self.equity}-intraday")

    def set_intraday_data(self):
        intraday_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.equity}/intraday-prices/?token={self.IEX_TOKEN}").json()
        self.db.set(key=f"{self.equity}-intraday", value=intraday_data)

    @property
    def websocket_data(self) -> dict:
        """
        Provides websocket data, a dict of {
        "price": float - Realtime price.
        "close": float - Closing price.
        "type": string - "increase" or "decrease" depending if price increased from closing price.
        "percentage": float - Percentage change.
        }
        :return:
        """
        percentage = ((self.price - self.close['close']) / self.close['close']) * 100
        type_ = lambda diff: "DECREASE" if diff < 0 else "INCREASE"

        return {
            "price": self.price,
            "close": self.close['close'],
            "type": type_(percentage),
            "percentage": abs(percentage)
        }

class EquityMovingAvg(Equity):
    """
    EquityMovingAvg is a separate class as it can encapsulate both the SMA and EMA indicators.
    """
    def __init__(self, equity: str, timescale: str, exponential: bool):
        super().__init__(equity=equity)

        if timescale_is_valid(timescale=timescale):
            self.timescale = timescale

        # String representation of indicator
        self.moving_average_indicator: str = "SMA" if not exponential else "EMA"

    @property
    def moving_average(self) -> list:
        """Returns cached moving_averages in format {date: "%Y-%m-%d", "sma"/"ema": float}"""
        data = self.db.get(key=f"{self.equity}-{self.moving_average_indicator}")
        if self.timescale == "ytd":
            return data

        parse_data(data, self.timescale)

    def set_moving_average(self) -> None:
        """
        Caches the moving average (simple or exponential) into database.
        """

        available_data = []
        try:
            available_data = self.db.get(f"{self.equity}-{self.moving_average_indicator}")

        except KeyError:
            pass

        data = self.get_moving_avg()

        # Apply data to available_data
        for ma_dict in data:
            date = ma_dict['date']
            ma = ma_dict[self.moving_average_indicator]
            # Ensures we do not handle duplicate data
            if date not in available_data:
                available_data.append({
                    "date": date,
                    self.moving_average_indicator: ma
                })

        # Cached to Redis database.
        self.db.set(key=f"{self.equity}-{self.moving_average_indicator}", value=available_data, permanent=True)

    def get_moving_avg(self) -> list:
        """
        Returns the moving average (simple or exponential) sorted in ascending order.
        :return: list - [{"date": "%Y-%m-%d", "sma/ema": float, ...}]
        """
        parsed_data = []
        data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/indicator/{self.moving_average_indicator}?range={self.timescale}&token={self.IEX_TOKEN}").json()

        ma, chart = data

        for index, ma in enumerate(reversed(data[ma][0])):
            if ma is not None:
                parsed_data.append({
                    "date": data[chart][index]["date"],
                    self.moving_average_indicator: float(ma)
                })

        return parsed_data


class EquityIndicators(Equity):
    def __init__(self, equity: str, timescale: str):
        super().__init__(equity=equity)

        # Verifies that specified time_range is valid
        if timescale in timescales:
            self.time_range = timescale
        else:
            if timescale is None:
                raise TimeRangeRequired("A time range must be specified.")

            else:
                raise InvalidTimescale("Passed time_range parameter is not a valid time range.")

    @property
    def bbands(self) -> list:
        """
        Returns cached of bbands data in format [{date: "%Y-%m-%d, upper: float, middle: float, lower: float}, {...}]
        """
        return self.db.get(key=f"{self.equity}-bbands")

    def set_bbands(self) -> None:
        """Caches bbands data (in the format returned by self.get_bands())"""
        self.db.set(key=f"{self.equity}-bbands", value=self.get_bbands(), permanent=True)

    def get_bbands(self) -> list:
        """
        Returns bbands data in ascending order, in the format
        [{
        date: "%Y-%m-%d,
        upper: float,
        middle: float,
        lower: float},
        {...}]
        where "upper", "middle" and "lower" refer to the upper, middle, and lower bollinger bands.
        """
        # input1 is the period in days. Default is 15 days.
        input1 = 15
        # input2 is the number of std. deviations. Default is 2.
        input2 = 2

        parsed_data = []
        data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/indicator/bbands?range={self.time_range}&input1={input1}&input2={input2}&token={self.IEX_TOKEN}").json()

        indicator_key, chart_key = data.keys()

        lower, middle, upper = data[indicator_key]
        chart = data[chart_key]

        for index, bband in enumerate(lower):
            if bband is not None:
                date = chart[index]['date']
                parsed_data.append({
                    'date': date,
                    'lower': bband,
                    'middle': middle[index],
                    'upper': upper[index]
                })

        # parsed_data contains dicts which are in ascending order.
        return parsed_data
