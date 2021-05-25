from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import Http404, JsonResponse
from django.template import RequestContext
from django.shortcuts import render
from django.core import serializers
from django.conf import settings
from . import models
# 引入settings.py
import random
import math
import json
import re
import sys

sys.path.append("..")
import comments.models


def index(request):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})

    class Slider:
        pic_address = ''
        title = ''
        article_id = ''
        id = 0

    temp_slides = models.Slide.objects.all()
    articles = models.Article.objects.filter(classification__name__iexact='index_show')
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
    tags = models.Tag.objects.all()
    return render(request, 'blog/index.html', {'wallpapers': wallpapers, 'slides': slides, 'tags': tags})


def wallpaper(request, wallpaper_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    try:
        image = models.Wallpaper.objects.get(pic_index=str(wallpaper_id))  # pk是主键字段
    except:
        image = models.Wallpaper()
    return render(request, 'blog/wallpaper.html', {'image': image})


def article(request, classification, tags, now_page):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    # 判断是否是从标签处点进来的,'$'说明不是从标签处点进来的
    articles = []
    if str(tags) == '$':
        articles = models.Article.objects.filter(classification__name__iexact=classification)  # 获取某一分类下的文章
    else:
        all_articles = models.Article.objects.all()
        for i in all_articles:
            article_all_tags = i.tags.all()
            for j in article_all_tags:
                if tags == j.name:
                    articles.append(i)
                    break
    per_page = settings.ARTICLE_PER_PAGE
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
        'articles': articles[int(front):int(back) + 1], 'total_page': int(total_page), 'now_page': int(now_page),
        'classification': classification, 'pages': pages, 'last_page': int(last_page), 'first_page': int(first_page),
        'str_now_page': str(now_page), 'tags': tags
    })


