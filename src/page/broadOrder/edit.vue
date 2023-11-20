<template>
  <div class="popSp" id="ccc">
    <div>
      <div class="planName padding">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-1 control-label"
              >预案名称</label
            >
            <div class="col-sm-11">
              <input
                type="text"
                class="form-control"
                placeholder="请输入预案名称"
                v-model="formData.PlanName"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="filesSelect">
        <ul class="nav nav-justified broadcast" data-name="title">
          <li class="on">播放列表</li>
          <li>实时文本</li>
        </ul>
        <div class="con" data-name="con">
          <div>
            <div class="selection">
              <div class="menuType">
                <i class="fa fa-outdent" aria-hidden="true"></i>播放列表
              </div>
              <div id="songListHeight">
                <div
                  class="songSheet"
                  v-for="songlist in playList"
                  @click="() => (songlist.unfold = !songlist.unfold)"
                >
                  <div
                    class="songSheetName"
                    :class="songlist.selected ? 'songSheetNameSelect' : ''"
                  >
                    <div class="songSetting">
                      <span class="toggle"
                        ><i class="fa fa-angle-right" aria-hidden="true"></i
                      ></span>
                      <p contenteditable="false">{{ songlist.foldername }}</p>
                      <span class="musicNum"
                        >[{{
                          songlist.Files ? songlist.Files.length : 0
                        }}]</span
                      >
                    </div>
                    <span
                      class="songSheetTool"
                      @click.stop="selectSonglist(songlist)"
                      >选择</span
                    >
                  </div>
                  <ul class="musicList" v-if="songlist.unfold">
                    <li v-for="fileItem in songlist.Files">
                      <p>{{ fileItem.filename }}</p>
                      <ul class="musicListTools">
                        <li>
                          <i class="fa fa-play-circle" aria-hidden="true"></i
                          >试听
                        </li>
                      </ul>
                      <span class="totalTime">05:12</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="textFlies">
              <textarea
                class="form-control"
                v-model="xData.path"
                id="textarea01"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="detailSeclet">
        <ul class="nav nav-justified broadcast" data-name="title">
          <li class="on">在线列表</li>
          <li>分组列表</li>
        </ul>
        <div class="con" data-name="con">
          <div>
            <div class="selectedList" id="height04">
              <div
                class="singleFlies"
                :class="device.selected ? 'selected' : ''"
                v-if="device.deviceState != 'unregistered'"
                v-for="device in deviceList"
                @click="selectItem(device)"
              >
                {{ device.userID }}
              </div>
            </div>
            <div class="selectAll" @click="selectAll(1)">全选</div>
          </div>
          <div>
            <div class="sp-department">
              <ul data-name="title">
                <li class="on">广播组</li>
                <li>顺振队列组</li>
                <li>同振队列组</li>
                <li>对讲组</li>
                <li>会议组</li>
              </ul>
            </div>
            <div class="sp-right" data-name="con">
              <div>
                <div class="selectedList" id="height05">
                  <div
                    class="singleFlies"
                    :class="conf.selected ? 'selected' : ''"
                    v-for="conf in group1"
                    @click="selectItemx(conf)"
                  >
                    {{ conf.conf_num }}
                  </div>
                </div>
              </div>
              <div>
                <div class="selectedList" id="height06">
                  <div
                    class="singleFlies"
                    :class="conf.selected ? 'selected' : ''"
                    v-for="conf in group2"
                    @click="selectItemx(conf)"
                  >
                    {{ conf.conf_num }}
                  </div>
                </div>
              </div>
              <div>
                <div class="selectedList" id="height10">
                  <div
                    class="singleFlies"
                    :class="conf.selected ? 'selected' : ''"
                    v-for="conf in group3"
                    @click="selectItemx(conf)"
                  >
                    {{ conf.conf_num }}
                  </div>
                </div>
              </div>
              <div>
                <div class="selectedList" id="height11">
                  <div
                    class="singleFlies"
                    :class="conf.selected ? 'selected' : ''"
                    v-for="conf in group4"
                    @click="selectItemx(conf)"
                  >
                    {{ conf.conf_num }}
                  </div>
                </div>
              </div>
              <div>
                <div class="selectedList" id="height12">
                  <div
                    class="singleFlies"
                    :class="conf.selected ? 'selected' : ''"
                    v-for="conf in group5"
                    @click="selectItemx(conf)"
                  >
                    {{ conf.conf_num }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="menuType">
            <i class="fa fa-th-large" aria-hidden="true"></i>播放设备列表
          </div>
          <div class="selectedList" id="height07">
            <div
              class="singleFlies selectDelate"
              v-for="device in selectDevice"
              @click="deleteDevice(device)"
            >
              {{ device.userID }}
            </div>
          </div>
          <div class="selectAll" @click="deleteAll()">全部删除</div>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogxVisible"
      width="30%"
      append-to-body
    >
      <div>
        <div class="settingCon">
          <label style="display: block">自选周期设置</label>
          <span class="times" @click="subtract" style="background-color: black"
            >-</span
          >
          <input type="text" v-model="cycleIndex" class="cycleIndex" />
          <span class="times" @click="add" style="background-color: black"
            >+</span
          >
          <span>天</span>
        </div>
        <div>
          <br />
        </div>
        <div class="settingCon">
          <label style="display: block">常用周期选择</label>
          <span
            class="moudle"
            :class="dayOrWeek == 2 ? 'selected' : ''"
            @click="everyWeek"
            style="background-color: black"
            >每周播放</span
          >
          <span
            class="moudle"
            :class="dayOrWeek == 1 ? 'selected' : ''"
            @click="everyDay"
            style="background-color: black"
            >每日播放</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogxVisible = false"
          ><span style="color: #333">取 消</span></el-button
        >
        <el-button type="primary" @click="dialogxVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="setting">
      <div class="settingMoudle">
        <div class="settingTitle">选择时间</div>
        <div class="settingCon">
          <el-date-picker
            type="datetime"
            v-model="formData.PlanPreTime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </div>
      </div>

      <div class="settingMoudle">
        <div class="settingTitle">循环周期</div>
        <div class="settingCon">
          <!-- <span class="times" @click="subtract">-</span>
          <input type="text" v-model="cycleIndex" class="cycleIndex"/>
          <span class="times" @click="add">+</span>
          <span>天</span> -->
          <el-button type="info" @click="test">选择循环周期</el-button>
        </div>
      </div>
      <div class="settingMoudle">
        <div class="settingTitle">循环次数(-1为循环播放)</div>
        <div class="settingCon">
          <span class="times" @click="subtractTime">-</span>
          <input type="text" v-model="cycleTime" class="cycleIndex" />
          <span class="times" @click="addTime">+</span>
          <span>次</span>
        </div>
      </div>
      <div class="settingMoudle">
        <div class="settingTitle">播放文件类型</div>
        <div class="settingCon">
          <span
            class="moudle"
            :class="xData.cmdtype == 2 ? 'moudleSelected' : ''"
            @click="textPlay"
            >文本播放</span
          >
          <span
            class="moudle"
            :class="xData.cmdtype == 1 ? 'moudleSelected' : ''"
            @click="musicPlay"
            >音乐播放</span
          >
        </div>
      </div>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-info" @click="submitPlan">
        确定
      </button>
      <button type="button" class="btn btn-default" @click="close">取消</button>
    </div>
    <tool-tip :dialogShow="dialogShow" @close="closeTip">
      <p slot="content">{{ dialogText }}</p>
    </tool-tip>
  </div>
</template>

<script>
import parseXML from "utils/xml_parser";
import { isArray, isObject, isString } from "utils/tool";
import { mapGetters, mapActions } from "vuex";
import { toolTip } from "components";
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/broadOrder";
import { GET_USER_INFO } from "store/getters/type";
export default {
  data() {
    return {
      playList: [], // 歌单列表
      selectDevice: [], // 已勾选的设备
      selectConf: [], // 已勾选的组
      checkplaylist: [],
      isSelectAll: false, // 是否全选
      playCount: 0,
      cycleIndex: 0, // 预案循环次数
      cycleTime: -1,
      group1: [],
      group2: [],
      group3: [],
      group4: [],
      group5: [],
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      formData: {
        CreateUserID: "133585596bb04c9cbe311d0859dd7196",
        PlanName: "",
        PlanPreModel: 1,
        planmodel: 0,
        PlanPreTime: null,
        PlanActualTxt: "",
        folders: [], // 已勾选的歌单
        deviceId: "1005",
        FeatureBases: [],
        FeatureCode: [],
      },
      selectSongList: [],
      xData: {
        path: "",
        time: "",
        meeting: "",
        cmdtype: 0,
        period: "",
      },
      verto: "",
      meeting: "",
      voice: "",
      alarm: "",
      broad: "",
      dialogShow: false,
      dialogText: null,
      num1: 1,
      dialogxVisible: false,
      dayOrWeek: 0, //1代表每日播放，2代表每周播放
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.refresh();
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.alarm = this.get_user_info.freeswitchData.AlarmID;
      this.broad = this.get_user_info.freeswitchData.BroadID;
      this.organizationid = this.get_user_info.user.organizationid;
    });
  },
  components: {
    toolTip,
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      currentLoginUser: "currentLoginUser",
      deviceList: "deviceList",
      get_user_info: GET_USER_INFO,
    }),
  },
  methods: {
    async refresh() {
      let resultxxx = await this.instance({
        method: "get",
        url: `Organization/getDeviceGroup/${this.get_user_info.user.organizationid}`,
      });
      resultxxx.data.result.forEach((s, i) => {
        if (s.conf_num.substring(0, 2) === "80") {
          this.group1.push(s);
        } else if (s.conf_num.substring(0, 2) === "81") {
          this.group2.push(s);
        } else if (s.conf_num.substring(0, 2) === "82") {
          this.group3.push(s);
        } else if (s.conf_num.substring(0, 2) === "83") {
          this.group4.push(s);
        } else {
          this.group5.push(s);
        }
      });
      // 1、查询歌单数组
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
      // 2、查询所有在线设备
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

          let registrations = [];
          let deviceList = [];
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
        }.bind(this),
        function (data) {}.bind(this)
      );

      // 订阅注册事件
      //this.vertoHandle.subscribe("FSevent.custom::sofia::register", {handler: this.handleFSEventRegister.bind(this)});
      // 订阅取消注册事件
      //this.vertoHandle.subscribe("FSevent.custom::sofia::unregister", {handler: this.handleFSEventRegister.bind(this)});
    },
    // 注册事件 和 取消注册事件
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
    everyWeek() {
      this.dayOrWeek = 2;
      this.cycleIndex = 7;
    },
    everyDay() {
      this.dayOrWeek = 1;
      this.cycleIndex = 1;
    },
    textPlay() {
      this.xData.cmdtype = 2;
    },
    musicPlay() {
      this.xData.cmdtype = 1;
    },
    subtractTime() {
      if (this.cycleTime == 1) {
        this.cycleTime = -1;
      }
      if (this.cycleTime > 1) {
        this.cycleTime = this.cycleTime - 1;
      }
    },
    test() {
      this.dialogxVisible = true;
    },
    addTime() {
      if (this.cycleTime == -1) {
        this.cycleTime = 1;
      } else if (this.cycleTime < 10) {
        this.cycleTime = this.cycleTime + 1;
      }
    },
    subtract() {
      this.dayOrWeek = 0;
      if (this.cycleIndex > 0) {
        this.cycleIndex = this.cycleIndex - 1;
      }
    },
    add() {
      this.dayOrWeek = 0;
      if (this.cycleIndex < 10) {
        this.cycleIndex = this.cycleIndex + 1;
      }
    },
    selectSonglist(songlist) {
      if (!songlist.selected) {
        this.formData.folders.push(songlist);
        this.selectSongList.push(songlist);
      } else {
        this.selectSongList.forEach(
          function (c, i) {
            if (songlist.FolderID == c.FolderID) {
              this.selectSongList.splice(i, 1);
              this.formData.folders.splice(i, 1);
            }
          }.bind(this)
        );
      }
      songlist.selected = !songlist.selected;
    },
    selectItem(device) {
      if (!device.selected) {
        this.selectDevice.push(device);
        device.selected = true;
      } else {
        this.deleteDevice(device);
      }
    },
    async selectItemx(conf) {
      if (!conf.selected) {
        let deviceyyy = [];
        let resultyyy = await this.instance({
          method: "get",
          url: `DeviceGroup/Detail/${conf.id}`,
        });
        resultyyy.data.result.deviceGroups.forEach((s, i) => {
          deviceyyy.push(s.devicecode);
        });
        let deviceyyyadd = [];
        this.deviceList.forEach((s, i) => {
          deviceyyy.forEach((x, y) => {
            if (s.userID == x) {
              deviceyyyadd.push(s);
            }
          });
        });
        deviceyyyadd.forEach((s, i) => {
          let exist = 0;
          this.selectDevice.forEach((x, y) => {
            if (s.userID == x.userID) {
              exist = 1;
            }
          });
          if (exist == 0) {
            s.selected = true;
            this.selectDevice.push(s);
          }
        });
      } else {
        this.deleteConf(conf);
      }
    },
    selectAll(type) {
      if (type == 1) {
        if (!this.isSelectAll) {
          this.selectDevice = [];
          this.deviceList.forEach((d, i) => {
            if (
              d.deviceState == "registered" ||
              d.deviceState == "registeredM"
            ) {
              d.selected = true;
              this.selectDevice.push(d);
            }
          });
        } else {
          this.selectDevice = [];
          this.deviceList.forEach((d, i) => {
            if (
              d.deviceState == "registered" ||
              d.deviceState == "registeredM"
            ) {
              d.selected = false;
              this.deleteDevice(d);
            }
          });
        }
        this.isSelectAll = !this.isSelectAll;
      }
    },
    deleteDevice(device) {
      this.selectDevice.forEach(
        function (s, i) {
          if (device.userID == s.userID) {
            this.selectDevice.splice(i, 1);
          }
          device.selected = false;
        }.bind(this)
      );
    },
    deleteConf(conf) {
      this.selectConf.forEach(
        function (s, i) {
          if (conf.conf_num == s.conf_num) {
            this.selectConf.splice(i, 1);
          }
          conf.selected = false;
        }.bind(this)
      );
    },
    deleteAll() {
      this.selectDevice = [];
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
    closeTip() {
      this.dialogShow = false;
    },
    submitPlan() {
      Date.prototype.format = function (format) {
        var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          S: this.getMilliseconds(), //millisecond
        };
        if (/(y+)/.test(format))
          format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return format;
      };
      this.xData.period = String(this.cycleIndex * 86400);
      let path = "";
      if (typeof this.formData.PlanPreTime != "undefined") {
        this.xData.time = this.formData.PlanPreTime.format(
          "yyyy-MM-dd hh:mm:ss"
        );
      } else {
        this.formData.PlanPreTime = new Date(0, 0, 0, 0, 0, 0);
        this.xData.time = this.formData.PlanPreTime.format(
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      this.xData.meeting = this.broad;
      if (this.xData.cmdtype == 1) {
        this.selectSongList.forEach(
          function (c, i) {
            c.Files.forEach(
              function (s, j) {
                let mediapath = s.mediapath.split("/");
                path = path + " " + mediapath[mediapath.length - 1];
              }.bind(this)
            );
          }.bind(this)
        );
        this.xData.path = path;
      }
      // 提交预案
      if (this.formData.PlanName == "") {
        this.dialogText = "预案名称不能为空";
        this.dialogShow = true;
      } else {
        if(this.xData.cmdtype===0){
          this.dialogText = "播放文件类型未选择";
          this.dialogShow = true;
        }else if (this.xData.path == "") {
          this.dialogText = "歌单选择或者实时文本输入不能为空";
          this.dialogShow = true;
        } else {
          this.selectDevice.forEach(
            function (s, i) {
              s.deviceid = s.userID;
            }.bind(this)
          );
          this.formData.FeatureBases = this.selectDevice;
          this.formData.planmodel = this.cycleTime;
          this.$ajax
            .post("Plan/Create", Object.assign(this.formData, this.xData))
            .then((res) => {
              if (res.data.code == 1) {
                if (
                  this.formData.PlanPreTime.format("yyyy-MM-dd hh:mm:ss") ==
                  "1899-12-31 00:00:00"
                ) {
                  this.deleteAll();
                  this.deviceList.forEach((item) => {
                    item.selected = false;
                  });
                  this.$emit("close", 1);
                } else {
                  let device_ids = "";
                  this.selectDevice.forEach((element, i) => {
                    if (i != 0) device_ids += "-";
                    device_ids += element.userID;
                  });
                  let planid = res.data.result.planid;
                  this.$ajax.get(
                    "https://scc.yuqi.com:8082/api/scheds/" +
                      planid +
                      "%" +
                      device_ids +
                      "%" +
                      this.cycleTime
                  );
                  this.deleteAll();
                  this.deviceList.forEach((item) => {
                    item.selected = false;
                  });
                  this.$emit("close", 1);
                }
              } else {
              }
            });
        }
      }
    },
    close() {
      this.$emit("close");
      this.deleteAll();
      this.deviceList.forEach((item) => {
        item.selected = false;
      });
    },
  },
};
</script>

<style>
.el-button--info {
  color: #fff;
  background-color: #697379bf;
  border-color: #323439;
}
</style>
