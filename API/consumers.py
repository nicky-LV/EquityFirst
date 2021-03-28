from channels.consumer import SyncConsumer
from channels.exceptions import StopConsumer


class CryptoConsumer(SyncConsumer):
    # websocket connect
    def websocket_connect(self):
        self.send({
            "type": "websocket.connect"
        })

    # websocket data received
    def websocket_receive(self, data):
        self.send({
            "type": "websocket.send",
            "data": data
        })

    # websocket disconnected
    def websocket_disconnect(self):
        self.send({
            "type": "websocket.disconnect"
        })
        raise StopConsumer

