from django.shortcuts import render, render_to_response
from django.http import Http404, JsonResponse
from django.template import RequestContext
from . import models
# 引入settings.py
from django.conf import settings
import re
import random


def index(request):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    
    class Slider:
        pic_address = ''
        title = ''
        article_id = ''
        id = 0
    
    temp_slides = models.Slide.objects.all()
    articles = models.Article.objects.filter(classification__name__iexact = 'index_show')
    slides = []
    for i in range(len(temp_slides)):
        t = Slider()
        t.pic_address = temp_slides[i].pic_address
        t.id = i
        t.title = articles[i].title
        t.article_id = articles[i].id
        slides.append(t)
    temp_wallpapers = models.Wallpaper.objects.all()
    wallpapers = []
    num = random.sample(range(len(temp_wallpapers)), 8)
    for i in num:
        wallpapers.append(temp_wallpapers[i])
    # 第三个参数传递数据到前端,为一个dict
    return render(request, 'blog/index.html', {'wallpapers': wallpapers, 'slides': slides})


def wallpaper(request, wallpaper_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    image = models.Wallpaper.objects.get(pk = wallpaper_id)  # pk是主键字段
    return render(request, 'blog/wallpaper.html', {'image': image})


def article(request, classification, now_page):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    articles = models.Article.objects.filter(classification__name__iexact = classification)  # 获取某一分类下的文章
    per_page = 7
    total_page = len(articles) // per_page  # 每页展示7篇,total_page为总页数
    if len(articles) % per_page != 0:
        total_page += 1
    front = (int(now_page) - 1) * per_page
    back = front + per_page - 1
    if back > len(articles) - 1:
        back = len(articles) - 1
    if back < front or int(now_page) < 1:
        # raise Http404
        return render(request, 'blog/article.html', {'articles': articles, 'now_page': -1})
    pages = []  # 为要显示的页码
    for i in range(3):
        t = int(now_page) + int(i)
        if t > total_page:
            break
        pages.append(str(t))
    
    last_page = pages[-1]
    if int(last_page) == total_page:
        pages.clear()
        for i in range(5):
            t = int(total_page) - int(i)
            if t < int(now_page):
                break
            pages.append(str(t))
        pages.reverse()
    for i in range(1, 3):
        t = int(now_page) - int(i)
        if t < 1:
            break
        pages.insert(0, str(t))
    first_page = pages[0]
    # 注意切片左闭右开
    return render(request, 'blog/article.html', {
        'articles'      : articles[int(front):int(back) + 1], 'total_page': int(total_page), 'now_page': int(now_page),
        'classification': classification, 'pages': pages, 'last_page': int(last_page), 'first_page': int(first_page),
        'str_now_page'  : str(now_page),
    })


def page(request, now_page, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    # 若存在cookies，则不增加阅读量
    try:
        now_article = models.Article.objects.get(pk = article_id)
        if not "article_%s_has_read" % article_id in request.COOKIES:
            now_article.increase_readings()
    except:
        raise Http404
    # 记录访问明细
    recorder = models.Recorder(content_object = now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = now_article.title
    recorder.save()
    classification = now_article.classification
    # 要为str才能在templates中与str比较
    response = render_to_response('blog/page.html', {
        'article': now_article, 'classification': str(classification), 'now_page': now_page
    }, content_type = RequestContext(request))
    # 设置临时cookie，表示打开阅读过了,该cookie有效期直到浏览器关闭
    response.set_cookie("article_%s_has_read" % article_id, "True")
    return response


def search_page(request, word, page_number, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    try:
        now_article = models.Article.objects.get(pk = article_id)
        if not "article_%s_has_read" % article_id in request.COOKIES:
            now_article.increase_readings()
    except:
        raise Http404
    # 记录访问明细
    recorder = models.Recorder(content_object = now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = now_article.title
    recorder.save()
    # 注意到服务器端时改域名,且要写http://
    host_url = 'http://127.0.0.1:8000/search/?q='
    if settings.DEBUG == False:
        host_url = 'http://www.dongjiayi.com/search/?q='
    word = re.sub('\+{2}', '%2B%2B', word)
    back_url = host_url + str(word) + '&page=' + str(page_number)
    response = render_to_response('blog/search_page.html', {
        'article': now_article, 'word': word, 'page_number': page_number, 'back_url': back_url,
    }, content_type = RequestContext(request))
    # 设置临时cookie，表示打开阅读过了,该cookie有效期直到浏览器关闭
    response.set_cookie("article_%s_has_read" % article_id, "True")
    return response


# 先看是否有阅读过文章，再看是否点过赞
def thumbs_up(request, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    if "article_%s_has_read" % article_id in request.COOKIES:
        if "article_%s_has_thumbs_up" % article_id in request.COOKIES:
            return render_to_response('blog/jsondata.html', {'j': 'false'}, content_type = RequestContext(request))
        else:
            response = render_to_response('blog/jsondata.html', {'j': 'true'},
                                          content_type = RequestContext(request))
            response.set_cookie("article_%s_has_thumbs_up" % article_id, "True")
            now_article = models.Article.objects.get(pk = article_id)
            now_article.increase_thumb_up()
            return response
    else:
        return render_to_response('blog/jsondata.html', {'j': 'false'}, content_type = RequestContext(request))


def page_not_found(request):
    return render(request, '404.html')


def page_error(request):
    return render(request, '500.html')



def judge_ip(request):
    ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    ips = models.LimitIp.objects.all()
    t = []
    for i in ips:
        t.append(i.ip_address)
    if str(ip) in t:
        return True
    return False


def stock_recorder(request):
    now_article = models.Article.objects.get(pk = 80)
    recorder = models.Recorder(content_object = now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = '股市记录'
    recorder.save()
    temp = models.StockRecorder.objects.all()
    recorders = sorted(temp, key = lambda t: t.time, reverse = True)
    return render(request, 'blog/stock.html', {'recorders': recorders})


def cpphighlight(request):
    now_article = models.Article.objects.get(pk = 80)
    recorder = models.Recorder(content_object = now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = 'cpp代码高亮'
    recorder.save()
    return render(request, 'blog/cpphighlight.html', )