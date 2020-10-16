const { reqMemberList } = require("../../utils/requset")

const state={
   list:[]
}
const mutations={
    changeList(state,arr){
        state.list=arr
    }
}

const actions = {
    reqListAction(context){
        reqMemberList().then(res=>{
            context.commit("changeList",res.data.list)
        })
    }
}


const getters={
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