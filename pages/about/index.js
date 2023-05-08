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
        order_type:1,
        end_date: "",
        start_date: "",
        address: "",
        longitude: '0',
        serial_num:'',
        latitude: '0',
        fileList: [],
        ball_lev: '',
        people_num: "",
        img_id:'0',
        sign_fee: "",
        mobile: '',
        remarks: "",
        color:"",
        place:'',
        gradeList: [
            {
                text:'等级不限',
                color:'#982EDF',
            },
            {
                text:'2.0',
                color:'#5D71FF',
                
            },
            {
                text:'2.5',
                color:'#982EDF',
            },
            {
                text:'3.0',
                color:'#4B7CDE',
            },
            {
                text:'3.5',
                color:'#2C9C49',
            },
            {
                text:'4.0',
                color:'#96B937',
            },
            {
                text:'4.5',
                color:'#FF5660', 
            },
            {
                text:'5.0',
                color:'#5D71FF',
                
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
            color:e.detail.value.color,
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
        file.forEach( e => {
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
                        id:obj.data.file_id
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
            ball_field,
            ball_type,
            end_date,
            start_date,
            province,
            city,
            area,
            color,
            place,
            address,
            ball_lev,
            people_num,
            fileList,
            sign_fee,
            mobile,
            remarks,
            latitude,
            longitude,
            order_type,
            serial_num,
            img_id,
        } = this.data;
        if(!ball_field ){
            return wx.showToast({
              title: '请填写场馆名',
              icon:'none'
            })
        }
        if(!serial_num ){
            return wx.showToast({
              title: '请填写场馆编号',
              icon:'none'
            })
        }
        if( !ball_type){
            return wx.showToast({
                title: '请选择约球类型',
                icon:'none'
              })
        }
        if( !start_date){
            return wx.showToast({
                title: '请选择约球时间',
                icon:'none'
              })
        }
        if( !place){
            return wx.showToast({
                title: '请选择约球位置',
                icon:'none'
              })
        }
        if( !ball_lev){
            return wx.showToast({
                title: '请填写约球水平',
                icon:'none'
              })
        }
        if( !people_num){
            return wx.showToast({
                title: '请填写约球人数',
                icon:'none'
              })
        }
        if(sign_fee < 1){
            return wx.showToast({
                title: '请填写报名费用',
                icon:'none'
              })
        }
        if( !mobile){
            return wx.showToast({
                title: '请填写联系方式',
                icon:'none'
              })
        }
        const res = await request({
            url: "/order/create_order",
            method: "POST",
            data: {
                ball_field,
                ball_type: ball_type == '单打' ? 1 : 2,
                start_date,
                order_type,
                serial_num,
                province,
                img_id:fileList.length > 0 ? fileList[0].id :0,
                color,
                city,
                area,
                end_date,
                place,
                address,
                ball_lev:ball_lev ==  '等级不限' ? 0 : ball_lev,
                people_num,
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
                   wx.redirectTo({
                     url: '/pages/AboutOrder/index?ballTyepe=' + (that.data.ball_type == '单打' ? 1 : 2) + '&status=1000',
                   })
                }, 2000)
            }
        }

    }
})