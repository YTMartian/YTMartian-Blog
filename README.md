# [YTMartian-Blog](http://www.dongjiayi.com/)

### INTRODUCTION

- A blog build with django--~~1.11.0~~ 3.0.5 in python--~~3.6.2~~ 3.8.3(64-bit)

- I was a fresh man(2017) when I first know django,and then I built this blog intermittently till now，and the work will not end up because there are so many interesting new technologies come to the world! At first I didn't know too much about the css and js，so I used some front-end templates so the front-end files may be mussy, If I have free time in the future I will build a better new independent website.


### SOMETHING

install requirements

```
pip install -r requirements.txt
```

should change

```
from django.utils import six
```
to
```
import six
```
and comment out
```
from django.utils.encoding import python_2_unicode_compatible
...
@python_2_unicode_compatible
```

### ACHIEVING FUNCTION

* [x] Index slider.

* [x] Wallpaper exhibition(it will refresh while refresh the page).

* [x] Stock recorder(because I was fascinated in stock market).

* [x] Article search.

* [x] Artice pagination。

* [x] Thumbs-up to the article.

* [x] Comment to the article(emoji support).

* [x] Article information(reading amount, views, thumbs-up and comments amount of reading).

* [x] Zoom picture in the article page.

* [x] Highlight code(use [highlight.js](https://highlightjs.org/)).

* [x] Video customized(use [video.js](https://videojs.com/)).

* [x] WeChat mini program.

* [x] Memcached cache

* [ ] User login function.

* [ ] Front end adapt the Mobile services.

* [x] Rebuild frontend with react.

* [x] Deploy in docker.

* [x] support mermaid

* [x] 标签不要重复创建

* [ ] recoder不再记录访问ip问题修复

* [ ] 修复分页跳转问题

<img src="mini program.jpg" width="30%" height="30%">

### CHANGELOG

- 2025-01-18 增加文章目录功能
