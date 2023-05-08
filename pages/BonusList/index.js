import {request} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList:[
            '球星用户名', '性别', '级别', '本周积分', '获奖次数', '总奖金（元）',
        ],
        list:[
            
        ],
        end_date:'',
        start_date:''
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
        this.list()
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
    async list(){
        const res = await request({
            url: "/pk/get_bonus_week",
            method: "get",
            data:{
             
            }
           
        });
        if(res.code == 200){
            this.setData({
                 list:res.data.list,
                 end_date:res.data.end_date,
                 start_date:res.data.start_date
            })
        }
    }
})