import {
    request
} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        page: 1,
        bonus: 0,
        type_count: {},
        last_page: 1,
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
            lsit: [],
            page: 1
        }, () => {
            this.memberInfo()
            this.get_integral_detail()
        })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },
    async memberInfo() {
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        let obj = res.data;
        this.setData({

            bonus: obj.bonus,

        })
    },
    onWithdrawal() {
        if (this.data.bonus < 0.1) {
            wx.showToast({
                title: '低于0.1不能提现',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/withdrawal/index?type=bonus',
        })
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
    async get_integral_detail() {
        const res = await request({
            url: "/member/get_integral_detail",
            method: "get",
            data: {
                page: this.data.page,
                type: 30
            }

        });
        this.setData({
            last_page: res.data.list.last_page,
            list: [...this.data.list, ...res.data.list.data],
            type_count: res.data.type_count
        })
    },
    touchBottom() {
        const {
            last_page,
            page
        } = this.data;
        if (last_page == page) return;
        this.setData({
            page: this.data.page += 1
        }, () => {
            this.get_integral_detail()
        })
    }
})