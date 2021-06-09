equity_symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'NVDA', 'PYPL', 'NFLX', 'CMCSA']
# todo: add "type" of indicator being either "lagging" or "leading".
technical_indicators = [
    {"name": "SMA",
     "description": "Simple moving average"},
    {"name": "EMA",
     "description": "Exponential moving average"},
    {"name": "MACD",
     "description": "Moving average convergence divergence"},
    {"name": "STOCH",
     "description": "Stochastic oscillator"},
    {"name": "RSI",
     "description": "Relative strength index"},
    {"name": "ADX",
     "description": "Average directional index"}
]
timescales = {"1D": 1, "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, "YTD": "YTD"}
ma_types = ["SMA", "MA"]