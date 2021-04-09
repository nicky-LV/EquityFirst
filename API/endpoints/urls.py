from django.urls import path, re_path
from .views import *
urlpatterns = [
    path('get-tickers/', get_tickers, name='get-tickers'),
    path('get-historical-data/<str:equity>/', get_historical_data, name='historical-data'),
    path('get-technical-indicators/', get_technical_indicators, name='get-technical-indicators'),
    path('analysis/<str:equity>/<str:technical_indicator>/', get_technical_analysis, name='get-technical-analysis')
]