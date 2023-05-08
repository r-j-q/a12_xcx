// pages/vip/index.js
import {
    request,
    baseUrl
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        checked: false,
        privilegeList: [
            {
                img: '../../static/image/zshd.png',
                msg: '专属活动'
            },
            {
                img: '../../static/image/zszk.png',
                msg: '专属折扣'
            },
            {
                img: '../../static/image/tqdc.png',
                msg: '提前订场'
            }
        ]
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
    ChangePackage(e) {
        this.setData({
            active: e.currentTarget.dataset.index
        })
    },
    onChange(e) {
        this.setData({
            checked: e.detail
        })
    },
    Pay() {
        
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