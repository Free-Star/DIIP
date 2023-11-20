<template>
  <div >
    <div class="broadcastCon">
      <div><!--tab01-->
        <div id="aa">
          <div class="tableTool">
            <button type="button" class="btn btn-success" @click="booking">发起预约</button>
            <button type="button" class="btn btn-success" @click="orderDetail(detailData)">查看预约详情</button>
            <el-dialog
              title="预约"
              :visible.sync="dialogVisible"
              width="25%"
              style="color:#fff;"              
              >
              <el-form ref="form" :model="detailData" label-width="80px">
                <el-form-item label="预案名称:" :label-width="formLabelWidth">
                  <el-input v-model="detailData.planname" style="border: 1px solid #dcdfe6;padding: 0 15px;width: 200px;color: #fff !important;"></el-input>
                </el-form-item>
                <el-form-item label="文件类型:" :label-width="formLabelWidth">
                  <el-input v-model="detailData.cmdtype == 1 ? '音乐播放':'文本播放'" style="border: 1px solid #dcdfe6;padding: 0 15px;width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="预案时间:" :label-width="formLabelWidth">
                  <el-input v-model="detailData.planpretime" style="border: 1px solid #dcdfe6;padding: 0 15px;width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="预案周期:" :label-width="formLabelWidth">
                  <el-input v-model="showPeriod" style="border: 1px solid #dcdfe6;padding: 0 15px;width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="循环次数:" :label-width="formLabelWidth">
                  <el-input v-model="detailData.planmodel" style="border: 1px solid #dcdfe6;padding: 0 15px;width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="播放文件:" :label-width="formLabelWidth">
                  <el-select v-model="value" style="color: #333;border: 1px solid #dcdfe6;padding: 0 15px;width: 200px;">
                    <el-option
                      v-for="item in playList"
                      @click="changePList(item)"
                      :key="item.folderid"
                      :label="item.foldername"
                      :value="item.folderid"
                      id="elsel"  
                      style="color: #333;">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form> 
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialog1Visible = true">播放设备</el-button> 
                <el-button @click="diaReturn"><span style="color: #333 !important;">取 消</span></el-button>
                <el-button type="primary" @click="diaConfirm(detailData)">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog
              title="查看播放设备"
              :visible.sync="dialog1Visible"
              width="30%"
              >
              <div style="display:block; float:clear;height:200px">
                <span style="color:#fff">未选设备列表（在线）</span>
                <div class="selectedList">
                  <div class="singleFlies"
                    v-for="device in unselectDevice"
                    @click="selectItem(device)">{{device.userid}}</div>
                </div>
              </div>
              <div style="display:block; float:clear;height:200px"> 
                <span style="color:#fff">已选设备列表（在线）</span>
                <div class="selectedList">
                  <div class="singleFlies selected"
                    v-for="device in selectDevice"
                    @click="deleteDevice(device)">{{device.userid}}</div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1Visible = false"><span style="color: #333 !important;">取 消</span></el-button>
                <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
              </span>
            </el-dialog>
            <div class="operate"
                 @click="deleteItem"><span class="delate"><i class="fa fa-times" aria-hidden="true"></i>删除</span></div>
          </div>
          <div class="table">
            <table class="table">
              <thead>
              <tr>
                <td>预案名称</td>
                <!-- <td>预约模式</td> -->
                <td>预约时间</td>
                <!-- <td>播放模式</td>
                <td>播放次数</td> -->
                <td>播放终端</td>
                <!-- <td>操作</td> -->
              </tr>
              </thead>
              <tbody v-if="showPlanData.length != 0">
              <tr @click="selectClick(index, plan)" v-for="(plan, index) in showPlanData">
                <td>{{ plan.planname }}</td>
                <!-- <td>{{ plan.planpremodel == 1 ? '定时预约' : ''}}</td> -->
                <td v-if="dateToStr(plan.planpretime)!= '1899-12-31 00:00:00'">{{ dateToStr(plan.planpretime) }}</td>
                <td v-else>非定时任务                                      <button style="color:blue" @click="feidingshi(plan)">立即执行</button></td> 
                <!-- <td>{{ plan.planmodel == 1 ? '循环播放' : '按次播放' }}</td>
                <td>{{ plan.plantime }}</td> -->
                <td>{{ plan.deviceids }}</td>
                <!-- <td>
                  <span @click.stop="nowPlay">立即播放</span>
                </td> -->
              </tr>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <edit v-if="editShow" @close="booking"></edit>
    <confirm-dialog v-if="dialogShow" @submit="confirm">
      <p slot="content">确定要删除这些预案吗？</p>
    </confirm-dialog>
  <!-- <div id="media" class = "content padding">
      <video width=800 id="webcam" autoplay="autoplay" hidden="true"></video>
    </div> -->
  </div>

