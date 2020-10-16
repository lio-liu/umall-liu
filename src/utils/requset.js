import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import store from "../store"
import {warningAlert} from "./alert"
import router from "../router"
Vue.prototype.$imgPre = "http://localhost:3000"
let baseUrl = '/api'


// 打包的时候
// Vue.prototype.$imgPre=""
// let baseUrl = ''


//请求拦截  后台 app.js 后端登录拦截打开
axios.interceptors.request.use(req => {
    // console.log("---请求拦截----");
    // console.log(req);
    if (req.url != baseUrl + "/api/userlogin") {
        req.headers.authorization = store.state.userInfo.token;
    }
    return req;
})


//响应拦截
axios.interceptors.response.use(res => {
    console.group("=====本次请求路径是:" + res.config.url)
    console.log(res);
    console.groupEnd()
   
    //用户掉线了
    if(res.data.msg=='登录已过期或访问权限受限'){
        warningAlert(res.data.msg)
        router.push("/login")
    }

    return res;
})


//添加
export const reqMenuAdd = (params) => {
    return axios({
        url: baseUrl + '/api/menuadd',
        method: 'post',
        data: qs.stringify(params)
    })
}

//获取列表
export const reqMenuList = () => {
    return axios({
        url: baseUrl + '/api/menulist',
        method: 'get',
        params: {
            istree: true
        }
    })
}


// 删除
export const reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({ id: id })
    })
}


// 获取一条
export const reqMenuDetail = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: 'get',
        params: {
            id: id
        }
    })
}

//修改
export const reqMenuUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: 'post',
        data: qs.stringify(params)
    })
}

//------------角色管理

//1 角色添加
export const reqRoleAdd = (params) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: 'post',
        data: qs.stringify(params)
    })
}

//2 角色列表
export const reqRoleList = () => {
    return axios({
        url: baseUrl + '/api/rolelist',
        method: 'get'
    })

}


//3 角色获取一条
export const reqRoleInfo = (id) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: 'get',
        params: {
            id: id
        }
    })
}


//4 角色修改

export const reqRoleEdit = (params) => {
    return axios({
        url: baseUrl + '/api/roleedit',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 5 角色删除
export const reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}


// ----------------管理员管理

// 1 管理员添加
export const reqManageAdd = (params) => {
    return axios({
        url: baseUrl + '/api/useradd',
        method: 'post',
        data: qs.stringify(params)
    })
}

//2 管理员总数
export const reqManageCount = () => {
    return axios({
        url: baseUrl + '/api/usercount',
        method: 'get'
    })
}

//3 管理员列表  params:{size:2,page:1}
export const reqManageList = (params) => {
    return axios({
        url: baseUrl + '/api/userlist',
        method: 'get',
        params: params
    })
}

//4 管理员获取一条
export const reqManageInfo = (uid) => {
    return axios({
        url: baseUrl + '/api/userinfo',
        method: 'get',
        params: {
            uid: uid
        }
    })
}

//5 管理员修改
export const reqManageEdit = (params) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: 'post',
        data: qs.stringify(params)
    })
}


//6 管理员删除
export const reqManageDel = (uid) => {
    return axios({
        url: baseUrl + '/api/userdelete',
        method: 'post',
        data: qs.stringify({ uid: uid })

    })
}


//管理员登录
export const reqLogin = (params) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: params
    })
}





//----------商品分类

//商品分类添加
//参数中带有文件需要使用FormDate
// params={pid:1,catename:"123",img:File,state:1}
export const reqCateAdd = (params) => {
    let data = new FormData()
    //data.append("pod",1)
    // data.append("catename","123")
    // data.append("img",File)
    // data.append("status",1)
    for (let i in params) {
        data.append(i, params[i])
    }

    return axios({
        url: baseUrl + "/api/cateadd",
        method: 'post',
        data: data
    })

}

//商品分类列表
export const reqCateList = (params) => {
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params: params

    })
}

