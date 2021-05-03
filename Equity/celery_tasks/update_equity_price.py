from channels.layers import get_channel_layer

from Equity.constants.equity_symbols import equity_symbols
from Equity.classes import EquityData

from asgiref.sync import async_to_sync


def update_equity_price():
    # Retrieve channel layer
    channel_layer = get_channel_layer()
    for symbol in equity_symbols:
        # Retrieve price for equity
        equity = EquityData(str(symbol))
        price = equity.get_price()

        # Update channel layer groups with name: (symbol)-price
        async_to_sync(channel_layer.group_send)(f"{symbol}-price", {
            'type': 'update.price',
            'text': price
        })