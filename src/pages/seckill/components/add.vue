<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加活动' : '编辑活动'"
      :visible.sync="info.isshow"
      @closed="close"
    
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              v-model="value"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="conTime"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeSecond">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in thirdCateList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <el-button v-else type="primary" @click="update">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsList,
  reqSeckAdd,
  reqSeckDetail,
  reqSeckUpdate,
} from "../../../utils/requset";
import { successAlert, warningAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  components: {},
  data() {
    return {
      imgUrl: "",
      //二级分类的list
      secondCateList: [],
      //三级分类的list
      thirdCateList: [],
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        goodsname: "",
        title: "",
        status: 1,
        begintime: "",
        endtime: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqListAction",
      reqSpecsList: "specs/reqListAction",
      reqListAction: "seckill/reqListAction",
    }),
    //转换事件
    conTime() {
      this.form.begintime = this.value[0].getTime();
      this.form.endtime = this.value[1].getTime();
      console.log(this.form.begintime, this.form.endtime);
    },

   
    //一级分类修改的时候
    changeFirst() {
      //二级分类的值先置空
      this.form.second_cateid = "";
      this.getSecondList();
    },
    //获得二级分类list
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        //二级分类list
        this.secondCateList = res.data.list;
      });
    },

    //二级分类修改的时候
    changeSecond() {
      this.form.goodsid = "";
      this.getThirdList();
    },
    getThirdList() {
      reqGoodsList({ fid: this.form.second_cateid }).then((res) => {
        this.thirdCateList = res.data.list.filter(
          (item) => this.form.second_cateid == item.second_cateid
        );
      });
    },

    //验证图片
    //获取图片
    getFile(e) {
      let file = e.target.files[0];

      //1.大小不超过2M 1M=1024KB
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件不能超过2M");
        return;
      }
      //图片
      let imgExtArr = [".jpg", ".png", ",jpeg", ".gif"];
      let extname = file.name.slice(file.name.lastIndexOf("."));
      if (!imgExtArr.some((item) => item == extname)) {
        warningAlert("格式不正确");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },

    cancel() {
      this.info.isshow = false;
    },
    //重置
    empty() {
      //二级分类的list
      this.secondCateList = [];
      //三级分类的list
      this.thirdCateList = [];
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        goodsname: "",
        title: "",
        status: 1,
        begintime: "",
        endtime: "",
      };

      this.value = [];
    },
    // 弹框消失的时候
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    add() {
      reqSeckAdd(this.form).then((res) => {
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
      reqSeckDetail(id).then((res) => {
        if (res.data.code == 200) {
          // form 没有id
          this.form = res.data.list;
          this.form.id = id;
          this.value = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime)),
          ];
          this.getSecondList();
          this.getThirdList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      reqSeckUpdate(this.form).then((res) => {
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
    if (this.cateList.length == 0) {
      this.reqCateList();
    }

    //商品规格做了分页，需要获取的所有的数据时，加一个参数 到store/specs.js中做判断
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}
.my-upload h3 {
  text-align: center;
  line-height: 150px;
  font-size: 30px;
  font-weight: 400;
}
.my-upload .my-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}
.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>