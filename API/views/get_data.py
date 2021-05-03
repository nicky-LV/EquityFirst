from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from Equity.constants.equity_symbols import equity_symbols
from Equity.constants.technical_indicator_list import indicator_list

from Redis.classes import Redis
db = Redis()


@api_view(["GET"])
def get_tickers(request):
    return Response(data=equity_symbols, status=status.HTTP_200_OK)


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