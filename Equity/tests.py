import pytest
import random

from backend.Redis.classes import Redis

from .classes import Equity
from .utils import *
from .exceptions import *


@pytest.fixture
def equity_symbol_and_instance():
    """
    :returns: [str, object] - Returns a randomly chosen equity symbol and its corresponding object.
    """
    equity_symbol = equity_symbols[random.randint(0, len(equity_symbols)-1)]
    return [equity_symbol, Equity(equity=equity_symbol)]


@pytest.fixture
def redis_instance():
    return Redis()


class TestEquity:
    @staticmethod
    def test_equity_symbol():
        with pytest.raises(InvalidEquity):
            Equity(equity="invalid_equity_symbol")

    @staticmethod
    def test_price_getter(equity_symbol_and_instance):
        """ Retrieve equity price. """
        equity, eq_object = equity_symbol_and_instance
        # Type check
        assert isinstance(eq_object.price, (float, int))

    @staticmethod
    def test_price_setter(equity_symbol_and_instance, redis_instance):
        """ Set equity price and check that cached equity price equals the current market price. """
        equity, eq_object = equity_symbol_and_instance
        # [GET] Current price data from data-provider.
        current_price = get_price(equity=equity)
        eq_object.price = current_price
        # Checks that the cached price equals the current price of the equity
        assert redis_instance.get(key=f"{equity}-price") == current_price

    @staticmethod
    def test_close_getter(equity_symbol_and_instance, redis_instance):
        """ Retrieve equity close price. """
        equity, eq_object = equity_symbol_and_instance
        current_close = get_closing_price(equity=equity)
        eq_object.close = current_close

        assert redis_instance.get(key=f"{equity}-close")['close'] == current_close['close']

    @staticmethod
    def test_close_setter(equity_symbol_and_instance, redis_instance):
        """ Set closing price for equity. """
        equity, eq_object = equity_symbol_and_instance
        current_close = get_closing_price(equity=equity)
        eq_object.close = current_close

        """ Check that the closing price was saved in database """
        assert redis_instance.get(key=f"{equity}-close")['close'] == current_close['close']

    @staticmethod
    def test_historical_data(equity_symbol_and_instance, redis_instance):
        """ Tests retrieval of historical data. """
        equity, eq_object = equity_symbol_and_instance

        # Retrieves historical data
        hist_data = eq_object.historical_data
        last_entry = hist_data[-1]