</template>

<script>
import parseXML from "utils/xml_parser";
import { isArray, isObject, isString } from "utils/tool";
import edit from "./edit.vue";
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/broadOrder";
import { confirmDialog } from "components";
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";
export default {
  data() {
    return {
      editShow: false, //编辑框显示或隐藏
      selectPlan: [],
      verto: "",
      meeting: "",
      voice: "",
      alarm: "",
      broad: "",
      xPlanData: [],
      showPlanData: [],
      dialogVisible: false,
      detailData: "",
      showTime: "",
      dialog1Visible: false,
      formLabelWidth: "120px",
      dList: [],
      pList: [],
      deviceList: [],
      showPeriod: "",
      selectDevice: [],
      unselectDevice: [],
      returnData: {
        CreateUserID: "133585596bb04c9cbe311d0859dd7196",
        PlanName: "",
        PlanPreModel: 1,
        planmodel: 2,
        PlanPreTime: new Date(),
        PlanActualTxt: "",
        folders: [], // 已勾选的歌单
        deviceId: "1005",
        FeatureBases: [],
        FeatureCode: [],
        path: "",
        time: "",
        meeting: "",
        cmdtype: 0,
        period: "",
      },
      value: "",
      selectPlayList: [],
      playList: [],
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      $(".orgTreeList").removeClass("treeListShow").addClass("treeListHide");
      this.refresh();
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.alarm = this.get_user_info.freeswitchData.AlarmID;
      this.broad = this.get_user_info.freeswitchData.BroadID;
    });
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      currentLoginUser: "currentLoginUser",
      dialogShow: "dialogShow",
      get_user_info: GET_USER_INFO,
      selectPhonex: "selectPhonex",
    }),
  },
  components: {
    edit,
    confirmDialog,
  },
  methods: {
    changePList(item) {
      this.pList[0].folderid = item.folderid;
      this.pList[0].foldername = item.foldername;
    },
    dateToStr(datetime) {
      datetime = new Date(datetime);
      var year = datetime.getFullYear(),
        month = datetime.getMonth() + 1,
        date = datetime.getDate(),
        hour = datetime.getHours(),
        minutes = datetime.getMinutes(),
        second = datetime.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        second
      );
    },
    refresh() {
      this.$store.dispatch("setSelectPhonex", null);
      this.instance({
        method: "post",
        url: "/Plan/List",
        data: { pageIndex: 0, pageSize: 1000 },
      }).then((res) => {
        if (res.data.code == 1) {
          if (res.data.result != null && res.data.result.length > 0) {
            console.log("success");
            this.showPlanData = [];
            this.showPlanData = res.data.result;
            this.showPlanData = this.showPlanData.reverse();
            this.showPlanData.sort((a, b) => {
              return Date(b.planpretime) - Date(a.planpretime);
            });
            let i = 0;
            let j = 0;
            let sum = 1;
            let sum_show = 1;
            for (i = 1; i < res.data.result.length; i++) {
              console.log(this.showPlanData[i].planpretime);
              if (
                this.showPlanData[i].planname !=
                this.showPlanData[i - 1].planname
              ) {
                sum_show++;
              }
            }
            let sum_array = [];
            sum_array.length = sum_show;
            for (i = 0; i < sum_show; i++) {
              sum_array[i] = 1;
            }
            for (i = 1, j = 0; i < res.data.result.length; i++) {
              if (
                res.data.result[i].planname == res.data.result[i - 1].planname
              ) {
                sum_array[j]++;
              } else {
                j++;
              }
            }
            for (
              i = 0, j = 0;
              i < sum_array.length;
              i++, j = j + sum_array[i - 1]
            ) {
              this.showPlanData[i] = res.data.result[j];
              if (i + sum == res.data.result.length) {
                this.showPlanData.splice(j + 1, res.data.result.length - j - 1);
              }
            }
            this.showPlanData.length = sum_show;
          } else {
            this.showPlanData = [];
          }
        } else {
          console.log("failed");
        }
      });
      this.$ajax
        .get("Folder/getTreeFiles", {
          params: { UserID: "133585596bb04c9cbe311d0859dd7196" },
        })
        .then((res) => {
          if (res.data.code == 1) {
            let result = res.data.result;
            result.forEach(function (r, i) {
              r.unfold = false;
              r.selected = false;
            });
            this.playList = result;
          }
        });
    },
    handleFSEventRegister(v, e) {
      let _this = this;
      let deviceList = _this.deviceList;
      if (e.eventChannel == "FSevent.custom::sofia::register") {
        let isContinue = true;
        deviceList.forEach(function (d, i) {
          if (d.userid == e.data["from-user"]) {
            isContinue = false;
            return;
          }
        });

        if (isContinue) {
          let user = {};
          user.deviceState = "registered";
          user.userid = e.data["to-user"];
          user.callDirection = null;
          user.selected = false;
          deviceList.push(user);
        }
      } else if (e.eventChannel == "FSevent.custom::sofia::unregister") {
        deviceList.forEach(function (d, i) {
          if (d.userid == e.data["from-user"]) {
            deviceList.splice(i, 1);
          }
        });
      }

      _this.deviceList = Object.assign([], deviceList);
    },
    selectClick(index, plan) {
      let target = $(".table>tbody>tr").eq(index);
      if (target.hasClass("selected")) {
        this.detailData = "";
        this.selectPlan.forEach(
          function (s, i) {
            if (s.planid == plan.planid) {
              this.selectPlan.splice(i, 1);
            }
          }.bind(this)
        );
      } else {
        this.selectPlan.push(plan);
        this.detailData = plan;
        this.detailData.planpretime = this.dateToStr(
          this.detailData.planpretime
        );
        this.showPeriod = this.detailData.period / 86400;
      }
      this.selectPlan;
      target.toggleClass("selected");
    },
    booking(type) {
      this.editShow = !this.editShow;
      $("#aa").toggle();
      if (type == 1) {
        this.refresh();
      }
    },
    orderDetail(item) {
      if (this.detailData != "") {
        this.showPeriod = item.period / 86400;
        this.vertoHandle.sendMethod(
          "jsapi",
          {
            command: "fsapi",
            data: { cmd: "show", arg: "registrations as xml" },
          },
          function (data) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.message, "text/xml");
            const msg = parseXML(doc);
            this.deviceList = [];
            let registrations = [];
            if (msg) {
              if (isArray(msg.row)) {
                registrations = msg.row;
              } else if (isObject(msg.row)) {
                registrations.push(msg.row);
              } else if (isArray(msg)) {
                registrations = msg;
              } else if (isObject(msg)) {
                registrations.push(msg);
              }
            }

            registrations.forEach((s, i) => {
              let user = {};
              user.deviceState = "registered";
              user.userid = s.reg_user;
              user.callDirection = null;
              user.selected = false;
              this.deviceList.push(user);
            });
          }.bind(this),
          function (data) {
            console.log("error:" + data);
          }.bind(this)
        );

        // 订阅注册事件
        this.vertoHandle.subscribe("FSevent.custom::sofia::register", {
          handler: this.handleFSEventRegister.bind(this),
        });
        // 订阅取消注册事件
        this.vertoHandle.subscribe("FSevent.custom::sofia::unregister", {
          handler: this.handleFSEventRegister.bind(this),
        });

        this.instance({
          method: "get",
          url: "/Plan/Folders/" + item.planid,
          data: {},
        }).then((res) => {
          this.pList = res.data.result;
          this.value = this.pList[0].folderid;
        });
        this.instance({
          method: "get",
          url: "/Plan/Devices/" + item.planid,
          data: {},
        }).then((res) => {
          this.dList = res.data.result;
          let _this = this;
          this.selectDevice = [];
          this.deviceList.forEach(function (s, i) {
            _this.dList.forEach(function (c, j) {
              if (s.userid == c) {
                _this.selectDevice.push(s);
              }
            });
          });
          this.unselectDevice = [];
          this.deviceList.forEach((item) => {
            this.unselectDevice.push(item);
          });
          for (let i = 0; i < this.unselectDevice.length; i++) {
            for (let j = 0; j < this.dList.length; j++) {
              if (this.unselectDevice[i].userid == this.dList[j]) {
                this.unselectDevice.splice(i, 1);
                i -= 1;
                break;
              }
            }
          }
        });
        this.dialogVisible = true;
      } else {
        this.$message("请选择想要查看的预约！");
      }
    },
    diaConfirm(detailData) {
      this.$ajax
        .get(
          "https://scc.yuqi.com:8082/api/deletescheds/" + detailData.planid
        )
        .then((re) => {});
      this.$ajax.post("Plan/RemoveList", [detailData.planid]).then((re) => {
        if (re.data.code == 1) {
          console.log("delete_success");
        } else {
          console.log("failed");
        }
        this.returnData = this.detailData;
        this.returnData.FeatureBases = this.selectDevice;
        this.returnData.FeatureBases.forEach(function (s, i) {
          s.deviceid = s.userid;
        });
        let _this = this;
        this.playList.forEach(function (s, i) {
          if (s.folderid == _this.value) {
            _this.selectPlayList.push(s);
          }
        });
        this.returnData.folders = this.selectPlayList;
        this.returnData.period = this.showPeriod * 86400;
        this.selectPlayList = [];
        this.$ajax.post("Plan/Create", this.returnData).then((res) => {
          if (res.data.code == 1) {
            console.log("create_success");
            let device_ids = "";
            this.selectDevice.forEach((element, i) => {
              if (i != 0) device_ids += "-";
              device_ids += element.userid;
            });
            let planid = res.data.result.planid;
            this.$ajax.get(
              "https://scc.yuqi.com:8082/api/scheds/" +
                planid +
                "%" +
                device_ids +
                "%" +
                this.returnData.planmodel
            );
            this.$emit("close", 1);
          } else {
          }
        });
        this.dialogVisible = false;
        this.showPlanData = "";
        this.deviceList = [];
        this.selectDevice = [];
        this.unselectDevice = [];
        this.refresh();
      });
    },
    diaReturn() {
      this.dialogVisible = false;
      this.refresh();
    },
    deleteItem() {
      if (this.selectPlan.length != 0) {
        this.$store.dispatch("setDialogShow", true);
      }
    },
    fsAPI(cmd, arg, success_cb, failed_cb) {
      this.vertoHandle.sendMethod(
        "jsapi",
        {
          command: "fsapi",
          data: {
            cmd: cmd,
            arg: arg,
          },
        },
        success_cb,
        failed_cb
      );
    },
    selectItem(device) {
      this.selectDevice.push(device);
      this.unselectDevice.forEach(
        function (s, i) {
          if (device.userid == s.userid) {
            this.unselectDevice.splice(i, 1);
          }
        }.bind(this)
      );
    },
    deleteDevice(device) {
      this.unselectDevice.push(device);
      this.selectDevice.forEach(
        function (s, i) {
          if (device.userid == s.userid) {
            this.selectDevice.splice(i, 1);
          }
        }.bind(this)
      );
    },
    nowPlay() {},
    feidingshi(plan) {
      console.log(plan);
      let planid = plan.planid;
      let device_ids = plan.deviceids.replace(/,/g, "-");
      console.log(device_ids);
      let planmodel = plan.planmodel;
      this.$ajax.get(
        "https://scc.yuqi.com:8082/api/scheds/" +
          planid +
          "%" +
          device_ids +
          "%" +
          planmodel
      );
    },
    confirm() {
      let ids = [];
      this.selectPlan.forEach(function (s, i) {
        ids.push(s.planid);
      });
      let _this = this;
      ids.forEach(function (s, i) {
        console.log("delete_freeswitch_scheds");
        _this.$ajax
          .get("https://scc.yuqi.com:8082/api/deletescheds/" + s)
          .then((res) => {});
      });
      this.$ajax.post("Plan/RemoveList", ids).then((res) => {
        if (res.data.code == 1) {
          this.$store.dispatch("setDialogShow", false);
          this.refresh();
        } else {
        }
      });
    },
  },
};
</script>

<style>
/* .el-input__inner {
    color: #fff !important; 
  }*/
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
</style>
