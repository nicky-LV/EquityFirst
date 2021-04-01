from celery import shared_task
from Analysis.classes import Crypto
from Redis.classes import Redis
from celery.utils.log import get_task_logger
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from Analysis.Equity.classes import cached_tickers
db = Redis()
btc = Crypto()

logger = get_task_logger(__name__)


@shared_task
def get_price_every_10_mins():
    time, price = btc.current_price()
    key = f"{time.hour}:{time.minute}"
    db.set(key=key, value=price)


@shared_task
def get_price_every_5_secs():
    time, price = btc.current_price()
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)('get_price_every_5_secs', {
        "type": "websocket.update",
        "text": price
    })


@shared_task
def equity_historical_data_daily():
    for ticker in cached_tickers(ticker_only=True):
        pass