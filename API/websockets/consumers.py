from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import json

import functools

from API.models import Channels, Groups

from Analysis.Equity.stock_index import top_10_tickers

# todo: work out how to change a user's group based on indicator / tim


class IntraDayData(AsyncJsonWebsocketConsumer):
    def __init__(self):
        self.channel = None
        self.group = None
        super().__init__()

    async def websocket_connect(self, message):
        """
        Accepts the websocket request. Client then sends a request to initialize dataflow.
        """
        channel = Channels(name=self.channel_name)
        await self.connect()

    async def send_json(self, content, close=False):
        await super().send(text_data=json.dumps(content), close=close)

    async def receive_json(self, content, **kwargs):
        # Identify the type of the user's request
        if content['type'] and content['selectedEquity'] in top_10_tickers:

            if content['type'] == "GROUP":
                """
                Based on the provided selected equity, retrieves a group and links the channel to said group.
                
                --- 
                Clients must send a "type" key within the JSON payload, with "GROUP" as the value to re-group a channel.
                """

                # get / create the group based off the specified equity
                self.group, created = await database_sync_to_async(functools.partial(self.get_group, content['selectedEquity']))()

                # create channel db entry for the client
                self.channel, created = await database_sync_to_async(self.get_channel)()

                # assign channel to group
                status = database_sync_to_async(functools.partial(self.assign_channel_to_group,
                                                                  channel=self.channel,
                                                                  group=self.group))()

                if not status:
                    # returns error
                    await self.send_json(content=
                                         json.dumps({
                                             "STATUS": "ERROR",
                                             "MESSAGE": "Failed to add group to channel"
                                         }))

                print(self.channel.name)
                print(self.group.name)

        else:
            await self.send(text_data="No type or selected equity is provided in payload.")

    async def websocket_update(self, content):
        """
        Sends JSON-encoded content to the client.
        :param content: (python native datatype) content to send to the client.
        :return: None
        """
        await self.send_json(content=content)

    # DB queries

    @staticmethod
    def get_group(selectedEquity):
        """
        Returns the group associated with the selected equity
        :param selectedEquity: the equity that the user has selected
        :return: a get_or_create tuple (object, created)
        """
        return Groups.objects.get_or_create(name=f"{selectedEquity}-intraday")

    def get_channel(self):
        """
        Creates a channel (DB entry) for the client.
        :param group: Group to connect to
        :return: a get_or_create tuple (object, created)
        """
        return Channels.objects.get_or_create(name=self.channel_name)

    @staticmethod
    def assign_channel_to_group(channel, group):
        """
        Assigns channel to group
        :param channel: Client's channel
        :param group: Group that channel will be added to
        :return bool: True/False if successful
        """

        try:
            channel.group = group
            channel.save()
            return True

        except Exception:
            return False