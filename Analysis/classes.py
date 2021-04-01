import requests
import datetime
from Redis.classes import Redis
from django.conf import settings

"""
Classes for interfacing with IEX Cloud's / AlphaVantage API
"""


class Crypto:
    def __init__(self):
        self.token = settings.IEXCLOUD_TOKEN
        self.time = []

    def current_price(self, ticker="btc"):
        # keys: price, symbol ("BTCUSD")
        json_response = requests.get(f"https://cloud.iexapis.com/stable/crypto/{ticker}usd/price/?token={self.token}").json()
        time = datetime.datetime.now()
        return time, float(json_response['price'])