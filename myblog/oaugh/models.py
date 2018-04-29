from django.db import models


# Create your models here.


class OAuth_QQ(models.Model):
    user_name = models.TextField('用户名', blank = True, null = True, default = 'anonymous')
    qq_openid = models.CharField(max_length = 128, blank = True, null = True, default = '')
    
    def __str__(self):
        return self.qq_openid
