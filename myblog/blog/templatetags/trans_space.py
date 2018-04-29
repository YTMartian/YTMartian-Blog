"""
将search.html里query中的空格替换为' + '号
"""
from django import template

register = template.Library()


@register.filter
def trans_space(value):
    return str(value).replace(' ', '+')

