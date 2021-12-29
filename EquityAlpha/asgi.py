"""
ASGI config for EquityAlpha project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter
from API.consumers import RealtimePriceConsumer

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    # websocket protocol
    "websocket": URLRouter([
        path('realtime-price/<str:equity>/', RealtimePriceConsumer.as_asgi())
    ])
})
