<template>
  <div class="allDevice" style=" position: fixed;">
    <div class="menuType">
      <i class="fa fa-list-ul" aria-hidden="true"></i>设备列表
      <button type="button" class="btn btn-sm btn-info" @click="confirmAddAll" v-if="!editFlag">
        全部添加
      </button>
      <button type="button" class="btn btn-sm btn-info" @click="confirmAdd" v-if="!editFlag">
        确定添加
      </button>
      <button type="button" class="btn btn-sm btn-info" @click="confirmEdit" v-if="editFlag">
        确定修改
      </button>
    </div>

    <!-- 创建新的组 -->
    <form style="padding: 5px 10px">
      <span v-if="!editFlag">请输入新设备组的名称</span>
      <span v-if="editFlag">修改设备组的名称</span>
      <input
        v-model="newDeviceGroupName"
        style="width: 50%; margin: 5px 0px"
        type="text"
        class="form-control form-lighter"
        placeholder=""
      />
    </form>

    <form style="padding: 5px 10px">
      <span v-if="!editFlag">请输入新设备组的组号</span>
      <span v-if="editFlag">修改设备组的组号</span>
      <input
        v-model="newDeviceGroupExtn"
        style="width: 50%; margin: 5px 0px"
        type="text"
        class="form-control form-lighter"
        placeholder=""
      />
      <span v-show="extnExisted(newDeviceGroupExtn)" style="color:red">该组号已存在！</span>
    </form>

  
    <el-radio-group class="choose" v-model="newDeviceGroupType">
      <span v-if="!editFlag">请勾选新设备组类型</span>
      <span v-if="editFlag">修改设备组的类型</span>
      <el-radio :label="'left_watcher'">值班组</el-radio>
      <el-radio :label="'alarm'">告警组</el-radio>
      <el-radio :label="'broad'">广播组</el-radio>
      <el-radio :label="'meeting'">会议组</el-radio>
      <br>
      <el-radio :label="'inqueue'">顺振组</el-radio>
      <el-radio :label="'allqueue'">同振组</el-radio>
      <el-radio :label="'radio'">对讲组</el-radio>
    </el-radio-group>

    <form style="padding: 5px 10px; display: flex;">
      <input
        v-model="searchCode"
        style="width: 50%; margin: 5px 0px"
        type="text"
        class="form-control form-lighter"
        placeholder="搜索目标设备号"
      />
      <button type="button" class="btn btn-sm btn-info" style="margin: 7px;" @click="searchDevice">搜索</button>
      <button type="button" class="btn btn-sm btn-info" style="margin: 7px;" @click="searchClear">清空</button>
    </form>

    <div class="musicList" id="height03" v-if="searchShow">
      <span style="margin: 10px 13px;">搜索结果</span>
      <div class="aa">
        <div
          class="singleFlies"
          :class="{ selected: device.selected }"
          v-for="device in searchList"
          :key="device.deviceId"
          @click="selectDeviceEvent(device)"
        >
          {{ device.devicecode }}
          <span>{{ device.devicename }}</span>
        </div>
      </div>
    </div>

    <span style="margin: 10px 13px; color: red;" v-show="searchFailed">未能找到相应设备！</span>

    <div class="musicList" id="height02">
      <span style="margin: 10px 13px;">全部设备</span>
      <div id="SelectedMembers" class="aa">
        <div
          class="singleFlies"
          :class="{ selected: device.selected }"
          v-for="device in deviceList"
          :key="device.deviceId"
          @click="selectDeviceEvent(device)"
        >
          {{ device.devicecode }}
          <span>{{ device.devicename }}</span>
        </div>
      </div>
    </div>

    <div class="sidder" @click="close()">
      <i class="fa fa-2x fa-angle-double-right"></i>
      <span>取消</span>
    </div>
  </div>
</template>
<script>
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/deviceGroup";

