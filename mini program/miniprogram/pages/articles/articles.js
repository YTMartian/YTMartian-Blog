// pages/articles/articles.js
Page({

    /**
     * Page initial data
     */
    data: {
        tagId: -1,
        pageNumber: 1,
        articleList: [],
        isLoading: true,
        noMoreArticle: false
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        const that = this;
        const app = getApp();
        if (typeof (options) !== "undefined") { //判断undefined
            that.setData({
                "tagId": options.tagId
            })
        }
        this.onReachBottom()
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
        this.setData({
            tagId: this.data.tagId,
            pageNumber: 1,
            articleList: [],
            isLoading: true,
            noMoreArticle: false
        })
        this.onLoad()
    },

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {
        const app = getApp();
        const that = this;
        that.setData({
            "isLoading": true
        })
        //获取文章
        wx.request({
            url: app.globalData.baseUrl + 'get_article/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "tag",
                "tag_id": that.data.tagId,
                "article_id": -1,
                "page_number": that.data.pageNumber,
            },
            method: 'POST',
            success: function (res) {
                const articles = [];
                const noMore = res.data.list.length < app.globalData.perPage;
                for (let i = 0; i < res.data.list.length; i++) {
                    articles.push({
                        'pk': res.data.list[i].pk,
                        'title': res.data.list[i].fields.title,
                        'publish_time': res.data.list[i].fields.publish_time.slice(0, 10),
                        'readings': res.data.list[i].fields.readings,
                        'thumbs_up': res.data.list[i].fields.thumbs_up,
                        'comments': res.data.list[i].fields.comments,
                        'img': 'https://www.dongjiayi.com/static/files/preview-' + res.data.list[i].pk + '.jpg'
                    })
                }
                that.setData({
                    "articleList": that.data.articleList.concat(articles),
                    "pageNumber": that.data.pageNumber + 1,
                    "isLoading": false,
                    "noMoreArticle": noMore
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {

    }
})