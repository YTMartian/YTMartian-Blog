// pages/articles/articles.js
Page({

    /**
     * Page initial data
     */
    data: {
        tagId: -1,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        const that = this;
        const app = getApp();

        that.setData({
            "tagId": options.tagId
        })
        //获取文章
        wx.request({
            url: app.globalData.baseUrl + 'get_article/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "tag",
                "tag_id": options.tagId,
                "article_id": -1
            },
            method: 'POST',
            success: function (res) {
                console.log(res)

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