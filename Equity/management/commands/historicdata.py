from django.core.management.base import BaseCommand, CommandError
from Analysis.celery_tasks.equity_tasks import populate_historic_data


class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            populate_historic_data()

        except Exception:
            raise CommandError("Error in populating historic data on startup. Please check startup scripts.")