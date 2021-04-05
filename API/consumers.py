from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
import json

from Analysis.Equity.indicator_list import indicator_list

# todo: work out how to change a user's group based on indicator / tim
class RealTimeData(AsyncJsonWebsocketConsumer):
    async def websocket_connect(self, message):
        await self.channel_layer.group_add("realtime-data", self.channel_name)
        await self.connect()

    async def send_json(self, content, close=False):
        await super().send(text_data=json.dumps(content), close=close)

    async def receive_json(self, content, **kwargs):
        if content['technicalIndicator'] in indicator_list and content['selectedEquity']:
            selected_equity = content['selectedEquity'].upper()
            technical_indicator = content['technicalIndicator'].upper()
            await self.channel_layer.group_add(f'{selected_equity}-{technical_indicator}', self.channel_name)

    async def websocket_update(self, content):
        """
        Sends JSON-encoded content to the client.
        :param content: (python native datatype) content to send to the client.
        :return: None
        """
        await self.send_json(content=content)