export default {
  props: {
    targetMenu: {
      type: Object,
      required: true,
    },
    deviceGroups: {},
    editFlag: false,
    editDeviceGroup: {}
  },
  computed: {
    myEditDeviceGroup: function () {
      return this.editDeviceGroup;
    }
  },
  data() {
    return {
      deviceList: [],
      selectDevice: [],
      searchList: [],
      searchCode: "",
      searchShow: false,
      searchFailed: false,
      fuzzyQuery: "",
      newDeviceGroupName: "",
      newDeviceGroupExtn: "",
      newDeviceGroupType: "",
      instance: this.$ajax.create({
        baseurl: "https://scc.yuqi.com:8001",
      }),
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.refresh();
    });
  },
  watch: {
    targetMenu: function () {
      this.$ajax
        .get("Feature/getFeatureByOrg/" + this.targetMenu.organizationid)
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result;
            result.forEach((r, i) => {
              r.selected = false;
            });
            this.deviceList = result.sort((x, y) => {
              return x.devicecode - y.devicecode;
            });
          }
        });
    },

    myEditDeviceGroup: function (newVal) {
      this.refresh();
      this.newDeviceGroupName = this.editDeviceGroup.name;
      this.newDeviceGroupExtn = this.editDeviceGroup.devicegroup_extn;
      this.newDeviceGroupType = this.editDeviceGroup.devicegroup_type;
      for (let device of this.editDeviceGroup.deviceGroups) 
        for (let de of this.deviceList) {
          if (de.devicecode == device.devicecode) {
            console.log(de);
            this.selectDeviceEvent(de);
            break;
          }
        }
    }
  },

  methods: {
    refresh() {
      this.selectDevice = [];
      this.newDeviceGroupName = "";
      this.newDeviceGroupExtn = "";
      this.newDeviceGroupType = "";
      this.deviceList.forEach(item => {
        item.selected = false;
      });
    },

    refreshDeviceList() {
      this.$ajax
        .get("Feature/getFeatureByOrg/" + this.targetMenu.organizationid)
        .then((res) => {
          if (res.data.code === 1) {
            let result = res.data.result;
            result.forEach((r, i) => {
              r.selected = false;
            });
            this.deviceList = result.sort((x, y) => {
              return x.devicecode - y.devicecode;
            });
          }
        });
    },

    searchDevice() {
      this.searchList = [];
      if(this.searchCode != "") {
        this.deviceList.forEach((device) => {
          if (device.devicecode.startsWith(this.searchCode))
            this.searchList.push(device);
        });
      } 
      if(this.searchList.length != 0) {
        this.searchShow = true;
        this.searchFailed = false;
      }
      else {
        this.searchShow = false;
        this.searchFailed = true;
      }
    },

    searchClear() {
      this.searchCode = "";
      this.searchShow = false;
      this.searchFailed = false;
    },

    selectDeviceEvent(device) {
      if (!device.selected) {
        if (this.selectDevice.length == 0) {
          this.selectDevice.push(device);
        } else {
          let isRepeat = this.selectDevice.find(
            (item) => item.deviceid == device.deviceid
          );
          if (!isRepeat) {
            this.selectDevice.push(device);
          }
        }
      } else {
        this.selectDevice.forEach((de, index) => {
          if (device.deviceid == de.deviceid)
            this.selectDevice.splice(index, 1);
        });
      }
      device.selected = !device.selected;
    },
    confirmAdd() {
      this.checkInput();
      if (this.deviceList.length !== 0 && this.selectDevice.length !== 0) {
        this.$emit(
          "transferData",
          this.selectDevice,
          this.newDeviceGroupName,
          this.newDeviceGroupExtn,
          this.newDeviceGroupType,
          false
        );
      }
    },
    confirmAddAll() {
      this.checkInput();
      if (this.deviceList.length !== 0) {
        this.$emit(
          "transferData",
          this.deviceList,
          this.newDeviceGroupName,
          this.newDeviceGroupExtn,
          this.newDeviceGroupType,
          false
        );
      }
    },

    // 确认修改当前分组
    confirmEdit() {
      this.checkInput();
      if (this.deviceList.length !== 0 && this.selectDevice.length !== 0) {
        this.$emit(
          "transferData",
          this.selectDevice,
          this.newDeviceGroupName,
          this.newDeviceGroupExtn,
          this.newDeviceGroupType,
          true
        );
      }

    },
    
    checkInput (){
      if (this.newDeviceGroupType == "") {
        this.$message.error("请勾选分组类型!");
        return;
      } else if (this.newDeviceGroupName == "") {
        this.$message.error("请填写分组名称!");
        return;
      } else if (this.newDeviceGroupExtn == "") {
        this.$message.error("请填写分组号!");
        return;
      } else if (this.extnExisted(this.newDeviceGroupExtn)) {
        this.$message.error("分组号已存在!");
        return;
      } else if (this.selectDevice.length == 0) {
        this.$message.error("分组中需要至少包含一个设备!");
        return;
      }
    },

    close() {
      this.$emit("close");
    },
    extnExisted(extn) {
      if (this.editFlag) {
        for (let item of this.deviceGroups) {
          if(extn === item.devicegroup_extn && this.editDeviceGroup.devicegroupid != item.devicegroupid) 
            return true;
        }
      } else {
        for (let item of this.deviceGroups) {
          if(extn === item.devicegroup_extn) 
            return true;
        }
      }
      return false;
    }
  },
};
</script>
<style scoped>
.menuType button {
  float: right;
}
.choose {
  padding: 5px 10px;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
  background-color: transparent;
}

#height02 {
  overflow: auto; 
  height: 55vh !important;
}

#height03 {
  overflow: auto; 
  height: 20vh !important;
}

</style>
