import requests
import json
import datetime
from datetime import timedelta
from functools import lru_cache

from django.conf import settings
from Equity.constants.equity_symbols import equity_symbols
from Redis.classes import Redis

from Equity.constants.timerange import timeranges
from Equity.exceptions import TimeRangeRequired, InvalidTimeRange

import asyncio


@lru_cache
def is_valid_equity(equity_symbol):
    try:
        if equity_symbol.upper() in equity_symbols:
            return True

    except AttributeError:
        raise AttributeError("The equity symbol must be a string.")


def compare_dates(date):
    current_date = datetime.datetime.now()
    passed_data = date.split('-')
    try:
        passed_year, passed_month, passed_day = passed_data[0], passed_data[1], passed_data[2]
        compare_date = datetime.datetime(year=int(passed_year), month=int(passed_month), day=int(passed_day))
        if (current_date - compare_date).days == 1:
            return True

        else:
            return False

    except AttributeError:
        raise AttributeError("Passed datetime objects are not dates.")


class Base:
    def __init__(self, equity):
        if is_valid_equity(equity):
            self.equity = equity.upper()

        self.db = Redis()
        self.IEX_TOKEN = settings.IEXCLOUD_TOKEN
        self.sort_by_date = lambda date_str: datetime.datetime.strptime(date_str, "%Y-%m-%d")

    @property
    def price(self):
        price = float(requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/price/?token={self.IEX_TOKEN}").json())
        return price

    @property
    def close(self):
        """
        Returns closing information (close price, timestamp) for a specified equity symbol.
        :return: dict {'close': float, 'timestamp' int}
        """
        return self.db.get(key=f"{self.equity}-close")


class EquityData(Base):
    def __init__(self, equity):
        super().__init__(equity=equity)

    # saves and returns historic data.
    def set_historic_data(self, time_range="1y"):
        """
        Set the historical data for an equity.
        :param time_range: str - "1y" "1m" "1d" for 1 year, month or day respectively. Leave blank for all historical data.
        :return: dict - {date: [open, high, low, close], ...}
        """
        historic_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.equity}/chart/{time_range}/?token={self.IEX_TOKEN}").json()

        historic_data_parsed = {
            data['date']:  [
                data['open'],
                data['high'],
                data['low'],
                data['close']
            ]
            for data in historic_data
        }

        # this historic data must be saved as a string within the redis database (serialize to json)
        self.db.set(key=self.equity, value=json.dumps(historic_data_parsed), permanent=True)

        return historic_data_parsed

    def get_historic_data(self, dict_format=False):
        """
        Retrieve historical data for an equity.
        :return: list - nested list of historical data [[date, open, high, low, close], [...]]
        """

        historic_data = json.loads(self.db.get(key=self.equity))

        if dict_format:
            return historic_data

        else:
            weekly_data = []
            monthly_data = []
            yearly_data = []

            count = 0
            for key, value in historic_data.items():
                data = [key]
                for i in range(len(value)):
                    data.append(value[i])

                if count > len(historic_data) - 31:
                    monthly_data.append(data)
                    if count > len(historic_data) - 8:
                        weekly_data.append(data)

                yearly_data.append(data)

                count += 1

            return weekly_data, monthly_data, yearly_data

    # saves and returns intraday data.
    def set_intraday_data(self):
        intraday_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.equity}/intraday-prices/?token={self.IEX_TOKEN}").json()

        # intraday data is parsed into dict format with keys [minute, open, high, low, close]

        intraday_data_parsed = [
            [data['minute'],
             data['open'],
             data['high'],
             data['low'],
             data['close']
             ]

            for data in intraday_data
        ]

        self.db.set(key=f"{self.equity}-intraday", value=json.dumps(intraday_data_parsed), permanent=True)

        return intraday_data_parsed

    def get_intraday_data(self):
        """
        Retrieve intraday data for an equity.
        :return: list - Nested list of data in format [[date, open, high, low, close], [...]]
        """
        return json.loads(self.db.get(f"{self.equity}-intraday"))

    def set_previous_day_data(self):
        # get date from last day saved in redis DB.
        previous_day_saved = json.loads(self.db.get(key=self.equity))[-1]['date']
        if compare_dates(previous_day_saved):
            previous_day_data = requests.get(
                f"https://cloud.iexapis.com/stable/stock/{self.equity}/previous/?token={self.IEX_TOKEN}").json()

            previous_day_data_parsed = {
                'date': previous_day_data['date'],
                'open': previous_day_data['open'],
                'high': previous_day_data['high'],
                'low': previous_day_data['low'],
                'close': previous_day_data['close']
            }

            # retrieve current historical data
            historical_data = json.loads(self.db.get(key=self.equity))
            historical_data.append(previous_day_data_parsed)

            # update the historical data with previous day's data
            self.db.set(key=self.equity, value=historical_data, permanent=True)

            return historical_data

        else:
            raise ArithmeticError("Cannot assign data for previous trading day because today - yesterday != 1 day.")


