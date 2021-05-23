// pages/articles/page.js
Page({

    /**
     * Page initial data
     */
    data: {
        articleId: -1,
        title: '',
        content: '',
        publish_time: '',
        readings: 0,
        thumbs_up: 0,
        comments: 0,
        commentsList: [],
        isLoading: true,
        articleLikeImg: '/images/like_gray.svg'
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        const that = this;
        const app = getApp();
        if (typeof (options) !== "undefined") { //判断undefined
            that.setData({
                "articleId": options.articleId
            })
        }
        if (app.globalData.likeArticleList.indexOf(that.data.articleId) !== -1) {//已经点赞
            that.setData({
                'articleLikeImg': '/images/like_red.svg'
            })
        }
        //获取文章
        wx.request({
            url: app.globalData.baseUrl + 'get_article/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "one_article",
                "tag_id": -1,
                "article_id": that.data.articleId
            },
            method: 'POST',
            success: function (res) {
                const title = res.data.list[0].fields.title;
                let content = res.data.list[0].fields.content;
                const publish_time = res.data.list[0].fields.publish_time.slice(0, 10);
                const readings = res.data.list[0].fields.readings;
                const thumbs_up = res.data.list[0].fields.thumbs_up;
                const comments = res.data.list[0].fields.comments;
                //去掉content中因为网站端而改动的部分，如\_等，如果后续用react重构了网站前端，这一部分可以去掉
                // article.content = article.content.replace(new RegExp( '\\_' , "g" ), '_');//全部替换
                // article.content = article.content.replace(new RegExp( '\\\\' , "g" ), '\\');
                content = content.replace(/\\_/g, '_');//全部替换
                content = content.replace(/\\\\/g, '\\');
                content = app.towxml(content, 'markdown', {
                    theme: 'light',					// 主题，默认`light`
                    events: {					// 为元素绑定的事件方法
                        tap: (e) => {
                            // console.log('tap', e);
                        }
                    }
                });
                that.setData({
                    "title": title,
                    "content": content,
                    "publish_time": publish_time,
                    "readings": readings,
                    "thumbs_up": thumbs_up,
                    "comments": comments,
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
        //获取评论
        wx.request({
            url: app.globalData.baseUrl + 'get_comment/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "article",
                "article_id": that.data.articleId,
                "comment_id": -1
            },
            method: 'POST',
            success: function (res) {
                const comments = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let content = res.data.list[i].fields.content;
                    content = content.replace(/\n/g, '');
                    content = content.replace(/<fuck>/g, '');
                    comments.push({
                        'pk': res.data.list[i].pk,
                        'user_name': res.data.list[i].fields.user_name,
                        'post': res.data.list[i].fields.post,
                        'parent': res.data.list[i].fields.parent,
                        'content': content,
                        'submit_date': res.data.list[i].fields.submit_date.slice(0, 10),
                        'thumbs_up': res.data.list[i].fields.thumbs_up,
                    })
                }
                that.setData({
                    'commentsList': comments,
                    'isLoading': false
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
        this.setData({
            "article": {},
            "articleId": this.data.articleId,
        })
        this.onLoad()
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

    },
    likeArticle: function () {
        const that = this;
        const app = getApp();
        if (app.globalData.nickName.length === 0) {
            wx.getUserInfo({
                success: function (res) {
                    app.globalData.nickName = res.userInfo.nickName;
                    app.globalData.avatarUrl = res.userInfo.avatarUrl;
                },
            })
        }
        if (app.globalData.likeArticleList.indexOf(that.data.articleId) === -1) { //未点赞
            //点赞
            wx.request({
                url: app.globalData.baseUrl + 'submit_like/',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    "condition": "article",
                    "state": "add",
                    "article_id": that.data.articleId,
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.msg === 'success') {
                        app.globalData.likeArticleList.push(that.data.articleId);
                        that.setData({
                            'articleLikeImg': '/images/like_red.svg',
                            'thumbs_up': that.data.thumbs_up + 1
                        });
                        wx.showToast({
                            title: '已赞！',
                            icon: 'success',
                            duration: 1500,
                        })
                    }
                },
                fail: function (res) {
                },
                complete: function (res) {
                },
            });
        }
        // wx.showModal({
        //     title: '',
        //     content: '是否确认删除',
        //     success(res) {
        //         if (res.confirm) {
        //             console.log('用户点击确定')
        //         } else if (res.cancel) {
        //             console.log('用户点击取消')
        //         }
        //     }
        // })
    },
})