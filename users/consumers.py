import json
from utils.sockets import BaseConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import F

class GlobalConsumer(BaseConsumer):
    def get_stream_name(self, scope):
        return "_global"

    async def connect(self):
        await super(GlobalConsumer,self).connect()
        """Add custom logic when the user is connected"""

    async def disconnect(self, close_code):
        await super(GlobalConsumer,self).disconnect(close_code)
        """Add custom logic when the user is disconnected"""
