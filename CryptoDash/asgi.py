"""
ASGI config for CryptoDash project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter
from API.consumers import RealTimeData

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CryptoDash.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    # websocket protocol
    "websocket": URLRouter([
        path('realtime-data/', RealTimeData.as_asgi()),
    ])
})
