from .utils import equity_is_valid
from .exceptions import InvalidEquity


def valid_equity_required(func):
    """ Decorator for ensuring passed equities are valid. """
    def wrapper(*args, equity, **kwargs):
        if equity_is_valid(equity=equity):
            func(*args, equity, **kwargs)

        else:
            raise InvalidEquity("The equity is invalid.")

    return wrapper
