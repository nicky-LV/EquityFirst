from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from .serializers import MovingAverageSerializer

from Equity.constants import equity_symbols, technical_indicators
from Equity.classes import Equity
from Equity.decorators import valid_equity_required
from Equity.exceptions import InvalidEquity


class MovingAverage(APIView):
    @staticmethod
    def get(request, equity, moving_avg, timescale):
        data = {
            "equity": equity,
            "ma_type": moving_avg,
            "timescale": timescale
        }
        serializer = MovingAverageSerializer(data=data)
        if serializer.is_valid():
            ma_data = serializer.calculate_ma()
            return Response(data=ma_data, status=status.HTTP_200_OK)

        else:
            raise ValidationError("Unable to calculate Moving Avg.")


class GetEquitySymbols(APIView):
    def get(self, request):
        return Response(data=equity_symbols, status=status.HTTP_200_OK)


class GetTechnicalIndicators(APIView):
    def get(self, request):
        # todo: return technical indicators as {name: "", description: ""}
        return Response(data=technical_indicators, status=status.HTTP_200_OK)


class GetHistoricalData(APIView):
    def get(self, request, equity):
        equity_object = Equity(equity=equity, timescale="ytd")
        return Response(data=equity_object.historical_data, status=status.HTTP_200_OK)


class GetCloseData(APIView):
    def get(self, request, equity):
        close_price = Equity(equity=equity).close
        return Response(data=close_price, status=status.HTTP_200_OK)


class GetEquityStats(APIView):
    @valid_equity_required
    def get(self, request, equity):
        try:
            equity_object = Equity(equity=equity)
            volume, pe_ratio, close = equity_object.volume, equity_object.pe_ratio, equity_object.close
            data = {
                "volume": volume if volume else None,
                "pe_ratio": pe_ratio if pe_ratio else None,
                "close": close if close else None
            }
            return Response(data=data, status=status.HTTP_200_OK)

        except InvalidEquity:
            return Response(data="Invalid equity symbol", status=status.HTTP_404_NOT_FOUND)
