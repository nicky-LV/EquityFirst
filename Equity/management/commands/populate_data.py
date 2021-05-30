from django.core.management.base import BaseCommand, CommandError
from Celery.tasks import cache_equity_prices, cache_closing_prices, cache_sma


class Command(BaseCommand):
    help = "Populate Redis database with equity data. This should be called on migration of the server, " \
           "where the data is not available. Redis TCP server must be instantiated."

    def handle(self, *args, **options):
        self.stdout.write(msg="Caching Equity prices (default timescale).")
        cache_equity_prices()
        self.stdout.write(msg="Caching Equity closing prices (default timescale).")
        cache_closing_prices()
        self.stdout.write(msg="Caching Equity simple moving averages (default timescale).")
        cache_sma()
