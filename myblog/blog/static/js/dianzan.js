//文章点赞函数

function thumbs_up(post_url, now_number) {
    var addnum = $("#add1s");
    var request = $.ajax({
        url:post_url,
        type: 'GET',
        async: true,
        timeout: 7000,
        error: function () {
            window.alert("😫出错了😫,可以向邮箱 1773741250@qq.com 发送反馈")
        },
        complete: function (XMLHttpRequest, status) {
            if (status == 'timeout') {
                request.abort();
                window.alert('请求超时了...')
            }
        },
        success: function () {
            if (request.responseText == "true") {
                var thumbs_number = document.getElementById('thumbs');
                thumbs_number.innerText = now_number + 1;
                addnum.show().html("<em class='add-animation'>+1S</em>");
            } else {
                addnum.show().html("<em class='add-animation'>已赞</em>");
            }
            $(".add-animation").addClass("hover");
        }
    });
}