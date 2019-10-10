from django.conf.urls import url
from . import views

app_name = 'oaugh'
urlpatterns = [
    url(r'^qq_check/$', views.qq_check, name = 'qq_check'),
    url(r'^qq_login/$', views.qq_login, name = 'qq_login'),
]
