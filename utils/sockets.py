from channels.generic.websocket import (
    AsyncJsonWebsocketConsumer as WebSocket
)
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json


class BaseWatch(WebSocket):

    def __slugify(self, namestr):
        return namestr.replace('/', '-')

    def get_stream_name(self, scope):
        """ return the stream name
        """
        return f"{self.__slugify(scope['raw_path'].decode('utf-8'))}"

    async def connect(self):
        """ connect to the stream
        """
        await self.channel_layer.group_add(
            self.get_stream_name(self.scope), self.channel_name)
        await self.accept()

        self.groups.append(self.get_stream_name(self.scope))

    async def disconnect(self, close_code):
        """ disconnect to the stream
        """

        # It wont need this code because under the hood django-channel 
        #  will automatically discard it once it disconnect
        # await self.channel_layer.group_discard(
        #     self.get_stream_name(self.scope), self.channel_name)
        pass



def send_emit_data(name,data):
    return {
        "type": "send_data",
        "data": {
            "type": "emit",
            "name": name,
            "data": data,
        } 
    } 


class BaseConsumer(BaseWatch):

    def get_stream_name(self,scope):
        return "_base_"

    async def receive(self,text_data):
        data = json.loads(text_data)
        type = data["type"]
        name = data["name"]
        # socket.io event base style of websocket
        if type == "on":
            await self.channel_layer.group_add(name,self.channel_name)
            self.groups.append(name)
        if type == "emit":
            await self.channel_layer.group_send(name,send_emit_data(name,data["data"]))
        if type == "dispose" and name in self.groups:
            await self.channel_layer.group_discard(name,self.channel_name)
            self.groups.remove(name)

    async def send_data(self,event):
        await self.send_json(event.get('data'))
            

    @staticmethod
    def emit(group_name,data):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            send_emit_data(group_name,data)
        )   