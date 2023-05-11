// pages/bookingOrders/index.js
import {
    request,
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title_type: false,
        clientHeight: '400',
        last_page: 0,
        page: 1,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: this.data.title_type ? '订场订单-羽毛球' : '订场订单-网球'
        })
        //获取盒子高度
        wx.getSystemInfo({
            success: (res) => {
                let query = wx.createSelectorQuery().in(this)
                query.select('.orders_list').boundingClientRect()
                query.exec(res => {
                    this.setData({
                        clientHeight: res[0].height
                    })
                })
            }
        })
        this.getList(this.data.page)
    },
    onBottomRefresh(e) {
        this.setData({ page: this.data.page + 1 })
        if (this.data.page > this.data.last_page) return
        this.getList(this.data.page)
    },
      // 支付订单
      async onSetInfo(e) {
        let id = e.currentTarget.dataset.id;
        let pay_type = e.currentTarget.dataset.payType;
         
        const res = await request({
            url: "/client/field/order/payment",
            method: "POST",
            data: {
                pay_type: pay_type,
                id: id
            }
        })
        if (res.code === 200) {
            this.setData({
                show: false
            })
                   
            wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,

                success: payRes => {  
                    this.getList(this.data.page)
                },
                fail: payFail => {
                    console.log('支付失败！');
                   
                } 
            }) 
            
        }

    },
    cancels(e){
        let id = e.currentTarget.dataset.id;
        const res =   request({
            url: "/client/field/order/cancel",
            method: "POST",
            data: {
                id
            }
        })
        if (res.code === 200) {
            wx.showToast({
                title: '退款申请成功',
                icon: 'none'
            })
        }
        
    },
    async getList(page) {
        const res = await request({
            url: "/client/field/order/list",
            method: "GET",
            data: {
                page: page
            }
        })
        this.setData({
            last_page: res.data.last_page,
            list: [...this.data.list, ...res.data.data]
        })
        console.log(this.data.list);
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