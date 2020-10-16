<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="角色编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称"> </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info"></el-button>
        </template>
      </el-table-column>
      <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- 引入删除组件 -->
          <del-btn @confirm="del(scope.row.id)"></del-btn>
          <!-- 查看scope -->
          <!-- <button @click="getS(scope)">get scope</button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqRoleDel } from "../../../utils/requset";

export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "role/list",
    }),
  },
  methods: {
    // getS(s){
    //   console.log(s);
    // },
    ...mapActions({
      reqRoleListAction: "role/reqListAction",
    }),
    //删除
    del(id) {
      reqRoleDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqRoleListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },

    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
  },

  mounted() {
    this.reqRoleListAction();
  },
};
</script>
<style scoped>
</style>