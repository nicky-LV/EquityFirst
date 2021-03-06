import os
from celery import Celery

# Redis message broker
app = Celery('EquityAlpha', broker="redis://localhost:6379")

# imports Celery-related settings from settings-dev.py, starting with CELERY. (e.g. CELERY_BROKER_URL = ...)
app.config_from_object("Celery.celery_settings", namespace="CELERY")
app.autodiscover_tasks()
