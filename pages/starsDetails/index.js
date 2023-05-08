import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
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
        isNameList: false,
        maskHidden: false,
        evalatImage: '',
        imagePath: "",
        qrcode_image: '',
        isShare: false,
        checked: true,
        isSuccess: false,
        member_lev:false,
        isPay: false,
        orderObj: {},
        order_id: "",
        isGong: false,
        member_id: '',
        status: '',
        isFind: false,
        teammate_id: '',
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
    onLoad(options) {
        qqmapsdk = new QQMapWX({
            key: 'VPQBZ-RYDKX-3WR4I-ZNGEN-Z56R2-JNB32'
        });
        wx.login({})
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    async memberInfo() {
        if (!wx.getStorageSync('member_id')) return;
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        let obj = res.data;
        this.setData({
            member_lev: obj.member_lev.find( e => e == 4)
        })
    },
    onSee(e){
        wx.navigateTo({
            url: '/pages/outs/index?order_id=' + this.data.order_id,
        })
    },
    handleOpts(e){
      
        wx.navigateTo({
            url: '/pages/outs/index?order_id=' + this.data.order_id,
        })
    },
    clipboardData(){
        let that =this;
        wx.setClipboardData({//复制文本
            data: that.data.orderObj.mobile,
            success: function (res) {
              wx.getClipboardData({//获取复制文本
                success: function (res) {
                  wx.showToast({
                    title:'复制成功',
                    icon:"none",//是否需要icon
                
                  })
                }
              })
            }
          }) 


    },
    myevent(e) {
        let that = this;
        this.setData({
            isFind: false,
        }, () => {
            if (e.detail && e.detail.teammate_id) {
                that.setData({
                    teammate_id: e.detail.teammate_id,
                    isPay: true,
                })
            }
        })
    },
    onClose() {
        this.setData({
            isPay: false,
            isShare: false,
        });
    },
    handleUp() {
        if (this.data.orderObj.ball_type == 2) {
            this.setData({
                isFind: true
            })
            return;
        }
        this.setData({
            isPay: true,
        })
    },
    async onSelect(event) {
        const name = event.detail.name;
        if (name == '微信支付') {
            let that = this;
            wx.login({
                async success(e) {
                    const res = await request({
                        url: "/snatch_order/create",
                        method: "POST",
                        data: {
                            order_id: that.data.order_id,
                            code: e.code,
                            pay_type: 'wx',
                            teammate_id: that.data.teammate_id || 0
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
                    teammate_id: that.data.teammate_id || 0,
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
                  wx.setStorageSync('invite_id', currentPage.options.invite_id || '')
            })
        } else if (currentPage.__displayReporter.query.scene) {
           let scene = decodeURIComponent(currentPage.__displayReporter.query.scene).split('')
       
            this.setData({
                order_id: scene[0]
            }, () => {
                this.orderDetail();
                wx.setStorageSync('invite_id',  scene[2]|| '')
            })
        }
        this.setData({
            member_id: wx.getStorageSync('member_id')
        })
        this.memberInfo()
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
    showquestion(){
        wx.navigateTo({
          url: '/pages/comment/index',
        })
    },
    handlesign() {

    },
    showList() {
        this.setData({
            isNameList: true
        })
    },
    hideList() {
        this.setData({
            isNameList: false,
            isGong: false
        })
    },
    handleClose() {
        this.setData({
            isSuccess: false
        })
        wx.navigateTo({
            url: '/pages/settleOrder/index?ballTyepe=' + this.data.orderObj.ball_type,
        })
    },

    showGong() {
        this.setData({
            isGong: true
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },
    async handleTuisai() {
        let that = this;
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
                   
                });


        

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
        this.onShow()
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
        let that = this;
        const {
            ball_lev,
            ball_type,
            ball_field,
            place,
            start_date
        } = that.data.orderObj
        let title = '球星网球分级赛' + ball_lev + (ball_type == 1 ? '单打' : '双打') + '、' +  ball_field + '、' + place;
        return {
            title: title,
            path: '/pages/starsDetails/index?order_id=' + that.data.order_id  + '&invite_id=' + wx.getStorageSync('member_id') ,
            imageUrl: 'https://www.star1.vip/ball/static/uploads/164095777c892f.png'
        }

    },
    showShare() {
        this.setData({
            isShare: true
        })
    },
    closeCard() {
        this.setData({
            maskHidden: false
        })
    },
    async shareCome() {
        this.onClose()
        if (this.data.imagePath) {
            this.setData({
                maskHidden: true
            })
            return;
        }
        wx.showToast({
            title: '海报生成中...',
            icon: 'loading',
            duration: 3000,
            mask: true
        });
        let that = this;
         wx.request({
            url: baseUrl + "/other/get_unlimited_qrcode",
            method: "post",
            data: {
                page: 'pages/starsDetails/index',
                env_version: 'release',  // trial
                width: 200,
                scene: that.data.order_id + '/' + wx.getStorageSync('member_id')
            },
            success:(res) => {
                wx.getImageInfo({
                    src: res.data.data.url,
                    success(res) {
                        that.setData({
                            qrcode_image: res.path,
                        }, () => {
                          
                        })
                    }
                })
                wx.getImageInfo({
                    src: 'https://www.star1.vip/ball/static/uploads/1416409e14a52942.jpg',
                    success(res) {
                        that.setData({
                            evalatImage: res.path,
                        }, () => {
                            that.createNewImg();
                        })
                    }
                })
            }
        })

    },
    createNewImg: function () {
        var that = this;
        var context = wx.createCanvasContext('mycanvas');

        context.fillRect(0, 0, 375, 667)
        var path = that.data.evalatImage;
        context.drawImage(path, 0, 0, 375, 667);

        var path2 = that.data.qrcode_image;
        context.drawImage(path2, 22, 490, 60, 65);
        context.stroke();


        context.fillRect(246, 430, 90, 30)
        context.stroke();
        var results = that.data.orderObj.ball_field
        context.setFillStyle('#000000');
        context.font = 'normal bold 12px Arial';
        context.fillText(results, 38, 593);
        context.stroke();

        var results1 = that.data.orderObj.start_date
        context.setFillStyle('#000000');
        context.font = 'normal bold 12px Arial';
        context.fillText(results1, 39, 620);
        context.stroke();

        var results2 = that.data.orderObj.people_num
        context.setFillStyle('#000000');
        context.font = 'normal bold 12px Arial';
        context.fillText(results2, 39, 643);
        context.stroke();





        context.save(); //保存之前的画布设置
        context.draw(true); //true表示保留之前绘制内容


        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
                    var tempFilePath = res.tempFilePath;
                    console.log(tempFilePath)
                    that.setData({
                        imagePath: tempFilePath,
                        maskHidden: true

                    });

                },
                fail: function (res) {
                    console.log(res);
                }
            });
        }, 1000);
    },
    baocun() {
        console.log('9999999')
        var that = this;
        //获取相册授权
        wx.getSetting({
            success(res) {
                console.log(res)
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            that.savaImageToPhotos();
                        },
                        fail(e) {
                            wx.showToast({
                                icon: 'none',
                                title: '请打开相册权限!',
                            })

                        }
                    })
                } else {
                    that.savaImageToPhotos();
                }
            },
            fail(msg) {

            }
        })
    },
    savaImageToPhotos: function () {
        let that = this;
        wx.showLoading({
            title: '努力生成中...'
        })
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 375,
            height: 667,
            destWidth: 718,
            destHeight: 1200,
            canvasId: 'mycanvas',
            success: function (res) {
                wx.hideLoading()
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showModal({
                            content: '保存成功',
                            showCancel: false,
                            confirmColor: '#72B9C3',
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定');
                                    that.setData({
                                        maskHidden: false,
                                    })
                                }
                            }
                        })
                    }
                }, that)
            },
            fail: function (res) {

            }
        })
    },
})