from django.contrib import admin
from django.db import IntegrityError
from django.contrib import messages
from .models import Tag, Classification, Article, Wallpaper, Slide, Recorder, LimitIp, StockRecorder
# from django import forms


# class ArticleForm(forms.ModelForm):
#     content = forms.CharField(widget=AdminPagedownWidget())
#
#     class Meta:
#         model = Article
#         fields = '__all__'


class ArticleAdmin(admin.ModelAdmin):
    # form = ArticleForm
    list_filter = ('publish_time', 'classification')
    list_display = ('title', 'publish_time', 'modify_time', 'classification', 'readings', 'thumbs_up', 'comments')
    list_per_page = 10
    search_fields = ('title',)


class RecorderAdmin(admin.ModelAdmin):
    """view recorder admin"""
    list_display = ('content_type', 'object_title', 'object_id', 'ip_address', 'view_time')
    ordering = ('-view_time',)
    list_per_page = 20


class LimitIpAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'location')
    list_per_page = 20


class StockAdmin(admin.ModelAdmin):
    list_display = ('time', 'title')
    list_per_page = 20
    ordering = ('-time',)


class TagAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        try:
            super().save_model(request, obj, form, change)
        except IntegrityError:
            messages.error(request, f'标签 "{obj.name}" 已存在，请使用其他名称。')
            # 重新抛出异常，但这次会被 admin 优雅地处理
            raise IntegrityError


admin.site.register(Tag, TagAdmin)
admin.site.register(Slide)
admin.site.register(Recorder, RecorderAdmin)
admin.site.register(Wallpaper)
admin.site.register(LimitIp, LimitIpAdmin)
admin.site.register(Classification)
admin.site.register(Article, ArticleAdmin)
admin.site.register(StockRecorder, StockAdmin)
