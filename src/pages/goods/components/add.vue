<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="info.isshow"
      @closed="close"
      @opened="opened"
    >
      <el-form ref="form" :model="form" label-width="80px">
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
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt="" />
            <input class="my-input" type="file" @change="getFile" />
          </div>
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品属性">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in goodsAttrsList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>

        <el-form-item label="商品描述">
          <!-- <textarea v-model="form.description" cols="30" rows="10"></textarea> -->
          <!-- 富文本 -->
          <div v-if="info.isshow" id="editor"></div>
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
import E from "wangeditor";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate,
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
      //商品属性的list
      goodsAttrsList: [],

      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      },
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
      reqListAction: "goods/reqListAction",
      reqTotalAction: "goods/reqtotalAction",
    }),

    opened() {
      this.editor = new E("#editor");
      this.editor.create();
      //编辑器创建完成之后再赋值
      this.editor.txt.html(this.form.description)
    },

    //一级分类修改的时候
    changeSpecs() {
      //二级分类的值先置空
      this.form.specsattr = [];
      this.getAttrsArr();
    },

    getAttrsArr() {
      //查看打印的specslist 发现自带的attr
      //找到 specslist中的一条数据id 和当前选中的this.form.specsid相同的就是当前的属性
      let arr = this.specsList.find((item) => item.id == this.form.specsid);
      this.goodsAttrsList = arr.attrs;
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
      this.imgUrl = "";

      //二级分类的list
      this.secondCateList = [];
      //商品属性的list
      this.goodsAttrsList = [];

      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
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
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      this.form.description = this.editor.txt.html();
      reqGoodsAdd(data).then((res) => {
        //成功
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //弹窗消失
          this.cancel();
          //清空
          this.empty();
          // //数据要刷新
          this.reqListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情一条
    look(id) {
      // 发请求
      reqGoodsDetail(id).then((res) => {
        if (res.data.code == 200) {
          // form 没有id
          this.form = res.data.list;
          this.form.id = id;

          this.getAttrsArr();
          this.getSecondList();

          this.imgUrl = this.$imgPre + this.form.img;

          this.form.specsattr = JSON.parse(this.form.specsattr);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    update() {
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      this.form.description = this.editor.txt.html();
      reqGoodsUpdate(data).then((res) => {
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