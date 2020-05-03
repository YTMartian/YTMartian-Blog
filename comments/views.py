from .forms import CommentForm
from . import models
from blog.models import Article
from django.http import JsonResponse, Http404
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext
from django.shortcuts import render


# Create your views here.

@require_POST
@csrf_exempt
def submit_comment(request, id):
    if not "article_%s_has_read" % id in request.COOKIES:
        raise Http404
    form = CommentForm(data=request.POST)
    # print(request.POST)
    if form.is_valid():
        new_comment = form.save(commit=False)
        # new_comment.user = request.user
        # new_comment.user_name = request.user.username
        new_comment.user_name = 'Anonymous'
        new_comment.ip_address = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", None))
        new_comment.save()
        # location = "#c" + str(new_comment.id)
        now_article = Article.objects.get(pk=id)
        now_article.comments += 1
        now_article.save()
        return JsonResponse({"msg": "success!"})
    return JsonResponse({"msg": "评论出错!"})


def thumbs_up(request, article_id, comment_id):
    if not "article_%s_has_read" % article_id in request.COOKIES:
        return render(request, 'blog/jsondata.html', {'j': 'false'})
    if "comment_%s_has_thumbs_up" % comment_id in request.COOKIES:
        return render('blog/jsondata.html', {'j': 'false'})
    response = render(request, 'blog/jsondata.html', {'j': 'true'})
    response.set_cookie("comment_%s_has_thumbs_up" % comment_id, "True")
    comment = models.Comment.objects.get(pk=comment_id)
    comment.thumbs_up += 1
    comment.save()
    return response


def thumbs_down(request, article_id, comment_id):
    if not "article_%s_has_read" % article_id in request.COOKIES:
        return render(request, 'blog/jsondata.html', {'j': 'false'})
    if "comment_%s_has_thumbs_down" % comment_id in request.COOKIES:
        return render(request, 'blog/jsondata.html', {'j': 'false'})
    response = render(request, 'blog/jsondata.html', {'j': 'true'})
    response.set_cookie("comment_%s_has_thumbs_down" % comment_id, "True")
    comment = models.Comment.objects.get(pk=comment_id)
    comment.thumbs_down += 1
    comment.save()
    return response
