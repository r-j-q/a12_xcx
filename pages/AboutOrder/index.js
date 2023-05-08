import {
    areaList
} from '@vant/area-data';
import {
    request
} from '../../request/index';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        isAddress: false,
        isLevel: false,
        isType: false,
        isMine: false,
        address: '',
        areaList,
        isGrade: false,
        grade: "已报名",
        status: '20',
        order_type: 1,
        mine: '我参加的',
        mineStatus: '2000',
        mineList: [
            {
                status: '2000',
                text: '我参加的'
            },
            {
                status: '1000',
                text: '我发起的'
            },
           
        ],
        gradeList: [{
                status: '20',
                text: '已报名'
            },
            {
                status: '60',
                text: '已截止'
            },
            {
                status: '70',
                text: '进行中'
            },
            {
                status: '80',
                text: '已结束'
            },
        ],
        level: '全部',
        levelList: ['全部','2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
        type: '全部',
        typeList: ['全部','单打', '双打'],
        list: [],
        last_page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    geiList() {
        this.setData({
            page: 1,
            list: []
        }, () => {
            this.get_snatch_list()
        })
    },
    onLoad(options) {
        let that = this;
        if (options.ballTyepe) {
            this.setData({
                type: options.ballTyepe == '1' ? '单打' : '双打',
            }, () => {
                if(options.status == 1000){
                    this.setData({
                        mineStatus:options.status,
                        mine:'我发起的',
                        gradeList:[{
                            status: '50',
                            text: '报名中'
                        },
                        {
                            status: '60',
                            text: '已截止'
                        },
                        {
                            status: '70',
                            text: '进行中'
                        },
                        {
                            status: '80',
                            text: '已结束'
                        },
                        ],
                        status: 50,
                        grade: '报名中',
                    })
                }
            })
        } 
        this.geiList()
       
    },
    handleDetails(e) {
        const order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/details/index?order_id=' + order_id,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
    async get_snatch_list() {
        const {
            address,
            status,
            level,
            type,
            mine,
            page
        } = this.data
        const res = await request({
            url: "/snatch_order/get_snatch_list",
            method: "get",
            data: {
                page,
                city: address,
                order_type: 1,
                order_from: mine == '我发起的' ? 'my' : 'ta',
                // status,
                ball_lev: level == '全部' ? '' : level,
                 ball_type: type == '单打' ? 1 : type == '双打' ? 2 : '',
            }
        });
        if (res.code == 200) {
            this.setData({
                last_page: res.data.last_page,
                list: [...this.data.list, ...res.data.data],
            })
        }
    },
    confirmLevel(e) {
        this.setData({
            level: e.detail.value,
            isLevel: false
        }, this.geiList())
    },
    confirmMine(e) {
        let that = this;
        this.setData({
            mine: e.detail.value.text,
            mineStatus: e.detail.value.status,
            isMine: false
        }, () => {
            let arr = []
            if (that.data.mineStatus == '2000') {
                arr = [{
                        status: '20',
                        text: '已报名'
                    },
                    {
                        status: '60',
                        text: '已截止'
                    },
                    {
                        status: '70',
                        text: '进行中'
                    },
                    {
                        status: '80',
                        text: '已结束'
                    },
                ]
            } else {
                arr = [{
                        status: '50',
                        text: '报名中'
                    },
                    {
                        status: '60',
                        text: '已截止'
                    },
                    {
                        status: '70',
                        text: '进行中'
                    },
                    {
                        status: '80',
                        text: '已结束'
                    },
                ]
            }
            that.setData({
                gradeList: arr,
                status: arr[0].status,
                grade: arr[0].text,

            }, () => {
                that.geiList()
            })
        })
    },
    confirmGrade(e) {
        this.setData({
            grade: e.detail.value.text,
            status: e.detail.value.status,
            isGrade: false
        }, this.geiList())
    },
    onClose() {
        this.setData({
            isGrade: false,
            isAddress: false,
            isLevel: false,
            isType: false,
            isMine: false
        })
    },
    handleLevel() {
        this.setData({
            isLevel: true
        })
    },
    handleAddress() {
        this.setData({
            isAddress: true
        })
    },
    handleMine() {
        this.setData({
            isMine: true
        })
    },
    handleGrade() {
        this.setData({
            isGrade: true
        })
    },
    handleType() {
        this.setData({
            isType: true
        })
    },
    confirmType(e) {
        this.setData({
            type: e.detail.value,
            isType: false
        }, this.geiList())
    },
    confirmAddress(e) {
        const address = e.detail.values;
        this.setData({
            address: address[1].name
        }, () => {
            this.onClose();
            this.geiList()
        })
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
        this.geiList()

        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        const {
            last_page,
            page
        } = this.data;
        if (last_page == page) return;
        this.setData({
            page: this.data.page += 1
        }, () => {
            this.get_snatch_list()
        })
    },

})