<template>
  <div>
    <div id="main" class="box"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  watch: {
    list: {
      handler() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById("main"));

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: "商品分类",
          },
          tooltip: {},
          legend: {
            data: ["下级分类数量"],
          },
          xAxis: {
            data: this.list.map(item=>item.catename),
          },
          yAxis: {},
          series: [
            {
              name: "下级分类数量",
              type: "line",
              data:this.list.map(item=>item.children.length),
            },
          ],
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      deep:true,
    },
  },
  methods: {
    ...mapActions({
      reqCate: "cate/reqListAction",
    }),
  },
  mounted() {
    this.reqCate();
  },
};
</script>
<style scoped>
.box {
  width: 80%;
  height: 500px;
  border: 1px solid #ccc;
  margin: 0 auto;
}
</style>