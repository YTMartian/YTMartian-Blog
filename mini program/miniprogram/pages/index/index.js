Page({
    data: {
        slides: [],
        swiperH: '',//swiper高度
        nowIdx: 0,//当前swiper索引
        slideFontSize: "1.3em",
        fontBottom: "2em",//字体距底部距离
        isLoading: true,
        showHistory: false,//显示历史记录或是主页其它类容
        searchText: '',
        historyArray: [],
        isSearching: false,
        searchButtonText: '搜索',
        tags: [],
        wallpapers: [],
        pageNumber: 1,

    },
    //清除历史记录
    clearHistory: function (e) {
        this.setData({
            historyArray: [], //清空历史记录数组
            searchText: "" //清空搜索框
        })
    },
    //搜索
    search: function (e) {
        const text = this.data.searchText; //搜索框的值
        const text2 = text.replace(/ /g, '');//判断是否只含空格
        if (text !== "" && text2 !== "") {
            //将搜索框的值赋给历史数组
            const array = this.data.historyArray;
            array.push(text)
            this.setData({//跟react类似，只有setData才能触发前端更新
                historyArray: array
            })
        } else if (text2 === "") {
            this.setData({
                searchText: ""
            })
        }
    },
    //点击历史记录赋值给搜索框
    pressSearch: function (e) {
        this.setData({
            searchText: e.target.dataset.text
        })
    },
    //搜索框的值
    searchInput: function (e) {
        this.setData({
            searchText: e.detail.value,
        })
    },
    //点击输入框时
    searchFocus: function (e) {
        this.setData({
            showHistory: true,
            isSearching: true
        })
    },
    //取消搜索
    cancelSearch: function (e) {
        this.setData({
            showHistory: false,
            isSearching: false,
            searchText: ''
        });
    },
    //获取swiper高度
    getHeight: function (e) {
        const winWid = wx.getSystemInfoSync().windowWidth - 2 * 50;//获取当前屏幕的宽度
        const imgh = e.detail.height;//图片高度
        const imgw = e.detail.width;
        const sH = 20 + winWid * imgh / imgw + "px";
        const fontSize = winWid / 300 + "em";
        const bottom = imgh / 200 + "em";
        this.setData({
            swiperH: sH,//设置高度
            slideFontSize: fontSize,
            fontBottom: bottom
        })
    },
    //swiper滑动事件
    swiperChange: function (e) {
        this.setData({
            nowIdx: e.detail.current
        })
    },
    onLoad: function () {
        const app = getApp();
        const that = this;//request里直接用不了this，因为上下文已经发生改变
        const slides = [];
        const slides_length = 3;
        for (let i = 0; i < slides_length; i++) {
            slides.push({'imgUrl': '', 'articleTitle': '', 'articleId': -1})
        }
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
                for (let i = 0; i < slides_length; i++) {
                    slides[i].imgUrl = res.data.list[i].fields.pic_address
                }
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
                for (let i = 0; i < slides_length; i++) {
                    slides[i].articleTitle = res.data.list[i].fields.title;
                    slides[i].articleId = res.data.list[i].pk;
                }
                that.setData({
                    "slides": slides,
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
        //获取标签
        wx.request({
            url: app.globalData.baseUrl + 'get_tags/',
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                const tagColor = ["#84bdd0",
                    "#e0768d",
                    "#e9755e",
                    "#f4a594",
                    "#73C8A9",
                    "#b28bcd",
                    "#bcd5dc",
                    "#d6a3dc",
                    "#f9dc74",
                    "#ebbdbf",
                    "#00c6ff",
                    "#81D8D0",
                    "#74caff",
                    "#95B9C7",
                    "#d68fac",
                    "#72c9c8",
                    "#FF7F50",
                    "#ffc67f",
                    "#79baec",
                    "#F660AB",
                    "#7eb2cc",
                    "#84d4ab"];
                const tags = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    tags.push({
                        'name': res.data.list[i].fields.name,
                        'id': res.data.list[i].pk,
                        'color': tagColor[Math.floor((Math.random() * tagColor.length))]
                    });
                }
                that.setData({
                    tags: tags
                })
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        });
        //获取首页壁纸
        // wx.request({
        //     url: app.globalData.baseUrl + 'get_wallpaper/',
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     data: {
        //         "condition": "index",
        //         "id": -1,
        //     },
        //     method: 'POST',
        //     success: function (res) {
        //         const wallpapers = [];
        //         for (let i = 0; i < res.data.list.length; i++) {
        //             wallpapers.push({
        //                 'id': res.data.list[i].pk,
        //                 'preview_address': res.data.list[i].fields.preview_address
        //             })
        //         }
        //         console.log(wallpapers)
        //         that.setData({
        //             "wallpapers": wallpapers,
        //         })
        //     },
        //     fail: function (res) {
        //     },
        //     complete: function (res) {
        //     },
        // });
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