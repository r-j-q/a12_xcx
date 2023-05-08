import {
    formatTime
} from '../../utils/util';
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
        ball_lev:'',
        province: '',
        longitude: '0',
        latitude: '0',
        city: '',
        area: '',
        color:'',
        sign_fee:'',
        place:'',
        address:'',
        deadline:'',
        start_date:'',
        order_type:2,
        content:'',
        end_date:'',
        ball_type:'',
        isType:false,
        mobile:'',
        batch:'',
        isendDate:false,
        isBallDate:false,
        isball_lev:false,
        isSignDate:false,
        typeList:[
           '单次','多次'
        ],
        gradeList: [
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
        minDate: new Date().getTime(),
        maxDate: new Date().setDate(new Date().getDate() + 360),
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
    onClose() {
        this.setData({
            isType:false,
            isendDate:false,
            isSignDate: false,
            isBallDate: false,
            isball_lev: false,
        })
    },
    confirmGrade(e) {
        this.setData({
            ball_lev: e.detail.value.text,
            color:e.detail.value.color,
            isball_lev: false
        })
    },
    async handlesign() {
        const {
            ball_field,
            ball_type,
            deadline,
            start_date,
            province,
            city,
            area,
            color,
            place,
            address,
            ball_lev,
            people_num,
            sign_fee,
            mobile,
            remarks,
            end_date,
            latitude,
            longitude,
            order_type,
            batch,
            content,
        } = this.data;
        if(  !ball_type  || !start_date || !place || !city || !ball_lev || !people_num || !sign_fee || !mobile){
            return wx.showToast({
              title: '请填写完整信息',
              icon:'none'
            })
        }
        const res = await request({
            url: "/order/create_order",
            method: "POST",
            data: {
                ball_field:'',
                ball_type: ball_type == '单次' ? 10 : 20,
                start_date,
                order_type,
                province,
                end_date,
                batch,
                color,
                city,
                area,
                place,
                address,
                ball_lev,
                people_num,
                img_id:0,
                sign_fee,
                mobile,
                remarks,
                latitude,
                longitude,
                content,
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
                    wx.navigateBack()
                }, 2000)
            }
        }

    },
    onSetDate(e) {
        let data = e.currentTarget.dataset.val;
        this.setData({
            [data]: true
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    confirm(e) {
        this.setData({
            deadline: formatTime(e.detail),
            isSignDate: false
        })
    },
    confirmType(e){
        this.setData({
            ball_type: e.detail.value,
            isType: false
        })
    },
    confirmDate(e) {
        this.setData({
            start_date: formatTime(e.detail),
            isBallDate: false
        })
    },
    confirmEndDate(e){
        this.setData({
            end_date: formatTime(e.detail),
            isendDate: false
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