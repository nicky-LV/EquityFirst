from .stock_index import us_stocks
from django.conf import settings
from functools import lru_cache
import requests
import json
from Redis.classes import Redis

# gets ticker symbols for the FTSE 100 (UK equity)


@lru_cache
def cached_tickers(ticker_only=False, stock_index=us_stocks):

    if ticker_only:
        return [equity['symbol'] for equity in stock_index]

    else:
        return [{'name': equity['name'], 'symbol': equity['symbol']} for equity in stock_index]


@lru_cache
def ticker_is_valid(ticker):
    if ticker.upper() in cached_tickers(ticker_only=True):
        return True

    else:
        raise AssertionError("Ticker is not valid")


class Base:

    def __init__(self, ticker):
        if ticker_is_valid(ticker):
            self.ticker = ticker.upper()

        self.db = Redis()
        self.IEX_token = settings.IEXCLOUD_TOKEN
        self.AV_token = settings.ALPHAVANTAGE_TOKEN


class EquityData(Base):
    # ticker is valid (due to tests done within the base class)

    # saves and returns historic data.
    def historic_data(self, time_range="1y"):
        historic_data = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.ticker}/chart/{time_range}/?token={self.IEX_token}").json()

        # historic data is parsed into dict format with keys [date, open, close, high, low, volume]
        historic_data_parsed = [
            {
                'date': data['date'],
                'open': data['open'],
                'close': data['close'],
                'high': data['high'],
                'low': data['low'],
                'volume': data['volume']
            }

            for data in historic_data
        ]

        # this historic data must be saved as a string within the redis database (serialize to json)
        self.db.set(key=self.ticker, value=json.dumps(historic_data_parsed))

        return historic_data_parsed

    # saves and returns intraday data.
    def intraday_data(self):
        intraday_data = requests.get(f"https://cloud.iexapis.com/stable/stock/twtr/intraday-prices/?token={self.IEX_token}").json()

        # intraday data is parsed into dict format with keys [date, time, average, open, close, high, low, volume]

        intraday_data_parsed = [
            {
                'date': data['date'],
                'time': data['minute'],
                'average': data['average'],
                'open': data['open'],
                'close': data['close'],
                'high': data['high'],
                'low': data['low'],
                'volume': data['volume']
            }

            for data in intraday_data
        ]

        self.db.set(key=f"{self.ticker}-intraday", value=json.dumps(intraday_data_parsed))
        return intraday_data_parsed

"""
Perform analysis on an equity, utilizing AlphaVantage's API for technical indicators.
"""
