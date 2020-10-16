<template>
  <div>
   

   <!-- 表格 -->
   <v-list @edit="edit"></v-list>

   <!-- 添加 -->
   <v-edit :info="info" ref="add"></v-edit>

  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vEdit from "./components/edit";

export default {
  props: [],
  components: {
    vList,
    vEdit
  },
  data() {
    return {
      info:{
        isshow:false,
        isAdd:true
      }
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),

    // 点击编辑
    edit(id){
       this.info.isshow=true;
       this.info.isAdd=false;

       //让组件发起获取详情的请求
       this.$refs.add.look(id);
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>
