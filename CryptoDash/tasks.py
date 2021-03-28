from celery import shared_task
from Analysis.classes import Crypto
from Redis.classes import Redis

db = Redis()
btc = Crypto()


@shared_task
def get_price_by_minute():
    time, price = btc.current_price()
    db.set(key=f"{time.hour}:{time.minute}", value=price, time=86400)
    print(db.get(key=f"{time.hour}:{time.minute}"))