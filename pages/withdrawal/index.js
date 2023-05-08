import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: '',
        bonus: '',
        money: '',
        zfb_account: '',
        real_name: '',
        type: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        if (options && options.type) {
            this.setData({
                type: options.type
            },() => {
                this.memberInfo()
            })
        }
      
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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
            balance: obj.balance || 0,
            bonus: obj.bonus || 0,
            real_name:obj.zfb_account ? obj.zfb_account.name : '',
            zfb_account:obj.zfb_account ? obj.zfb_account.account :''
        })
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
    async onWithDrawal() {
        const {
            money,
            zfb_account,
            real_name,
            type,
        } = this.data;

        if (!money || !zfb_account || !real_name) {
            wx.showToast({
                title: '请输入完整信息',
                icon: 'none'
            })
            return;
        }
        const res = await request({
            url: "/member/cash_withdrawal",
            method: "POST",
            data: {
                money,
                zfb_account,
                real_name,
                type
            }
        });
        if(res.code == 200){
            this.memberInfo()
            this.setData({
                money:''
            })
            wx.showToast({
                title: '提现申请成功',
                icon: 'none'
            })
            
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

})