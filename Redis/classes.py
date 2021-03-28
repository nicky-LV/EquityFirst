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


class Redis:
    def __init__(self):
        self.db = redis.Redis(host='localhost', port=6379, db=0)
        # default expiration date (in seconds)
        self.default_expiry = 10

    def get(self, key=None, all_keys=False):
        # data is stored as bytes (8 bits(binary)) in memory). A bytestring is a character + encoding
        # we can decode these bytestrings into english, by decoding with utf-8.

        if all_keys:
            return [{key: self.get(key=key)} for key in self.db.scan_iter()]

        else:
            if self.db.get(key) is None:
                raise KeyError("Key does not exist within the database.")

            else:
                return self.db.get(key).decode('utf-8')

    def set(self, key, value, time=86400):
        # default 24 hour expiry date
        self.db.setex(key, time, value)
        return f"{key}: {value} stored for {time} seconds."

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
