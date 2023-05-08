import Toast from '@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile: '',
        password: '',
        code: '',
        isCode: true,
        time: 60,
        checked:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
    onChange(e){
        this.setData({
            checked:e.detail
        })
    },
    async onLogin(){
        const {
            mobile,
            password,
            code,
            checked
        } = this.data;
        if (!mobile || !(/^1[34578]\d{9}$/.test(mobile))) {
            return Toast('请输入正确的手机号码')
        }
        if(code.length < 6){
            return Toast('请输入正确的验证码')
        }
        if( password.length < 8){
            return Toast('密码最少8位数')
        }
        if(!checked){
            return Toast('请勾选用户协议')
        }
    },
    async handleCode() {
        const {
            mobile
        } = this.data;
        console.log(mobile)
        if (!mobile || !(/^1[34578]\d{9}$/.test(mobile))) {
            return Toast('请输入正确的手机号码')
        }
        this.timer()
        this.setData({
            isCode:false
        })
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