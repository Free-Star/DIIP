<template>
  <div class="content">
    <div v-if="modolType!=null && modolType >=0 ">
        <modal :targetUserGroupId="targetUserGroupId" :targetMenu="targetMenu" :modolType='modolType' @close="closeModal" @refresh="refresh"></modal>
    </div>
		<div v-if="modolType!=null && modolType < 0">
			<edit :transferdata="transferdata" :modolType='modolType' @close="closeModal" @refresh="refresh"></edit>
		</div>
    <alarm :targetMenu="targetMenu" v-if="alarm_show" @close = "closeAlarmMessage"></alarm>
    <device-list :targetMenu='targetMenu' @transferData='transferData' ref="deviceList" v-show="showDeviceList"
     @close="close" :deviceGroups="deviceGroups" :editDeviceGroup="editDeviceGroup" :editFlag="editFlag">
    </device-list>
    <div class="groupList">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>组织机构
        <span><button type="button" class="btn btn-sm btn-info" @click="changeStatus">修改</button></span> 
      </div>
      <tree :deviceGroupsDelete="deviceGroupsDelete" :users="dataAll" :targetUserGroupId ="targetUserGroupId" :status = status :addr="OrgUrl" ref="tree" :lable="labels" @setInitData="initDatas" @refresh="refresh"></tree>
    </div>
    <div class="singleDevice">
      <!-- div class="tableTool">
        <!--div class="operate" >
              <p @click="open">
                <button type="button" class="btn btn-sm btn-info" >添加设备组</button></p>
          <!--<button type="submit" class="btn btn-sm btn-info" @click="openModal(-1)">新增设备组</button>-->
          <!--<button type="submit" class="btn btn-sm btn-info" :disabled="batch_select.length === 0" @click="on_batch_del">
              <i class="fa fa-search" aria-hidden="true"></i>批量删除
            </button> -->
        </div-->
      </div-->
      <div class="table">
        <h3> 号码分配 </h3>
        <table class="table">
         <caption>
        </caption>
          <thead>
            <tr>
              <td>页面verto号码</td>
              <td>值班组号码 
             <!-- <button type="button" class="btn btn-sm btn-info watcher"  @click = "enable_left_watcher==true?setLeftWatcherState(false):setLeftWatcherState(true)" > {{enable_left_watcher==true?"关闭自动通话应答":"启用自动通话应答"}}</button> -->
             <!-- <button type="button" v-if = "enable_left_watcher"  class="btn btn-sm btn-info watcher"  @click = "setLeftWatcherState(false)" > {{"关闭广播话筒"}}</button>   -->
              </td>
              <!-- <td>告警号码</td>
              <td>语音呼叫号码</td>
              <td>广播号码</td>
              <td>会议呼叫号码</td>
              <td>值班话机号码  
             <button type="button" class="btn btn-sm btn-info watcher"  @click = "enable_left_watcher==true?editLeftWatcher():setLeftWatcherState(true)" > {{enable_left_watcher==true?"修改值班话机号码":"启用值班模式"}}</button>
                <button type="button" v-if = "enable_left_watcher"  class="btn btn-sm btn-info watcher"  @click = "setLeftWatcherState(false)" > {{"关闭值班话机"}}</button>  
              </td>
	      <td>告警话机号码
             <button type="button" class="btn btn-sm btn-info watcher"  @click = "enable_right_watcher==true?editRightWatcher():setRightWatcherState(true)" > {{enable_right_watcher==true?"修改告警话机号码":"启用告警话机"}}</button>
                <button type="button" v-if = "enable_right_watcher"  class="btn btn-sm btn-info watcher"  @click = "setRightWatcherState(false)" > {{"关闭告警话机"}}</button>
              </td>
	      <td>移动话机号码
             <button type="button" class="btn btn-sm btn-info watcher"  @click = "enable_out_watcher==true?editOutWatcher():setOutWatcherState(true)" > {{enable_out_watcher==true?"修改移动话机号码":"启用移动话机"}}</button>
                <button type="button" v-if = "enable_out_watcher"  class="btn btn-sm btn-info watcher"  @click = "setOutWatcherState(false)" > {{"关闭移动话机"}}</button>
              </td> -->
	            <td>视频告警联动模式
                <button type="button" class="btn btn-sm btn-info alarm_control"  @click = "changeAlarmControl()" > 修改</button>
                <button type="button" class="btn btn-sm btn-info alarm_control"  @click = "changeAlarmMessage()" > 告警信息设置</button>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{verto}}</td>
              <td  :contenteditable = "left_contenteditable" @blur="editLeftWatcherFinished($event)" @keydown.13 = "editLeftWatcherFinished($event)" v-focus = "editleftwatcher"   >{{left_watcher}}</td>
              <!-- <td>{{alarm}}</td>
              <td>{{voice}}</td>
              <td>{{broad}}</td>
              <td>{{meeting}}</td>
	            <td  :contenteditable = "left_contenteditable" @blur="editLeftWatcherFinished($event)" @keydown.13 = "editLeftWatcherFinished($event)" v-focus = "editleftwatcher"   >{{left_watcher}}</td>
              <td  :contenteditable = "right_contenteditable" @blur="editRightWatcherFinished($event)" @keydown.13 = "editRightWatcherFinished($event)" v-focus = "editrightwatcher" >{{right_watcher}}</td>
              <td  :contenteditable = "out_contenteditable" @blur="editOutWatcherFinished($event)" @keydown.13 = "editOutWatcherFinished($event)" v-focus = "editoutwatcher"  >{{out_watcher}}</td> -->
	            <td> {{alarm_control=="popup"?"弹窗模式":(alarm_control=="matrix"?"矩阵模式":"路由模式")}} </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table">
        <h3> 用户 </h3> 
        <span style="float:right"><button type="submit" class="btn btn-sm btn-info" @click="openModal(1 ,0)">新增用户</button></span>
        <table class="table">
	      <caption>
        </caption>
          <thead>
            <tr>
              <td>用户名</td>
              <td>所属用户组</td>
              <td>所属机构</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in dataAll"  :key = "data.userid" >
              <td>{{ data.username }}</td>
              <td>{{ data.rolename }}</td>
              <td>{{ data.orgname }}</td>
              <td width="170">
                <button type="button" class="btn btn-sm btn-info" @click="openModal( 1 ,data.userid)">修改</button>
                <button type="button" class="btn btn-sm btn-default" @click="deleteUser(data.userid)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h3 v-if = "allDevices.length>=0">全部设备</h3>
        <table class = "table" alt="暂无记录">
          <caption>
          <span> {{this.targetUserGroup}} </span>
          <button type="button" class="btn btn-sm btn-info" @click="open(false,null)">设备分组</button>
          <button type="button" class="btn btn-sm btn-info" @click="openModal(-1 ,0)">添加设备</button>
          </caption>
          <thead>
            <tr>
              <td>设备编号</td>
              <td>设备名称</td>
              <td>设备类型</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in allDevices" >
              <td>{{device.devicecode}}</td>
              <td>{{device.devicename}}</td>
              <td>
                {{ returnType(device.type) }}
              </td>
              <td>
                <!-- Todo -->
                <button type="button" class="btn btn-sm btn-info" @click="openModal(-1 ,device)">修改</button>
                <button type="button" class="btn btn-sm btn-default" @click="deleteDevice(device.deviceid,device.devicecode)">删除</button>
              </td>
            </tr>
          </tbody>
      </table>
        <h3 v-if = "deviceGroups.length>0">设备组</h3>
        <table class = "table" v-for = "(group, index) in deviceGroups">
          <caption v-if="index != 0">
            <br>
            <br>
          </caption>
          <caption>  
            <span> {{group.name}} </span> 
            <span> {{"设备组号：" + group.devicegroup_extn + "  设备组类型："+ type(group.devicegroup_type)}} </span> 
            <button type="button" class="btn btn-sm btn-default" style="margin: 0px 2px;" @click="deleteDeviceGroup(group.devicegroupid,group.devicegroup_extn)">
              删除
            </button>
            <button type="button" class="btn btn-sm btn-info" style="margin: 0px 2px;" @click="open(true,group)">修改</button>
          </caption>
          <thead>
            <tr>
              <td>设备编号</td>
              <td>设备名称</td>
              <td>设备类型</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in group.deviceGroups" >
              <td>{{item.devicecode}}</td>
              <td>{{item.devicename}}</td>
              <td>
                {{ item.type == 0 ? '单话机' : '视频话机' }}
              </td>
            </tr>
          </tbody>
      </table>
