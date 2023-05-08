import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1,
        last_page:1,
        list:[]
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
            page:1,
            list:[]
        },() =>this.get_invite_list())
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
    async get_invite_list(){
        const {
            page
        } = this.data;
        const res = await request({
            url: "/member/get_invite_list",
            method: "GET",
            data: {
                page,
              
            }
        });
        this.setData({
            last_page: res.data.last_page,
            list: [...this.data.list, ...res.data.data],
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log('1111')
    },

})