//商品分类获取一条
export const reqCateInfo = (id) => {
    return axios({
        url: baseUrl + '/api/cateinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}





//修改
export const reqCateEdit = (params) => {
    let data = new FormData()
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: data
    })

}

//删除
export const reqCateDel = (id) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}

// -----------商品规格
//1添加
export const reqSpecsAdd = (params) => {
    return axios({
        url: baseUrl + '/api/specsadd',
        method: 'post',
        data: qs.stringify(params)
    })
}

// 2总数
export const reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "get"
    })
}

//  3列表分页
export const reqSpecsList = (params) => {
    return axios({
        url: baseUrl + "/api/specslist",
        method: "get",
        params: params
    })
}
//删除
export const reqSpecsDel = (id) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify({ id: id })
    })
}

//1条
export const reqSpecsInfo = (id) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

//修改
export const reqSpecsEdit = (params) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(params)
    })
}


//------------商品管理

//商品添加
export const reqGoodsAdd = (params) => {
    let data = new FormData()
    for (let i in params) {
        data.append(i, params[i])
    }

    return axios({
        url: baseUrl + "/api/goodsadd",
        method: 'post',
        data: data
    })

}


//商品总数
export const reqGoodsCount = () => {
    return axios({
        url: baseUrl + '/api/goodscount',
        method: 'get'
    })
}


//商品列表(分页)
export const reqGoodsList = (params) => {
    return axios({
        url: baseUrl + "/api/goodslist",
        method: 'get',
        params: params
    })
}

//商品获取一条
export const reqGoodsDetail = (id) => {
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}


//商品修改 
export const reqGoodsUpdate = (params) => {
    let data = new FormData()
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data: data
    })
}


//商品删除
export const reqGoodsDel = (id) => {
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}


//----------------会员管理
// 会员列表
export const reqMemberList = () => {
    return axios({
        url: baseUrl + '/api/memberlist',
        method: "get"
    })
}


// 会员获取一条
export const reqMemberDetail = (id) => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: 'get',
        params: {
            uid: id
        }
    })
}


//会员修改
export const reqMemberUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/memberedit",
        method: 'post',
        data: qs.stringify(params)
    })
}


//------------轮播图管理
//轮播图添加
export const reqBannerAdd = (params) => {
    let data = new FormData()
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: data
    })
}


// 轮播图列表
export const reqBannerList = () => {
    return axios({
        url: baseUrl + '/api/bannerlist',
        method: 'get'
    })
}


// 轮播图获取一条
export const reqBannerDetail = (id) => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: 'get',
        params: {
            id: id
        }
    })
}


//轮播图修改
export const reqBannerUpdate = (params) => {
    let data = new FormData()
    for (let i in params) {
        data.append(i, params[i])
    }
    return axios({
        url: baseUrl + '/api/banneredit',
        method: 'post',
        data: data
    })
}

//轮播图删除
export const reqBannerDel = (id) => {
    return axios({
        url: baseUrl + '/api/bannerdelete',
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}




//--------------秒杀活动管理


//添加
export const reqSeckAdd = (params) => {
    return axios({
        url: baseUrl + "/api/seckadd",
        method: "post",
        data: qs.stringify(params)
    })
}

//列表
export const reqSeckList = () => {
    return axios({
        url: baseUrl + "/api/secklist",
        method: 'get'

    })
}

// 获取一条
export const reqSeckDetail = (id) => {
    return axios({
        url: baseUrl + '/api/seckinfo',
        method: 'get',
        params: {
            id: id
        }
    })
}

//修改
export const reqSeckUpdate = (params) => {
    return axios({
        url: baseUrl + "/api/seckedit",
        method: "post",
        data: qs.stringify(params)
    })
}


//删除
export const reqSeckDel = (id) => {
    return axios({
        url: baseUrl + '/api/seckdelete',
        method: 'post',
        data: qs.stringify({
            id: id
        })
    })
}