</div>
</div>
        <!-- <paging></paging> -->
  </div>
</template>
<script>
import deviceList from "./deviceList.vue";
import alarm from "./alarm.vue";
import { mapGetters } from "vuex";
import tree from "../structureTree/index.vue";
import paging from "../paging/index.vue";
import modal from "./modal.vue";
import edit from "./edit.vue";
import { getHeights } from "utils/page/setting";
import { GET_USER_INFO } from "store/getters/type";
const labels = {
  defaultId: "organizationid",
  treeName: "orgname",
};
export default {
  directives: {
    focus: {
      update: function (el, { value }) {
        if (value) {
          el.focus();
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
      updateState: "updateState",
      TreeData: "TreeData",
    }),
  },
  data() {
    return {
      status: "show",
      showDeviceList: false,
      labels,
      selectUser: [],
      dataAll: [],
      deviceGroups: [],
      editDeviceGroup: null,
      editFlag: false,
      targetMenu: {},
      self: this,
      modolType: null,
      targetUserGroup: null,
      allDevices: [],
      targetUserGroupId: "",
      transferdata: { 
        device: null,
        targetMenuId: "" 
      },
      deviceGroupsDelete: [],
      verto: "",
      meeting: "",
      voice: "",
      broad: "",
      alarm: "",
      left_watcher: "",
      right_watcher: "",
      out_watcher: "",
      enable_left_watcher: "",//该字段被改成了通话自动应答控制，如果启用，系统自动把通话转发给刚空闲下来的值班组成员。
      enable_right_watcher: "",
      enable_out_watcher: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      alarm_control: "",
      left_contenteditable: false,
      right_contenteditable: false,
      out_contenteditable: false,
      editleftwatcher: false,
      editrightwatcher: false,
      editoutwatcher: false,
      alarm_show: false,
    };
  },
  watch: {
    TreeData: {
      handler: function (data) {
        this.targetMenu = data;
        this.transferdata.targetMenuId = data.organizationid;
        this.targetUserGroup = data.orgname;
        this.modolType = null;
        /*this.deviceGroups.forEach(
          (item,index)=>{
            this.deviceGroups.splice(index,1)
          }
        )*/
        this.$nextTick(function () {
          this.refresh();
        });
      },
      deep: true,
    },
    updateState: function () {
      if (this.updateState === 1) {
        this.refresh();
        this.$refs.deviceList.refreshDeviceList();
      } else if (this.updateState === 2) {
        this.refresh();
        this.$refs.tree.refresh(this.targetMenu);
      }
      this.$store.state.updateState = 0;
    },
  },
  components: {
    tree,
    modal,
    paging,
    deviceList,
    edit,
    alarm,
  },
  created() {
    this.$nextTick(() => {
      this.refresh();
      getHeights();
    });
    this.targetMenu = this.TreeData;
    if (!this.targetMenu.hasOwnProperty("organizationid"))
      this.targetMenu = { organizationid: "b202669251a046bbbc727ff3fb25f9f4" };
    this.targetUserGroup = this.$store.state.user_info.user.orgname;
    this.OrgUrl =
      "Organization/TreeRoot/" +
      this.$store.state.user_info.user.organizationid;
  },
  methods: {
    //  组织机构树默认选中
    closeAlarmMessage() {
      this.alarm_show = false;
    },
    changeAlarmMessage() {
      this.alarm_show = true;
    },
    returnType(type) {
      switch (type) {
        case 0:
          return "语音终端";
          break;
        case 1:
          return "视频终端";
          break;
        case 2:
          return "组播终端";
          break;
      }
    },
    type(str) {
      let devicegroup_type;
      switch (str) {
        case "broad":
          devicegroup_type = "广播组";
          break;
        case "inqueue":
          devicegroup_type = "顺振组";
          break;
        case "allqueue":
          devicegroup_type = "同振组";
          break;
        case "radio":
          devicegroup_type = "对讲组";
          break;
        case "meeting":
          devicegroup_type = "会议组";
          break;
        case "left_watcher":
          devicegroup_type = "值班组";
          break;
        case "alarm":
          devicegroup_type = "告警组";
          break;
      }
      return devicegroup_type;
    },
    changeAlarmControl() {
      if (this.alarm_control == "popup") this.alarm_control = "router";
      else if (this.alarm_control == "router") {
        this.$store.dispatch("setAlarmAddress", "");
        this.alarm_control = "matrix";
      } else if (this.alarm_control == "matrix") {
        this.alarm_control = "popup";
      }

      this.instance({
        method: "post",
        url: "/alarm_control/update/" + this.transferdata.targetMenuId,
        data: {
          alarm_control: this.alarm_control,
        },
      }).then((res) => {});
    },
    editLeftWatcherFinished(event) {
      this.left_contenteditable = false;
      event.target.textContent = event.target.textContent.trim();
      let text = event.target.textContent;
      if (isNaN(Number(text))) {
        this.$message.success("号码格式错误，请重新输入").return;
      }
      this.editleftwatcher = false;
      this.instance({
        method: "post",
        url: "/watcher/update/left/" + this.transferdata.targetMenuId,
        data: {
          watcher: text,
        },
      }).then((res) => {});
    },
    editRightWatcherFinished(event) {
      this.right_contenteditable = false;
      event.target.textContent = event.target.textContent.trim();
      let text = event.target.textContent;
      if (isNaN(Number(text))) {
        this.$message.success("号码格式错误，请重新输入").return;
      }
      this.editrightwatcher = false;
      this.instance({
        method: "post",
        url: "/watcher/update/right/" + this.transferdata.targetMenuId,
        data: {
          watcher: text,
        },
      }).then((res) => {});
    },
    editOutWatcherFinished(event) {
      this.out_contenteditable = false;
      event.target.textContent = event.target.textContent.trim();
      let text = event.target.textContent;
      if (isNaN(Number(text))) {
        this.$message.success("号码格式错误，请重新输入").return;
      }
      this.instance({
        method: "post",
        url: "/watcher/update/out/" + this.transferdata.targetMenuId,
        data: {
          watcher: text,
        },
      }).then((res) => {});
    },
    editLeftWatcher() {
      this.left_contenteditable = true;
      this.editleftwatcher = true;
    },
    editOutWatcher() {
      this.out_contenteditable = true;
      this.editoutwatcher = true;
    },
    editRightWatcher() {
      this.right_contenteditable = true;
      this.editrightwatcher = true;
    },
    setLeftWatcherState(state) {
      this.enable_left_watcher = state;
      this.instance({
        method: "post",
        url: "/watcher/left/" + this.transferdata.targetMenuId,
        data: {
          enable_left_watcher: state,
        },
      }).then((res) => {});
    },
    setRightWatcherState(state) {
      this.enable_right_watcher = state;
      this.instance({
        method: "post",
        url: "/watcher/right/" + this.transferdata.targetMenuId,
        data: {
          enable_right_watcher: state,
        },
      }).then((res) => {});
    },
    setOutWatcherState(state) {
      this.enable_out_watcher = state;
      this.instance({
        method: "post",
        url: "/watcher/out/" + this.transferdata.targetMenuId,
        data: {
          enable_out_watcher: state,
        },
      }).then((res) => {});
    },
    initDatas(data) {
      if (!this.targetMenu.hasOwnProperty("organizationid") && data) {
        this.targetMenu = data;
        this.refresh();
      }
    },
    // 渲染表格数据
    refresh() {
      let request = {
        organizationid: this.targetMenu.organizationid,
      };
      this.$ajax.post("User/List", request).then((res) => {
        if (res.data.code === 1) {
          this.dataAll = res.data.result;
        }
      });
      if (
        this.transferdata.targetMenuId != undefined &&
        this.transferdata.targetMenuId != ""
      )
        this.$ajax
          .get(`Organization/Detail/${this.transferdata.targetMenuId}`)
          .then((res) => {
            if (res.data.code === 1) {
              this.verto = res.data.result.vertoid;
              this.meeting = res.data.result.meetingid;
              this.voice = res.data.result.voicecallid;
              this.alarm = res.data.result.alarmid;
              this.broad = res.data.result.broadid;
              this.instance({
                method: "get",
                url: "/organization/" + this.transferdata.targetMenuId,
              }).then((res) => {
                this.left_watcher = res.data.left_watcher;
                this.right_watcher = res.data.right_watcher;
                this.out_watcher = res.data.out_watcher;
                this.enable_left_watcher = res.data.enable_left_watcher;
                this.enable_right_watcher = res.data.enable_right_watcher;
                this.enable_out_watcher = res.data.enable_out_watcher;
              });
              this.instance({
                method: "get",
                url: "/alarm_control/" + this.transferdata.targetMenuId,
              }).then((res) => {
                this.alarm_control = res.data.result.alarm_control;
                if (this.alarm_control == "" || this.alarm_control == undefined) this.alarm_control = "router";
              });
            }
          });
      this.$ajax
        .get(`Feature/getFeatureByOrg/${this.targetMenu.organizationid}`)
        .then((res) => {
          if (res.data.code === 1) {
            this.allDevices = res.data.result;
            this.allDevices.sort((x, y) => {
              return x.devicecode - y.devicecode;
            });
          }
        });
      this.$ajax.post(`Role/List`).then((res) => {
        if (res.data.code === 1) {
          let groupList = res.data.result;
          this.targetUserGroupId = "";

          groupList.forEach((element) => {

            if (element.rolename == this.targetUserGroup) {
              this.targetUserGroupId = element.roleid;
            }
          });

          if (this.targetUserGroupId != "")
            this.instance({
              method: "get",
              url: `Role/getDeviceGroup/${this.targetUserGroupId}`,
            }).then((res) => {
              if (res.data.code === 1) {
                let result = res.data.result;
                let length = result.length;
                this.deviceGroups = [];
                let axios = [];
                for (let i = 0; i < length; i++) {
                  axios.push(
                    this.instance({
                      method: "get",
                      url: `DeviceGroup/Detail/${result[i].devicegroupid}`,
                    })
                  );
                }
                this.$ajax.all(axios).then((res) => {
                  for (let i = 0; i < length; i++) {
                    if (
                      !this.deviceGroups.some((item) => {
                        return (
                          item.devicegroupid == res[i].data.result.devicegroupid
                        );
                      })
                    ) {
                      res[i].data.result.deviceGroups.sort((x, y) => {
                        return x.devicecode - y.devicecode;
                      });
                      this.deviceGroups.push(res[i].data.result);
                      this.deviceGroupsDelete.push(
                        res[i].data.result.devicegroupid
                      );
                    }
                  }
                });
              }
            });
          else this.deviceGroups = [];
        }
      });
    },

    openModal(status, id) {
      // status 为 1：用户的新增或修改
      if (status == 1) {
        if (id === 0) {
          this.modolType = 0;
        } else {
          this.modolType = 1;
          this.targetMenu.userid = id;
        }
      }
      // status 为 -1：设备的新增或修改
      if (status == -1) {
        if (id === 0) {
          this.modolType = -1;
        } else {
          this.modolType = -2;
          this.transferdata.device = id;
        }
      }
    },
    closeModal() {
      this.modolType = null;
    },

    deleteDevice(deviceId, deviceCode) {
      this.$confirm("确认删除此设备？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        let request = {};
        request.deviceId = deviceId;
        request.deviceCode = deviceCode;
        this.$ajax.post("Device/deletes", [request]).then((res) => {
          if (res.data.code === 1) {
            this.deviceGroups = [];
            this.refresh();
          }
        })
      }).catch(() => { });
    },

    deleteUser(userId) {
      this.$ajax.delete(`User/Remove/${userId}`).then((res) => {
        if (res.data.code === 1) {
          this.refresh();
        }
      });
    },
    open(editFlag, group) {
      this.editFlag = editFlag;
      this.editDeviceGroup = group;
      this.showDeviceList = true;
      $(".singleDevice")
        .removeClass("moveRightMiddle")
        .addClass("moveLeftMiddle");
      $(".allDevice").removeClass("moveRightDev").addClass("moveLeftDev");
    },

    close() {
      this.showDeviceList = false;
      this.editDeviceGroup = null;
      $(".singleDevice")
        .removeClass("moveLeftMiddle")
        .addClass("moveRightMiddle");
      $(".allDevice").removeClass("moveLeftDev").addClass("moveRightDev");
    },

    transferData(selectDevice, newDeviceGroupName, newDeviceGroupExtn, newDeviceGroupType, edit) {
      if (!edit) {
        this.instance({
          method: "post",
          url: "DeviceGroup/Create",
          data: {
            name: newDeviceGroupName,
            extn: newDeviceGroupExtn,
            devicegroup_type: newDeviceGroupType,
            deviceGroups: selectDevice,
          }
        }).then((res) => {
          if (res.data.code === 1) {
            let targetDeviceGroup = res.data.result.devicegroupid;
            this.deviceGroups = this.deviceGroups.concat([
              { devicegroupid: targetDeviceGroup },
            ]);
            this.$ajax
              .post(
                `Role/opRoleDevice/${this.targetUserGroupId}`,
                this.deviceGroups
              )
              .then((res) => {
                if (res.data.code === 1) {
                  this.refresh();
                }
              });
              this.$message.success("新设备组添加成功!");
              this.$refs.deviceList.refresh();
          }
        });
      } else {
        this.instance({
          method: "post",
          url: "DeviceGroup/Edit",
          data: {
            name: newDeviceGroupName,
            extn: newDeviceGroupExtn,
            devicegroup_type: newDeviceGroupType,
            deviceGroups: selectDevice,
            devicegroupid: this.editDeviceGroup.devicegroupid,
            preExtn: this.editDeviceGroup.devicegroup_extn
          }
        }).then((res) => {
          if (res.data.result.code === 1) {
            this.refresh();
            this.$message.success("设备组信息修改成功!");
          }
        });
      }  
    }, 
    
    //删除设备组
    deleteDeviceGroup(deviceGroupId, extn) {
      this.$confirm("确认删除此设备？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        this.instance({
          method: "post",
          url: "DeviceGroup/RemoveList",
          data: {
            ids: [deviceGroupId],
            roleid: this.targetUserGroupId,
            extn: extn,
          }
        }).then((res) => {
          if (res.data.code === 1) {
            this.deviceGroups = [];
            this.refresh();
          }
        });
      }).catch(() => {});
    },
    changeStatus() {
      if (this.status == "show") this.status = "change";
      else this.status = "show";
    },
  },
};
</script>

<style lang='scss'>
.watcher {
  margin-left: 5px;
}

.del-model {
  .el-message-box__btns {
    .el-button:nth-child(1) {
      background-color: #2d8cf0;
      border-color: #2d8cf0;
    }

    .el-button:nth-child(2) {
      background-color: #2d8cf0;
      border-color: #2d8cf0;
    }
  }
}

</style>


