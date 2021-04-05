from Analysis.api_token_hopping import AVTokenTable
from Analysis.Equity.classes import Base
import requests

intervals = {
    '1D': '1min',
    '1W': 'daily',
    '1M': 'daily',
    '1Y': 'daily'
}


class TechnicalAnalysis(Base):
    """
    Generates available AV token
    """

    def __init__(self, ticker, interval):
        super().__init__(ticker=ticker)

        if interval in intervals:
            self.interval = intervals[interval]
            self.token = AVTokenTable().get_token()

            # todo: research about SMA / EMA, default series type etc.
            self.default_series_type = "close"
            self.default_time_period = "10"

        else:
            raise ValueError(f"Passed interval {interval} is invalid.")

    def sma(self):
        data = requests.get(f"https://www.alphavantage.co/query?function=SMA&symbol={self.ticker}&interval={self.interval}&time_period={self.default_time_period}&series_type={self.default_series_type}&apikey={self.token}").json()

        return data

    def ema(self):
        data = requests.get(
            f"https://www.alphavantage.co/query?function=EMA&symbol={self.ticker}&interval={self.interval}&time_period={self.default_time_period}&series_type={self.default_series_type}&apikey={self.token}").json()

        return data

    def macd(self):
        data = requests.get(f"https://www.alphavantage.co/query?function=MACD&symbol={self.ticker}interval={self.interval}&series_type={self.default_series_type}&apikey={self.token}").json()

        return data

    def stoch(self):
        data = requests.get(f"https://www.alphavantage.co/query?function=STOCH&symbol={self.ticker}&interval={self.interval}&apikey={self.token}").json()

        return data

    def rsi(self):
        data = requests.get(f"https://www.alphavantage.co/query?function=RSI&symbol={self.ticker}&interval={self.interval}&time_period={self.default_time_period}&series_type={self.default_series_type}&apikey={self.token}").json()

        return data

    def adx(self):
        data = requests.get(f"https://www.alphavantage.co/query?function=ADX&symbol={self.ticker}&interval={self.interval}&time_period={self.default_time_period}&apikey={self.token}").json()

        return data