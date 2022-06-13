

from django.urls import path

from users.views import RegisterView


urlpatterns = [
    path('signup/',RegisterView.as_view({ 'post': 'create' }))
]