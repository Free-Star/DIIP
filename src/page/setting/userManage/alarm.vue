<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block">
    <div class="popContent">
      <h4>告警信息设备</h4>
      <el-form ref="form">
        <el-form-item>
          <input
            @keydown.13="onInput()"
            id="inputkey"
            v-model="newDevice"
            type="text"
            class="form-control"
            placeholder="输入完成后请敲击回车"
            autocomplete="off"
          />
          <div class="selectedList" id="height04">
            <div
              class="singleFlies selectDelate"
              v-for="device in deviceList"
              @click="deleteItem(device)"
            >
              {{ device }}
            </div>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <button type="button" class="btn btn-sm btn-info" @click="onSubmit">
            确定
          </button>
          <button
            type="button"
            class="btn btn-sm btn-default"
            @click="onCancel"
          >
            取消
          </button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapActions } from "vuex";
export default {
  props: {
    targetMenu: {
      type: Object,
      required: true,
    },
  },
  watch: {},
  data() {
    return {
      newDevice: "",
      devices: [],
      rules: {},
      self: this,
      range: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      deviceList: [],
    };
  },
  created() {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight;
      $(".popUp").css("top", documentHeight * 0.3 + "px");
      this.instance({
        url: "alarm_message/get",
        method: "post",
        data: { organizationid: this.targetMenu.organizationid },
      }).then((res) => {
        if (res.data.code === 1) {
          let data = [];
          let splits = res.data.result.alarm_message_devices.split(",");
          if (splits.length > 0 && splits[0] != "") {
            this.deviceList = splits;
          } else {
            this.deviceList = [];
          }
        }
      });
    });
  },

  methods: {
    ...mapActions(["update"]),
    deleteItem(device) {
      let l = this.deviceList.length;
      for (let i = 0; i < l; i++) {
        if (this.deviceList[i] != undefined && this.deviceList[i] == device) {
          this.deviceList.splice(i, 1);
          i -= 1;
        }
      }
    },
    onInput() {
      if (
        !isNaN(Number(this.newDevice)) &&
        !this.deviceList.some((it) => {
          return it == this.newDevice;
        })
      )
        this.deviceList.push(this.newDevice.trim());
      else this.$message.success("请输入数字作为设备号");
      this.newDevice = "";
    },
    onSubmit() {
      let text;
      if (this.deviceList.length > 0) text = this.deviceList.join(",");
      else text = "";
      console.log(text);
      this.instance({
        url: "alarm_message/update",
        method: "post",
        data: { organizationid: this.targetMenu.organizationid, text: text },
      }).then((res) => {
        if (res.data.code === 1 && res.data.result > 0) {
          this.$message.success("更新成功");
        } else {
          this.$message.success("更新失败，请检查数据库");
        }
      });
      this.$emit("close");
    },
    onCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style scpoed>
#input_key {
  margin: 20px auto;
  width: 450px;
}

#height04 {
  margin: 20px auto;
}
</style>
