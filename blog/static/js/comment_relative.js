var judge = true;//判断奇偶点击
var existed = false;//判断是否加载过评论

$(document).ready(function () {
    var btn = document.getElementById('submit_comment');
    var commentShow = $("#submit_comment");
    //点击按钮实现滚动直到按钮居顶(如果能够的话)
    btn.onclick = function () {
        //commentShow.slideToggle(500);//ms

        $('html,body').animate({scrollTop: commentShow.offset().top - 100}, 500);
        judge = false;

    };
});


