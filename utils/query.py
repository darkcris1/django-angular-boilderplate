import calendar
import datetime

from django.db.models.base import Model
from django.db.models.query import QuerySet
from django.shortcuts import _get_queryset
from django.utils import timezone
from .validators import img_ext, media_ext, video_ext
from django.db.models import Q


def get_object_or_none(klass, *args, **kwargs):
    """ try to return the class instance and
        return None if none existent.
    """
    queryset = _get_queryset(klass)
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        return None


class SerializerProperty(object):

    def __init__(self, *args, **kwargs):
        return super(SerializerProperty, self).__init__(*args, **kwargs)

    @property
    def _model(self)-> Model:
        return self.serializer_class.Meta.model

    def inject_authuser(self, data):
        return {**data, **{'user':self.request.user.id}}

    permission_classes_by_action = {}

    def get_permissions(self):
      try:
        # return permission_classes depending on `action`
        return [permission() for permission in self.permission_classes_by_action[self.action]]
      except KeyError:
        # action is not set return default permission_classes
        return [permission() for permission in self.permission_classes]



class FileQuery:
    @staticmethod
    def image(field_name):
        query = Q()
        for ext in img_ext:
            query = query | Q(**{field_name + "__iendswith": ext})
        
        return query

    @staticmethod
    def media(field_name):
        query = Q()
        
        for ext in media_ext:
            query = query | Q(**{field_name + "__iendswith": ext})
        
        return query

    @staticmethod
    def video(field_name):
        query = Q()
        for ext in video_ext:
            query = query | Q(**{field_name + "__iendswith": ext})
        
        return query

    @staticmethod
    def image_filter(qs: QuerySet,field_name) -> QuerySet:
        
        query = FileQuery.image(field_name)
        return qs.filter(query)

    @staticmethod
    def media_filter(qs: QuerySet,field_name) -> QuerySet:
        query = FileQuery.media(field_name)
        return qs.filter(query)


    @staticmethod
    def video_filter(qs: QuerySet,field_name) -> QuerySet:
        query = FileQuery.video(field_name)
        return qs.filter(query)