# [YTMartian-Blog](http://www.dongjiayi.com/)

### INTRODUCTION

- A blog build with django--~~1.11.0~~ 3.0.5 in python--~~3.6.2~~ 3.8.3(64-bit)

- I was a fresh man(2017) when I first know django,and then I built this blog intermittently till now，and the work will not end up because there are so many interesting new technologies come to the world! At first I didn't know too much about the css and js，so I used some front-end templates so the front-end files may be mussy, If I have free time in the future I will build a better new independent website.


### SOMETHING

install requirements

```
pip install -r requirements.txt
```

The django-haystack compatibility problem with the newest django 3.0.5, so when run this project you need to change some files appears in the log infomation.

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

* [ ] Rebuild frontend with react.

<img src="mini program.jpg" width="30%" height="30%">

