import { reqMenuList } from "../../utils/requset"

const state = {
    //菜单对的list
    list: []
}

const mutations = {
    //修改state
    changeList(state, arr) {
        state.list = arr
    }
}

const actions = {
    //页面请求
    reqListAction(context) {
        //  发请求
        reqMenuList().then(res => {
            context.commit("changeList", res.data.list)
        })
    }
}

const getters = {
    list(state) {
        return state.list
    }
}


export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}