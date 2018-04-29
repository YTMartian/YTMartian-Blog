from django.db import models
from django.conf import settings
from mptt.models import TreeForeignKey, MPTTModel


# Create your models here.

class Comment(MPTTModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, blank = True, null = True, )
    user_name = models.CharField(max_length = 50, blank = True, null = True, default = 'anonymous')
    post = models.ForeignKey(settings.COMMENT_ENTRY_MODEL, verbose_name = '文章')
    parent = TreeForeignKey('self', blank = True, null = True, verbose_name = '父级评论')
    content = models.TextField('评论', blank = True, null = True, default = '')
    submit_date = models.DateTimeField(auto_now_add = True, verbose_name = '提交时间')
    thumbs_up = models.PositiveIntegerField('赞', default = 0)
    thumbs_down = models.PositiveIntegerField('踩', default = 0)
    
    class MPTTMeta:
        order_insertion_by = ['submit_date']
    
    def __str__(self):
        if self.parent is not None:
            return '%s 回复 %s' % (self.user_name, self.parent.user_name)
        return '%s 评论文章 post_%s' % (self.user_name, str(self.post.id))