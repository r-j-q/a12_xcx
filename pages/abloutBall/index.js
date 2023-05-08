import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentIndex: 1,
        page: 1,
        list: [],
        order_type: 1,
        last_page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
     
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
        this.setData({
            list: [],
            page: 1
        }, this.onList())
    },
    async onList() {
        const {
            page
        } = this.data;
        const res = await request({
            url: "/order/get_order_list",
            method: "GET",
            data: {
                page,
                ball_type: this.data.currentIndex + 1,
                city:wx.getStorageSync('address'),
                order_type: 1,
            }
        });
        if (res.code == 200) {
            this.setData({
                last_page: res.data.last_page,
                list: [...this.data.list, ...res.data.data],
            })
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },
      /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    handleTabclick(e) {
        const currentIndex = e.currentTarget.dataset.index;
        if (this.data.currentIndex == currentIndex) return;
        this.setData({
            currentIndex,
            page: 1,
            list: []
        }, () => {
            this.onList()
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },
    handleDetails(e) {
        const order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/details/index?order_id=' + order_id,
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({
            page: 1,
            list: []
        }, () => {
            this.onList()
            setTimeout(() => {
                wx.stopPullDownRefresh();
            }, 1000)
        })
    },
    onAbount() {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/index',
            })
            return;
        }

        wx.navigateTo({
            url: '/pages/about/index',
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        const {
            last_page,
            page
        } = this.data;
        if (last_page == page) return;
        this.setData({
            page: this.data.page += 1
        }, () => {
            this.onList()
        })
    },
})