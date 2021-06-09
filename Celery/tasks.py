from celery import shared_task
from .utils import *
from Equity.utils import *
from Equity.classes import EquityMovingAvg


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
def cache_volume_and_pe_ratio():
    """
    Caches the volume and market share of all equities.
    """

    for equity in equity_symbols:
        equity_object = Equity(equity=equity)
        volume, pe_ratio = get_volume_and_pe_ratio(equity_symbol=equity)

        equity_object.volume = volume
        equity_object.pe_ratio = pe_ratio


@shared_task
def cache_closing_prices():
    """
    Caches the closing prices for each equity.
    """
    for equity in equity_symbols:
        equity_object = Equity(equity=equity)
        close_data = get_closing_price(equity=equity)
        equity_object.close = close_data


@shared_task
def cache_sma():
    """ Caches SMA values for each equity. """
    for equity in equity_symbols:
        obj = EquityMovingAvg(equity=equity, timescale="1M", exponential=False)
        obj.set_moving_average()
