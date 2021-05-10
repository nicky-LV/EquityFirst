from datetime import datetime, timedelta

from rest_framework.validators import ValidationError

from Equity.utils import equity_is_valid, timescale_is_valid, ma_type_is_valid
from Equity.constants import timescales
from Equity.exceptions import *

"""
Serializer utils (some are wrappers around Equity utils - as failures must raise a ValidationError).
"""


def serializer_equity_is_valid(equity: str):
    try:
        if equity_is_valid(equity):
            return True

    except InvalidEquity:
        raise ValidationError("Equity is not valid.")


def serializer_timescale_is_valid(timescale: str):
    try:
        if timescale_is_valid(timescale):
            return True

    except InvalidTimescale:
        raise ValidationError("Timescale is not valid")


def serializer_ma_type_is_valid(ma_type: str):
    try:
        ma_type_is_valid(ma_type)

    except InvalidMovingAvgType:
        raise ValidationError("Invalid Moving Average Type. It must be either SMA or MA.")


def validated_data_required(func):
    def func_wrapper(class_instance, *args):
        if class_instance.is_valid():
            return func(class_instance, *args)

        else:
            raise ValidationError("Validated data is required to calculate moving averages.")

    return func_wrapper
