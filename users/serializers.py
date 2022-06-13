from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from users.models import User

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password','photo')