from rest_framework import serializers
from rest_framework import fields

from .utils import *
from .decorators import validated_data_required
from Equity.utils import is_exponential
from Equity.classes import EquityMovingAvg


class MovingAverageSerializer(serializers.Serializer):
    equity = serializers.CharField(max_length=10, required=True, validators=[serializer_equity_is_valid])
    ma_type = serializers.CharField(max_length=3, required=True, validators=[serializer_ma_type_is_valid])
    timescale = serializers.CharField(max_length=10, required=True, validators=[serializer_timescale_is_valid])

    @validated_data_required
    def calculate_ma(self, exponential=False):
        equity = self.validated_data['equity']
        timescale = self.validated_data['timescale']
        exponential = is_exponential(self.validated_data['ma_type'])

        # Retrieve parsed & cached moving average
        equity_ma = EquityMovingAvg(equity=equity, timescale=timescale, exponential=exponential).moving_average
        return equity_ma