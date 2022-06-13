from rest_framework.response import Response
from urllib.parse import urlparse,parse_qs 
from rest_framework.pagination import CursorPagination


class ViewSetPagination(object):

    @property
    def paginator(self):
        """ The paginator instance associated with the view, or `None`.
        """
        if not hasattr(self, '_paginator'):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
        return self._paginator

    def paginate_queryset(self, queryset):
        """ Return a single page of results, or `None` if pagination is disabled.
        """
        if self.paginator is None:
            return None
        self.qs = queryset
        return self.paginator.paginate_queryset(queryset, self.request, view=self)
    
    def get_paginated_response(self, data,**kwargs):
        """ Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        page_ = self.paginator.page

        return Response({
            'next': page_.next_page_number() if page_.has_next() else None,
            'previous': page_.previous_page_number() if page_.has_previous() else None,
            'count': page_.paginator.count,
            'results': data,
            **kwargs
        })


class CursorViewSetPagination(ViewSetPagination):
    def get_paginated_response(self, data,**kwargs):
        """ Return a paginated style `Response` object for the given output data.
        """
        assert self.paginator is not None
        next_cursor = parse_qs(urlparse(self.paginator.get_next_link()).query)['page'][0] if self.paginator.has_next else None
        return Response({
            'next': next_cursor,
            'results': data,
            'count': self.qs.count(),
            **kwargs
        })