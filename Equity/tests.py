import pytest
import random

from Redis.classes import Redis

from .constants import equity_symbols

from .classes import Equity, EquityTechnicalInfo
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


def test_sma(equity_symbol_and_instance):
    """ Tests getting / setting of SMAs """
    equity_symbol, instance_ = equity_symbol_and_instance
    obj = EquityTechnicalInfo(equity=equity_symbol)

    # asserts that sma data is available and that its type is correct.
    assert obj.sma is not None
    assert type(obj.sma) == list
    assert type(obj.sma[0]['SMA']) == int or type(obj.sma[0]['SMA']) == float

    # caches sma data in the database
    sma_data = get_technical_data(equity=equity_symbol, technical_indicator="SMA")
    obj.sma = sma_data

    # asserts that the data exists in the database.
    cached_data = get_cached_data(key=f"{equity_symbol}-SMA")
    dates_array = [data['date'] for data in cached_data]
    random_date = sma_data[random.randint(0, len(sma_data)-1)]['date']

    assert random_date in dates_array


def test_technical_data(equity_symbol_and_instance):
    """ Tests getting / setting of technical data for one randomly selected equity symbol. """
    equity_symbol, instance_ = equity_symbol_and_instance
    obj = EquityTechnicalInfo(equity=equity_symbol)

    for technical_indicator in technical_indicators:
        technical_indicator = technical_indicator['name']
        if technical_indicator == "MACD":
            pass

        else:
            # asserts that technical data is available and that its type is correct.
            assert getattr(obj, technical_indicator.lower()) is not None
            assert type(getattr(obj, technical_indicator.lower())) == list
            assert type(getattr(obj, technical_indicator.lower())[0][technical_indicator]) == int or \
                   type(getattr(obj, technical_indicator.lower())[0][technical_indicator]) == float

            # caches technical data in the database
            technical_data = get_technical_data(equity=equity_symbol, technical_indicator=technical_indicator)
            setattr(obj, technical_indicator, technical_data)

            # asserts that the data exists in the database.
            cached_data = get_cached_data(key=f"{equity_symbol}-{technical_indicator}")
            dates_array = [data['date'] for data in cached_data]
            random_date = technical_data[random.randint(0, len(technical_data) - 1)]['date']

            assert random_date in dates_array
