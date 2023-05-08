// subpages/booking_settled/index.js
import {
    formatTime
} from '../../utils/util';
import {
    request,
    baseUrl
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        address: '',
        contacts: '',
        contact_phone: '',
        phone: '',
        start_time: '',
        end_time: '',
        logo: '',
        instruction: '',
        fileList1: [],
        fileList2: [],
        bank_card: '',
        bank_name: '',
        photos: [],
        photos1: [],
        photos2: [],
        photos3: [],
        photos4: [],
        photos5: [],
        // 弹出层
        isSignDate: false,
        isBallDate: false,
        formatter(type, value) {
            if (type === 'hour') {
                return `${value}时`;
            }
            if (type === 'minute') {
                return `${value}分`;
            }
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
    async onSubmit() {
        const {
            name,
            address,
            contacts,
            contact_phone,
            phone,
            start_time,
            end_time,
            logo,
            instruction,
            fileList1,
            fileList2,
            bank_card,
            bank_name,
            account_name,
            photos1,
            photos2,
            photos3,
            photos4,
            photos5
        } = this.data
        console.log();
        if (!name) {
            return wx.showToast({
                title: '请填写场馆名',
                icon: 'none'
            })
        }
        if (!address) {
            return wx.showToast({
                title: '请填写详细地址',
                icon: 'none'
            })
        }
        if (!contacts) {
            return wx.showToast({
                title: '请填写联系人',
                icon: 'none'
            })
        }
        if (!contact_phone) {
            return wx.showToast({
                title: '请填写联系人电话',
                icon: 'none'
            })
        }
        if (!phone) {
            return wx.showToast({
                title: '请填写场馆电话',
                icon: 'none'
            })
        }
        if (!start_time) {
            return wx.showToast({
                title: '请选择营业开始时间',
                icon: 'none'
            })
        }
        if (!end_time) {
            return wx.showToast({
                title: '请选择营业结束时间',
                icon: 'none'
            })
        }
        if (!logo) {
            return wx.showToast({
                title: '请选择场馆LOGO',
                icon: 'none'
            })
        }
        if (!instruction) {
            return wx.showToast({
                title: '说点什么吧...',
                icon: 'none'
            })
        }
        if ([...fileList1, ...fileList2].length < 2) {
            return wx.showToast({
                title: '请上传身份证正反面照片',
                icon: 'none'
            })
        }
        if (!bank_card) {
            return wx.showToast({
                title: '请填写收款个人账户或对公账户',
                icon: 'none'
            })
        }
        if (!bank_name) {
            return wx.showToast({
                title: '请填写开户行',
                icon: 'none'
            })
        }
        if (!account_name) {
            return wx.showToast({
                title: '请填写户名',
                icon: 'none'
            })
        }
        if ([...photos1, ...photos2, ...photos3, ...photos4, ...photos5].length < 3) {
            return wx.showToast({
                title: '至少上传三张球馆照片',
                icon: 'none'
            })
        }

        const res = await request({
            url: "/venue/create",
            method: "POST",
            data: {
                type: 1,
                name,
                contacts,
                contact_phone,
                address,
                phone,
                start_time,
                end_time,
                logo: logo[0].url,
                instruction,
                id_card: JSON.stringify([...fileList1, ...fileList2].map(item => {
                    return item.url
                })),
                bank_card,
                bank_name,
                account_name,
                photos: JSON.stringify([...photos1, ...photos2, ...photos3, ...photos4, ...photos5].map(item => {
                    return item.url
                }))
            }
        })
        if (res.code === 200) {
            wx.navigateBack({
                delta: 1
            })
        }
    },
    onSetDate(e) {
        let data = e.currentTarget.dataset.val
        this.setData({
            [data]: true
        })
    },
    //弹出层-时间
    onClose() {
        this.setData({
            isSignDate: false,
            isBallDate: false,
        })
    },
    confirmStart(value) {
        this.setData({
            start_time: value.detail + ':00',
            isSignDate: false,
        })
    },
    confirmEnd(value) {
        this.setData({
            end_time: value.detail + ':59',
            isBallDate: false,
        })
    },

    // 上传是身份证
    onAfterRead(event) {
        let list = event.currentTarget.dataset.type
        const {
            file
        } = event.detail;
        let that = this;
        console.log(list, file);
        file.forEach((e) => {
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
                    that.setData({
                        [list]: []
                    })
                    const obj = JSON.parse(res.data)

                    that.data[list].push({
                        ...file,
                        url: obj.data.url,
                        id: obj.data.file_id
                    });
                    that.setData({
                        [list]: that.data[list]
                    });
                },
            })
        })
    },
    onDelete(e) {
        let list = e.currentTarget.dataset.type
        this.setData({
            [list]: []
        })
        this.data[list].splice(e.detail.index, 1)
        this.setData({
            [list]: this.data[list]
        });
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