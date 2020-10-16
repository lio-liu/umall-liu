<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="手机">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.passward"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="info.isAdd" type="primary" 
          >添加</el-button
        >
        <el-button v-else type="primary" @click="edit">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import {  reqMemberDetail, reqMemberUpdate} from "../../../utils/requset";
import { successAlert, warningAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      //   defaultProps: {
      //     children: "children",
      //     label: "title",
      //   },

      form: {
        phone: "",
        nickname: "",
        passward: '',
      },
    };
  },
  computed: {
    ...mapGetters({
   
    }),
  },
  methods: {
    ...mapActions({
      //菜单的list
   
      // 角色的list
      reqListAction: "member/reqListAction",
    }),

    cancel() {
      this.info.isshow = false;
    },
    //重置
    //由于form 与树控组件没有关联 form清空的时候  要把树控组件重置
    empty() {
      this.form = {
         phone: "",
        nickname: "",
        passward: '',
      };
      //   this.$refs.tree.getCheckedKeys([]);
    },
    // 弹框消失的时候
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    // // 当点击了添加按钮，先获取到树形控件的数据，赋值给form，才做数据交互。
    // add() {
    //   //树形控件取值 this.$refs.tree.getCheckedKeys()

    //   //   this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
    //   reqRoleAdd(this.form).then((res) => {
    //     //成功

    //     if (res.data.code == 200) {
    //       successAlert(res.data.msg);
    //       //弹窗消失
    //       this.cancel();
    //       //清空
    //       this.empty();

    //       //数据要刷新
    //       this.reqListAction();
    //     } else {
    //       warningAlert(res.data.msg);
    //     }
    //   });
    // },
    //获取菜单详情一条
    look(id) {
      // 发请求
      //   点了编辑，获取到数据，赋值给form,需要补id，而且树形控件也需要赋值
      reqMemberDetail(id).then((res) => {
        if (res.data.code == 200) {
          // form 没有id
          this.form = res.data.list;
          this.form.uid = id;
          //树形控件赋值
        //   this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    edit() {
      reqMemberUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {

  },
};
</script>
<style scoped>
</style>