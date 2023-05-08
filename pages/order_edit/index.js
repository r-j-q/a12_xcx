import {
    formatTime
} from '../../utils/util';
import {
    request,
    baseUrl
} from '../../request/index';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ball_field:'',
        place:'',
        address:'',
        mobile:'',
        order_id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        qqmapsdk = new QQMapWX({
            key: 'QB6BZ-6QSE4-FJQU3-X2NRG-R3LYT-3NFAQ'
        });
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

      //选择地点
      handleAddress() {
        let that = this;
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    place: res.address,
                    longitude: res.longitude,
                    latitude: res.latitude
                }, () => {
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: that.data.latitude,
                            longitude: that.data.longitude
                        },
                        success: function (res) {
                            that.setData({
                                city: res.result.ad_info.city,
                                area: res.result.ad_info.district,
                                province: res.result.ad_info.province,
                            })
                        },
                        fail(err) {
                            console.log(err)
                        }
                    })
                })
            }
        })
    },
})