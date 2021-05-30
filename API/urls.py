from django.urls import path
from .views import *

urlpatterns = [
    path('get-tickers/', GetEquitySymbols.as_view(), name='get-tickers'),
    path('get-technical-indicators/', GetTechnicalIndicators.as_view(), name='get-technical-indicators'),
    path('get-historical-data/<str:equity>/', GetHistoricalData.as_view(), name='historical-data'),
    path('get-close-data/<str:equity>/', GetCloseData.as_view(), name='get-close-price'),
    path('technical/<str:equity>/<str:moving_avg>/<str:timescale>/', MovingAverage.as_view(), name='ma')
]