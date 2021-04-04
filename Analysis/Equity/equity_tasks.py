from Redis.classes import Redis
from Analysis.Equity.stock_index import top_10_tickers
from Analysis.Equity.classes import *
from celery import shared_task
from django.conf import settings


def populate_historic_data():
    if settings.COLLECT_HISTORICAL_DATA:
        for ticker in top_10_tickers:
            equity = EquityData(ticker=ticker)
            # saves an equity's historic data within redis
            equity.historic_data()

    else:
        print(f"settings.COLLECT_HISTORICAL_DATA is {settings.COLLECT_HISTORICAL_DATA}")

# called at the pre-market open of the next day.
# this appends an equity's historical data with yesterday's data.


@shared_task
def update_historic_data_with_previous_day_data():
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # updates the equity's historical data with the previous day's data
        equity.previous_day_data()


@shared_task
def update_intraday_data():
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # saves an equity's intraday data within redis
        equity.intraday_data()