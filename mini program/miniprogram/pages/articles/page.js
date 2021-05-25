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
        isArticleLoading: true,
        isCommentLoading: true,
        articleLikeImg: '/images/like_gray.svg',
        isFocus: false,
        commentText: '',
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        const that = this;
        const app = getApp();
        that.setData({
            "isArticleLoading": true,
            "isCommentLoading": true,
        })
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
        let isReading = false;
        if (app.globalData.readingArticleList.indexOf(that.data.articleId) !== -1) {//已经阅读
            isReading = true;
        } else {
            app.globalData.readingArticleList.push(that.data.articleId);
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
                "article_id": that.data.articleId,
                "is_reading": isReading
            },
            method: 'POST',
            success: function (res) {
                const title = res.data.list[0].fields.title;
                let content = res.data.list[0].fields.content;
                const publish_time = res.data.list[0].fields.publish_time.slice(0, 10);
                let readings = res.data.list[0].fields.readings;
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
                    'isArticleLoading': false
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
                        'submit_date': res.data.list[i].fields.submit_date.slice(0, 19).replace('T', ' '),
                        'thumbs_up': res.data.list[i].fields.thumbs_up,
                        'likeImg': '/images/thumb_gray.svg',
                        'canDelete': false
                    })
                    if (app.globalData.likeCommentList.indexOf(comments[i].pk) !== -1) {
                        comments[i].likeImg = '/images/thumb_red.svg';
                    }
                    if (app.globalData.myCommentsList.indexOf(comments[i].pk) !== -1) {
                        comments[i].canDelete = true;//自己发的评论可以删除
                    }
                }
                that.setData({
                    'commentsList': comments,
                    'isCommentLoading': false
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
            "commentText": ''
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
    likeSubmit: function (e) {
        const that = this;
        const app = getApp();
        if (app.globalData.nickName.length === 0) { //用户需要先登录
            wx.getUserProfile({
                desc: '获取用户身份信息',
                success: function (res) {
                    app.globalData.nickName = res.userInfo.nickName;
                    app.globalData.avatarUrl = res.userInfo.avatarUrl;
                    that.likeSubmit_(e)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        } else {
            that.likeSubmit_(e)
        }
    },
    likeSubmit_: function (e) {
        const that = this;
        const app = getApp();
        let post_data = {};
        let state = 'add';
        if (e.currentTarget.dataset.type === 'article') {//给文章点赞
            if (app.globalData.likeArticleList.indexOf(that.data.articleId) !== -1) { //已点赞，取消点赞
                state = 'minus'
            }
            post_data = {
                "condition": "article",
                "state": state,
                "article_id": that.data.articleId,
            }
        } else if (e.currentTarget.dataset.type === 'comment') {//给评论点赞
            let pk = e.currentTarget.dataset.commentid;
            if (app.globalData.likeCommentList.indexOf(pk) !== -1) { //已点赞，取消点赞
                state = 'minus'
            }
            post_data = {
                "condition": "comment",
                "state": state,
                "comment_id": pk,
            }
        } else {
            return;
        }
        //点赞
        wx.request({
            url: app.globalData.baseUrl + 'submit_like/',
            header: {
                'content-type': 'application/json'
            },
            data: post_data,
            method: 'POST',
            success: function (res) {
                if (res.data.msg === 'success') {
                    if (e.currentTarget.dataset.type === 'article') {
                        app.globalData.likeArticleList.push(that.data.articleId);
                        if (state === 'add') {
                            that.setData({
                                'articleLikeImg': '/images/like_red.svg',
                                'thumbs_up': that.data.thumbs_up + 1
                            });
                        } else if (state === 'minus') {
                            //移除元素
                            // let index = app.globalData.likeArticleList.indexOf(that.data.articleId);
                            // app.globalData.likeArticleList.splice(index, 1);//index开始，移除1个
                            let temp = [];
                            for (let i = 0; i < app.globalData.likeArticleList.length; i++) {
                                if (app.globalData.likeArticleList[i] !== that.data.articleId) {
                                    temp.push(app.globalData.likeArticleList[i]);
                                }
                            }
                            app.globalData.likeArticleList = temp;
                            that.setData({
                                'articleLikeImg': '/images/like_gray.svg',
                                'thumbs_up': that.data.thumbs_up - 1
                            });
                        }

                    } else if (e.currentTarget.dataset.type === 'comment') {
                        app.globalData.likeCommentList.push(e.currentTarget.dataset.commentid);
                        for (let i = 0; i < that.data.commentsList.length; i++) {
                            if (that.data.commentsList[i].pk === e.currentTarget.dataset.commentid) {
                                if (state === 'add') {
                                    that.data.commentsList[i].likeImg = '/images/thumb_red.svg';
                                    that.data.commentsList[i].thumbs_up = that.data.commentsList[i].thumbs_up + 1;
                                } else if (state === 'minus') {
                                    // let index = app.globalData.likeCommentList.indexOf(e.currentTarget.dataset.commentid);
                                    // app.globalData.likeCommentList = app.globalData.likeCommentList.splice(index, 1);//index开始，移除1个
                                    let temp = [];
                                    for (let i = 0; i < app.globalData.likeCommentList.length; i++) {
                                        if (app.globalData.likeCommentList[i] !== e.currentTarget.dataset.commentid) {
                                            temp.push(app.globalData.likeCommentList[i]);
                                        }
                                    }
                                    app.globalData.likeCommentList = temp;
                                    that.data.commentsList[i].likeImg = '/images/thumb_gray.svg';
                                    that.data.commentsList[i].thumbs_up = that.data.commentsList[i].thumbs_up - 1;
                                }
                                break;
                            }
                        }
                        that.setData({
                            'commentsList': that.data.commentsList,
                        });
                    }
                    wx.showToast({
                        title: state === 'add' ? '已赞' : '已取消',
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
    },
    submitComment: function (e) {
        const that = this;
        const app = getApp();
        if (app.globalData.nickName.length === 0) { //用户需要先登录
            //注意该方法也是异步的，因此需要在success里完成提交，否则app的nickName并没有更新
            wx.getUserProfile({
                desc: '获取用户身份信息',
                success: function (res) {
                    app.globalData.nickName = res.userInfo.nickName;
                    app.globalData.avatarUrl = res.userInfo.avatarUrl;
                    that.submitComment_(e)
                },
            })
        } else {
            that.submitComment_(e)
        }
    },
    submitComment_: function (e) {
        const that = this;
        const app = getApp();
        let comment = e.detail.value.inputComment;
        if (comment.replace(/ /g, '').length === 0) return;
        //提交评论
        wx.request({
            url: app.globalData.baseUrl + 'submit_comment/',
            header: {
                'content-type': 'application/json'
            },
            data: {
                "condition": "article",
                "article_id": that.data.articleId,
                "state": 'add',
                "content": comment,
                "user_name": app.globalData.nickName,
            },
            method: 'POST',
            success: function (res) {
                // console.log(res)
                let content = res.data.list[0].fields.content;
                content = content.replace(/\n/g, '');
                content = content.replace(/<fuck>/g, '');
                let newComment = {
                    'pk': res.data.list[0].pk,
                    'user_name': res.data.list[0].fields.user_name,
                    'post': res.data.list[0].fields.post,
                    'parent': res.data.list[0].fields.parent,
                    'content': content,
                    'submit_date': res.data.list[0].fields.submit_date.slice(0, 19).replace('T', ' '),
                    'thumbs_up': res.data.list[0].fields.thumbs_up,
                    'likeImg': '/images/thumb_gray.svg',
                    'canDelete': true
                }
                app.globalData.myCommentsList.push(newComment.pk);
                that.data.commentsList.push(newComment);
                that.setData({
                    'commentsList': that.data.commentsList,
                    'comments': that.data.comments + 1,
                    'commentText': ''
                })
                wx.showToast({
                    title: '评论成功',
                    icon: 'success',
                    duration: 1500,
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
    },
    deleteComment: function (e) {
        const that = this;
        const app = getApp();
        if (app.globalData.nickName.length === 0) { //用户需要先登录
            wx.getUserProfile({
                desc: '获取用户身份信息',
                success: function (res) {
                    app.globalData.nickName = res.userInfo.nickName;
                    app.globalData.avatarUrl = res.userInfo.avatarUrl;
                    that.deleteComment_(e)
                },
            })
        } else {
            that.deleteComment_(e)
        }
    },
    deleteComment_: function (e) {
        const that = this;
        const app = getApp();
        wx.showModal({
            title: '',
            content: '是否确认删除',
            success(res) {
                if (res.confirm) {
                    let comment_id = e.currentTarget.dataset.commentid;
                    //获取评论
                    wx.request({
                        url: app.globalData.baseUrl + 'submit_comment/',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            "condition": "article",
                            "state": 'delete',
                            "comment_id": comment_id,
                        },
                        method: 'POST',
                        success: function (res) {
                            if (res.data.msg === 'success') {
                                let commentList = [];
                                //从commentsList中删除改条评论
                                for (let i = 0; i < that.data.commentsList.length; i++) {
                                    if (that.data.commentsList[i].pk !== comment_id) {
                                        commentList.push(that.data.commentsList[i]);
                                    }
                                }
                                that.setData({
                                    'commentsList': commentList,
                                    'comments': that.data.comments - 1
                                })
                                //从myCommentsList中删除改条评论
                                commentList = [];
                                //从commentsList中删除改条评论
                                for (let i = 0; i < app.globalData.myCommentsList.length; i++) {
                                    if (app.globalData.myCommentsList[i].pk !== comment_id) {
                                        commentList.push(app.globalData.myCommentsList[i]);
                                    }
                                }
                                app.globalData.myCommentsList = commentList;

                                wx.showToast({
                                    title: '删除成功',
                                    icon: 'success',
                                    duration: 1500,
                                })
                            } else {
                                wx.showToast({
                                    title: '删除失败(1)',
                                    icon: 'none',
                                    duration: 1500,
                                })
                            }
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: '删除失败(2)',
                                icon: 'none',
                                duration: 1500,
                            })
                        },
                        complete: function (res) {
                        },
                    });
                } else if (res.cancel) {
                }
            }
        })
    },
    //点击输入框时
    commentFocus: function (e) {
        this.setData({
            isSearching: true,
            isFocus: true
        })
    },
    commentBlur: function (e) {
        this.setData({
            isFocus: false
        })
    },
})