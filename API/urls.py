from django.urls import path
from .views import *
urlpatterns = [
    path('get-tickers/', get_tickers, name='get-tickers'),
    path('get-historical-data/<str:ticker>/', get_historical_data, name='historical-data')
]