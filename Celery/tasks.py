import asyncio
from asgiref.sync import async_to_sync
from celery import shared_task
from django.conf import settings
from channels.layers import get_channel_layer

from .utils import *
from Equity.classes import *
from Equity.utils import *


@shared_task
def update_historic_data_with_previous_day_data():
    for ticker in equity_symbols:
        equity = EquityData(equity=ticker)
        # updates the equity's historical data with the previous day's data
        equity.set_previous_day_data()


@shared_task
def update_intraday_data():
    # Check if market is closed or open. 9:30 AM -
    for ticker in equity_symbols:
        equity = EquityData(equity=ticker)
        # saves an equity's intraday data within redis
        equity.set_intraday_data()

        # update intraday data for connected clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"{ticker}-intraday",
            {
                "type": "websocket.update",
                "text": equity.get_intraday_data()
            }
        )


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
    Caches prices for each equity.
    """
    for equity in equity_symbols:
        cache_equity_price(equity=equity)


def cache_closing_prices():
    """
    Caches the closing prices for each equity.
    """
    for equity in equity_symbols:
        close_data = get_closing_price(equity=equity)
        equity_object = Base(equity=equity)
        equity_object.close = close_data
