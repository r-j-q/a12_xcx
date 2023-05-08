import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ['排名', '姓名', '积分'],
        order_id: '',
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options && options.order_id) {
            this.setData({
                order_id: options.order_id
            }, () => {
                this.detail()
            })
        }
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
        this.detail()
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
    async detail() {
        const res = await request({
            url: "/member/get_integral_ranking_list",
            method: "get",
            data: {

                order_id: this.data.order_id,

            }
        });
       if(res.code == 200){
           this.setData({
               list:res.data
           })
       }
    }
})