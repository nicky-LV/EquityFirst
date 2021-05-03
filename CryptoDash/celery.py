import os
from celery import Celery

os.environ["DJANGO_SETTINGS_MODULE"] = "CryptoDash.settings"
# RabbitMQ message broker
app = Celery('CryptoDash', broker="redis://localhost:6379")

# imports Celery-related settings from settings.py, starting with CELERY. (e.g. CELERY_BROKER_URL = ...)
app.config_from_object("CryptoDash.celery_settings", namespace="CELERY")
app.autodiscover_tasks()
