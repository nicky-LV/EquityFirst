import requests
import datetime
import json
from Equity.constants.equity_symbols import equity_symbols
from Redis.classes import Redis
from django.conf import settings
from json.decoder import JSONDecodeError


def set_close_price():
    db = Redis()
    for equity in equity_symbols:
        timestamp = datetime.datetime.now().timestamp()

        try:
            close = requests.get(f"https://cloud.iexapis.com/stable/stock/{equity}/quote/close/?token={settings.IEXCLOUD_TOKEN}").json()
            """
            Must be permanently stored - as the default expiry is 24 hrs 
            (and the market can be closed for > 24 hrs at a time)
            """
            db.set(key=f"{equity}-close", value=json.dumps({'close': close, 'timestamp': timestamp}),
                   permanent=True)

        except JSONDecodeError:
            try:
                close = requests.get(f"https://cloud.iexapis.com/stable/stock/{equity}/quote/iexClose/?token={settings.IEXCLOUD_TOKEN}").json()
                db.set(key=f"{equity}-close", value=json.dumps({'close': close, 'timestamp': timestamp}),
                       permanent=True)

            except Exception:
                raise IndexError("Close Data & IEX Close data are unavailable.")