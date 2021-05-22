// pages/articles/page.js
Page({

    /**
     * Page initial data
     */
    data: {
        article: {},
        articleId: -1,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        const that = this;
        const app = getApp();

        that.setData({
            "articleId": options.articleId
        })
        //获取文章
        wx.request({
            url: app.globalData.baseUrl + 'get_article/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "one_article",
                "tag_id": -1,
                "article_id": options.articleId
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                const article = {'id': options.articleId, 'title': '', 'content': ''}
                article.title = res.data.list[0].fields.title;
                article.content = res.data.list[0].fields.content;
                //去掉content中因为网站端而改动的部分，如\_等，如果后续用react重构了网站前端，这一部分可以去掉
                // article.content = article.content.replace(new RegExp( '\\_' , "g" ), '_');//全部替换
                // article.content = article.content.replace(new RegExp( '\\\\' , "g" ), '\\');
                article.content = article.content.replace(/\\_/g, '_');//全部替换
                article.content = article.content.replace(/\\\\/g, '\\');
                article.content = app.towxml(article.content, 'markdown', {
                    theme: 'light',					// 主题，默认`light`
                    events: {					// 为元素绑定的事件方法
                        tap: (e) => {
                            // console.log('tap', e);
                        }
                    }
                });
                that.setData({
                    "article": article
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {

    }
})