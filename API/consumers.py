from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import functools

from .models import Channels, Groups

from Equity.classes import Equity
from Equity.exceptions import MissingPriceData


class RealtimePriceConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.equity = None
        self.equity_obj = None
        self.group_name = None
        self.group = None
        self.channel = None

    async def connect(self):
        """
        Accepts WS connection. Creates a group for this channel and its specific equity.
        """
        self.equity = self.scope['url_route']['kwargs']['equity']
        self.equity_obj = Equity(equity=self.equity)
        # Assign channel to group within database, so we can query it within Celery tasks.
        await self.assign_channel_to_group()
        # Add channel to group within channel layer
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        # Accept websocket connection
        await self.accept()


        try:
            # Send initial price-data
            await self.send_json(content=self.equity_obj.websocket_data)

        except MissingPriceData:
            pass

    async def receive_json(self, content, **kwargs):
        # Client has changed their selected equity.
        if content['type'] == "CHANGE_EQUITY":
            # Updates selected equity of channel.
            self.equity = content['equity']
            self.equity_obj = Equity(equity=self.equity)
            # Updates price shown to client.
            await self.update_price({
                "text": self.equity_obj.websocket_data
            })

    async def disconnect(self, code):
        await database_sync_to_async(self.channel.delete)()
        await self.close()

    async def update_price(self, data):
        # Checks if market is open (thus a price update is available)
        ws_data = data['text']
        await self.send_json(content=ws_data)

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

        # todo: check if channel is assigned to group. If so, delete the entry.

        # Assigns group to channel
        self.channel.group = self.group
        # Saves entry within database
        await database_sync_to_async(self.channel.save)()
