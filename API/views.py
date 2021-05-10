from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from .serializers import MovingAverageSerializer


class MovingAverage(APIView):
    def get(self, request):
        serializer = MovingAverageSerializer(data=request.data)
        if serializer.is_valid():
            ma_data = serializer.calculate_ma
            return Response(data=ma_data, status=status.HTTP_200_OK)

        else:
            raise ValidationError("Unable to calculate Moving Avg.")
