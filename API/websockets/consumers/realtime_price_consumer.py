from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from API.models import Channels, Groups
from django.conf import settings

import requests
import functools


class RealtimePriceConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.equity = None
        self.group_name = None
        self.group = None
        self.channel = None

    async def connect(self):
        """
        Accepts WS connection. Creates a group for this channel and its specific equity.
        """
        self.equity = self.scope['url_route']['kwargs']['equity']
        # Assign channel to group within database, so we can query it within celery tasks.
        await self.assign_channel_to_group()
        # Add channel to group within channel layer
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        # Accept websocket connection
        await self.accept()
        # Send initial price-data
        price = requests.get(f"https://cloud.iexapis.com/stable/stock/{self.equity}/price/?token={settings.IEXCLOUD_TOKEN}").json()
        await self.update_price(data=price)

    async def disconnect(self, code):
        await database_sync_to_async(self.channel.delete)()
        await self.close()

    async def update_price(self, data):
        await self.send_json(content={'price': data})

    def get_channel(self):
        """
        Retrieves a channel for the client. Alternatively, the channel is created if it doesn't already exist.
        :return: a get_or_create tuple (object, created)
        """
        return Channels.objects.get_or_create(name=self.channel_name)

    def get_group(self, equity):
        """
        Retrieves a group for the client. Alternatively, the group is created if it doesn't already exist.
        :return: a get_or_create tuple (object, created)
        """
        self.group_name = f"{equity}-price"
        return Groups.objects.get_or_create(name=f"{equity}-price")

    async def assign_channel_to_group(self):
        # Retrieves group specific to equity
        self.group, created = await database_sync_to_async(functools.partial(self.get_group, self.equity))()
        # Retrieves channel for the client
        self.channel, created = await database_sync_to_async(self.get_channel)()

        # Assigns group to channel
        self.channel.group = self.group

        # Saves entry within database
        await database_sync_to_async(self.channel.save)()
