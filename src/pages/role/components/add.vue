<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色限权">
          <!-- 树形控件 -->
          <!-- props配置 children判断是否有下一层的字段  label展示在页面上的字段
            
             -->
          <el-tree
            :data="menuList"
             show-checkbox
             node-key="id"
             ref="tree"
             default-expand-all
            :props="{children:'children',label:'title',}"
          >
          </el-tree>
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
  reqRoleAdd,
  reqRoleInfo,
  reqRoleEdit,
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
        rolename: "",
        menus: "[]",
        status: 1,
      },

    };
  },
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      //菜单的list
      reqMenuListAction: "menu/reqListAction",
      // 角色的list
      reqListAction: "role/reqListAction",
    }),

    cancel() {
      this.info.isshow = false;
    },
    //重置
    //由于form 与树控组件没有关联 form清空的时候  要把树控组件重置
    empty() {
      this.form = {
        rolename: "",
        menus: "[]",
        status: 1,
      };
      this.$refs.tree.getCheckedKeys([]);
    },
    // 弹框消失的时候
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    // 当点击了添加按钮，先获取到树形控件的数据，赋值给form，才做数据交互。
    add() {
      //树形控件取值 this.$refs.tree.getCheckedKeys()

      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.form).then((res) => {
        //成功

        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //弹窗消失
          this.cancel();
          //清空
          this.empty();

          //数据要刷新
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情一条
    look(id) {
      // 发请求
      reqRoleInfo(id).then((res) => {
        if (res.data.code == 200) {
          // form 没有id
          this.form = res.data.list;
          this.form.id = id;
          //树形控件赋值
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus))
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    edit() {
       //   点了编辑，获取到数据，赋值给form,需要补id，而且树形控件也需要赋值
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleEdit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.cancel();
          this.empty();
          this.reqRoleListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (this.menuList.length == 0) {
      this.reqMenuListAction();
    }
  },
};
</script>
<style scoped>
</style>