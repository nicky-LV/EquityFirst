"""
API Token hopping for AlphaVantage (to bypass the 5 requests / minute rate limiting factor).
"""
from Redis.classes import Redis
import redis
from django.conf import settings
from time import sleep
import threading
from functools import partial


# todo: initialize on server start
class AVTokenTable(Redis):
    def __init__(self):
        self.tokens = settings.ALPHAVANTAGE_TOKENS
        super().__init__()
        # override the database from the parent (which is a Redis table of index 1 - storing Equity info)
        # to a Redis table of index 2 - storing API info.
        self.db = redis.Redis(host='localhost', port=6379, db=2)

        # populate the database with the API tokens
        for token in self.tokens:
            self.set(key=token, value=0, permanent=True)

    def increase_token_count(self, token):
        count = int(self.get(key=token))
        self.set(key=token, value=count + 1, permanent=True)

    def decrease_token_count(self, token):
        sleep(60)
        # reset decrease token count
        self.set(key=token, value=0, permanent=True)

    def get_token(self):
        for token in self.tokens:
            count = int(self.get(key=token))
            # usage count of a token is 0
            if count < 5:
                # returns token and updates its count +1
                self.increase_token_count(token=token)

                # starts a non-blocking thread
                thread = threading.Thread(target=partial(self.decrease_token_count, token))
                thread.start()

                return token

            else:
                pass