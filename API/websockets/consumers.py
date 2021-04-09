from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

from API.models import Channels, Groups

from Analysis.Equity.stock_index import top_10_tickers

# todo: work out how to change a user's group based on indicator / tim


class IntraDayData(AsyncJsonWebsocketConsumer):
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

                group = Groups.objects.get_or_create(name=f"{content['selectedEquity']}-intraday")
                channel = Channels.objects.create(name=self.channel_name, group=group)

        else:
            await self.send(text_data="No type or selected equity is provided in payload.")


    async def websocket_update(self, content):
        """
        Sends JSON-encoded content to the client.
        :param content: (python native datatype) content to send to the client.
        :return: None
        """
        await self.send_json(content=content)