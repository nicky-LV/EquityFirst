"""
Settings for celery
"""

# We have to register Celery's tasks, or they will be un-identified.
# Import celery tasks (absolute import - not relative)
CELERY_IMPORTS = ('CryptoDash.tasks')
CELERY_TIMEZONE = "UTC"
CELERY_BEAT_SCHEDULE = {
    'btc_5_min': {
        'task': 'CryptoDash.tasks.get_price_every_10_mins',
        # seconds
        'schedule': 600
    },

    'btc_5_sec': {
        'task': 'CryptoDash.tasks.get_price_every_5_secs',
        'schedule': 5
    }
}