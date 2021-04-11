from .stock_index import top_10_tickers
from django.conf import settings
from functools import lru_cache
import requests
import json
from Redis.classes import Redis
import datetime


@lru_cache
def ticker_is_valid(ticker):
    if ticker.upper() in top_10_tickers:
        return True

    else:
        raise AssertionError("Ticker is not valid")


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
    def __init__(self, ticker):
        if ticker_is_valid(ticker):
            self.ticker = ticker.upper()

        self.db = Redis()
        self.IEX_token = settings.IEXCLOUD_TOKEN


class EquityData(Base):
    def __init__(self, ticker):
        super().__init__(ticker=ticker)

    # ticker is valid (due to tests done within the base class)

    # saves and returns historic data.
    def set_historic_data(self, time_range="1y"):
        historic_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.ticker}/chart/{time_range}/?token={self.IEX_token}").json()

        # historic data is parsed into list format [D, O, H, L, C, V]
        historic_data_parsed = [
            [data['date'],
             data['open'],
             data['high'],
             data['low'],
             data['close']
             ]

            for data in historic_data
        ]

        # this historic data must be saved as a string within the redis database (serialize to json)
        self.db.set(key=self.ticker, value=json.dumps(historic_data_parsed), permanent=True)

        return historic_data_parsed

    def get_historic_data(self):
        return self.db.get(key=self.ticker)

    # saves and returns intraday data.
    def set_intraday_data(self):
        intraday_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.ticker}/intraday-prices/?token={self.IEX_token}").json()

        # intraday data is parsed into dict format with keys [date, minute, average, open, close, high, low, volume]

        intraday_data_parsed = [
            [data['minute'],
             data['open'],
             data['high'],
             data['low'],
             data['close']
             ]

            for data in intraday_data
        ]

        self.db.set(key=f"{self.ticker}-intraday", value=json.dumps(intraday_data_parsed), permanent=True)

        return intraday_data_parsed

    def get_intraday_data(self):
        return self.db.get(f"{self.ticker}-intraday")

    def set_previous_day_data(self):
        # get date from last day saved in redis DB.
        previous_day_saved = json.loads(self.db.get(key=self.ticker))[-1]['date']
        if compare_dates(previous_day_saved):
            previous_day_data = requests.get(
                f"https://cloud.iexapis.com/stable/stock/{self.ticker}/previous/?token={self.IEX_token}").json()

            previous_day_data_parsed = {
                'date': previous_day_data['date'],
                'open': previous_day_data['open'],
                'close': previous_day_data['close'],
                'high': previous_day_data['high'],
                'low': previous_day_data['low'],
                'volume': previous_day_data['volume']
            }

            # retrieve current historical data
            historical_data = json.loads(self.db.get(key=self.ticker))
            historical_data.append(previous_day_data_parsed)

            # update the historical data with previous day's data
            self.db.set(key=self.ticker, value=historical_data, permanent=True)

            return historical_data

        else:
            raise ArithmeticError("Cannot assign data for previous trading day because today - yesterday != 1 day.")
