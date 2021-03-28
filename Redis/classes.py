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

    def get(self, key):
        # data is stored as bytes (8 bits(binary)) in memory). A bytestring is a character + encoding
        # we can decode these bytestrings into english, by decoding with utf-8.

        if self.db.get(key) is None:
            raise KeyError("Key does not exist within the database.")

        else:
            return self.db.get(key).decode('utf-8')

    def set(self, key, value, time=10):
        # todo: check if key already exists in redis database
        # by default key/value pairs are stored for self.default_expiry seconds

        self.db.set(key, value, ex=self.default_expiry)
        return f"{key}: {value} stored for {time} seconds."
