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
def get_historical_data(request, equity):
    if db.get(key=equity.upper()) is not None:
        try:
            return Response(data=db.get(key=equity.upper), status=status.HTTP_200_OK)

        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    else:
        raise NameError("Ticker is invalid.")


@api_view(["GET"])
def get_technical_analysis(request, equity, technical_indicator):
    if equity in top_10_tickers and technical_indicator in indicator_list:
        data = db.get(key=f"{equity}-{equity}")

        return Response(data=data, status=status.HTTP_200_OK)

    else:
        return Response(data="Equity and/or technical indicator is incorrect", status=status.HTTP_404_NOT_FOUND)