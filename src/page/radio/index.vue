<template>
  <div>
    <left-phone :select-phone="selectPhone" @reset="reset"></left-phone>
    <div id="media">
      <!-- <video width="800" id="webcam" autoplay="autoplay" hidden="true"></video> -->
    </div>
    <div class="middleCon">
      <div class="module">
        <ul class="nav nav-justified choose" data-name="title">
          <li @click="refresh(null)" class="on">全部</li>
          <li @click="refresh(userGroup[0])">分组</li>
        </ul>
        <div data-name="con">
          <div class="moduleList" id="height01">
            <div class="singleM" v-for="item in deviceList">
              <div
                class="moduleStyle"
                :class="returnClass(item.deviceState, item.type)"
                @click.stop="itemClick($event, item)"
              >
                <div
                  class="moduleNum"
                  style="
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  <i :class="returnIcon(item.type)" aria-hidden="true"></i
                  >{{
                    item.userID + " " + (item.name == null ? "" : item.name)
                  }}
                </div>
                <div class="moduleKind">
                  {{ returnType(item.type) }}
                  <i
                    class="fa fa-user"
                    v-if="
                      item.deviceState == 'active' ||
                      item.deviceState == 'ringing'
                    "
                  ></i>
                  {{ item.calling == null ? "" : item.calling }}
                </div>
                <div class="moduleState">
                  {{
                    returnState(item.deviceState) +
                    "   " +
                    (item.timer.s > 0 || item.timer.m > 0 || item.timer.h > 0
                      ? (item.timer.h / 10 < 1
                          ? "0" + item.timer.h + ":"
                          : item.timer.h + ":") +
                        (item.timer.m / 10 < 1
                          ? "0" + item.timer.m + ":"
                          : item.timer.m + ":") +
                        (item.timer.s / 10 < 1
                          ? "0" + Math.floor(item.timer.s)
                          : Math.floor(item.timer.s))
                      : "")
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="moduleList">
            <div class="department">
              <ul data-name="title">
                <li
                  @click="refresh(item)"
                  :class="{ on: item.selected }"
                  v-for="item in userGroup"
                >
                  {{ item.name + " " + item.devicegroup_extn }}
                </li>
              </ul>
            </div>
            <div class="rightDetailList" data-name="con">
              <div class="departDetail">
                <div class="detailCon">
                  <div
                    class="singleM"
                    v-show="returnGroup(item)"
                    v-for="item in deviceList"
                  >
                    <div
                      class="moduleStyle"
                      :class="returnClass(item.deviceState, item.type)"
                      @click.stop="itemClick($event, item)"
                    >
                      <div class="moduleNum">
                        <i :class="returnIcon(item.type)" aria-hidden="true"></i
                        >{{
                          item.userID +
                          " " +
                          (item.name == null ? "" : item.name)
                        }}
                      </div>
                      <div class="moduleKind">
                        {{ returnType(item.type) }}
                        <i
                          class="fa fa-user"
                          v-if="
                            item.deviceState == 'active' ||
                            item.deviceState == 'ringing'
                          "
                        ></i>
                        {{ item.calling == null ? "" : item.calling }}
                      </div>
                      <div class="moduleState">
                        {{
                          returnState(item.deviceState) +
                          "   " +
                          (item.timer.s > 0 ||
                          item.timer.m > 0 ||
                          item.timer.h > 0
                            ? (item.timer.h / 10 < 1
                                ? "0" + item.timer.h + ":"
                                : item.timer.h + ":") +
                              (item.timer.m / 10 < 1
                                ? "0" + item.timer.m + ":"
                                : item.timer.m + ":") +
                              (item.timer.s / 10 < 1
                                ? "0" + Math.floor(item.timer.s)
                                : Math.floor(item.timer.s))
                            : "")
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="selectAll">全部选择</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="functionMenu">
        <ul class="nav nav-justified menuList">
          <li
            id="a1"
            @click="startMeeting"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <i class="fa fa-fire fa-2x" aria-hidden="true"></i>
            <span>开始对讲</span>
          </li>
          <li
            id="a2"
            @click="startMeeting"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <i class="fa fa-user-plus fa-2x" aria-hidden="true"></i>
            <span>加入成员</span>
          </li>
          <li
            id="a3"
            @click="selectAll"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <i class="fa fa-group fa-2x" aria-hidden="true"></i
            ><span>全选</span>
          </li>
        </ul>
      </div>
    </div>
    <right-phone></right-phone>
    <!--confirm-dialog v-if="dialogShow"-->
    <!--slot name="content">确定要呼叫到</slot-->
    <!--/confirm-dialog-->
    <!--callDivert v-if="phoneShow"></callDivert-->
  </div>
</template>

<script>
import parseXML from "utils/xml_parser";
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/meeting";
import { isArray, isObject, isString } from "utils/tool.js";
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";
import { leftPhone, rightPhone, confirmDialog, callDivert } from "components";
export default {
  watch: {},
  data() {
    return {
      shows: false,
      deviceAll: [],
      name: "",
      nowSession: [], // 正在开会的话机
      selectNowSession: [], // 会议中选中的话机
      selectPhone: [],
      groupShow: "", // 选中待会议的话机
      selectNowCall: [],
      selectRingCall: [],
      meeting: "",
      org: "",
    };
  },
  computed: {
    ...mapGetters({
      dialogShow: "dialogShow",
      vertoHandle: "vertoHandle", // verto初始化
      deviceList: "deviceList", // 分组设备(不包括当前用户)
      phoneShow: "phoneShow", // 话机显示或隐藏
      userGroup: "userGroup",
      confMeeting: "confMeeting",
      get_user_info: GET_USER_INFO,
      selectPhonex: "selectPhonex",
    }),
  },
  components: {
    leftPhone,
    rightPhone,
    confirmDialog,
    callDivert,
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.name =
        this.get_user_info.freeswitchData.MeetingID +
        "-" +
        window.location.hostname;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.org = this.get_user_info.user.OrgName;
      this.refresh();
    });
  },
  methods: {
    reset() {
      this.selectPhone = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
    },
    returnIcon(type) {
      switch (type) {
        case 0:
          return "fa fa-microphone";
          break;
        case 1:
          return "fa fa-video-camera";
          break;
        case 2:
          return "fa fa-user";
          break;
      }
    },
    returnGroup(item) {
      return item.groupid.some((it) => {
        return it == this.groupShow;
      });
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
    returnClass(status, type) {
      switch (status) {
        case "registered":
          return "online";
          break;
        case "registeredM":
          return "onlineMulticast";
          break;
        case "unregistered":
          return "offline";
          break;
        case "ringing":
          return "waitting";
          break;
        case "active":
          return "calling";
          break;
        case "register":
          return "online";
          break;
        default:
          return "online";
      }
    },
    returnState(status) {
      switch (status) {
        case "registeredM":
          return "在线";
          break;
        case "registered":
          return "在线";
          break;
        case "unregistered":
          return "离线";
          break;
        case "ringing":
          return "振铃";
          break;
        case "active":
          return "通话中";
          break;
        case "register":
          return "在线";
          break;
      }
    },
    refresh(item) {
      this.$store.dispatch("setSelectPhonex", null);
      this.userGroup.forEach((r, i) => {
        r.selected = false;
      });
      if (item) {
        item.selected = true;
        this.groupShow = item.devicegroupid;
      } else this.groupShow = "";
    },
    itemClick(e, row) {
      let target = e.currentTarget;
      let _this = this;

      if ($(target).hasClass("online")) {
        if ($(target).hasClass("onlineSelected")) {
          $(target).removeClass("onlineSelected");
          this.selectPhone.forEach((s, i) => {
            if (s.userID == row.userID) {
              this.selectPhone.splice(i, 1);
            }
          });
          //            this.selectPhone.splice(this.selectPhone.indexOf(row.userExten));
        } else {
          $(target).addClass("onlineSelected");
          this.selectPhone.push(row);
        }
      } else if ($(target).hasClass("onlineMulticast")) {
        if ($(target).hasClass("onlineMulticastSelected")) {
          $(target).removeClass("onlineMulticastSelected");
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1);
            }
          });
        } else {
          $(target).addClass("onlineMulticastSelected");
          this.selectPhone.push(row);
        }
      } else if ($(target).hasClass("calling")) {
        if ($(target).hasClass("callingSelected")) {
          $(target).removeClass("callingSelected");
          this.selectNowSession.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectNowSession.splice(i, 1);
            }
          });
        } else {
          $(target).addClass("callingSelected");
          this.selectNowSession.push(row);
        }
      } else if ($(target).hasClass("waitting")) {
        if ($(target).hasClass("waittingSelected")) {
          $(target).removeClass("waittingSelected");
        } else {
          $(target).addClass("waittingSelected");
        }
      }
    },
    //  开始会议
    startMeeting() {
      const laChannelName = this.getChannelName("liveArray");
      if (this.selectPhone.length != 0) {
        //  赋值到会议话机数组
        this.nowSession = Object.assign([], this.selectPhone);
        //  单个设备开始会议
        this.selectPhone.forEach((s, i) => {
          this.fsAPI(
            "conference",
            this.name +
              " " +
              "bgdial" +
              " " +
              (s.type == 2 ? "loopback" : "user/") +
              this.selectPhone[i].userID +
              " " +
              this.meeting +
              "-" +
              this.org +
              "会议呼叫",
            function (res) {
              console.log("邀请会议", res);
            }
          );
        });

        //  重置勾选话机数组
        this.selectPhone = [];
        $(".onlineSelected").removeClass("onlineSelected"); //.addClass('online')
        //  重置勾选样式
        //let allPhone = $('.middleCon .memberList').eq(1).find('.moduleList').find('.moduleStyle')
        //for(let i=0;i<allPhone.length;i++) {
        //  $(allPhone[i]).removeClass('onlineSelected')
        //  $(allPhone[i]).removeClass('callingSelected')
        //  $(allPhone[i]).removeClass('waittingSelected')
        //}

        this.broadcast(laChannelName, {
          liveArray: {
            command: "bootstrap",
            context: laChannelName,
            name: this.name,
            obj: {},
          },
        });
      }
    },
    broadcast(channel, params) {
      var msg = {
        eventChannel: channel,
        data: {},
      };

      for (var i in params) {
        msg.data[i] = params[i];
      }
      this.vertoHandle.sendMethod("verto.broadcast", msg);
    },
    getChannelName(what) {
      // liveArray chat mod
      return (
        "conference-" + what + "." + this.name + "@" + window.location.hostname
      );
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
    //  结束会议
    closeMeeting() {
      if (this.selectNowSession.length != 0) {
        this.fsAPI(
          "conference",
          this.name + " " + "hup all",
          function (res) {
            console.log("会议结束 ", res);
            this.nowSession = [];
            this.selectNowSession = [];
          }.bind(this)
        );
      }
    },

    publicFunction(type) {
      if (this.selectNowSession.length != 0) {
        this.fsAPI(
          "conference",
          "list as json",
          function (res) {
            let msg = res.message.split("\n").splice(1);

            msg.forEach((m, i) => {
              if (m == "") return;
              let id = m.split(";")[0];
              this.fsAPI(
                "conference",
                this.name + " " + type + " " + id,
                function (res) {
                  switch (type) {
                    case "mute":
                      console.log("禁止发言成功：", res);
                      break;
                    case "unmute":
                      console.log("允许发言成功：", res);
                      break;
                    case "kick":
                      console.log("踢出会议成功：", res);
                      break;
                  }
                  this.removeChecked();
                }.bind(this)
              );
            });
          }.bind(this)
        );
      } else {
        console.log("请勾选要执行的设备！");
      }
    },
    // 清除勾选的设备
    removeChecked() {
      this.nowSession.forEach(
        function (n, i) {
          this.selectNowSession.map(
            function (s, c) {
              if (n.userExten == s.userExten) {
                this.nowSession.splice(i, 1);
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    selectAll() {
      this.selectPhone = [];
      this.deviceList.forEach((device) => {
        if (this.groupShow == "" || this.returnGroup(device) == true)
          this.selectPhone.push(device);
      });
      $(".online").addClass("onlineSelected");
    },
    // 会议录音
    meetingRecord(type) {
      this.vertoHandle.fsAPI(
        "conference",
        this.name + " recording " + type + " /tmp/record.wav",
        function (res) {
          console.log("会议录音成功: ", res);
        }
      );
    },
  },
};
</script>

<style scoped>
</style>
