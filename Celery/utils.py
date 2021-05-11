from asgiref.sync import async_to_sync
from django.conf import settings
from channels.layers import get_channel_layer

from Equity.utils import equity_is_valid, get_price
from Equity.decorators import valid_equity_required
from Equity.constants import equity_symbols
from Equity.classes import EquityData, Base


def populate_historic_data():
    """ Caches historic data for each equity. This should be ran once the server is deployed,
    to populate our database. """
    if settings.COLLECT_HISTORICAL_DATA:
        for ticker in equity_symbols:
            equity = EquityData(equity=ticker)
            # Caches an equity's historical data.
            equity.set_historic_data()

    else:
        print(f"settings.COLLECT_HISTORICAL_DATA is {settings.COLLECT_HISTORICAL_DATA}")


@valid_equity_required
def channels_update_equity_price(equity: str):
    """ Updates channel groups with equity prices. """
    # Retrieve channel layer
    channel_layer = get_channel_layer()
    equity_object = Base(equity=equity)
    price = equity_object.price

    # Update channel layer groups with name: (symbol)-price
    async_to_sync(channel_layer.group_send)(f"{equity}-price", {
        'type': 'update.price',
        'text': price
    })


@valid_equity_required
def cache_equity_price(equity: str):
    """ Caches equity price for a given equity"""
    equity_object = Base(equity=equity)
    price_data = get_price(equity=equity)
    print(price_data)
    equity_object.price = price_data