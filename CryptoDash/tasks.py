from celery import shared_task
from Analysis.classes import Crypto
from Redis.classes import Redis
from celery.utils.log import get_task_logger
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


db = Redis()
btc = Crypto()

logger = get_task_logger(__name__)

"""
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
"""