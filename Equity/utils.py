from datetime import datetime, timedelta
import requests
from typing import Union

from django.conf import settings

from Redis.utils import get_cached_data
from Equity.decorators import valid_equity_required, valid_timescale_required
from .constants import timescales, ma_types, technical_indicators
from .exceptions import *


def market_is_open():
    """ Market is open Mon-Fri, 4:30AM - 8PM """
    now = datetime.now()
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


def ma_type_is_valid(ma_type: str):
    if ma_type in ma_types:
        return True
    raise InvalidMovingAvgType


def is_exponential(ma_type: str):
    if ma_type == "EMA":
        return True
    return False


@valid_equity_required
def get_price(equity):
    return requests.get(f"https://cloud.iexapis.com/stable/stock/{equity}/price?token={settings.IEXCLOUD_TOKEN}").json()


@valid_equity_required
def get_closing_price(equity):
    """ [GET] Requests the closing price for a specified equity.
    :param equity: str - The equity you want the closing price for.
    :return: dict - Returns a dictionary with keys: "close" & "timestamp"
    {"close": float, "timestamp": int}
    """
    close = requests.get(f"https://cloud.iexapis.com/stable/stock/{equity}/quote?token={settings.IEXCLOUD_TOKEN}").json()['iexClose']
    return close


def get_rsi(equity, timescale="1m"):
    data = requests.get(url=f"https://cloud.iexapis.com/stable/stock/{equity}/indicator/rsi?range={timescale}&token={settings.IEXCLOUD_TOKEN}").json()
    indicator_data, chart_data = data['indicator'][0], data['chart']

    rsi_data = []
    for idx, indicator_value in enumerate(indicator_data):
        if indicator_value:
            rsi: Union[float, int] = indicator_value
            # Date in format YYYY-MM-DD
            date = chart_data[idx]['date']
            rsi_data.append({
                'RSI': rsi,
                date: date
            })

    return rsi_data


def parse_data(data: list, timescale: str) -> list:
    """ Parses data objects within a list.
    returning data in ascending order for a specified timescale. """
    parsed_data = []
    end_date = datetime.now() - timedelta(days=timescales[timescale])
    for item in data:
        try:
            date = item['date']
            # If the date of the MA calculation is outside of the date range, it is ignored.
            if datetime.strptime(date, "%Y-%m-%d") >= end_date:
                parsed_data.append(item)

            else:
                # Processed date outside the timescale range.
                break

        except IndexError:
            raise MissingData

    return parsed_data


def get_volume_and_pe_ratio(equity_symbol: str):
    vol_url = f"https://cloud.iexapis.com/stable/stock/{equity_symbol}/quote?token={settings.IEXCLOUD_TOKEN}"
    response = requests.get(url=vol_url).json()
    # pe_ratio = current stock price / earnings per share. pe_ratio can indicate whether an equity is over/under valued.
    volume, pe_ratio = response['volume'], response['peRatio']

    return volume, pe_ratio

def get_indicator_data(equity):
    for indicator in technical_indicators:
        data = requests.get(url=f"https://cloud.iexapis.com/stable/stock/{equity}/indicator/{indicator}?token={settings.IEXCLOUD_TOKEN}").json()