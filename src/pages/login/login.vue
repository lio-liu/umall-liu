<template>
  <div class="login">
    <div class="box">
      <h3 class="center">登录</h3>
      <div class="line">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </div>
      <div class="line">
        <el-input
          placeholder="请输入密码"
          v-model="form.password"
          show-password
        ></el-input>
      </div>
      <div class="line center">
        <el-button type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import{reqLogin} from "../../utils/requset"
import { mapGetters, mapActions } from "vuex";
import {successAlert,warningAlert} from "../../utils/alert"
export default {
  props: [],
  components: {},
  data() {
    return {
      form:{
        username:'',
        password:''
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeUserInfoAction:"changeUserInfoAction"
    }),

    login(){
     reqLogin(this.form).then(res=>{
       if(res.data.code==200){
       successAlert("登录成功")
       this.changeUserInfoAction(res.data.list)
       this.$router.push("/")
       }else{
         warningAlert(res.data.msg)
       }
     })
    }
  },
  mounted() {},
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #553443, #303d60);
  position: relative;
}

.box{
    width: 400px;
    padding: 30px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    position: absolute;
    background-color: #fff;
    border-radius: 20px;
}

.center{
    text-align: center;
}
.line{
    padding-top: 30px;
}
</style>