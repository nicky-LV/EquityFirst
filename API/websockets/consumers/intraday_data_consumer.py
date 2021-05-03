from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
import json

import functools

from API.models import Channels, Groups

from Equity.equity_symbols import equity_symbols
from Equity.classes import EquityData


class IntraDayData(AsyncJsonWebsocketConsumer):
    def __init__(self):
        self.channel = None
        self.group = None
        self.group_name = None
        super().__init__()

    async def websocket_connect(self, message):
        """
        Accepts the websocket request. Client then sends a request to initialize dataflow.
        """
        # create channel db entry for the client
        self.channel, created = await database_sync_to_async(self.get_channel)()

        await self.connect()

    async def send_json(self, content, close=False):
        await super().send(text_data=json.dumps(content), close=close)

    async def receive_json(self, content, **kwargs):
        # Identify the type of the user's request
        if content['type'] and content['selectedEquity'] in equity_symbols:

            if content['type'] == "GROUP":
                """
                Based on the provided selected equity, retrieves a group and links the channel to said group.
                
                --- 
                Clients must send a "type" key within the JSON payload, with "GROUP" as the value to re-group a channel.
                """

                selected_equity = content['selectedEquity']

                # get / create the group based off the specified equity
                self.group, created = await database_sync_to_async(functools.partial(self.get_group, selected_equity))()

                # assign channel to group
                success = database_sync_to_async(functools.partial(self.assign_channel_to_group,
                                                                   channel=self.channel,
                                                                   group=self.group))()

                if success:
                    # Add channel to group
                    await self.channel_layer.group_add(self.group_name, self.channel_name)
                    # Instantiate EquityData instance (which we can retrieve data from)

                    try:
                        data = EquityData(selected_equity)

                        # Retrieve intraday data
                        initial_intraday_data = data.get_intraday_data()

                        # Retrieve historical data
                        week_data, month_data, year_data = data.get_historic_data()

                        await self.send_json(content={
                            "STATUS": "INITIAL_DATA",
                            "DATA": {
                                "1D": initial_intraday_data,
                                "1W": week_data,
                                "1M": month_data,
                                "1Y": year_data
                            }
                        })

                    except AssertionError:
                        await self.send_json(content=
                        {
                            "STATUS": "ERROR",
                            "DATA": "selectedEquity is not a valid equity ticker."
                        })

                    except KeyError:
                        await self.send_json(content=
                        {
                            "STATUS": "ERROR",
                            "DATA": "Equity not found in database."
                        })

                if not success:
                    # returns error
                    await self.send_json(content=
                    {
                        "STATUS": "ERROR",
                        "DATA": "Failed to add group to channel"
                    })
        else:
            # type or selectedEquity was not provided in the JSON payload.
            await self.send_json({
                "STATUS": "ERROR",
                "MESSAGE": "Please select an equity."
            })

    async def websocket_update(self, content):
        """
        Sends JSON-encoded content to the client.
        :param content: (python native datatype) content to send to the client.
        :return: None
        """
        await self.send(text_data=content['text'])

    """
    async def websocket_disconnect(self, message):
        # Todo: remove channel
        await database_sync_to_async(self.remove_channel)()
        await self.close()
    """

    # ---------------------------------------------
    # DB queries
    # ---------------------------------------------

    def get_group(self, selectedEquity):
        """
        Returns the group associated with the selected equity
        :param selectedEquity: the equity that the user has selected
        :return: a get_or_create tuple (object, created)
        """
        self.group_name = f"{selectedEquity}-intraday"
        return Groups.objects.get_or_create(name=f"{selectedEquity}-intraday")

    def get_channel(self):
        """
        Creates a channel (DB entry) for the client.
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

    def remove_channel(self):
        """
        Deletes channel once client has disconnected
        """
        print(f"Channel: {self.channel} deleted.")
        self.channel.delete()