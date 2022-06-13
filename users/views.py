from django.shortcuts import render
from users.serializers import RegisterSerializer
from utils.query import SerializerProperty
from rest_framework.mixins import CreateModelMixin
from rest_framework.viewsets import GenericViewSet
# Create your views here.

class RegisterView(SerializerProperty, GenericViewSet, CreateModelMixin):
    permission_classes = []
    authentication_classes = []
    serializer_class = RegisterSerializer


