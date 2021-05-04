from django.urls import path, re_path
from .views.get_data import *
from .views.technical_analysis import *
from .views.get_close_price import get_close_price
urlpatterns = [
    path('get-tickers/', get_tickers, name='get-tickers'),
    path('get-technical-indicators/', get_technical_indicators, name='get-technical-indicators'),
    path('get-historical-data/<str:equity>/', get_historical_data, name='historical-data'),
    path('get-close-data/<str:equity>/', get_close_price, name='get-close-price'),
    path('SMA/<str:equity_symbol>/<str:requested_timeframe>/', simple_moving_average, name='sma')
]