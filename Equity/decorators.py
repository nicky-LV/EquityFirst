from .utils import equity_is_valid, timescale_is_valid
from .exceptions import InvalidEquity


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
            func(*args, timescale, **kwargs)

    return wrapper
