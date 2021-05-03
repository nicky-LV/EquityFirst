from Equity.constants.equity_symbols import equity_symbols
from django.conf import settings
from functools import lru_cache
import requests
import json
from Redis.classes import Redis
import datetime


@lru_cache
def ticker_is_valid(ticker):
    if ticker.upper() in equity_symbols:
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
    def __init__(self, equity):
        if ticker_is_valid(equity):
            self.equity = equity.upper()

        self.db = Redis()
        self.IEX_token = settings.IEXCLOUD_TOKEN


class EquityData(Base):
    def __init__(self, equity):
        super().__init__(equity=equity)

    def get_price(self):
        price = float(requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/price/?token={settings.IEXCLOUD_TOKEN}").json())
        return price

    # saves and returns historic data.
    def set_historic_data(self, time_range="1y"):
        """
        Set the historical data for an equity.
        :param time_range: str - "1y" "1m" "1d" for 1 year, month or day respectively. Leave blank for all historical data.
        :return: dict - {date: [open, high, low, close], ...}
        """
        historic_data = requests.get(
            f"https://cloud.iexapis.com/stable/stock/{self.equity}/chart/{time_range}/?token={self.IEX_token}").json()

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
            f"https://cloud.iexapis.com/stable/stock/{self.equity}/intraday-prices/?token={self.IEX_token}").json()

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
                f"https://cloud.iexapis.com/stable/stock/{self.equity}/previous/?token={self.IEX_token}").json()

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
