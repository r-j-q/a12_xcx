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
        city: '北京市',
        areaList,
        key_word: '',
        tabs: [ '报名中', '已开训', '已结束'],
        currentIndex: 0,
        status:50,
        list:[],
        page:1,
        last_page:1,
        member_lev:''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onAbount(){
        if(!wx.getStorageSync('token')){
            wx.navigateTo({
              url: '/pages/login/index',
            })
            return;
        }
        if(wx.getStorageSync('name') == ''){
            wx.navigateTo({
              url: '/pages/personal/index',
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/cultivate/index',
        })
    },
    async memberInfo() {
        if (!wx.getStorageSync('member_id')) return;
        const res = await request({
            url: "/member/get_member_info",
            method: "GET",
            data: {
                member_id: wx.getStorageSync('member_id')
            }
        });
        let obj = res.data;
        this.setData({
            member_lev:  obj.member_lev.find( e => e == 2)
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
    onShow() {
        this.setData({
            list:[],
            page:1
        },() => {
            this.onList()
            this.memberInfo()
        })    
    },
    onSearch(){
        this.onShow()
    },
    async onList() {
        const {
            page,
            city,
            key_word,
            currentIndex,
        } = this.data;
        const res = await request({
            url: "/order/get_order_list",
            method: "GET",
            data: {
                page,
                city,
                key_word,
                ball_type:'',
                order_type:2,
                status:  currentIndex == 0 ? "50" : currentIndex == 1 ? "70" : "80",
            }
        });
        if (res.code == 200) {
            this.setData({
                last_page: res.data.last_page,
                list: [...this.data.list, ...res.data.data],
            })
        }
    },
    handleTabclick(e) {
        const currentIndex = e.currentTarget.dataset.index;
        if (this.data.currentIndex == currentIndex) return;
        this.setData({
            currentIndex,
            page:1,
            list:[]
        },() =>{
            this.onList()
        })
    },
    handleDetils(e){
        const order_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/trainDetails/index?order_id=' + order_id ,
        })
    },
    //选择位置
    handleAddress() {

        this.setData({
            isAddress: true
        })
    },
    cancel() {
        this.setData({
            isAddress: false
        })


    },
    confirm(e) {
        const city = e.detail.values;
        this.setData({
            city: city[1].name,
            page:1,
            list:[]
        }, () => {
            this.cancel();
            this.onList()
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
        this.setData({
            page: 1,
            list: []
        }, () => {
            this.onList()
            setTimeout(() => {
                wx.stopPullDownRefresh();
            }, 1000)
        })
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
            this.onList()
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})