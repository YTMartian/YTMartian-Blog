# [YTMartian-Blog](http://www.dongjiayi.com/)

### INTRODUCTION

- A blog build with django--1.11.0 in python--3.6.2(64-bit)

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

- Index slider.

- Wallpaper exhibition(it will refresh while refresh the page).

- Stock recorder(because I was fascinated in stock market).

- Article search.

- Artice pagination。

- Thumbs-up to the article.

- Comment to the article(emoji support).

- Article information(reading amount, views, thumbs-up and comments amount of reading).

- Zoom picture in the article page.

- Highlight code(use [highlight.js](https://highlightjs.org/)).

- Video customized(use [video.js](https://videojs.com/)).

### UNDER BUILDING

- User login function.

- Front end adapt the Mobile services.

- WeChat mini program.
