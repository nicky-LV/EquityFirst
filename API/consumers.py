from channels.consumer import AsyncConsumer
from channels.layers import get_channel_layer
from channels.exceptions import StopConsumer

from CryptoDash.tasks import db
import json


class CryptoConsumer(AsyncConsumer):

    # accept websocket connection
    async def websocket_connect(self, event):
        # add channel to group
        await self.channel_layer.group_add('datastream', self.channel_name)

        # accept connection
        await self.send({
            "type": "websocket.accept"
        })

    # payload received from frontend
    async def websocket_receive(self, payload):
        if payload['text'] == 'initialize':
            # add the client's channel to our group
            await self.send({
                "type": "websocket.send",
                "text": json.dumps(db.get(all_keys=True))
            })

    async def websocket_update(self, payload):
        print("websocket update")
        await self.send({
            "type": "websocket.send",
            "text": payload['text']
        })

    # close websocket (server-side)
    async def websocket_disconnect(self, payload):
        await self.channel_layer.group_discard('datastream', self.channel_name)
        await self.send({
            "type": "websocket.disconnect"
        })
        raise StopConsumer

