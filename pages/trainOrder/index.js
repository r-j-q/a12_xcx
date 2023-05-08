import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ['待支付', '进行中', '已结束', '已取消'],
        currentIndex: 1,
        list: [

        ],
        status:70,
        page:1,
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
    async get_snatch_list() {
        const {
            page,
            currentIndex
        } = this.data;
        let arr = [10,70,80,0]
        const res = await request({
            url: "/snatch_order/get_snatch_list",
            method: "get",
            data: {
                page,
                order_type: 2,
                status:arr[currentIndex],
            }
        });
        if (res.code == 200) {
            this.setData({
                last_page: res.data.last_page,
                list: [...this.data.list, ...res.data.data],
            })
        }
    },
    handleDetils(e){
        const order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/trainDetails/index?order_id=' + order_id ,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            page: 1,
            list: []
        }, () => {
            this.get_snatch_list()
        })
    },
    handleTabclick(e) {
        const currentIndex = e.currentTarget.dataset.index;
        if (this.data.currentIndex == currentIndex) return;

        this.setData({
            currentIndex,
            page:1,
            list:[]
        },() => {
            this.get_snatch_list()
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
        let that = this;
        that.setData({
            page: 1,
            list: []
        }, () => {
            that.get_snatch_list()
          
        })
        wx.stopPullDownRefresh();
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