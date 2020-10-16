<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加商品规格' : '编辑商品规格'"
      :visible.sync="info.isshow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>

        <el-form-item
          label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
        >
          <div class="con">
            <div class="input-warp">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index == 0" @click="addAttr"
              >新增规格属性</el-button
            >
            <el-button type="danger" v-else @click="del(index)">删除</el-button>
          </div>
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
  reqSpecsAdd,
  reqSpecsInfo,
  reqSpecsEdit,
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
      attrArr: [{ value: "" }, { value: "" }],

      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",

      reqTotalAction: "specs/reqTotalAction",
    }),

    cancel() {
      this.info.isshow = false;
    },
    // 添加
    addAttr() {
      this.attrArr.push({ value: "" });
    },

    //删除
    del(index) {
      this.attrArr.splice(index, 1);
    },

    //重置
    //由于form 与树控组件没有关联 form清空的时候  要把树控组件重置
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
      this.attrArr = [{ value: "" }, { value: "" }];
    },
    // 弹框消失的时候
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    //验证数据是否合格
    checkedData() {
      //验证规格名称
      if (this.form.specsname == "") {
        warningAlert("规格名称不能为空");
        return false;
      }

      //验证每一个属性值都不能为空
      if (this.attrArr.some((item) => item.value == "")) {
        warningAlert("所有的属性值都必填");
        return false;
      }
      return true
    },


    add() {

      if(!this.checkedData()){
       return;
      }
      //   [{ value: "s" }, { value: "l" }, { value: "xl" }]-- - map-- > ["s", "l", "xl"];
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsAdd(this.form).then((res) => {
        //成功

        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //弹窗消失
          this.cancel();
          //清空
          this.empty();

          //数据要刷新
          this.reqListAction();

          //重新获取总数
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取菜单详情一条
    look(id) {
      //发请求
      reqSpecsInfo(id).then((res) => {
        if (res.data.code == 200) {
          //这个时候form是没有id的
          this.form = res.data.list[0];
          //'['s','l','m']'--->[{value:'s'},{value:'l'},{value:'m'}]
          this.attrArr = JSON.parse(this.form.attrs).map((item) => ({
            value: item,
          }));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改
    edit() {
      
      if(!this.checkedData()){
       return
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsEdit(this.form).then((res) => {
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
  mounted() {},
};
</script>
<style scoped>
.con {
  display: flex;
}
.input-warp {
  flex: 1;
}
</style>