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
        balance:0,
        show: false,
        box_active: 0,
        dateList: [],
        oldDataList: [],
        newDataList: [],
        headerList: [],

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
        changeIndex: '',
        popinfo: {},
        radio: 'balance',
        newListNum: [],
        newListNum2: [],
        newListOne: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.venue_id) {
            this.getList(options.venue_id)
        }
        this.get_member_info()
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
            console.log("newListnewListnewList", newList[1].key)
            list.unshift(' ')
            this.setData({
                newListOne: newList[1].key,
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


        let newList = this.data.newDataList;
        newList.forEach((items) => {
            items.value.forEach((its) => {
                its.isActive = false
            })
        })
        this.setData({
            box_active: e.currentTarget.dataset.index,
            changeIndex: '',
            popinfo: {},
            newListNum: [],
            newListNum2: [],
            newDataList: newList,
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
                // console.log('------>8888');

                this.setData({
                    headerList: list,
                    newDataList: newList,
                })
            }
        })
    },
    onItem(e) {
        let _this = this;

        let eNumber = e.currentTarget.dataset.number;
        if (eNumber === _this.data.newListOne) {
            _this.onTemChange(e)
            console.log('场地11111------->', eNumber)
        } else {
            _this.onTemChange2(e)
            console.log('场地22222------->', eNumber)

        }
        // _this.setData({
        //     newListOne:  e.currentTarget.dataset.number
        // })


    },
    onTemChange(e) {
        let _this = this;
        // _this.setData({
        //     newListNum2: []
        // })
        let newList = this.data.newDataList;


        newList.forEach((items) => {

            if (items.key === e.currentTarget.dataset.number) {

                items.value.forEach((its) => {
                    if (its.id === e.currentTarget.dataset.value.id) {

                        if (this.data.newListNum.length >= 2 && !its.isActive) {
                            wx.showToast({
                                title: '同一场地最多不超过两小时',
                                icon: 'none'
                            })
                            if (its.isActive) {
                                its.isActive = false
                            }
                            return
                        } else {

                            if (its.isActive) {
                                its.isActive = false;

                                const deleteID = this.data.newListNum.filter((s) => s.id != its.id);

                                _this.setData({
                                    newListNum: deleteID
                                })
                                // console.log('------>8080', this.data.newListNum)


                            } else {

                                if (this.data.newListNum.length < 2) {
                                    let newlist = _this.data.newListNum;
                                    newlist.push(its);
                                    its.isActive = true;
                                    _this.setData({
                                        newListNum: newlist
                                    },

                                    )

                                }


                            }


                        }


                    }
                })
            }
        })

        switch (e.currentTarget.dataset.value.state) {
            case 0:
                break;
            case 1:

                this.setData({
                    newDataList: newList,
                    amount: e.currentTarget.dataset.value.price,
                    changeIndex: e.currentTarget.dataset.index,
                    popinfo: e.currentTarget.dataset
                })
                // console.log('newDataList=-222------->', this.data.newDataList)
                break;
            case 2:
                break;
            default:
                break;
        }
    },
    onTemChange2(e) {
        let _this = this;
        // _this.setData({
        //     newListNum: []
        // })
        console.log("this.data.newListNum2", this.data.newListNum2)
        let newList2 = this.data.newDataList;
        newList2.forEach((items) => {

            if (items.key === e.currentTarget.dataset.number) {

                items.value.forEach((its) => {
                    if (its.id === e.currentTarget.dataset.value.id) {

                        if (this.data.newListNum2.length >= 2 && !its.isActive) {
                            wx.showToast({
                                title: '同一场地最多不超过两小时',
                                icon: 'none'
                            })
                            if (its.isActive) {
                                its.isActive = false
                            }
                            return
                        } else {

                            if (its.isActive) {
                                its.isActive = false;

                                const deleteID = this.data.newListNum2.filter((s) => s.id != its.id);

                                _this.setData({
                                    newListNum2: deleteID
                                })
                                console.log('------>8080', this.data.newListNum2)


                            } else {

                                if (this.data.newListNum2.length < 2) {
                                    let newList3 = _this.data.newListNum2;
                                    newList3.push(its);
                                    its.isActive = true;
                                    _this.setData({
                                        newListNum2: newList3
                                    },

                                    )

                                }


                            }


                        }


                    }
                })
            }
        })

        switch (e.currentTarget.dataset.value.state) {
            case 0:
                break;
            case 1:
                // console.log('------>场地位置',
                //     e.currentTarget)
                this.setData({
                    newDataList: newList2,
                    amount: e.currentTarget.dataset.value.price,
                    changeIndex: e.currentTarget.dataset.index,
                    popinfo: e.currentTarget.dataset
                })
                // console.log('newDataList=-222------->', this.data.newDataList)
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
        let list = [];

        let newList2 = this.data.newDataList;


        console.log("------->newList2", newList2)
        console.log("------->9999newListNum", this.data.newListNum)
        console.log("------->9999newListNum2", this.data.newListNum2)

        let cancotList = [...this.data.newListNum, ...this.data.newListNum2];
        console.log("------->cancotList", cancotList)

        // console.log("------->dateIndex", this.data.dateList)
        let dateIndex = this.data.dateList[this.data.box_active]


        if (Object.keys(this.data.popinfo).length > 0) {
            cancotList.forEach((flags)=>{
                list.push({
                    field_detail_id:   flags.id,
                    date: dateIndex.oldDate
                })    
            })

            // list.push({
            //     field_detail_id: this.data.popinfo.value.id,
            //     date: dateIndex.oldDate
            // })


            console.log("------->创建订单", list)
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

    async  get_member_info(){ 
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                
            }
        })
        if (res.code === 200) {
            this.setData({
                balance:res.data.balance
            })
            console.log("========>>>>",res)
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
                   
            wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,

                success: payRes => {  
                    wx.navigateTo({
                        url: '/subpages/bookingSucceed/index'
                    });
                },
                fail: payFail => {
                    console.log('支付失败！');
                   
                } 
            }) 
            
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