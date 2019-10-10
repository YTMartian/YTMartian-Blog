"""
在img标签后插入 id="myImg" class="img-judge" 这样写文章时只需写<img src="....">
因此不要在文章本身写入 '<img' 这种内容
在video标签后插入 class="myVideo"
这样就只需写 <video controls><source src="...."></video>
因此不要在文章本身写入 '<video' 这种内容
"""
from django import template

register = template.Library()


@register.filter
def add_(value):
    s = str(value)
    index = 0
    max_loop = 0
    while True:
        max_loop += 1
        index = s.find('<img', index)
        if index == -1 or max_loop > 100:
            break
        else:
            index += 4  # original index is before '<img'
            s = s[:index] + ' id="myImg" class="img-judge" ' + s[index:]
            index += 30  # 30 is len(' id="myImg" class="img-judge" ')
    index = 0
    max_loop = 0
    while True:
        max_loop += 1
        index = s.find('<video', index)
        if index == -1 or max_loop > 100:
            break
        else:
            index += 6  # original index is before '<video'
            s = s[:index] + ' controls id="my-video" class="video-js vjs-big-play-centered myVideo" preload="auto" ' \
                            'width="640" height="360" ' \
                            'data-setup="{}" ' + s[index:]
            index += 127
    return s
