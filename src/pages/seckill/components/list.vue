<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
    
      <el-table-column prop="title" label="活动名称"> </el-table-column>
     

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info"></el-button>
        </template>
      </el-table-column>
      <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。 -->
      <el-table-column label="操作" width="180">
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
import { reqSeckDel } from "../../../utils/requset";

export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "seckill/list",
      size:"goods/size",
     total:"goods/total"
    }),
  },
  methods: {
    // getS(s){
    //   console.log(s);
    // },
    ...mapActions({
      reqListAction: "seckill/reqListAction",
   
    }),
    //删除
    del(id) {
      reqSeckDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
        
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改了当前页码
    changePage(e) {
      this.changePageAction(e);
    },
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
  },

  mounted() {
    this.reqListAction();
  
  },
};
</script>
<style scoped>
img{
  width: 50px;
  height: 50px;
}
</style>