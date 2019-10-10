from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Comment


# Register your models here.


class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_name', 'post', 'content', 'submit_date', 'thumbs_up', 'thumbs_down', 'ip_address')
    ordering = ('-submit_date',)
    list_per_page = 20


admin.site.register(Comment, CommentAdmin)