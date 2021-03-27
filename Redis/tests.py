from django.test import TestCase
from unittest import TestCase
import pytest
import time

from .classes import Redis


class RedisTest(TestCase):

    # tests if redis setters/getters work
    @staticmethod
    def test_set_get():
        db = Redis()
        default_expiry_time = db.default_expiry
        db.set("my_key", "my_value")

        # default time
        assert db.get("my_key") == "my_value"

        # checks that it is deleted after the default expiry time
        time.sleep(default_expiry_time)
        with pytest.raises(KeyError):
            assert db.get("my_key") is None

