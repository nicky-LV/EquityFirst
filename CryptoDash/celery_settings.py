"""
Settings for celery
"""
from django.conf import settings
from celery.schedules import crontab

# We have to register Celery's tasks, or they will be un-identified.
# Import celery tasks (absolute import - not relative)
CELERY_IMPORTS = ('Analysis.Equity.equity_tasks')
CELERY_TIMEZONE = settings.TIME_ZONE
CELERY_BEAT_SCHEDULE = {
    "update_historic_data": {
        "task": "Analysis.Equity.equity_tasks.update_historic_data_with_previous_day_data",
        "schedule": crontab(minute=0, hour=4, day_of_week="tue-sat"),
    },

    "update_intraday_data": {
        "task": "Analysis.Equity.equity_tasks.update_intraday_data",
        "schedule": crontab(minute='*/15')
    }
}