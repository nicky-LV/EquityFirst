from django.urls import path
from .views import *
urlpatterns = [
    path('moving_average/', moving_average, name='moving_average')
]