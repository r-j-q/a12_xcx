import Toast from '@vant/weapp/toast/toast';
import {
    request
} from '../../request/index';
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: "约约球",
        balance: 0,
        integral: 0,
        ball_lev: "",
        isService:false,
        outstanding_balance:0,
        freeze_invite_account:0,
        bonus: 0,
        portrait: "../../static/tab/mine.png",
        list: [
            {
                label: '奖金',
                url: '../../static/image/bonus.png'
            },
            {
                label: '邀请好友',
                url: '../../static/image/playback.png'
            },
            {
                label: '用户信息',
                url: '../../static/image/user.png'
            },
            {
                label: '退出登录',
                url: '../../static/image/shiming.png'
            },

        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


    },
    showquestion(e){
        console.log(e.currentTarget.dataset.type)
        const type = e.currentTarget.dataset.type
        Dialog.alert({
            title: '提示',
            message: type == 2 ?'根据用户参加约球和分级赛解冻':'约球结束后自动解冻',
          }).then(() => {
            // on close
          })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    handleAboutOrder() {
        wx.navigateTo({
            url: '/pages/AboutOrder/index',
        })
    },
    handleSeletttOrder() {
        wx.navigateTo({
            url: '/pages/settleOrder/index',
        })
    },
    handleTranOrder() {
        wx.navigateTo({
            url: '/pages/trainOrder/index',
        })
    },
    handleBlance() {
        wx.navigateTo({
            url: '/pages/BalanceDetails/index',
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */

    onShow: async function () {
        if (!wx.getStorageSync('member_id')) {
            wx.redirectTo({
                url: '/pages/login/index?isMine=1',
            })
            return;
        }
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        let obj = res.data;
        this.setData({
            portrait: obj.portrait || '../../static/tab/mine.png',
            name: obj.name || '约约球',
            balance: obj.balance || 0,
            integral: obj.integral,
            bonus: obj.bonus,
            ball_lev: obj.ball_lev,
            outstanding_balance:obj.outstanding_balance,
            freeze_invite_account:obj.freeze_invite_account
        })
    },

    handleto(e) {
        const index = e.currentTarget.dataset.index;
        switch (index) {
            case 0:
                wx.navigateTo({
                    url: '/pages/moneyDetails/index',
                })
                break;
                case 1:
                    wx.navigateTo({
                        url: '/pages/share/index',
                    })
                    break;
            case 2:
                wx.navigateTo({
                    url: '/pages/personal/index?edit=true',
                })
                break;
            case 3:
                wx.removeStorageSync('token')
                wx.removeStorageSync('mobile')
                wx.removeStorageSync('member_id')
                wx.removeStorageSync('name')
                wx.removeStorageSync('portrait')
                wx.navigateTo({
                  url: '/pages/login/index',
                })
                break;
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    onPullDownRefresh() {
        this.onShow()
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },
    integralDetails() {
        wx.navigateTo({
            url: '/pages/integralDetails/index',
        })
    },
    handleMoney(){
        wx.navigateTo({
            url: '/pages/moneyDetails/index',
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    handleKefu(){
        wx.hideTabBar({
          animation: true,
        })
        this.setData({
            isService:true
        })
    },
    onSure(){
        wx.showTabBar({
          animation: true,
        })
        this.setData({
            isService:false
        })
    }
})