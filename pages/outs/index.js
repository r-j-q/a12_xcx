import {
    request
} from '../../request/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_id: '',
        pk_type: 10,
        isScore: false,
        arr: [],
        a_souce: '',
        isNum:false,
        b_souce: '',
        member_list: [],
        member_id: '',
        pk_map: {},
        skip_list: [],
        area_num:'',
        tabs: [
            {
                name: '淘汰赛',
                pk_type: 10,
            },
            {
                name: '附加赛1',
                pk_type: 15,
            },
            {
                name: '附加赛2',
                pk_type: 16,
            },
           
            {
                name: '半决赛',
                pk_type: 30,
            },

            {
                name: '附加赛',
                pk_type: 35,
            },
            {
                name: '决赛',
                pk_type: 40,
            }
        ],
        member_lev:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options && options.order_id) {
            this.setData({
                order_id: options.order_id
            }, () => {
                this.detail()
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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
            member_lev: obj.member_lev.find( e => e == 4),
            member_id:wx.getStorageSync('member_id')
        })
    },
    async detail() {
        let that =this;
        const res = await request({
            url: "/pk/get_battle_array",
            method: "get",
            data: {
                order_id: this.data.order_id,
            }
        });
        if (res.code && res.data.pk_map) {
            this.setData({
                member_list: res.data.member_list,
                pk_type:that.data.pk_type || 10,
                pk_map: res.data.pk_map,
                skip_list: res.data.skip_list,
            }, () => {
                if ((this.data.pk_map[10].length + this.data.skip_list.length) > 4) {
                    let tabs = [{
                            name: '淘汰赛',
                            pk_type: 10,
                        },
                        {
                            name: '附加赛1',
                            pk_type: 15,
                        },
                        {
                            name: '附加赛2',
                            pk_type: 16,
                        },
                        {
                            name: '附加赛',
                            pk_type: 20,
                        },
                        {
                            name: '半决赛',
                            pk_type: 30,
                        },
                        {
                            name: '附加赛',
                            pk_type: 35,
                        },
                        {
                            name: '决赛',
                            pk_type: 40,
                        }
                    ]
                    this.setData({
                        tabs,
                    })
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.memberInfo()
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
        this.detail()
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },
    onResult() {
        wx.navigateTo({
            url: '/pages/result/index?order_id=' + this.data.order_id,
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
    handleTabclick(e) {
        const pk_type = e.currentTarget.dataset.pk_type;
        if (this.data.pk_type == pk_type) return;
        this.setData({
            pk_type,
        })
    },
    bindarea_num(e){
        let area_num = e.detail.value;
        this.setData({
            area_num,
        })
    },
    bindAsouce(e) {
        let a_souce = e.detail.value;
        this.setData({
            a_souce,
        })
    },
    bindBsouce(e) {
        let b_souce = e.detail.value;
        this.setData({
            b_souce,
        })
    },
    showSouce(e) {
        const arr = e.currentTarget.dataset.item;
        this.setData({
            arr,
            isScore: true
        })
    },
    showAreaNum(e){
        const arr = e.currentTarget.dataset.item;
        this.setData({
            serial_num:e.currentTarget.dataset.item[0].serial_num,
            arr,
                isNum:true
        })
    },
    cnacelShow(){
        this.setData({
            isScore: false,
            area_num:"",
            isNum:false,
            a_souce: '',
            b_souce: ''

        })
    },
    async onSure(e) {
        const arr = e.currentTarget.dataset.item;
        let data = {
            serial_num: arr[0].serial_num,
            characteristic: arr.find(e => e.member_id == this.data.member_id).characteristic,
            id: arr.find(e => e.member_id == this.data.member_id).id
        }
        const res = await request({
            url: "/pk/affirm_score",
            method: "POST",
            data: data
        });
        if (res.code == 200) {
            wx.showToast({
                title: '确认成功',
                icon: 'none'
            })
            this.detail()            
        }

    },
    async handleNume(){
        const {
            area_num,
            serial_num,
        } = this.data;
  
        if ( area_num == ''  ) {
            wx.showToast({
                title: '请上传正确的编号',
                icon: "none"
            })
            return;
        }

        const res = await request({
            url: "/administrators/update_pk_info",
            method: "POST",
            data: {
                area_num,
                serial_num,
            },
        });

        if (res.code == 200) {
            wx.showToast({
                title: '录入成功',
                icon: 'none'
            })
            this.detail()
            this.setData({
                isNum: false,
                area_num: '',
            })

        }
    },
    async handleSouce() {
        const {
            a_souce,
            b_souce
        } = this.data;
        let item = this.data.arr;
        console.log(item)
        if (a_souce == '' || b_souce == '' || a_souce == b_souce ) {
            wx.showToast({
                title: '请上传正确的比分',
                icon: "none"
            })
            return;
        }

        const res = await request({
            url: "/pk/set_score",
            method: "POST",
            data: {
                serial_num: item[0].serial_num,
                score_map: JSON.stringify([{
                    member_id: item[0].member_id,
                        score: a_souce,
                    },
                    {
                        member_id: item[1].member_id,
                        score: b_souce,
                    },
                ], )

            },
        });

        if (res.code == 200) {
            wx.showToast({
                title: '录入成功',
                icon: 'none'
            })
            this.detail()
            this.setData({
                isScore: false,
                a_souce: '',
                b_souce: ''

            })

        }
    }

})


