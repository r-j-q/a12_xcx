import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        real_name: "",
        id_num: "",
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

    },
    async handlesign() {
        const {
            real_name,
            id_num
        } = this.data;
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!real_name) return;
        if (reg.test(id_num) === false) {
            wx.showToast({
                title: '身份证号不合法',
                icon:'none'
            })
            return
        }
        const res = await request({
            url: "/member/real_name_authentication",
            method: "POST",
            data: {
                id_num,
                real_name,
            }
        });
        if (res.code == 200) {
            wx.showToast({
                title: '认证成功',
                icon: 'none'
            });
            wx.setStorageSync('is_realname_auth', true); //是否实名
            wx.navigateBack()
        }
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
})