<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block; position: fixed;">
    <div class="popContent">
      <el-form
        class="form-horizontal"
        :model="formData"
        ref="formData"
        :rules="rules"
      >
        <div class="row">
          <div class="col-md-6" v-if="formData.type != 2">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备号</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.devicecode"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="formData.type != 2 && modolType != -2">
            <div class="form-group">
              <label class="col-sm-6 control-label">添加范围</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="range" />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备名称</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  placeholder=""
                  class="form-control"
                  v-model="formData.devicename"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="formData.type != 2">
            <div class="form-group">
              <label class="col-sm-6 control-label">密码</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.password"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="formData.type == 2">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP地址</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.ipaddress"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="formData.type == 2">
            <div class="form-group">
              <label class="col-sm-6 control-label">端口号</label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.port"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备类型</label>
              <div class="col-sm-6">
                <label class="radio-inline" v-if="modolType != -2 || preType != '2'">
                  <input type="radio" value="0" v-model="formData.type" />单话机
                </label>
                <label class="radio-inline" v-if="modolType != -2 || preType != '2'">
                  <input
                    type="radio"
                    value="1"
                    v-model="formData.type"
                  />视频终端
                </label>
                <label class="radio-inline" v-if="modolType != -2 || preType == '2'">
                  <input
                    type="radio"
                    value="2"
                    v-model="formData.type"
                  />组播终端
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="userEdit">
        确定
      </button>
      <button type="button" class="btn btn-sm btn-default" @click="close">
        取消
      </button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from "vuex";
export default {
  props: {
    modolType: { type: Number },
    transferdata: { type: Object },
  },
  data() {
    return {
      formData: {
        devicecode: "",
        devicename: "",
        password: "",
        type: "0",
        ipaddress: "",
        port: "",

        devicevedios: [
          { vediourl: "" },
          { vediourl: "" },
          { vediourl: "" },
          { vediourl: "" },
        ],
        feature: {
          organizationid: this.transferdata.targetMenuId,
          aliasname: "",
        },
      },
      preType: '',
      rules: {},
      self: this,
      range: "1",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
    };
  },
  created() {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight;
      $(".popUp").css("top", documentHeight * 0.3 + "px");
      // 如果是修改当前设备，则将设备除密码外的原信息进行展示
      if (this.modolType === -2) {
        this.preType = this.transferdata.device.type;
        this.formData.type = this.transferdata.device.type;
        this.formData.devicename = this.transferdata.device.devicename;
        if (this.formData.type == '2') {
          this.formData.ipaddress = this.transferdata.device.ipaddress;
          this.formData.port = this.transferdata.device.port;
        } else this.formData.devicecode = this.transferdata.device.devicecode;
      }
    });
  },
  methods: {
    ...mapActions(["update"]),
    close() {
      this.$emit("close");
    },

    // 提交设备信息前进行用户输入检查
    // 1. 非空检查
    // 2. 设备号必须为数字
    checkInput() {
      if (this.formData.type == '0' || this.formData.type == '1') {
        if (this.formData.devicecode === '') {
          this.showTip("请输入设备号！", false);
          return false;
        } else if (isNaN(Number(this.formData.devicecode, 10))) {
          this.showTip("设备号必须为纯数字！", false);
          return false;
        } else if (this.formData.password === '') {
          this.showTip("请输入密码！", false);
          return false;
        } 
      } else if (this.formData.type == '2') {
        if (this.formData.devicename === '') {
          this.showTip("请输入设备名称！", false);
          return false;
        } else if (this.formData.ipaddress === '') {
          this.showTip("请输入IP地址！", false);
          return false;
        } else if (this.formData.port === '') {
          this.showTip("请输入端口号！", false);
          return false;
        } 
      }
      return true;
    },

    showTip(tipContent, tipType) {
      tipType ? this.$message.success(tipContent) : this.$message.error(tipContent)
    },

    userEdit() {
      if(!this.checkInput()) return;
      // this.modolType 为 -1 则表示新增设备
      if (this.modolType != -2) {
        let axios = [];
        let range = this.range == "" ? 1 : parseInt(this.range);
        for (let i = 0; i < range; i++) {
          // this.formData.type 为 0：单话机    1：视频终端       2：组播终端 
          if (this.formData.type != 2) {
            let temp = new Object();
            if(range == 1)
            temp.devicecode = this.formData.devicecode;
            else
            temp.devicecode = String(parseInt(this.formData.devicecode) + i);
            temp.devicename =
              this.formData.devicename == ""
                ? temp.devicecode
                : range == 1
                ? this.formData.devicename
                : this.formData.devicename + String(i + 1);
            temp.password =
              this.formData.password == ""
                ? temp.devicecode
                : this.formData.password;
            temp.type = this.formData.type;
            temp.devicevedios = this.formData.devicevedios;
            temp.feature = this.formData.feature;
            axios.push(this.$ajax.post("Device/Create", temp));
          } else if (this.formData.type == 2) {
            let temp = new Object();
            temp.ipaddress = this.formData.ipaddress;
            temp.organizationid = this.transferdata.targetMenuId;
            temp.port = this.formData.port;
            temp.type = this.formData.type;
            temp.devicename = this.formData.devicename;
            axios.push(
              this.instance({
                url: "Device/CreateMulticast",
                method: "post",
                data: temp,
              })
            );
          }
        }
        this.$ajax.all(axios).then((res) => {
          res.forEach((re) => {
            if (re.data.code == 0)
              setTimeout(() => {
                this.$message.success("某个设备已存在,请勿重复添加");
              }, 500);
            else if (re.data.code == 2)
              setTimeout(() => {
                this.$message.success(res.data.result);
              }, 500);
            else
              setTimeout(() => {
                this.$message.success("设备添加成功！");
              }, 500);
          });
          this.$store.dispatch("update", 1);
          this.close();
        });
      } else { // this.modolType 为 -2 则表示修改已有设备
        let temp = new Object();
        if (this.formData.type != '2') { 
          temp.preDevicecode = this.transferdata.device.devicecode;
          temp.deviceid = this.transferdata.device.deviceid;
          temp.devicecode = this.formData.devicecode;
          temp.devicename = this.formData.devicename == null ? temp.devicecode : this.formData.devicename;
          temp.password = 
            this.formData.password == null
              ? temp.devicecode
              : this.formData.password;
          temp.type = this.formData.type;

        } else if (this.formData.type == '2') { // 组播
          temp.deviceid = this.transferdata.device.deviceid;
          temp.devicename = this.formData.devicename;
          temp.ipaddress = this.formData.ipaddress;
          temp.port = this.formData.port;
          temp.type = this.formData.type;
        }
        this.instance({
          method: "post",
          url: "/Device/Edit",
          data: temp
        }).then(res => {
          if (res.data.result.code == 0)
            this.showTip("修改失败，设备号已存在！", false);
          else {
            this.showTip("设备信息修改成功！", true);
            this.$store.dispatch("update", 1);
            this.close()
          }
        })
      }
    },
  },
};
</script>
