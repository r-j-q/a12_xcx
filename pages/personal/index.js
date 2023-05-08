import {
    getdateNoTime
} from '../../utils/util';
import {
    request,
    baseUrl,
} from '../../request/index';
import {
    areaList
} from '@vant/area-data';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isBrthday: false,
        isSex: false,
        isAddress: false,
        isGrade: false,
        isDisabled: false,
        portrait: "",
        gradeList: ['2.0','2.5', '3.0', ' 3.5', '4.0', '4.5', '5.0'],
        areaList,
        ball_lev: '',
        autograph: "",
        sex: "",
        birthday: '',
        id_num: "",
        real_name: "",
        height:'',
        weight:'',
        city: '',
        shoole: '',
        edit:false,
        currentDate: new Date().getTime(),
        minDate: new Date(1950, 10, 1).getTime(),
        maxDate: new Date().getTime(),
        columns: ['男', '女'],
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
            return value;
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options && options.edit){
            this.setData({
                edit:options.edit
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    handleGrade() {
      
        this.setData({
            isGrade: true,
        })
    },
    handleSex() {
        if (this.data.isDisabled) return;
        this.setData({
            isSex: true
        })
    },
    confirmSex(e) {
        this.setData({
            sex: e.detail.value,
            isSex: false
        })
    },
    onClose() {
        this.setData({
            isBrthday: false,
            isSex: false,
            isAddress: false,
            isGrade: false
        })
    },
    confirmGrade(e) {
        this.setData({
            ball_lev: e.detail.value,
            isGrade: false
        })
    },
    confirm(e) {
        this.setData({
            birthday: getdateNoTime(e.detail),
            isBrthday: false
        })
    },
    handlebirthday() {
        if (this.data.isDisabled) return;
        this.setData({
            isBrthday: true
        })
    },
    confirmAddress(e) {
        const address = e.detail.values;
        this.setData({
            city: address[2].name
        }, () => {
            this.onClose()
        })
    },
    handleAddress() {
        this.setData({
            isAddress: true
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            mobile: wx.getStorageSync('mobile')
        })
        this.getMemberInfo()
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
    async getMemberInfo() {
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        if (res.code == 200 && res.data.name) {
            const {
                autograph,
                ball_lev,
                birthday,
                city,
                height,
                mobile,
                name,
                portrait,
                sex,
                shoole,
                id_num,
                real_name,
                weight
            } = res.data;
            this.setData({
                autograph,
                ball_lev,
                birthday,
                city,
                height,
                mobile,
                real_name,
                id_num,
                name,
                portrait,
                sex: sex == 2 ? "男" : sex == 1 ? "女" : "",
                shoole,
                weight,
                isDisabled: ball_lev * 1 > 0 ? true :false
            })

        }
    },
    async handlesign() {
        const {
            name,
            mobile,
            ball_lev,
            birthday,
            sex,
            height,
            weight,
            city,
            shoole,
            autograph,
            real_name,
            id_num,
            portrait
        } = this.data;
        if (!name ) {
            wx.showToast({
                title: '请填写用戶名',
                icon: "none"
            })
            return;
        }
        // if ( !real_name ) {
        //     wx.showToast({
        //         title: '请填写真实姓名',
        //         icon: "none"
        //     })
        //     return;
        // }
        if ( !portrait ) {
            wx.showToast({
                title: '请上传头像',
                icon: "none"
            })
            return;
        }
        // if ( !birthday ) {
        //     wx.showToast({
        //         title: '请填写生日',
        //         icon: "none"
        //     })
        //     return;
        // }
        if ( !sex ) {
            wx.showToast({
                title: '请选择性别',
                icon: "none"
            })
            return;
        }
        if ( !ball_lev ) {
            wx.showToast({
                title: '请选择等级',
                icon: "none"
            })
            return;
        }
        // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

        // if (reg.test(id_num) === false) {
        //     wx.showToast({
        //         title: '身份证号不合法',
        //         icon: 'none'
        //     })
        //     return
        // }
        const res = await request({
            url: "/member/update",
            method: "POST",
            data: {
                name,
                mobile,
                real_name,
                id_num,
                ball_lev,
                birthday,
                sex: sex == '男' ? 2 : 1,
                height:height|| 0,
                weight: weight||0 ,
                city,
                shoole,
                autograph,
                portrait,
                invite_id:wx.getStorageSync('invite_id') || 0,
            }
        });
        if (res.code == 200) {
            wx.showToast({
                title: '保存成功',
                icon: 'none'
            });
            wx.setStorageSync('name', name)
            wx.setStorageSync('portrait', portrait)
            wx.navigateBack({
                delta: 1
            })
        }
    },
    onChooseAvatar(e) {
        let that = this;
        wx.uploadFile({
            url: baseUrl + '/other/upload',
            name: 'file',
            header: {
                'Content-Type': 'multipart/form-data',
                'Authorization': wx.getStorageSync("token"), //如果需要token的话要传
            },
            filePath: e.detail.avatarUrl, //服务器端接收图片的路径
            success: function (res) {

                that.setData({
                    portrait: JSON.parse(res.data).data.url
                })
            },
            fail: function (res) {
                console.log(res); //发送失败回调，可以在这里了解失败原因
            }
        })


    }
})