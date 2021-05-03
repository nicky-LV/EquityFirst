from celery import shared_task
from .update_equity_price import update_equity_price


@shared_task
def realtime_equity_price():
    update_equity_price()