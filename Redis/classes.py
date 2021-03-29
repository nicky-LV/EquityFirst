"""
Classes for interacting with the redis database.

NB:
Since Redis stores data in-memory (allocated RAM), we don't have much capacity.
My original idea was to store intra-day stock data within redis,
and have a larger, more persistent database for daily, weekly, or monthly stocks.

If we plan to expand for future stocks (e.g. equities) we should let external APIs
handle the storage of them, we will just be the middleman of data.
"""

import redis
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class Redis:
    def __init__(self):
        self.db = redis.Redis(host='localhost', port=6379, db=1)
        # default expiration date (in seconds)
        self.default_expiry = 10

    def get(self, key=None, all_keys=False):
        # data is stored as bytes (8 bits(binary)) in memory). A bytestring is a character + encoding
        # we can decode these bytestrings into english (utf-8), by decoding with utf-8.

        if all_keys:
            return sorted([{"time": key.decode('utf-8'), "price": float(self.get(key=key))} for key in self.db.scan_iter()], key=lambda x: list(x.keys())[0])

        else:
            if self.db.get(key) is None:
                raise KeyError("Key does not exist within the database.")

            else:
                return self.db.get(key).decode('utf-8')

    # default 24 hour expiry date to set keys
    def set(self, key, value, time=86400):
        self.db.setex(key, time, value)

        # retrieves channel layer
        channel_layer = get_channel_layer()

        # sends message to all clients connected to "datastream" group in channel layer
        # with the new price value
        async_to_sync(channel_layer.group_send)(
            'datastream',
            {
                "type": "websocket.update",
                "text": json.dumps({"time": key, "price": float(value)})
            })

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
