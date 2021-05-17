from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from .serializers import MovingAverageSerializer
from backend.Equity.constants import equity_symbols, technical_indicators
from backend.Equity.classes import Equity


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