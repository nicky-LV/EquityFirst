"""
Settings for celery
"""
from django.conf import settings
from celery.schedules import crontab

# We have to register Celery's tasks, or they will be un-identified.
# Import celery tasks (absolute import - not relative)
CELERY_IMPORTS = ('Analysis.Equity.equity_tasks')
CELERY_TIMEZONE = settings.TIME_ZONE

# 10 equities. 13 tokens at 5 req/minute = 65 req/minute
# 6 technical indicators.
"""
If we wanted to do ALL technical analysis for 1 equity, it would be 6 req/minute.
For 10 it's 60 req/minute.

"""
CELERY_BEAT_SCHEDULE = {
    "update_historic_data": {
        "task": "Analysis.Equity.equity_tasks.update_historic_data_with_previous_day_data",
        "schedule": crontab(minute=0, hour=4, day_of_week="tue-sat"),
    },

    "update_intraday_data": {
        "task": "Analysis.Equity.equity_tasks.update_intraday_data",
        "schedule": crontab(minute='*/15')
    },

    "perform_technical_analysis": {
        "task": "Analysis.Equity.equity_tasks.perform_technical_analysis",
        "schedule": crontab(minute='*/1')
    }
}

