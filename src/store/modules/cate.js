import { reqCateList } from "../../utils/requset"

const state = {
    list:[]
}

const mutations = {
   changeList(state,arr){
       state.list = arr
   }
}

const actions = {
    reqListAction(context){
    //    发请求
    reqCateList({istree:true}).then(res=>{
        let list=res.data.list?res.data.list:[]
        context.commit("changeList",list)
    })

    }
}


const getters = {
    list(state){
        return state.list
    }
}


export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}