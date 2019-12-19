from django.conf.urls import url, handler404, handler500
from . import views

urlpatterns = [
    url(r'^index/$', views.index, name = 'index'),
    url(r'^wallpaper/(\d+)$', views.wallpaper, name = 'wallpaper'),  # 每个参数形如（参数）
    url(r'^article/(acm|python|c-c\+\+|java|thoughts|others|tags)/(.+)/(\d+)$', views.article, name = 'article'),
    url(r'^article/(\d+)/(\d+)$', views.page, name = 'page'),  # \d只能匹配0-9,'+'匹配前面的表达式一次或多次
    url(r'^search/q=(.+)&page=(\d+)/(\d+)', views.search_page, name = 'search_page'),
    url(r'^thumbs_up/article=(\d+)$', views.thumbs_up, name = 'thumbs_up'),
    url(r'^stock_recorder$', views.stock_recorder, name = 'stock_recorder'),
    url(r'^cpphighlight$', views.cpphighlight, name = 'cpphighlight'),
]

handler404 = views.page_not_found
handler500 = views.page_error
