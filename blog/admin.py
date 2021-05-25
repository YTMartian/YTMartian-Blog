from django.contrib import admin
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


admin.site.register(Tag)
admin.site.register(Slide)
admin.site.register(Recorder, RecorderAdmin)
admin.site.register(Wallpaper)
admin.site.register(LimitIp, LimitIpAdmin)
admin.site.register(Classification)
admin.site.register(Article, ArticleAdmin)
admin.site.register(StockRecorder, StockAdmin)
