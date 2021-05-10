"""
Tests the capability of calculating moving averages.
"""
import pytest
from Equity.classes import EquityMovingAvg, Base
from Redis.classes import Redis
import random
from Equity.constants.equity_symbols import equity_symbols


@pytest.fixture
def database():
    """Returns an instance of our Redis DB class for caching data."""
    return Redis()


@pytest.fixture
def moving_avg_instance() -> list:
    """Returns a EquityMovingAvg instance"""
    index = random.randint(0, len(equity_symbols)-1)
    equity = str(equity_symbols[index])
    return [EquityMovingAvg(equity, time_range="1m", exponential=False), EquityMovingAvg(equity, time_range="1m",
                                                                                         exponential=True)]


def test_set_moving_average(moving_avg_instance, database):
    sma_instance, ema_instance = moving_avg_instance
    sma_instance.set_moving_average()
    ema_instance.set_moving_average()


def test_equity_base_params():
    with pytest.raises(AttributeError):
        Base(123)
