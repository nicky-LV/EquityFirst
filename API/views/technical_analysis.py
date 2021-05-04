
import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from Equity.constants.equity_symbols import equity_symbols
from Equity.classes import EquityData
from Redis.classes import Redis
from datetime import datetime, timedelta

from functools import lru_cache

db = Redis()


@lru_cache
def date_data(data, date):
    try:
        closing_price = data[date][3]
        return closing_price

    except KeyError:
        pass


@api_view(["GET"])
def simple_moving_average(request, equity_symbol, requested_timeframe):
    """
    Calculates SMA for a requested timeframe ("1Y", "1M", "1W", "1D") before today's date.
    SMA is calculated from closing values.
    :param requested_timeframe: str - how many dates (from todays date) should we calculate.
    Options: ("1Y", "1M", "1W", "1D")
    :param equity_symbol: Equity ticker
    :return: Nested list of simple moving averages [[date, sma], ...]
    """
    equity = EquityData(equity_symbol.upper())
    time_period = 14
    ranges = {
        "1Y": 365,
        "1M": 30,
        "1W": 7,
        "1D": 1
    }
    # sma_data is the SMA values for each date within the requested timeframe
    sma_data = []

    if equity_symbol in equity_symbols and requested_timeframe in ranges.keys():
        data = equity.get_historic_data(dict_format=True)
        sma = {}

        for i in range(1, ranges[requested_timeframe] + 1):
            start_date = datetime.now() - timedelta(days=i)
            start_date_str = start_date.strftime("%Y-%m-%d")
            close_sum = 0
            for num in range(1, time_period + 1):
                date_str = (start_date - timedelta(days=num)).strftime("%Y-%m-%d")

                # Closing price for specific date
                try:
                    closing_price = data[date_str][3]
                    close_sum += closing_price

                except KeyError:
                    pass

            # Data not collected on weekends / when market is closed.
            if start_date_str in data:
                sma[start_date_str] = close_sum / time_period
            else:
                pass

        return Response(data=sma, status=status.HTTP_200_OK)

    else:
        return Response(data=f"Invalid query arguments.", status=status.HTTP_404_NOT_FOUND)