class EquityMovingAvg(Base):
    """
    EquityMovingAvg is a separate class as it can encapsulate both the SMA and EMA indicators.
    """
    def __init__(self, equity: str, time_range: str, exponential: bool):
        super().__init__(equity=equity)

        # Verifies that specified time_range is valid
        if time_range in timeranges:
            self.time_range = time_range
        else:
            if time_range is None:
                raise TimeRangeRequired("A time range must be specified.")

            else:
                raise InvalidTimeRange("Passed time_range parameter is not a valid time range.")

        # String representation of indicator
        self.moving_average_indicator = "sma" if not exponential else "ema"

    @property
    def moving_average(self) -> dict:
        """Returns cached moving_averages in format {date: "%Y-%m-%d", "sma"/"ema": float}"""
        return self.db.get(key=f"{self.equity}-{self.moving_average_indicator}")

    def set_moving_average(self) -> None:
        """
        Caches the moving average (simple or exponential) into database.
        """

        available_data = {}
        try:
            available_data = self.db.get(f"{self.equity}-{self.moving_average_indicator}")

        except KeyError:
            pass

        data = self.get_moving_avg()

        # Apply data to available_data
        for date, ma in data.items():
            # Ensures we do not handle duplicate data
            if date not in available_data:
                available_data[date] = ma

        # Sorts into ascending order (by date).

        available_data = {key: available_data[key] for key in sorted(available_data, key=self.sort_by_date)}

        # Cached to Redis database.
        self.db.set(key=f"{self.equity}-{self.moving_average_indicator}", value=json.dumps(available_data), permanent=True)

    def get_moving_avg(self) -> dict:
        """
        Returns the moving average (simple or exponential) sorted in ascending order.
        :return: dict - {"%Y-%m-%d": moving_average float, ...}
        """
        parsed_data = {}
        data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/indicator/{self.moving_average_indicator}?range={self.time_range}&token={self.IEX_TOKEN}").json()

        ma, chart = data

        for index, ma in enumerate(reversed(data[ma][0])):
            if ma is not None:
                parsed_data[data[chart][index]["date"]] = float(ma)

        return parsed_data


class EquityIndicators(Base):
    def __init__(self, equity: str, time_range: str):
        super().__init__(equity=equity)

        # Verifies that specified time_range is valid
        if time_range in timeranges:
            self.time_range = time_range
        else:
            if time_range is None:
                raise TimeRangeRequired("A time range must be specified.")

            else:
                raise InvalidTimeRange("Passed time_range parameter is not a valid time range.")

    @property
    def bbands(self) -> list:
        """Returns cached of bbands data in format [{date: "%Y-%m-%d, upper: float, middle: float, lower: float}, {...}]"""
        return self.db.get(key=f"{self.equity}-bbands")

    def set_bbands(self) -> None:
        """Caches bbands data (in the format returned by self.get_bands())"""
        self.db.set(key=f"{self.equity}-bbands", value=json.dumps(self.get_bbands()), permanent=True)

    def get_bbands(self) -> list:
        """Returns bbands data in ascending order, in the format [{date: "%Y-%m-%d, upper: float, middle: float, lower: float}, {...}]
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









