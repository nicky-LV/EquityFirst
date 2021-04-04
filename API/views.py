from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from Analysis.Equity.stock_index import top_10_tickers
from Analysis.Equity.indicator_list import indicator_list

import json

from Redis.classes import Redis
db = Redis()


@api_view(["GET"])
def get_tickers(request):
    return Response(data=top_10_tickers, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_technical_indicators(request):
    return Response(data=indicator_list, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_historical_data(request, ticker):
    if db.get(key=ticker.upper()) is not None:
        try:
            return Response(data=db.get(key=ticker.upper), status=status.HTTP_200_OK)

        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        raise NameError("Ticker is invalid.")

