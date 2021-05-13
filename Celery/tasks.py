import asyncio
from asgiref.sync import async_to_sync
from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer

from .utils import *
from Equity.classes import *
from Equity.utils import *


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
        # Todo: Consider lowering the timescale, once we have sufficient cached data.
        obj.set_moving_average()
