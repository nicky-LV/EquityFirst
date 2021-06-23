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


def get_technical_data(equity, technical_indicator=None, timescale="1m"):
    def get_data(equity_=equity, technical_indicator_=None, timescale_="1m"):
        # Retrieve cached data of that technical indicator already
        cached_data = get_cached_data(key=f"{equity_}-{technical_indicator_}")

        # Handle duplicate information
        # List of dates to query our data against. If both entries have the same date, we skip over it.
        cached_dates = [data['date'] for data in cached_data if cached_data]

        data = requests.get(
            url=f"https://cloud.iexapis.com/stable/stock/{equity_}/indicator/rsi?range={timescale_}&token={settings.IEXCLOUD_TOKEN}")

        if data.status_code == 200:
            data = data.json()
            indicator_data, chart_data = data['indicator'][0], data['chart']

            for idx, indicator_data in enumerate(indicator_data):
                date = chart_data[idx]['date']

                # Entry with this date does not already exist in the db.
                if date not in cached_dates and indicator_data is not None:
                    cached_data.append({
                        "date": date,
                        technical_indicator: indicator_data
                    })

            return cached_data

    def get_macd_data(equity_=equity, timescale_=timescale):
        data = requests.get(
            url=f"https://cloud.iexapis.com/stable/stock/{equity_}/indicator/MACD?range={timescale_}&token={settings.IEXCLOUD_TOKEN}")

        if data.status_code == 200:
            # Retrieve cached data of that technical indicator already
            cached_data = get_cached_data(key=f"{equity_}-MACD")

            # --- Handle duplicate information ---
            # List of dates to query our data against. If both entries have the same date, we skip over it.
            cached_dates = [data['date'] for data in cached_data if cached_data]

            data = data.json()

            # MACD values, macd_signal (9 day EMA of macd values), and macd histogram data
            macd, macd_signal, macd_histogram = data['indicator'][0], data['indicator'][1], data['indicator'][2]
            chart_data = data['chart']

            for idx, indicator_data in enumerate(macd):
                date = chart_data[idx]['date']

                if date not in cached_dates and macd[idx] is not None:
                    cached_data.append({
                        'date': date,
                        'MACD': macd[idx],
                        'MACD_SIGNAL': macd_signal[idx],
                        'MACD_HISTOGRAM': macd_histogram[idx]
                    })

            return cached_data

    if technical_indicator.upper() == "MACD":
        return get_macd_data(equity_=equity, timescale_="3m")

    elif technical_indicator.upper != "MACD" and technical_indicator:
        return get_data(equity_=equity, technical_indicator_=technical_indicator, timescale_=timescale)


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