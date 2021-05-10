from json.decoder import JSONDecodeError
from unittest import TestCase
import pytest

from .classes import Redis


class RedisTest(TestCase):

    # tests if redis setters/getters work
    @staticmethod
    def test_set_get():
        db = Redis()
        default_expiry_time = db.default_expiry
        db.set("my_key", "my_value")

        with pytest.raises(KeyError):
            db.get("non_existent_key")

