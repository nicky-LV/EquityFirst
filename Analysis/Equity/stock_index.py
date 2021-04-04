from pytickersymbols import PyTickerSymbols

stock_data = PyTickerSymbols()
us_stocks = stock_data.get_stocks_by_index('NASDAQ 100')

top_10_tickers = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'FB', 'NVDA', 'PYPL', 'NFLX', 'CMCSA']
