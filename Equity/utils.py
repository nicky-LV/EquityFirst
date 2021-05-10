import datetime
from .constants import equity_symbols, timescales, ma_types
from .exceptions import *


def market_is_open():
    """ Market is open Mon-Fri, 4:30AM - 8PM """
    now = datetime.datetime.now()
    open_ = False
    # Weekdays (monday-friday)
    if 1 <= now.isoweekday() <= 5:
        # 4AM - 8PM
        if 4 <= now.hour <= 20:
            # Edge case if time is 4AM but not past 4:29AM.
            if now.hour == 4:
                # Time is 04.xx where xx >= 30
                if now.minute >= 30:
                    open_ = True

    return open_


def equity_is_valid(equity: str):
    if equity.upper() in equity_symbols:
        return True
    raise InvalidEquity


def timescale_is_valid(timescale: str):
    # Verifies that specified time_range is valid
    if timescale in timescales:
        return True
    raise InvalidTimescale("Timescale is invalid.")


def ma_type_is_valid(ma_type: str):
    if ma_type in ma_types:
        return True
    raise InvalidMovingAvgType


def is_exponential(ma_type: str):
    if ma_type == "EMA":
        return True
    return False

