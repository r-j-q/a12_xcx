import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
import {
    request
} from '../../request/index';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: true,
        isSuccess: false,
        orderObj:{},
        member_id:'',
        status:'',
        isNameList:false,
        options: [{
            name: '微信支付',
            icon: 'wechat',
        },
        {
            name: '余额支付',
            icon: 'https://img.yzcdn.cn/vant/custom-icon-light.png'
        },

    ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
        hideList() {
        this.setData({
            isNameList: false,
            isGong: false
        })
    },
    showList() {
        this.setData({
            isNameList: true
        })
    },
    onLoad(options) {
        qqmapsdk = new QQMapWX({
            key: 'VPQBZ-RYDKX-3WR4I-ZNGEN-Z56R2-JNB32'
        });
        wx.login({})
    },
    handleUp() {
        this.setData({
            isPay: true,
        })

    },
    onClose() {
        this.setData({
            isPay: false
        });
    },
    async handleTuisai() {
        let that = this;
        console.log('1111')
            Dialog.confirm({
                    title: '提示',
                    message: '您确定要退赛吗?',
                })
                .then(async () => {
                    if (this.data.orderObj.member_id == this.data.member_id) {
                        const res = await request({
                            url: "/order/cancel_order",
                            method: "POST",
                            data: {
                                order_id: that.data.orderObj.order_id,
                            }
                        });
                        if (res.code == 200) {
                            that.orderDetail()
                            wx.showToast({
                                title: '取消成功',
                                icon: "none"
                            })
    
                        }
                    }else{
                        const res = await request({
                            url: "/snatch_order/cancel_snatch",
                            method: "POST",
                            data: {
                                snatch_id: that.data.orderObj.snatch_order.snatch_id,
                            }
                        });
                        if (res.code == 200) {
                            that.orderDetail()
                            wx.showToast({
                                title: '取消成功',
                                icon: "none"
                            })
                        }
                    }
                   
                })
                .catch(() => {
                    // on cancel
                });


        

    },
    handlesign() {
        const {
            checked,
            isSuccess
        } = this.data;
        if (!checked) {
            return Toast('请勾选报名须知')
        }
        this.setData({
            isSuccess: true
        })
    },
    handleGomap() {
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                wx.openLocation({
                    latitude: that.data.orderObj.latitude * 1,
                    longitude: that.data.orderObj.longitude * 1,
                    address: that.data.orderObj.place
                })
            },
        })
    },
    handleClose() {
        this.setData({
            isSuccess: false
        })
    },
    async onSelect(event) {
        const {
            checked,
            isSuccess
        } = this.data;
        if (!checked) {
            return Toast('请勾选报名须知')
        }
        const name = event.detail.name;
        if (name == '微信支付') {
            let that = this;
            wx.login({
                async success(e) {
                    console.log(e)
                    const res = await request({
                        url: "/snatch_order/create",
                        method: "POST",
                        data: {
                            order_id: that.data.order_id,
                            code: e.code,
                            pay_type: 'wx'
                        }
                    });
                    if (res.code == 200) {
                        let wxObj = res.data.payinfo;
                        wx.requestPayment({
                            nonceStr: wxObj.nonceStr,
                            package: wxObj.package,
                            paySign: wxObj.paySign,
                            signType: wxObj.signType,
                            timeStamp: wxObj.timeStamp,
                            success(res1) {
                                that.setData({
                                    isSuccess: true
                                })
                                that.onShow()
                            },
                            fail(err) {
                                wx.showToast({
                                    icon: 'none',
                                    title: '支付失败',
                                })
                            }
                        })


                    }
                }
            })
        } else {
            let that = this;
            const res = await request({
                url: "/snatch_order/create",
                method: "POST",
                data: {
                    order_id: that.data.order_id,
                    pay_type: 'balance'
                }
            });
            if (res.code == 200) {
                that.setData({
                    isSuccess: true
                })
                that.onShow()
            }
        }
        this.onClose();
    },
    onChange(e) {
        this.setData({
            checked: e.detail
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    handleClose() {
        this.setData({
            isSuccess: false
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        if (currentPage.options && currentPage.options.order_id) {
            this.setData({
                order_id: currentPage.options.order_id,
            }, () => {
                this.orderDetail();
                this.setData({
                    member_id: wx.getStorageSync('member_id')
                })
            })
        }
    },
    async orderDetail() {
        const res = await request({
            url: "/order/get_order_info",
            method: "GET",
            data: {
                order_id: this.data.order_id,
            }
        });
        if (res.code == 200) {
            this.setData({
                orderObj: res.data,
                status: res.data.status
            })
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
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
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