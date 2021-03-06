import requests
from datetime import datetime
from functools import lru_cache
from typing import Union

from django.conf import settings
from Redis.classes import Redis
from Redis.utils import get_cached_data

from .utils import parse_data, get_ma_data
from .decorators import valid_equity_required, valid_timescale_required
from .constants import equity_symbols
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
        return self.db.get(key=f"{self.equity}-stats")['close']

    @close.setter
    def close(self, payload: float):
        available_data = get_cached_data(key=f"{self.equity}-stats")
        available_data['close'] = payload
        self.db.set(key=f"{self.equity}-stats", value=available_data, permanent=True)

    @property
    def volume(self):
        return self.db.get(key=f"{self.equity}-stats")['volume']

    @volume.setter
    def volume(self, _volume: float):
        available_data = get_cached_data(key=f"{self.equity}-stats")
        available_data['volume'] = _volume
        self.db.set(key=f"{self.equity}-stats", value=available_data, permanent=True)

    @property
    def pe_ratio(self):
        return self.db.get(key=f"{self.equity}-stats")['pe_ratio']

    @pe_ratio.setter
    def pe_ratio(self, _pe_ratio: float):
        if _pe_ratio > 0:
            available_data = get_cached_data(key=f"{self.equity}-stats")
            available_data['pe_ratio'] = _pe_ratio
            self.db.set(key=f"{self.equity}-stats", value=available_data, permanent=True)

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
        percentage = ((self.price - self.close) / self.close) * 100
        type_ = lambda diff: "DECREASE" if diff < 0 else "INCREASE"

        return {
            "price": self.price,
            "close": self.close,
            "type": type_(percentage),
            "percentage": percentage
        }


class EquityTechnicalInfo(Equity):
    def __init__(self, equity: str):
        super().__init__(equity=equity)

    @property
    def sma(self) -> list:
        return self.db.get(key=f"{self.equity}-SMA")

    @sma.setter
    def sma(self, sma_data: list) -> None:
        self.db.set(key=f"{self.equity}-SMA", value=sma_data, permanent=True)

    @property
    def ema(self) -> list:
        return self.db.get(key=f"{self.equity}-EMA")

    @ema.setter
    def ema(self, ema_data: list) -> None:
        self.db.set(key=f"{self.equity}-EMA", value=ema_data, permanent=True)

    @property
    def rsi(self) -> list:
        return self.db.get(key=f"{self.equity}-RSI")

    @rsi.setter
    def rsi(self, rsi_data: list) -> None:
        cached_data = get_cached_data(key=f"{self.equity}-RSI")
        for rsi_data_ in rsi_data:
            cached_data.append(rsi_data_)

        self.db.set(key=f"{self.equity}-RSI", value=cached_data, permanent=True)

    @property
    def stoch(self) -> list:
        return self.db.get(key=f"{self.equity}-STOCH")

    @stoch.setter
    def stoch(self, stoch_data: list):
        self.db.set(key=f"{self.equity}-STOCH", value=stoch_data, permanent=True)

    @property
    def adx(self) -> list:
        return self.db.get(key=f"{self.equity}-ADX")

    @adx.setter
    def adx(self, adx_data: list):
        self.db.set(key=f"{self.equity}-ADX", value=adx_data, permanent=True)

    @property
    def macd(self) -> list:
        return self.db.get(key=f"{self.equity}-MACD")

    @macd.setter
    def macd(self, macd_data: list) -> None:
        self.db.set(key=f"{self.equity}-MACD", value=macd_data, permanent=True)

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
        data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/indicator/bbands?range={self.timescale}&input1={input1}&input2={input2}&token={self.IEX_TOKEN}").json()

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
