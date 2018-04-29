from django.conf.urls import url
from . import views

app_name = 'comments'
urlpatterns = [
    url(r'^post/(?P<id>[0-9]+)/submit-comment/$', views.submit_comment, name = 'submit_comment'),
    url(r'^comment/(\d+)/(\d+)/thumbs_up/$', views.thumbs_up, name = 'thumbs_up'),
    url(r'^comment/(\d+)/(\d+)/thumbs_down/$', views.thumbs_down, name = 'thumbs_down'),
]
