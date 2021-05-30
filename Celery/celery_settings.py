"""
Settings for Celery
"""
from django.conf import settings
from celery.schedules import crontab

# Register celery tasks so that they are visible.
# Ensure imports are not relative, to ensure clarity.
CELERY_IMPORTS = 'Celery.tasks'
CELERY_TIMEZONE = settings.TIME_ZONE


"""
If we wanted to do ALL technical analysis for 1 equity, it would be 6 req/minute.
For 10 it's 60 req/minute.

"""
CELERY_BEAT_SCHEDULE = {
    "realtime_price": {
        "task": "Celery.tasks.channels_realtime_price",
        "schedule": crontab(minute='*/1', hour="4-20", day_of_week="mon-fri")
    },

    "cache_price": {
        "task": "Celery.tasks.cache_equity_prices",
        "schedule": crontab(minute='*/1', hour="4-20", day_of_week="mon-fri")
    }
}

