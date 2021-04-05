from Redis.classes import Redis
from Analysis.Equity.stock_index import top_10_tickers
from Analysis.Equity.classes import *
from celery import shared_task
from django.conf import settings
from Analysis.Equity.indicator_list import indicator_list

from Analysis.TechAnalysis.classes import TechnicalAnalysis

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def populate_historic_data():
    if settings.COLLECT_HISTORICAL_DATA:
        for ticker in top_10_tickers:
            equity = EquityData(ticker=ticker)
            # saves an equity's historic data within redis
            equity.historic_data()

    else:
        print(f"settings.COLLECT_HISTORICAL_DATA is {settings.COLLECT_HISTORICAL_DATA}")

# called at the pre-market open of the next day.
# this appends an equity's historical data with yesterday's data.


@shared_task
def update_historic_data_with_previous_day_data():
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # updates the equity's historical data with the previous day's data
        equity.previous_day_data()


@shared_task
def update_intraday_data():
    for ticker in top_10_tickers:
        equity = EquityData(ticker=ticker)
        # saves an equity's intraday data within redis
        equity.intraday_data()


@shared_task
def perform_technical_analysis():
    """
    :return: Returns technical indicator data to clients connected to their respective groups in the channel layer.
    """

    channel_layer = get_channel_layer()

    # each loop is 6 req
    for ticker in top_10_tickers:
        analysis = TechnicalAnalysis(ticker=ticker, interval="1D")

        SMA_data = analysis.sma()['Technical Analysis: SMA']
        analysis.db.set(key=f"{ticker}-SMA", value=json.dumps(SMA_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-SMA",
            {
                'type': 'websocket.update',
                'data': SMA_data
            })

        EMA_data = analysis.ema()['Technical Analysis: EMA']
        analysis.db.set(key=f"{ticker}-EMA", value=json.dumps(EMA_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-EMA",
            {
                'type': 'websocket.update',
                'data': EMA_data
            }
        )



        MACD_data = analysis.macd()['Technical Analysis: MACD']
        analysis.db.set(key=f"{ticker}-MACD", value=json.dumps(MACD_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-MACD",
            {
                'type': 'websocket.update',
                'data': MACD_data
            }
        )

        STOCH_data = analysis.stoch()['Technical Analysis: STOCH']
        analysis.db.set(key=f"{ticker}-STOCH", value=json.dumps(STOCH_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-STOCH",
            {
                'type': 'websocket.update',
                'data': STOCH_data
            }
        )

        RSI_data = analysis.rsi()['Technical Analysis: RSI']
        analysis.db.set(key=f"{ticker}-RSI", value=json.dumps(RSI_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-RSI",
            {
                'type': 'websocket.update',
                'data': RSI_data
            }
        )

        ADX_data = analysis.adx()['Technical Analysis: ADX']
        analysis.db.set(key=f"{ticker}-ADX", value=json.dumps(ADX_data),
                        permanent=True)

        async_to_sync(channel_layer.group_send)(
            f"{ticker}-MACD",
            {
                'type': 'websocket.update',
                'data': ADX_data
            }
        )

    # overall usage of this is 60 req/minute, our capacity is 65 req/minute



