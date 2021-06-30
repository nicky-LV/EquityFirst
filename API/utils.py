from rest_framework.validators import ValidationError

from Equity.decorators import equity_is_valid, timescale_is_valid
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
        if ma_type.upper() == "EMA" or ma_type.upper() == "SMA":
            return True

        else:
            return False

    except InvalidMovingAvgType:
        raise ValidationError("Invalid Moving Average Type. It must be either SMA or EMA.")