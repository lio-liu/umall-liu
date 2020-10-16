import { reqSpecsList, reqSpecsCount } from "../../utils/requset"

const state = {
    list: [],
    size: 2,
    total: 5,
    page: 1
}

const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr
    },
    //修改total 
    changeTotal(state, num) {
        state.total = num;
    },

    //修改页码
    changePage(state, page) {
        state.page = page
    }

}

const actions = {
    //页面请求
    reqListAction(context,bool) {

        let params= bool?{}: { page: context.state.page, size: context.state.size }
          
        //发请求
        reqSpecsList(
           params
        ).then(res => {
            let list = res.data.list ? res.data.list : []
            //如果取到的的数据是null，并且不是第一页，那么就页码减一 重新请求list
            if(context.state.page>1&&list.length==0){
                context.commit("changePage",context.state.page-1)
                context.dispatch('reqListAction')
                return
            }

            list.forEach(item=>{
                item.attrs=JSON.parse(item.attrs)
            })
            context.commit("changeList", list)
        })
    },
    
    //获取总数的请求
    reqTotalAction(context) {
        reqSpecsCount().then(res => {
            context.commit("changeTotal", res.data.list[0].total)
        })
    },

    //组件修改了页码
    changePageAction(context, page) {
        //修改页码
        context.commit("changePage", page)
        //发起list请求
        context.dispatch('reqListAction')
    }
}


const getters = {
    list(state) {
        return state.list
    },
    size(state) {
        return state.size
    },
    total(state) {
        return state.total;
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}