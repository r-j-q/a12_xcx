import Toast from '@vant/weapp/toast/toast';
import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        password: '',
        code: '',
        loginType: 2,
        isCode: true,
        time: 60,
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
            console.log(this.data.isMine);
        }
        wx.login()
    },
    phoneinput: function (e) {
        this.setData({
            mobile: e.detail.value
        });
    },
    pwdinput: function (e) {
        this.setData({
            password: e.detail.value
        });
    },
    codeinput(e) {
        this.setData({
            code: e.detail.value
        });
    },
    handleType() {
        const {
            loginType
        } = this.data;
        this.setData({
            loginType: loginType == 1 ? 2 : 1,
        })
    },
    async onLogin() {
        const {
            mobile,
            loginType,
            code,
            isMine
        } = this.data;
        // if (loginType == 2 && code.length !== 6) {
        //     return Toast('请输入正确的验证码')
        // }
        wx.login({
            async success(res1) {
                const res = await request({
                    url: "/member/get_user_phone",
                    // url: "/member/admin_login",
                    method: "POST",
                    data: {
                        sms_code: code,
                        mobile,
                        login_code: res1.code
                    }
                    // data: {
                    //     user_name:'admin',
                    //     password:'123456'
                    // }
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
                    if (isMine == 1) {
                        wx.switchTab({
                            url: '/pages/mine/index',
                        })
                    } else {
                        wx.navigateBack({
                            delta: 2
                        })
                    }
                }
            }
        })

    },
    async handleCode() {
        const {
            mobile
        } = this.data;
        if (!mobile || !(/^1[34578]\d{9}$/.test(mobile))) {
            return Toast('请输入正确的手机号码')
        }
        const res = await request({
            url: "/other/send_verification_code",
            method: "POST",
            data: {
                mobile,
            }
        });
        if (res.code == 200) {
            this.timer()
            this.setData({
                isCode: false
            })
        }

    },
    //验证码倒计时
    timer() {
        let promise = new Promise((resolve, reject) => {
            let setTimer = setInterval(
                () => {
                    this.setData({
                        time: this.data.time - 1
                    })
                    if (this.data.time <= 0) {
                        this.setData({
                            time: 60,
                            isCode: true
                        })
                        resolve(setTimer)
                    }
                }, 1000)
        })
        promise.then((setTimer) => {
            clearInterval(setTimer)
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