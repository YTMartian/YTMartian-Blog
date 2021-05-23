from django.conf.urls import url, handler404, handler500
from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    url(r'^index/$', views.index, name='index'),
    url(r'^wallpaper/(\d+)$', views.wallpaper, name='wallpaper'),  # 每个参数形如（参数）
    url(r'^article/(acm|python|c-c\+\+|java|thoughts|others|tags)/(.+)/(\d+)$', views.article, name='article'),
    url(r'^article/(\d+)/(\d+)$', views.page, name='page'),  # \d只能匹配0-9,'+'匹配前面的表达式一次或多次
    url(r'^search/q=(.+)&page=(\d+)/(\d+)', views.search_page, name='search_page'),
    url(r'^thumbs_up/article=(\d+)$', views.thumbs_up, name='thumbs_up'),
    url(r'^stock_recorder$', views.stock_recorder, name='stock_recorder'),
    url(r'^cpphighlight$', views.cpphighlight, name='cpphighlight'),
    path('get_slide/', views.get_slide),
    path('get_tags/', views.get_tags),
    path('get_article/', views.get_article),
    path('get_wallpaper/', views.get_wallpaper),
    path('get_comment/', views.get_comment),
    path('submit_like/', views.submit_like),
]

handler404 = views.page_not_found
handler500 = views.page_error
