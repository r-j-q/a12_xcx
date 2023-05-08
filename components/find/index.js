import {
    request
} from '../../request/index.js';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type:'',
    },

    /**
     * 组件的初始数据
     */
    data: {
        key_word: '',
        real_name:'',
        ball_lev:'',
        portrait:'',
        member_id:'',
        list:[],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async onSearch() {
            if(!this.data.key_word) return;
            const res = await request({
                url: "/member/search_member_list",
                method: "GET",
                data: {
                    key_word:this.data.key_word,
                }
            });
            if(res.code == 200 && res.data.length > 0){
                this.setData({
                    list:res.data
                })
                // const {real_name,ball_lev,member_id,portrait} = res.data;
                // this.setData({
                //     real_name,
                //     ball_lev,
                //     portrait,
                //     teammate_id:member_id
                // })
            }
        },
        cancel(){
            this.setData({
                member_id:''
            },() => {
                this.triggerEvent('myevent')
            })
        },
        onMemberid(e){
            const id = e.currentTarget.dataset.id;
            if(id == this.data.member_id ) return;
            this.setData({
                member_id:id
            })
        },
        onCancel(){
            if(this.data.member_id == '') {
                wx.showToast({
                    title: '请选择一个队友',
                    icon:'none'
                  })
                  return
            }
            if(this.data.member_id == wx.getStorageSync('member_id') ){
                wx.showToast({
                  title: '不能选择自己为队友',
                  icon:'none'
                })
                return
            }
            if(this.data.ball_lev && this.data.ball_lev !== this.data.type ){
                wx.showToast({
                  title: '等级不符',
                  icon:'none'
                })
                return
            }
            this.setData({
                real_name:''
            },() => {
                this.triggerEvent('myevent',{
                    teammate_id: this.data.member_id ||'',
                  })
            })
        },
       
    }
})