"""
Classes for interacting with the redis database.

NB:
Since Redis stores data in-memory (allocated RAM), we don't have much capacity.
My original idea was to store intra-day stock data within redis,
and have a larger, more persistent database for daily, weekly, or monthly stocks.

If we plan to expand for future stocks (e.g. equities) we should let external APIs
handle the storage of them, we will just be the middleman of data.
"""

"""
Equities are stored like so:

<ticker> | <historical data>
<ticker>-intraday | <intraday data (today)>
< ticker >-<analysis_method> | <data returned from analysis method>
"""

import redis
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import datetime
from django.conf import settings


def remaining_time():
    now = datetime.datetime.now()
    elapsed_seconds = (now.hour * (60**2)) + (now.minute * 60) + now.second
    # time (until END OF DAY) = seconds in day - seconds elapsed within the day (at time of calculation)
    remaining = 86400 - elapsed_seconds
    return remaining


class Redis:
    def __init__(self):
        self.db = redis.Redis(host='localhost', port=6379, db=1)
        # default expiration date (in seconds)
        self.default_expiry = 10

    def get(self, key=None):
        # data is stored as bytes (8 bits(binary)) in memory). A bytestring is a character + encoding
        # we can decode these bytestrings into english (utf-8), by decoding with utf-8.

        if self.db.get(key) is None:
            raise KeyError("Key does not exist within the database.")

        else:
            return json.loads(self.db.get(key))

    # default expiry date for each key is until END OF DAY
    def set(self, key, value, permanent=False):
        if permanent:
            self.db.set(name=key, value=value)

        else:
            time = remaining_time()
            self.db.setex(key, time, value)

    def delete(self, *keys, all_keys=False):
        if all_keys:
            for key in self.db.scan_iter():
                self.db.delete(key)

        else:
            try:
                for key in keys:
                    self.db.delete(key)

            except KeyError:
                print(f"Key does not exist")
