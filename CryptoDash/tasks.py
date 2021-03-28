from celery import shared_task
from Analysis.classes import Crypto
from Redis.classes import Redis
from celery.utils.log import get_task_logger

db = Redis()
btc = Crypto()

logger = get_task_logger(__name__)

@shared_task
def get_price_by_minute():
    time, price = btc.current_price()
    key = f"{time.hour}:{time.minute}"
    db.set(key=key, value=price, time=86400)
    btc.cached_sma(key=time, price=price)
