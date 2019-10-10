'''
MARKDOWN过滤器
'''
import markdown2

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.encoding import force_text
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(is_safe = True)
@stringfilter
def custom_markdown(value):
    return mark_safe(markdown2.markdown(force_text(value),
                                        extras = ["fenced-code-blocks", "cuddled-lists", "metadata", "tables",
                                                  "spoiler"]))


"""
去除publish time里的具体时间
"""


@register.filter
def trans_date(value):
    return str(value).split(' ')[0]


"""
调整时间轴里的日期
"""


@register.filter
def get_year(value):
    return str(value).split('-')[0]


@register.filter
def get_month(value):
    return str(value).split('-')[1]


@register.filter
def get_day(value):
    return str(value).split('-')[2]
