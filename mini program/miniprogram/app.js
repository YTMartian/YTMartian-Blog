//app.js
App({
    // 引入`towxml3.0`解析markdown
    towxml: require('/towxml/index'),

    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }

        //配置全局变量
        this.globalData = {
            baseUrl: "https://www.dongjiayi.com/blog/",
            perPage: 8,//一页多少文章
            likeArticleList: [],//记录已经点赞的文章id，点过赞的不能继续点了(所有的点赞记录都是本地记录，数据库没有记录)
            likeCommentList: [],//记录已经点赞的评论id
            readingArticleList: [],//记录看过的文章，看过后阅读量不再增加
            myCommentsList: [],//已经发出的评论
            nickName: '',//用户名
            avatarUrl: '',//用户头像
            historyArray: [],//历史搜索记录
        }
    }
})
