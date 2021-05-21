Page({
    data: {
        imgUrls: [],
        indicatorDots: true,//指示点
        vertical: false,
        autoplay: true,
        interval: 4000,//切换时间
        duration: 2000,//切换动画时间
        circular: true,//循环
        easing_function: "easeOutCubic",//渐出动画
        slide_articles: [],
    },
    onLoad: function () {
        const app = getApp();
        const that = this;//request里直接用不了this
        //获取首页图片地址
        wx.request({
            url: app.globalData.baseUrl + 'get_slide/',
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                // console.log(res.data.list[0].fields.pic_address)
                const imgUrls = []
                for (let i = 0; i < res.data.list.length; i++) {
                    imgUrls.push(res.data.list[i].fields.pic_address)
                }
                that.setData({
                    "imgUrls": imgUrls
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
        //获取首页文章
        wx.request({
            url: app.globalData.baseUrl + 'get_article/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "slide",
                "tag_id": -1,
                "article_id": -1
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                const slide_articles = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    slide_articles.push(res.data.list[i])
                }
                that.setData({
                    "slide_articles": slide_articles
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    }
})