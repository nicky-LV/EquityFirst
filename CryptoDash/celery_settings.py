"""
Settings for celery
"""

# We have to register Celery's tasks, or they will be un-identified.
# Import celery tasks (absolute import - not relative)
CELERY_IMPORTS = ('CryptoDash.tasks')
CELERY_TIMEZONE = "UTC"
CELERY_BEAT_SCHEDULE = {

}