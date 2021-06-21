from .exceptions import InvalidEquity, InvalidTimescale
from .constants import equity_symbols, timescales


def equity_is_valid(equity: str):
    if equity.upper() in equity_symbols:
        return True
    raise InvalidEquity


def timescale_is_valid(timescale: str):
    # Verifies that specified time_range is valid
    if timescale in timescales:
        return True
    raise InvalidTimescale("Timescale is invalid.")


def valid_equity_required(func):
    """ Decorator for ensuring passed equities are valid. """
    def wrapper(*args, equity, **kwargs):
        if equity_is_valid(equity=equity):
            return func(*args, equity=equity, **kwargs)

        else:
            raise InvalidEquity("The equity is invalid.")

    return wrapper


def valid_timescale_required(func):
    """ Decorator for ensuring timescales are valid. """
    def wrapper(*args, timescale, **kwargs):
        if timescale_is_valid(timescale=timescale):
            return func(*args, timescale=timescale, **kwargs)

    return wrapper
