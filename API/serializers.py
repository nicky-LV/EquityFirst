from rest_framework import serializers

from .utils import *
from .decorators import validated_data_required
from Equity.classes import EquityTechnicalInfo


class MovingAverageSerializer(serializers.Serializer):
    equity = serializers.CharField(max_length=10, required=True, validators=[serializer_equity_is_valid])
    ma_type = serializers.CharField(max_length=3, required=True, validators=[serializer_ma_type_is_valid])
    timescale = serializers.CharField(max_length=10, required=True, validators=[serializer_timescale_is_valid])

    @validated_data_required
    def calculate_ma(self):
        equity = self.validated_data['equity']

        # Retrieve parsed & cached moving average
        equity_ma = getattr(EquityTechnicalInfo(equity=equity), self.validated_data['ma_type'])
        return equity_ma
