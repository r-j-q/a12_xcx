import Toast from '@vant/weapp/toast/toast';
import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: false,
        isMine: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options && options.isMine) {
            this.setData({
                isMine: options.isMine
            })
        }
        wx.login()
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
    onagree(){
        wx.navigateTo({
            url: '../agree/index' ,
        })
    },
    onconceal(){
        wx.navigateTo({
            url: '../conceal/index' ,
        })
    },
    handleMoblieLogin() {
        const {
            checked,
            isMine
        } = this.data;
        if (!checked) {
            return Toast('请勾选用户协议')
        }
        wx.navigateTo({
            url: '../mobileLogin/index?isMine=' + isMine,
        })
    },
    onChange(e) {
        this.setData({
            checked: e.detail
        })
    },
     getPhoneNumber(e) {
        if (!e.detail.code) return;
        let that =this;
        wx.login({
            async success(res1) {

                const res = await request({
                    url: "/member/get_user_phone",
                    method: "POST",
                    data: {
                        code: e.detail.code,
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        login_code:res1.code
                    }
                });
                if (res.code == 200) {
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none'
                    });
                    wx.setStorageSync('token', res.data.token);
                    wx.setStorageSync('mobile', res.data.mobile);
                    wx.setStorageSync('member_id', res.data.member_id);
                    // wx.setStorageSync('is_realname_auth', res.data.is_realname_auth); //是否实名
                    if (res.data.portrait && res.data.name) {
                        wx.setStorageSync('name', res.data.name)
                        wx.setStorageSync('portrait', res.data.portrait)
                    }
                    if (that.data.isMine == 1) {
                        wx.switchTab({
                            url: '/pages/abloutBall/index',
                        })
                    } else {
                        wx.navigateBack({
                            delta: 1
                        })
                    }

                }
            },
        })

    },
    handleRegister() {
        const {
            checked
        } = this.data;
        if (!checked) {
            return Toast('请勾选用户协议')
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