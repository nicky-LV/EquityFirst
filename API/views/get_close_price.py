from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from Equity.classes import Base
from Equity.constants.equity_symbols import equity_symbols


@api_view(["GET"])
def get_close_price(request, equity):
    if equity in equity_symbols:
        close_and_timestamp = Base(equity).close
        return Response(data={
            'close': close_and_timestamp['close'],
            'timestamp': close_and_timestamp['timestamp']
        }, status=status.HTTP_200_OK)

    else:
        return Response(data="Not a valid equity symbol.", status=status.HTTP_404_NOT_FOUND)
