import requests
import json


"""
Classes for interfacing with IEX Cloud's API.
"""


class Crypto:
    def __init__(self):
        self.token = "pk_9f620f2620ee41fa9b8eaef1a0e1b1e0 "

    def current_price(self, ticker="btc"):
        # keys: price, symbol ("BTCUSD")
        json_response = requests.get(f"https://cloud.iexapis.com/stable/crypto/{ticker}usd/price/token={self.token}").json()
        return json_response['price']

