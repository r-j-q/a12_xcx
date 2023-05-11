// subpages/booking/index.js
import {
    request
} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: [
            {
                imgs: '../../static/image/wqs.png',
                imgz: '../../static/image/wqz.png',
                msg: '网球',
                type: 1
            },
            {
                imgs: '../../static/image/ymqs.png',
                imgz: '../../static/image/ymqz.png',
                msg: '羽毛球',
                type: 2
            },
            {
                imgs: '../../static/image/pkqs.png',
                imgz: '../../static/image/pkqz.png',
                msg: '匹克球',
                type: 3
            }
        ],
        clientHeight: '400',
        top: 0,
        page: 1,
        type: 1,
        total: null,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.onList(this.data.type, this.data.page, (res) => {
            this.setData({
                list: res.data.data
            })
        })
        //获取盒子高度
        wx.getSystemInfo({
            success: (res) => {
                let query = wx.createSelectorQuery().in(this)
                query.select('.list_content').boundingClientRect()
                query.exec(res => {
                    this.setData({
                        clientHeight: res[0].height
                    })
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
    async onList(type, page, callback) {
        const res = await request({
            url: "/venue/list",
            method: "GET",
            data: {
                type,
                page
            }
        })
        this.setData({
            total: res.data.last_page,
        })
        if (callback) {
            callback(res)
        }
    },
    //加载更多
    onBottomRefresh(e) {
        this.setData({
            page: this.data.page + 1
        })
        if (this.data.total < this.data.page) return false
        this.onList(this.data.type, this.data.page, (res) => {
            this.setData({
                list: [...this.data.list, ...res.data.data]
            })
        })
    },
    //切换导航
    changeNav(e) {
        if (e.currentTarget.dataset) {
            this.setData({
                type: e.currentTarget.dataset.type,
                page: 1,
                top: 0,
                list: []
            })
            this.onList(this.data.type, this.data.page, (res) => {
                this.setData({
                    list: res.data.data
                })
            })
        }

    },
    toGo(){
        wx.navigateTo({
            url: '/subpages/bookingOrders/index'
        });
    },
    toBack() {
        wx.navigateTo({
            url: '/subpages/booking_settled/index',
        })
    },
    goBack(e) {
        let id = e.currentTarget.dataset.id;
        let state = e.currentTarget.dataset.state;
        console.log('state',state);
        if(state.state !=1){
            wx.showToast({
                title: '未入住',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/subpages/booking_tennis/index?venue_id=' + encodeURIComponent(id)
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})