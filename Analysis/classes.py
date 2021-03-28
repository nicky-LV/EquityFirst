import requests
import datetime
from Redis.classes import Redis



"""
Classes for interfacing with IEX Cloud's API.
"""


class Crypto:
    def __init__(self):
        self.token = "pk_9f620f2620ee41fa9b8eaef1a0e1b1e0"
        self.time = []
        self.moving_averages = []

    def current_price(self, ticker="btc"):
        # keys: price, symbol ("BTCUSD")
        json_response = requests.get(f"https://cloud.iexapis.com/stable/crypto/{ticker}usd/price/?token={self.token}").json()
        time = datetime.datetime.now()
        return time, json_response['price']

    def cached_sma(self, key, price):
        price = float(price)

        if len(self.moving_averages) >= 1:
            sma = (sum(self.moving_averages) + price) / (len(self.moving_averages) + 1)
            self.moving_averages.append(sma)
            self.time.append(key)

        else:
            self.moving_averages.append(price)

