// pages/booking_tennis/index.js
import {
    request
} from '../../request/index'
import {
    formatDate,
    formatWeek
} from '../../utils/util';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        box_active: 0,
        dateList: [],
        oldDataList: [],
        newDataList: [],
        headerList: [],
        changeIndex: '',
        timeList: [],
        tableColor: [
            {
                color: '#BFBFBF',
                msg: '不可选'
            },
            {
                color: '#438E53',
                msg: '可预订'
            },
            {
                color: '#F2914A',
                msg: '已选择'
            },
            {
                color: '#F8C351',
                msg: '我的预定'
            }
        ],
        amount: 0,
        popinfo: {},
        radio: 'balance'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.venue_id) {
            this.getList(options.venue_id)
        }
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
    //获取列表
    async getList(id) {
        const { data } = await request({
            url: "/client/field/list",
            method: "GET",
            data: {
                venue_id: id
            }
        })
        const res = await request({
            url: "/venue/show/" + id,
            method: "GET",
        })
        this.onSetDate(res)
        let list = []
        let newList = []
        if (data.length > 0 || Object.keys(data).length > 0) {
            Object.keys(data[Object.keys(data)[0]]).map(ele => {
                list.push(ele)
            })
            newList.unshift({
                index: 0,
                key: '时间',
                value: this.data.timeList
            })
            Object.keys(data[Object.keys(data)[0]]).map((ele, index) => {
                newList.push({
                    index: (index + 1).toString(),
                    key: ele,
                    value: data[Object.keys(data)[0]][ele]
                })
            })
            list.unshift(' ')
            this.setData({
                oldDataList: data,
                newDataList: newList,
                headerList: list
            })
            this.getTime(data)
        }

    },
    //时间
    getTime(data) {
        let list = []
        Object.keys(data).forEach(ele => {
            let timestamp = new Date(ele).getTime();
            list.push({
                week: formatWeek(timestamp),
                date: formatDate(timestamp),
                oldDate: ele
            })
        })
        this.setData({
            dateList: list
        })
    },
    //切换日期
    changeDate(e) {
        this.setData({
            box_active: e.currentTarget.dataset.index,
            changeIndex: '',
            popinfo: {}
        })
        Object.keys(this.data.oldDataList).forEach(ele => {
            if (e.currentTarget.dataset.data.oldDate === ele) {
                let list = []
                let newList = []
                Object.keys(this.data.oldDataList[ele]).map(ele => {
                    list.push(ele)
                })
                newList.unshift({
                    index: 0,
                    key: '时间',
                    value: this.data.timeList
                })
                Object.keys(this.data.oldDataList[ele]).map((item, index) => {
                    newList.push({
                        index: (index + 1).toString(),
                        key: item,
                        value: this.data.oldDataList[ele][item]
                    })
                })
                list.unshift(' ')
                this.setData({
                    headerList: list,
                    newDataList: newList,
                })
            }
        })
    },
    onItem(e) {
        switch (e.currentTarget.dataset.value.state) {
            case 0:

                break;
            case 1:
                console.log(e.currentTarget);
                this.setData({
                    amount: e.currentTarget.dataset.value.price,
                    changeIndex: e.currentTarget.dataset.index,
                    popinfo: e.currentTarget.dataset
                })
                break;
            case 2:

                break;
            default:
                break;
        }


    },
    changeList(e) {
        console.log(e.currentTarget.dataset);
    },
    // 提交订单
    async open() {
        let list = []
        let dateIndex = this.data.dateList[this.data.box_active]
        if (Object.keys(this.data.popinfo).length > 0) {
            list.push({
                field_detail_id: this.data.popinfo.value.id,
                date: dateIndex.oldDate
            })
            const res = await request({
                url: "/client/field/order/create",
                method: "POST",
                data: {
                    fields: JSON.stringify(list)
                }
            })
            if (res.code === 200) {
                let tiemr = new Date(res.data.field_details[0].pivot.date).getTime();
                let priceS = this.data.popinfo.value.price
                this.setData({
                    show: true,
                    popinfo: {
                        amount: res.data.amount,
                        date: res.data.field_details[0].pivot.date,
                        start_time: res.data.field_details[0].start_time,
                        end_time: res.data.field_details[0].end_time,
                        name: res.data.field_details[0].field.name,
                        price: priceS,
                        week: formatWeek(tiemr),
                        id: res.data.id
                    }
                })
                console.log(this.data.popinfo);
            }
        } else {
            return wx.showToast({
                title: '请选择场次',
                icon: 'none'
            })
        }

    },
    // 支付订单
    async onSetInfo() {
        const res = await request({
            url: "/client/field/order/payment",
            method: "POST",
            data: {
                pay_type: this.data.radio || balance,
                id: this.data.popinfo.id
            }
        })
        if (res.code === 200) {
            this.setData({
                show: false
            })
            wx.navigateTo({
                url: '/subpages/bookingSucceed/index'
            });
        }

    },
    onChange(e) {
        this.setData({
            radio: e.detail
        })
    },
    onClose() {
        this.setData({ show: false })
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

    },
    onSetDate(data) {
        if (data.code === 200) {
            let end_time = data.data.end_time.split(":")[0] * 1
            let start_time = data.data.start_time.split(":")[0] * 1
            let dateList = []
            for (let index = start_time; index < end_time; index++) {
                dateList.push({
                    time: `${index}:00`
                })
            }
            this.setData({
                timeList: dateList
            })
        }
    }
})