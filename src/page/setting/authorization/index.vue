<template>
  <div class="hhcontainer">
    <div class="title" :style="{ backgroundColor: flag ? '#008C00' : '#ff0000' }">{{ ma }}</div>
    <el-form
      ref="form"
      label-width="120px"
      style="border: 1px solid #000; background-color: #313439"
    >
      <div class="xqxx ttt" style="padding-top: 10px">需求信息填写</div>
      <el-form-item label="最大用户数">
        <el-input v-model="num"></el-input>
      </el-form-item>
      <el-form-item label="申请授权至">
        <el-col>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="date"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <div class="s">
        <el-button type="primary" style="margin-bottom: 10px" @click="onSubmit1"
          >立即申请</el-button
        >
      </div>
    </el-form>
    <el-form
      ref="form"
      label-width="120px"
      style="
        border: 1px solid #000;
        background-color: #313439;
        margin-top: 200px;
      "
    >
      <div class="xqxx ttt" style="padding-top: 10px">激活授权</div>
      <el-form-item label="CDkey填写">
        <el-input v-model="key"></el-input>
      </el-form-item>
      <div class="s">
        <el-button type="primary" @click="onSubmit2" style="margin-bottom: 10px"
          >立即激活</el-button
        >
      </div>
    </el-form>
    <el-dialog
      title="请将如下激活码复制并告知管理员"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span class="scs">{{ res }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: "",
      date: "",
      key: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      dialogVisible: false,
      res: null,
      ma: null,
      flag: false,
    };
  },
  created() {
    this.instance({
      method: "get",
      url: "/License/CheckState",
    }).then((res) => {
      console.log(res);
      if (res.data.code == "1") {
        this.ma =
          "授权至：" +
          res.data.result.expiretime +
          " 最大用户数: " +
          res.data.result.devicelimit;
        this.flag = true;
      } else {
        this.ma = "系统未授权或设备超限，请联系管理员";
        this.flag = false;
      }
    });
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    onSubmit1() {
      let that = this;
      let d = this.date;
      const resDate =
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate()) +
        " " +
        this.p(d.getHours()) +
        ":" +
        this.p(d.getMinutes()) +
        ":" +
        this.p(d.getSeconds());
      console.log(resDate);
      console.log({ ExpireTime: resDate, DeviceLimit: this.num });
      this.instance({
        method: "post",
        url: "/License/Generate",
        data: { ExpireTime: resDate, DeviceLimit: this.num },
      }).then((res) => {
        console.log(res);
        if (res.data.code == "1") {
          that.res = res.data.result;
          that.dialogVisible = true;
        }
      });
    },
    onSubmit2() {
      console.log("submit!");
      this.instance({
        method: "post",
        url: "/License/Cdkey/Upload",
        data: { CdKey: this.key },
      }).then((res) => {
        this.$message(res.data.message);
        this.instance({
          method: "get",
          url: "/License/CheckState",
        }).then((res) => {
          console.log(res);
          if (res.data.code == "1") {
            this.ma =
              "授权至：" +
              res.data.result.expiretime +
              " 最大用户数: " +
              res.data.result.devicelimit;
            this.flag = true;
          } else {
            this.ma = "系统未授权或用户数超限，请联系管理员";
            this.flag = false;
          }
        });
      });
    },
  },
};
</script>
<style>
.el-input__inner {
  color: #fff !important;
}
#elsel span {
  color: #333 !important;
}
.el-dialog {
  background-color: #313439 !important;
}
/* .el-input input {
    color: #fff !important;
  } */
label {
  color: #fff !important;
}
.el-dialog__wrapper,
.el-dialog .el-dialog--small,
.el-dialog__header,
.el-dialog__title {
  color: #fff;
}
.el-dialog__wrapper,
.el-dialog .el-dialog--small,
.el-dialog__body,
.el-form,
.el-form-item,
.el-form-item__content,
.el-input,
.el-input__inner {
  color: #fff;
}
.el-date-picker__header-label {
  color: #48576a;
}
.el-input input {
  color: #fff;
}
.title,
.xqxx {
  justify-content: center;
  text-align: center;
  align-items: center;
  padding-bottom: 30px;
  font-size: 30px;
}
.ttt {
  background-color: #222428;
}
.title {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 1px solid #4e545a;
  border-radius: 15px;
}
.s {
  justify-content: center;
  text-align: center;
  align-items: center;
}
.c {
  flex: 1;
}
.hhcontainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  height: 100%;
  width: 50%;
  margin: auto;
}
.scs {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
.el-button--default span {
  color: #1f2d3d;
}
.el-button--primary span {
  color: #fff;
}
.el-form-item {
  background-color: #313439;
}
</style>