def page(request, now_page, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    # 若存在cookies，则不增加阅读量
    try:
        now_article = models.Article.objects.get(pk=article_id)
        if not "article_%s_has_read" % article_id in request.COOKIES:
            now_article.increase_readings()
    except:
        raise Http404
    # 记录访问明细
    recorder = models.Recorder(content_object=now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = now_article.title
    recorder.save()
    classification = now_article.classification
    # 要为str才能在templates中与str比较
    response = render(request, 'blog/page.html', {
        'article': now_article, 'classification': str(classification), 'now_page': now_page
    })
    # 设置临时cookie，表示打开阅读过了,该cookie有效期直到浏览器关闭
    response.set_cookie("article_%s_has_read" % article_id, "True")
    return response


def search_page(request, word, page_number, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    try:
        now_article = models.Article.objects.get(pk=article_id)
        if not "article_%s_has_read" % article_id in request.COOKIES:
            now_article.increase_readings()
    except:
        raise Http404
    # 记录访问明细
    recorder = models.Recorder(content_object=now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = now_article.title
    recorder.save()
    # 注意到服务器端时改域名,且要写http://
    host_url = 'http://127.0.0.1:8000/search/?q='
    if not settings.DEBUG:
        host_url = 'http://www.dongjiayi.com/search/?q='
    word = re.sub('\+{2}', '%2B%2B', word)
    back_url = host_url + str(word) + '&page=' + str(page_number)
    response = render(request, 'blog/search_page.html', {
        'article': now_article, 'word': word, 'page_number': page_number, 'back_url': back_url,
    })
    # 设置临时cookie，表示打开阅读过了,该cookie有效期直到浏览器关闭
    response.set_cookie("article_%s_has_read" % article_id, "True")
    return response


# 先看是否有阅读过文章，再看是否点过赞
def thumbs_up(request, article_id):
    if judge_ip(request):
        return JsonResponse({'董家佚': '😁限制访问😁'})
    if "article_%s_has_read" % article_id in request.COOKIES:
        if "article_%s_has_thumbs_up" % article_id in request.COOKIES:
            return render(request, 'blog/jsondata.html', {'j': 'false'})
        else:
            response = render(request, 'blog/jsondata.html', {'j': 'true'})
            response.set_cookie("article_%s_has_thumbs_up" % article_id, "True")
            now_article = models.Article.objects.get(pk=article_id)
            now_article.increase_thumb_up()
            return response
    else:
        return render(request, 'blog/jsondata.html', {'j': 'false'})


# 404 should has exception.
def page_not_found(request, exception):
    return render(request, '404.html')


# 500 should not has exception.
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
    now_article = models.Article.objects.get(pk=80)
    recorder = models.Recorder(content_object=now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = '股市记录'
    recorder.save()
    temp = models.StockRecorder.objects.all()
    recorders = sorted(temp, key=lambda t: t.time, reverse=True)
    return render(request, 'blog/stock.html', {'recorders': recorders})


def cpphighlight(request):
    now_article = models.Article.objects.get(pk=80)
    recorder = models.Recorder(content_object=now_article)
    recorder.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
    recorder.object_title = 'cpp代码高亮'
    recorder.save()
    return render(request, 'blog/cpphighlight.html', )


@csrf_exempt
@require_http_methods(['GET'])
def get_slide(request):
    res = {}
    try:
        data = models.Slide.objects.all()
        res['list'] = json.loads(serializers.serialize('json', data))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['GET'])
def get_tags(request):
    res = {}
    try:
        data = models.Tag.objects.all()
        res['list'] = json.loads(serializers.serialize('json', data))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


PER_PAGE = 8


@csrf_exempt
@require_http_methods(['POST'])
def get_article(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        res_data = {}
        if data['condition'] == 'all':  # 所有文章
            res_data = models.Article.objects.all()
        elif data['condition'] == 'slide':  # slide的文章
            res_data = models.Article.objects.filter(classification__id=8)  # index_show
        elif data['condition'] == 'tag':  # 该标签下的文章
            try:
                per_page = PER_PAGE
                page_number = data['page_number']
                res_data = models.Article.objects.filter(tags__id=data['tag_id'])  # 判断是否在ManyToManyField里面
                if 0 < page_number <= math.ceil(len(res_data) / per_page):
                    start = per_page * (page_number - 1)
                    end = per_page * page_number
                    if end > len(res_data):
                        end = len(res_data)
                    res_data = res_data[start:end]
                else:
                    res_data = {}
            except:
                pass
        elif data['condition'] == 'one_article':  # 单独一篇文章
            res_data = models.Article.objects.filter(pk=data['article_id'])
            if not data['is_reading']:
                article_ = models.Article.objects.get(pk=data['article_id'])
                article_.readings = article_.readings + 1
                article_.save()
        elif data['condition'] == 'page':
            try:
                per_page = PER_PAGE
                page_number = data['page_number']
                res_data = models.Article.objects.all()
                if 0 < page_number <= math.ceil(len(res_data) / per_page):
                    start = per_page * (page_number - 1)
                    end = per_page * page_number
                    if end > len(res_data):
                        end = len(res_data)
                    res_data = res_data[start:end]
                else:
                    res_data = {}
            except:
                pass
        elif data['condition'] == 'history':
            try:
                per_page = PER_PAGE
                page_number = data['page_number']
                res_data = models.Article.objects.filter(content__contains=data['search_text'])
                if 0 < page_number <= math.ceil(len(res_data) / per_page):
                    start = per_page * (page_number - 1)
                    end = per_page * page_number
                    if end > len(res_data):
                        end = len(res_data)
                    res_data = res_data[start:end]
                else:
                    res_data = {}
            except:
                pass
        res['list'] = json.loads(serializers.serialize('json', res_data))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_wallpaper(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        res_data = {}
        if data['condition'] == 'index':
            wallpapers = models.Wallpaper.objects.all()
            res_data = random.sample(list(wallpapers), 8)
            print(res_data)
        elif data['condition'] == 'one':
            res_data = models.Wallpaper.objects.filter(id=data['id'])  # index_show
        res['list'] = json.loads(serializers.serialize('json', res_data))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def get_comment(request):
    res = {}
    try:
        data = json.loads(request.body.decode('utf-8'))
        res_data = {}
        if data['condition'] == 'article':  # 获取文章的评论
            res_data = comments.models.Comment.objects.filter(post__id=data['article_id'])
        elif data['condition'] == 'comment':  # 获取评论的评论
            res_data = comments.models.Comment.objects.filter(parent__id=data['comment_id'])
        res['list'] = json.loads(serializers.serialize('json', res_data))
        res['msg'] = 'success'
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def submit_like(request):
    res = {}
    try:
        msg = 'failed'
        data = json.loads(request.body.decode('utf-8'))
        if data['condition'] == 'article':  # 点赞文章
            article_ = models.Article.objects.get(id=data['article_id'])
            if data['state'] == 'add':
                article_.thumbs_up = article_.thumbs_up + 1
                msg = 'success'
            elif data['state'] == 'minus':
                article_.thumbs_up = article_.thumbs_up - 1
                msg = 'success'
            article_.save()
        elif data['condition'] == 'comment':  # 点赞评论
            comment = comments.models.Comment.objects.get(id=data['comment_id'])
            if data['state'] == 'add':
                comment.thumbs_up = comment.thumbs_up + 1
                msg = 'success'
            elif data['state'] == 'minus':
                comment.thumbs_up = comment.thumbs_up - 1
                msg = 'success'
            comment.save()
        res['msg'] = msg
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)


@csrf_exempt
@require_http_methods(['POST'])
def submit_comment(request):
    res = {}
    try:
        msg = 'failed'
        data = json.loads(request.body.decode('utf-8'))
        res_data = {}
        if data['condition'] == 'article':  # 回复文章
            if data['state'] == 'add':  # 添加评论
                article_ = models.Article.objects.get(id=data['article_id'])
                article_.comments = article_.comments + 1
                article_.save()
                comment = comments.models.Comment(content=data['content'], post=article_)
                comment.user_name = data['user_name']
                comment.save()
                msg = 'success'
                res_data = comments.models.Comment.objects.filter(id=comment.id)
            elif data['state'] == 'delete':  # 删除评论
                comment = comments.models.Comment.objects.get(id=data['comment_id'])
                print(comment.__dict__)
                print(comment.post_id)
                article_ = models.Article.objects.get(id=comment.post_id)
                print('fuck1')
                article_.comments = article_.comments - 1
                article_.save()
                print('fuck2')
                comments.models.Comment.objects.filter(id=data['comment_id']).delete()
                print('fuck3')
                msg = 'success'
        elif data['condition'] == 'comment':  # 回复评论
            if data['state'] == 'add':  # 添加评论
                parent = comments.models.Comment.objects.get(id=data['comment_id'])
                comment = comments.models.Comment(content=data['content'], parent=parent)
                comment.save()
                msg = 'success'
            elif data['state'] == 'delete':  # 删除评论
                comments.models.Comment.objects.get(id=data['comment_id']).delete()
                msg = 'success'
        res['list'] = json.loads(serializers.serialize('json', res_data))
        res['msg'] = msg
        res['code'] = 0
    except Exception as e:
        res['msg'] = str(e)
        res['code'] = 1
    return JsonResponse(res)
