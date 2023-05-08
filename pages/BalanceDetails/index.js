import {request} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance:0,
        list:[],
        page:1,
        type_map:[],
        last_page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onReady() {
       
    },
    onWithdrawal() {
        if (this.data.balance < 0.1) {
            wx.showToast({
                title: '低于0.1不能提现',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/withdrawal/index?type=balance',
        })
      
    },
    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        let obj = res.data;
        this.setData({
            balance:obj.balance || 0,
        })
        this.setData({
            page:1,
            list:[]
        },() => {
            this.get_balance_list()
        })
       
    },
    handleRefresher(){
        console.log('111')
        const {
            last_page,
            page
        } = this.data;
        if (last_page == page) return;
        this.setData({
            page: this.data.page += 1
        }, () => {
            this.get_balance_list()
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
        this.onShow()
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },
    async get_balance_list(){
        const res = await request({
            url: "/admin/get_balance_list",
            method: "GET",
            data: {
               page:this.data.page
            }
        });
       if(res.code == 200) {
           this.setData({
               last_page:res.data.list.last_page,
               type_map:res.data.type_map,
               list: [...this.data.list, ...res.data.list.data],
           })
       }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },


})