from celery import shared_task

from .utils import *
from backend.Equity.utils import *


@shared_task
def channels_realtime_price():
    """
    Updates the price of all connected clients (channels), providing real-time prices.
    """
    for equity in equity_symbols:
        channels_update_equity_price(equity=equity)


@shared_task
def cache_equity_prices():
    """
    Requests current equity price from data-provider.
    Caches prices for each equity.
    """
    for equity in equity_symbols:
        cache_equity_price(equity=equity)


@shared_task
def cache_closing_prices():
    """
    Caches the closing prices for each equity.
    """
    for equity in equity_symbols:
        close_data = get_closing_price(equity=equity)
        equity_object = Equity(equity=equity)
        equity_object.close = close_data


@shared_task
def cache_sma():
    """ Caches SMA values for each equity. """
    for equity in equity_symbols:
        obj = EquityMovingAvg(equity=equity, timescale="1M", exponential=False)
        obj.set_moving_average()
