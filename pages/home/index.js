import Toast from '@vant/weapp/toast/toast';
import {
    request
} from '../../request/index'
import {
    areaList
} from '@vant/area-data';


Page({
    /**
     * 页面的初始数据
     */
    data: {
        isAddress: false,
        address: '',
        swiperList: [
            '../../static/image/banner.png',
        ],
        currentIndex: 0,
        autoplay: true,
        areaList,
        value: '',
        interval: 5000,
        duration: 1000,
        indicatorDots: true,
        circular: true,
        tabList: [{
                url: "../../static/image/ball.png",
                label: "球星网球约球"
            },
            {
                url: "../../static/image/awatr.png",
                label: "球星网球分级赛"
            },
            {
                url: "../../static/image/red.png",
                label: "球星爱培训"
            },
            {
                url: "../../static/image/black.png",
                label: "球星奖金榜"
            },
            {
                url: "../../static/image/booking.png",
                label: "预定场地"
            },
        ],
        list: [
        ],
        page:1,
        last_page:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    handleOpts(){
        wx.navigateTo({
          url: '/pages/settleOrder/index',
        })
    },

    async onList() {
        const {
            page,
            address
        } = this.data;
        const res = await request({
            url: "/order/get_order_list",
            method: "GET",
            data: {
                page,
                city:address,
                ball_type:'',
                order_type:3,
            }
        });
        if (res.code == 200) {
            this.setData({
                last_page: res.data.last_page,
                list: [...this.data.list, ...res.data.data],
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function () {
        if(!wx.getStorageSync('address')){
            wx.setStorageSync('address', '北京市')
        }
        this.setData({
            page:1,
            address:wx.getStorageSync('address'),
            list:[]
        },() => this.onList())
    },

    handleTabclick(e) {
        const currentIndex = e.currentTarget.dataset.index;
        if (this.data.currentIndex == currentIndex) return;
        if(currentIndex == 1){
            wx.showToast({
                title: '暂未开放',
                icon:'none'
              })
            // wx.navigateTo({
            //   url: '/pages/train/index',
            // })
        }

    },
    handleIndex(e) {
        const index = e.currentTarget.dataset.index
        switch (index) {
            case 0:
                wx.switchTab({
                    url: '/pages/abloutBall/index',
                })
                break;
            case 1:
                wx.switchTab({
                    url: '/pages/settle/index',
                })
                break;
            case 2:
                // wx.navigateTo({
                //     url: '/pages/train/index',
                // })
                wx.showToast({
                  title: '暂未开放',
                  icon:'none'
                })
                break;
            case 3:   
                wx.navigateTo({
                    url: '/pages/BonusList/index',
                })
                break;
            case 4:
                wx.navigateTo({
                  url: '/subpages/booking/index',
                })
        }
    },
    //选择位置
    handleAddress() {
        wx.hideTabBar({
            animation: true,
        })
        this.setData({
            isAddress: true
        })
    },
    cancel() {
        this.setData({
            isAddress: false
        })
        wx.showTabBar({
            animation: true,
        })

    },
    confirm(e) {
        const address = e.detail.values;
        wx.setStorageSync('address', address[1].name)
        this.setData({
            address: address[1].name
        }, () => {
            this.cancel()
            this.onShow()
        })
    },
    handeleDetails(){
        wx.navigateTo({
            url: '/pages/starsDetails/index',
        })
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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onRecharge() {

    },
    handleDetails(e) {
        const order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/starsDetails/index?order_id=' + order_id ,
        })
    },


})