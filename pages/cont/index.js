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
        province: '',
        city: '',
        area: '',
        ball_field: '',
        ball_type: '',
        order_type: 3,
        end_date: "",
        start_date: "",
        address: "",

        longitude: '0',
        latitude: '0',
        fileList: [],
        ball_lev: '',
        people_num: "",
        img_id: '0',

        sign_fee: "",
        mobile: '',
        remarks: "1、比赛设置为8签位。\n2、规则采用中国网球协会制定的《网球竞赛规则》。\n3、赛制采用单淘汰赛制度及附加赛赛制，每场比赛采用4比4抢七无占先，4:4时通过抢七决定胜负\n4、比赛采用信任制，出现争议球先由选手自行协商解决，若协商无果，则由现场管理人员来决定这一分的判罚；如一方不服判罚，2分钟内仍未开始，视为弃权判负。对于恶意呼报出界的，平台将给予惩罚，视情节严重程度，保留禁赛权利。\n5、比赛采用限时规定，每场比赛限时20分钟。时间一到，活球的需一球打完，结束时比分领先者获胜；如此时平分，则再打一分决定胜负。\n6、比赛采用单数局交换方位，局间无休息。",
        color: "",
        place: '',
        gradeList: [
            {
                text: '2.0',
                color: '#5D71FF',
            },
            {
                text: '2.5',
                color: '#982EDF',
            },
            {
                text: '3.0',
                color: '#4B7CDE',
            },
            {
                text: '3.5',
                color: '#2C9C49',
            },
            {
                text: '4.0',
                color: '#96B937',
            },
            {
                text: '4.5',
                color: '#FF5660',
            },
            {
                text: '5.0',
                color: '#5D71FF',

            },
        ],
        isType: false,
        isball_lev: false,
        isSignDate: false,
        isBallDate: false,
        typeList: ['单打', '双打'],
        minDate: new Date().getTime(),
        maxDate: new Date().setDate(new Date().getDate() + 15),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            }
            if (type === 'month') {
                return `${value}月`;
            }
            if (type === 'day') {
                return `${value}日`;
            }
            if (type === 'hour') {
                return `${value}时`;
            }
            if (type === 'minute') {
                return `${value}分`;
            }
            return value;
        },

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
    confirmGrade(e) {
        this.setData({
            ball_lev: e.detail.value.text,
            color: e.detail.value.color,
            isball_lev: false
        })
    },
    confirmType(e) {
        this.setData({
            ball_type: e.detail.value,
            isType: false
        })
    },
    onClose() {
        this.setData({
            isType: false,
            isSignDate: false,
            isBallDate: false,
            isball_lev: false,
        })
    },
    onSetDate(e) {
        let data = e.currentTarget.dataset.val;
        this.setData({
            [data]: true
        })
    },
    confirmDate(e) {
        this.setData({
            start_date: formatTime(e.detail),
            end_date:formatTime(e.detail + (3600000*2)),
            isBallDate: false
        })
    },
    confirm(e) {
        this.setData({
            end_date: formatTime(e.detail),
            isSignDate: false
        })
    },
    afterRead(event) {
        const {
            file
        } = event.detail;
        let that = this;

        file.forEach(e => {
            wx.uploadFile({
                url: baseUrl + '/other/upload',
                filePath: e.url,
                name: 'file',
                header: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': wx.getStorageSync("token"), //如果需要token的话要传
                },
                formData: {
                    user: 'test'
                },
                success(res) {
                    console.log(res.data)
                    const {
                        fileList = []
                    } = that.data;
                    const obj = JSON.parse(res.data)

                    fileList.push({
                        ...file,
                        url: obj.data.url,
                        id: obj.data.file_id
                    });
                    that.setData({
                        fileList
                    });
                },
            });
        })

    },
    onDelete(e) {
        const {
            fileList = []
        } = this.data;
        fileList.splice(e.detail.index, 1)
        this.setData({
            fileList
        });
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
    async handlesign() {
        let that = this;
        const {

            ball_type,

            start_date,
            province,
            city,
            area,
            color,
            place,
            address,
            ball_lev,
            people_num,
            end_date,
            sign_fee,
            ball_field,
            remarks,
            latitude,
            longitude,
            order_type,
            mobile,

        } = this.data;
        if (!ball_field) {
            return wx.showToast({
                title: '场馆名称',
                icon: 'none'
            })
        }

        if (!ball_type) {
            return wx.showToast({
                title: '请选择类型',
                icon: 'none'
            })
        }
        if (!start_date  || !end_date) {
            return wx.showToast({
                title: '请选择时间',
                icon: 'none'
            })
        }
        if (!place) {
            return wx.showToast({
                title: '请选择位置',
                icon: 'none'
            })
        }
        if (!ball_lev) {
            return wx.showToast({
                title: '请填写水平',
                icon: 'none'
            })
        }
        if (people_num < 6) {
            return wx.showToast({
                title: '人数最少6人',
                icon: 'none'
            })
        }
        if (!sign_fee) {
            return wx.showToast({
                title: '请填写报名费用',
                icon: 'none'
            })
        }
        if (!mobile) {
            return wx.showToast({
                title: '请填写联系方式',
                icon: 'none'
            })
        }
        const res = await request({
            url: "/order/create_order",
            method: "POST",
            data: {
                ball_type: ball_type == '单打' ? 1 : 2,
                start_date,
                order_type,
                province,
                img_id: 0,
                ball_field,
                end_date,
                color,
                city,
                area,
                place,
                address,
                ball_lev,
                people_num:ball_type == '双打' ? people_num * 2 :  people_num,
                sign_fee,
                mobile,
                remarks,
                latitude,
                longitude,
            }
        });
        if (res.code == 200) {
            {
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000,
                    mask: true
                })
                setTimeout(function () {
                    // wx.redirectTo({
                    //     url: '/pages/settleOrder/index',
                    // })
                    wx.redirectTo({
                        url: '/pages/settleOrder/index?ballTyepe=' + (that.data.ball_type == '单打' ? 1 : 2) + '&status=1000',
                      })
                }, 2000)
            }
        }

    }
})
