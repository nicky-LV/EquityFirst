from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from Equity.equity_symbols import equity_symbols
from Redis.classes import Redis

db = Redis()


@api_view(["GET"])
def simple_moving_average(request, equity):
    """
    :param request: HTTPRequest object returned from middleware
    :param equity: Equity ticker
    :return: Nested list of simple moving averages [[date, sma], ...]
    """

    if equity.upper() in equity_symbols:
        pass

    else:
        return Response(data=f"{equity} is not a valid equity ticker.", status=status.HTTP_404_NOT_FOUND)