from django.db import models
from collections import OrderedDict
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
# 引用系统自带的用户模型
from django.contrib.auth.models import User


# 一个model为一张数据表

class Recorder(models.Model):
    """阅读明细记录"""
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField('id')
    object_title = models.CharField('标题', max_length = 100, default = '')
    content_object = GenericForeignKey(ct_field = 'content_type', fk_field = 'object_id')
    # 记录IP地址
    ip_address = models.CharField('ip地址', max_length = 20)
    
    # 访问时间
    view_time = models.DateTimeField('时间', auto_now_add = True)


class TagManager(models.Manager):
    def get_Tag_list(self):  # 返回文章标签列表, 每个标签以及对应的文章数目
        tags = Tag.objects.all()  # 获取所有标签
        tag_list = []
        for i in range(len(tags)):
            tag_list.append([])
        for i in range(len(tags)):
            temp = Tag.objects.get(name = tags[i].name)  # 获取当前标签
            posts = temp.article_set.all()  # 获取当前标签下的所有文章
            tag_list[i].append(tags[i].name)
            tag_list[i].append(len(posts))
        return tag_list


class Tag(models.Model):
    name = models.CharField(max_length = 20, blank = True, default = '')
    creat_time = models.DateTimeField(auto_now_add = True)
    
    objects = models.Manager()  # 默认的管理器
    tag_list = TagManager()  # 自定义的管理器
    
    @models.permalink
    def get_absolute_url(self):
        return ('tagDetail', (), {
            'tag': self.name
        })
    
    def __str__(self):
        return self.name


class ClassManager(models.Manager):
    def get_Class_list(self):  # 返回文章分类列表, 每个分类以及对应的文章数目
        classf = Classification.objects.all()  # 获取所有的分类
        class_list = []
        for i in range(len(classf)):
            class_list.append([])
        for i in range(len(classf)):
            temp = Classification.objects.get(name = classf[i].name)  # 获取当前分类
            posts = temp.article_set.all()  # 获取当前分类下的所有文章
            class_list[i].append(classf[i])
            class_list[i].append(len(posts))
        return class_list


class Classification(models.Model):
    name = models.CharField(max_length = 25, default = '')
    objects = models.Manager()  # 默认的管理器
    class_list = ClassManager()  # 自定义的管理器
    
    def __str__(self):
        return self.name


class ArticleManager(models.Model):
    def get_Article_onDate(self):  # 实现文章的按月归档, 返回月份以及对应的文章数  如: [[2015.5,5],[2015.4,5]] ,
        post_date = Article.objects.datetimes('publish_time', 'month', order = 'DESC')
        date_list = []
        for i in range(len(post_date)):
            date_list.append([])
        for i in range(len(post_date)):
            curyear = post_date[i].year
            curmonth = post_date[i].month
            tempArticle = Article.objects.filter(publish_time__year = curyear).filter(publish_time__month = curmonth)
            tempNum = len(tempArticle)
            date_list[i].append(post_date[i])
            date_list[i].append(tempNum)
        return date_list
    
    def get_Article_OnArchive(self):  # 返回一个字典,一个时间点,对应一个文章列表
        post_date = Article.objects.datetimes('publish_time', 'month', order = 'DESC')
        post_date_article = []
        for i in range(len(post_date)):
            post_date_article.append([])
        for i in range(len(post_date)):
            curyear = post_date[i].year
            curmonth = post_date[i].month
            tempArticle = Article.objects.filter(publish_time__year = curyear).filter(publish_time__month = curmonth)
            post_date_article[i] = tempArticle
        
        dicts = OrderedDict()
        for i in range(len(post_date)):
            dicts.setdefault(post_date[i], post_date_article[i])
        return dicts


class Article(models.Model):  # 文章
    title = models.CharField('标题', max_length = 100, default = '')
    tags = models.ManyToManyField(Tag, blank = True, default = '')  # 标签
    classification = models.ForeignKey(Classification, default = '')  # 分类
    content = models.TextField('内容', blank = True, null = True, default = '')
    publish_time = models.DateTimeField('发布日期', auto_now_add = True)
    modify_time = models.DateTimeField('最新修改', auto_now = True, null = True)
    readings = models.PositiveIntegerField('阅读量', default = 0)
    thumbs_up = models.PositiveIntegerField('点赞', default = 0)
    comments = models.PositiveIntegerField('评论', default = 0)
    objects = models.Manager()  # 默认的管理器
    date_list = ArticleManager()  # 自定义的管理器
    
    @models.permalink
    def get_absolute_url(self):
        return ('detail', (), {
            'year': self.publish_time.year, 'month': self.publish_time.strftime('%m'),
            'day' : self.publish_time.strftime('%d'), 'id': self.id
        })
    
    def get_tags(self):  # 返回一个文章对应的所有标签
        tag = self.tags.all()
        return tag
    
    def get_before_article(self):  # 返回当前文章的前一篇文章
        temp = Article.objects.order_by('id')
        cur = Article.objects.get(id = self.id)
        count = 0
        for i in temp:
            if i.id == cur.id:
                index = count
                break
            else:
                count = count + 1
        if index != 0:
            return temp[index - 1]
    
    def get_after_article(self):  # 返回当前文章的后一篇文章
        temp = Article.objects.order_by('id')
        max = len(temp) - 1
        cur = Article.objects.get(id = self.id)
        count = 0
        for i in temp:
            if i.id == cur.id:
                index = count
                break
            else:
                count = count + 1
        if index != max:
            return temp[index + 1]
    
    def increase_readings(self):
        self.readings += 1
        self.save(update_fields = ['readings'])
    
    def increase_thumb_up(self):
        self.thumbs_up += 1
        self.save(update_fields = ['thumbs_up'])
    
    def increase_comments(self):
        self.comments += 1
        self.save(update_fields = ['comments'])
    
    def __str__(self):
        return self.title
    
    class Meta:  # 按时间下降排序
        ordering = ['-publish_time']


class Wallpaper(models.Model):
    pic_index = models.CharField(max_length = 10, default = '')
    preview_address = models.TextField(max_length = 200, default = '')
    pic_address = models.TextField(max_length = 200, default = '')
    
    def __str__(self):
        return self.pic_index


class Slide(models.Model):
    pic_index = models.CharField(max_length = 10, default = '')
    pic_address = models.TextField(max_length = 200, default = '')
    
    def __str__(self):
        return self.pic_index


class LimitIp(models.Model):
    ip_address = models.CharField(max_length = 20, default = '')
    location = models.TextField('位置', blank = True, null = True, default = '')
    
    def __str__(self):
        return self.ip_address


class StockRecorder(models.Model):
    title = models.CharField('标题', max_length = 100, default = '')
    content = models.TextField('内容', default = '')
    time = models.CharField('时间', max_length = 20, default = '')
    
    def __str__(self):
        return self.title