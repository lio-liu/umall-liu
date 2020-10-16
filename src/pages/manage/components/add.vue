<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加管理员' : '编辑管理员'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
   
         <el-form-item label="所属角色">
          <el-select
            v-model="form.roleid"
            placeholder="请选择上级菜单"
          >
            <el-option label="请选择" disabled value=""></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="info.isAdd" type="primary" @click="add"
          >添加</el-button
        >
        <el-button v-else type="primary" @click="edit">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import {
  reqManageAdd,
  reqManageInfo,
  reqManageEdit,
} from "../../../utils/requset";
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
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },

      icons: [
        "el-icon-s-tools",
        "el-icon-star-on",
        "el-icon-s-goods",
        "el-icon-s-order",
      ],
    };
  },
  computed: {
    ...mapGetters({
      roleList: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      //管理员的list
      reqManageListAction: "manage/reqListAction",
      // 角色的list
      reqRoleListAction: "role/reqListAction",

       reqTotalAction:"manage/reqTotalAction",
    }),

    cancel() {
      this.info.isshow = false;
    },
    //重置
    //由于form 与树控组件没有关联 form清空的时候  要把树控组件重置
    empty() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    // 弹框消失的时候
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    add() {
      reqManageAdd(this.form).then((res) => {
        //成功

        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //弹窗消失
          this.cancel();
          //清空
          this.empty();

          //数据要刷新
          this.reqManageListAction();
          
          //重新获取总数
          this.reqTotalAction()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情一条
    look(uid) {
      // 发请求
      //   点了编辑，获取到数据，赋值给form,需要补id，而且树形控件也需要赋值
      reqManageInfo(uid).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //   密码是加密过的  需要清空
          this.form.password = "";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    edit() {
      reqManageEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqManageListAction();

        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (this.roleList.length == 0) {
      this.reqRoleListAction();
    }
  },
};
</script>
<style scoped>
</style>