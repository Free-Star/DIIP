<script src="../../utils/page/meeting.js"></script>
<template>
  <div>
    <left-phone :select-phone="selectPhone" @reset="reset"></left-phone>
    <div class="middleCon">
      <div class="module">
        <ul class="nav nav-justified choose" data-name="title">
          <li class="on">全部（{{onlineNum}}/{{deviceList.length}}）</li>
          <li @click="st2">分组</li>
          <!-- <li @click="st3" :class="st==3?'on':''">视频</li> -->
        </ul>
        <div data-name="con">
          <div class="moduleList" id="height01">
            <div class="myButtonUp" v-if="buttonShow">
              <el-button type="primary" icon="arrow-up" style="background-color: rgba(78,84,90,0.3); border-color: rgba(78,84,90,0.2);" @click.native="scrolling(-1, 1)"></el-button>
            </div>
            <div class="myButtonDown" v-if="buttonShow">
              <el-button type="primary" icon="arrow-down" style="background-color: rgba(78,84,90,0.3); border-color: rgba(78,84,90,0.2);" @click.native="scrolling(1, 1)"></el-button>
            </div>
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
                <div class="detailCon" id="groups">
                  <div class="myButtonUp" v-if="groupButtonShow">
                    <el-button type="primary" icon="arrow-up" style="background-color: rgba(78,84,90,0.3); border-color: rgba(78,84,90,0.2);" @click.native="scrolling(-1, 2)"></el-button>
                  </div>
                  <div class="myButtonDown" v-if="groupButtonShow">
                    <el-button type="primary" icon="arrow-down" style="background-color: rgba(78,84,90,0.3); border-color: rgba(78,84,90,0.2);" @click.native="scrolling(1, 2)"></el-button>
                  </div>
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
                <div class="selectAll" @click="selectAll()">全部选择</div>
              </div>
            </div>
          </div>
          <!-- <div class="st3" v-show="st==3">
            <video height="700" id="webcam" autoplay="autoplay" class="video"></video>
            <el-button type="primary" @click="quitVideo()">退出视频</el-button>
          </div> -->
        </div>
      </div>
      <div class="functionMenu">
        <ul class="nav nav-justified menuList">
          <li
            id="a1"
            @click="call"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="对单个设备发起呼叫"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-phone fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 1 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 1 ? { color: 'yellow' } : { color: 'white' }
              "
              >呼叫</span
            >
          </li>
          <!-- <li
            id="a9"
            @click="playVideo()"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="对单个设备发起视频呼叫"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-video-camera fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 9 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 9 ? { color: 'yellow' } : { color: 'white' }
              "
              >视频</span
            >
          </li> -->
          <li
            id="a2"
            @click="strongCall"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="强行插入到选中设备的呼叫当中，断掉对端呼叫"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-volume-control-phone fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 2 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 2 ? { color: 'yellow' } : { color: 'white' }
              "
              >强行通话</span
            >
          </li>
          <li
            id="a3"
            @click="strongDelete"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="强行结束选中的呼叫"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-window-close fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 6 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 6 ? { color: 'yellow' } : { color: 'white' }
              "
              >强拆</span
            >
          </li>
          <li
            id="a4"
            @click="strongJoin"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="强行插入到选中设备的呼叫当中并形成三方通话"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-deaf fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 3 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 3 ? { color: 'yellow' } : { color: 'white' }
              "
              >强插</span
            >
          </li>
          <li
            id="a5"
            @click="observe"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="强行插入到选中设备的呼叫进行监听,对方无法听见管理员"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-headphones fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 4 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 4 ? { color: 'yellow' } : { color: 'white' }
              "
              >监听</span
            >
          </li>
          <li
            id="a6"
            @click="daiJie"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="管理员对选中的未接听的呼叫进行代接，与其建立通话"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-phone-square fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 5 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 5 ? { color: 'yellow' } : { color: 'white' }
              "
              >代接</span
            >
          </li>
          <li
            id="a7"
            @click="callTraverse"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="将管理员进行的通话转给选中的在线话机"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-reply fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 7 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 7 ? { color: 'yellow' } : { color: 'white' }
              "
              >转到</span
            >
          </li>
          <li
            id="a8"
            @click="connect"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="在两个在线设备之间直接建立呼叫"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-arrow-right fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 8 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 8 ? { color: 'yellow' } : { color: 'white' }
              "
              >直连</span
            >
          </li>
          <li
            id="a9"
            @click="callHoldOn"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="把管理员进行的通话保留到队列中"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-spinner fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 10 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 10 ? { color: 'yellow' } : { color: 'white' }
              "
              >保留</span
            >
          </li>

          <li
            id="a10"
            @click="rollCall"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchend="$btnMouseup"
            @touchstart="$btnMousedown"
          >
            <el-tooltip
              content="对指定终端进行点名"
              placement="top"
              :open-delay="1000"
            >
              <i
                class="fa fa-check-square-o fa-2x"
                aria-hidden="true"
                :style="
                  adminState == 11 ? { color: 'yellow' } : { color: 'white' }
                "
              ></i>
            </el-tooltip>
            <span
              :style="
                adminState == 11 ? { color: 'yellow' } : { color: 'white' }
              "
              >点名</span
            >
          </li>
        </ul>
      </div>
    </div>
    <right-phone></right-phone>
    <video width="920" height="800" id="webcam" autoplay="autoplay"></video>
    <!-- <el-dialog
      title="视频通话"
      :visible.sync="videoVisible"
      width="30%"
      :before-close="handleClose"
    >
      <video width="920" height="800" id="webcam" autoplay="autoplay"></video>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quitVideo()">退出视频</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import parseXML from "utils/xml_parser";
import { mapGetters, mapActions } from "vuex";
import { getHeight } from "utils/height";
import { getHeights, itemClick } from "utils/page/voiceCall";
import { GET_USER_INFO } from "store/getters/type";
import { leftPhone, rightPhone, deviceList, switchs } from "components";

export default {
  components: {
    leftPhone,
    rightPhone,
    deviceList,
    switchs,
  },
  data() {
    return {
      st:1,
      inputValue: "",
      deviceAll: [],
      currentCall: null,
      destination_number: "",
      nowCall: [],
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      selectNowCall: [],
      selectPhone: [],
      selectRingCall: [],
      deviceGroupList: [],
      deviceGroup: [],
      num: 0,
      groupShow: "",
      verto: "",
      buttonShow: this.$store.state.buttonShow,
      groupButtonShow: false,
      maxCount: 30000,
      sortFlag: false,
      left_devices:[] //用来存放值班组的所有话机，方便v3版本的判断
    };
  },
  created() {
    let that = this;
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.organizationid = this.get_user_info.user.organizationid;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.meetingid = this.get_user_info.freeswitchData.MeetingID;
      this.rollcallid = this.get_user_info.freeswitchData.RollCallID; 
      this.instance({
        url: "organization/" + this.organizationid,
        method: "get",
      }).then((res) => {
        let devices = res.data.leftgroup;
        if(devices.length > 0)
        for (let index in devices) {
          that.left_devices.push(devices[index].devicecode);
        }
      });
      //this.initData()
      this.refresh();
    });
  },

  watch: {
    videoVisible: function (v) {
      if (v) {
        this.st = 3;
        // ('1234')
        // (document.getElementsByClassName('video'))
        // document.getElementsByClassName('video').display = "";
      }
    },

    deviceList: {
      handler(newval){
        if (this.sortFlag) {
          this.sortFlag = false;
          return;
        }
        let self = this;
        this.$nextTick(function () {
          self.sortByStatus(newval);
          let box = document.getElementById("height01");
          let singles = box.getElementsByClassName("singleM");
          let boxArea = box.clientHeight * box.clientWidth;
          try {
            let singleArea = singles[0].clientHeight * singles[0].clientWidth * singles.length;
            self.buttonShow = singleArea > boxArea? true : false;
          } catch (e) {}
        });
      },

      deep: true
    },

    deviceCount(newval) {
      this.groupButtonShow = newval > this.maxCount ? true : false;
    },

    maxCount(newval) {
      this.groupButtonShow = this.deviceCount > newval ? true : false;
    },

    buttonShow(newval) {
      this.$store.dispatch("setButtonShow", newval);
    }
  },

  computed: {
    ...mapGetters({
      dialogShow: "dialogShow",
      callQueue: "callQueue",
      vertoHandle: "vertoHandle",
      group_users: "group_users",
      users: "users",
      currentDeviceList: "deviceList",
      currentLoginUser: "currentLoginUser",
      userGroup: "userGroup",
      get_user_info: GET_USER_INFO,
      selectPhonex: "selectPhonex",
      adminState: "adminState",
      deviceStatus: "deviceStatus",
      dialogVisible: "dialogVisible",
      videoVisible: "videoVisible",
    }),

    // 定义一个包含 getter 和 setter 的属性
    deviceList: {
      get() {
        return this.currentDeviceList;
      },
      set(value) {
        this.$store.commit('SET_DEVICE_LIST', value);
      },
    },

    onlineNum() {
      let count = this.deviceList.length;
      if(this.deviceList == null || this.deviceList.length == undefined || this.deviceList.length == 0) return 0;
      this.deviceList.forEach(item => {
        if(item.deviceState == "unregistered") count--;
      })
      return count;
    },

    deviceCount() {
      let count = 0;
      let self = this;
      if(this.deviceList == null || this.deviceList.length == undefined || this.deviceList.length == 0) return 0;
      else {
        this.deviceList.forEach(item => {
        let check = item.groupid.some((it) => {
          return it == self.groupShow;
        });
          if(check) count++; 
        });
        return count;
      }
    }
  },
  methods: {
    // st1(){
    //   this.$store.dispatch("setVideoVisible",false)
    //   this.st=1
    // },
    st2() {
      // this.$store.dispatch("setVideoVisible",false)
      // this.st=2
      this.refresh(this.userGroup[0]);
      let self = this;
      setTimeout(function() {
        let groups = document.getElementById("groups");
        let singles = groups.getElementsByClassName("singleM");
        let groupsArea = groups.clientHeight * groups.clientWidth;
        if(singles != null && singles.length != 0) {
          for(let item of singles) {
            if(item.clientHeight != 0) {
              self.maxCount = Math.floor(groupsArea / (item.clientHeight * item.clientWidth));
            }
          }
        } else self.maxCount = 200;
      }, 500);  
    },
    // st3(){
    //   this.st=3
    // },
    quitVideo() {
      // this.$store.dispatch("setVideoVisible", false);
      this.hangupCall();
      this.$store.dispatch("setAdminState", 0);
    },

    sortByStatus(deviceList) {
      console.log("设备变化，进行排序：", deviceList);
      let result = deviceList.slice().sort((a, b) => {
        const order = { active: 1, ringing: 2, registered: 3, unregistered: 4 };
        return order[a.deviceState] - order[b.deviceState];
      });
      this.$set(this, 'deviceList', result);
      this.sortFlag = true;
    },

    scrolling(dir, pos) {
      let scroll;
      if(pos == 1) scroll = document.getElementById("height01");
      else scroll = document.getElementById("groups");
      if (dir > 0) scroll.scrollTop += 400;
      else scroll.scrollTop -= 400;
    },

    async playVideo() {
      // this.$store.dispatch("setVideoVisible", true);
      if (
          this.selectPhone.length +
          this.selectNowCall.length +
          this.selectRingCall.length !=
        1
      ) {
        this.$message.success("请选择单个设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let des;
      if (this.selectPhone.length > 0) des = this.selectPhone[0].userID;
      else if (this.selectNowCall.length > 0)
        des = this.selectNowCall[0].userID;
      else if (this.selectRingCall.length > 0)
        des = this.selectRingCall[0].userID;

      //获取该组织下值班组的话机
      let result = await this.instance({
      method: "get",
      url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered' && devices[index].type == 1)
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      if (found) {
        this.fsAPI(
          "originate",
          "{origination_caller_id_number=" +
            des +
            "}user/" +
            leftdevice +
            " " +
            des +
            " XML default"
        );
        this.$store.dispatch("setAdminState", 1);
      } else {
        this.vertoHandle.newCall(
        {
          destination_number: des,
          caller_id_name: this.verto,
          caller_id_number: this.verto,
          useVideo: true,
          useCamera: "any",
          useStereo: true,
          outgoingBandwidth: "default",
          incomingBandwidth: "default",
          tag: "webcam",
          deviceParams: {
            useMic: "any",
            useSpeak: "any",
            useCamera: "any",
          },
        },
        function () {
          ("添加视频成功");
        }
      );
      }
      //发起视频通话的话就直接走9901
      this.$store.dispatch("setAdminState", 9);
      this.$store.dispatch("setFromm",this.$route.path)
      this.$store.dispatch("setIsVideo", true);
      this.selectPhone = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
    },
    // handleClose(done) {
    //   this.$confirm("确认退出视频？")
    //     .then((_) => {
    //       done();
    //       this.quitVideo();
    //     })
    //     .catch((_) => {});
    // },
    // 获取设备分组数据
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
    returnGroup(item) {
      return item.groupid.some((it) => {
        return it == this.groupShow;
      });
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

    showTip(tipContent, tipType) {
      tipType? this.$message.success(tipContent) : this.$message.error(tipContent)
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
      let ifAdd = 0;
      // 同时还需要取消勾选样式，防止误导用户
      if (row.deviceState === "registered") {
        this.selectNowCall = [];
        this.selectRingCall = [];
        $(".callingSelected").removeClass("callingSelected").addClass("calling");
        $(".waittingSelected").removeClass("waittingSelected").addClass("waitting");
      }
      if (row.deviceState === "ringing") {
        this.selectNowCall = [];
        this.selectPhone = [];
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected").removeClass("callingSelected").addClass("calling");
      }
      if (row.deviceState === "active") {
        this.selectRingCall = [];
        this.selectPhone = [];
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".waittingSelected").removeClass("waittingSelected").addClass("waitting");
      }

      this.selectPhone.forEach(function (s, i) {
        if (s.userID === row.userID) {
          ifAdd = 1;
        }
      });
      if (this.selectPhonex === null && ifAdd === 0) {
        this.$store.dispatch("setSelectPhonex", row);
      } else if (this.selectPhonex === null && ifAdd === 1) {
        this.$store.dispatch("setSelectPhonex", null);
      } else {
        if (this.selectPhonex.userID === row.userID) {
          this.$store.dispatch("setSelectPhonex", null);
        } else {
          if (ifAdd === 1) {
          } else {
            this.$store.dispatch("setSelectPhonex", row);
          }
        }
      }
      if ($(target).hasClass("online")) {
        if ($(target).hasClass("onlineSelected")) {
          $(target).removeClass("onlineSelected");
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1);
            }
          });
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
          this.selectNowCall.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectNowCall.splice(i, 1);
            }
          });
        } else {
          $(target).addClass("callingSelected");
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1);
            }
          });
          this.selectNowCall.push(row);
        }
      } else if ($(target).hasClass("waitting")) {
        if ($(target).hasClass("waittingSelected")) {
          $(target).removeClass("waittingSelected");
          this.selectRingCall.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectRingCall.splice(i, 1);
            }
          });
        } else {
          $(target).addClass("waittingSelected");
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1);
            }
          });
          this.selectRingCall.push(row);
        }
      }
      this.destination_number =
        this.selectPhone.length > 0 ? this.selectPhone[0].userID : "";
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

    // 实现管理员和指定话机的强行通话
    async strongCall() {
      let users = this.deviceList;
      let userChanged = false;
      if (this.selectNowCall.length == 0 || this.selectNowCall.length > 1) {
        this.$message.success("请选择一个正在通话中的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let select = this.selectNowCall[0];
      if (userChanged) this.$store.dispatch("setDeviceList", users);

      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      if (found) {
        this.fsAPI(
          "uuid_transfer",
          select.channelUUID + " *9805" + leftdevice + " XML default"
        );
        this.$store.dispatch("setAdminState", 2);
      } else {
        this.vertoHandle.newCall({
          destination_number: "*9801" + select.channelUUID,
          caller_id_name: this.verto,
          caller_id_number: this.verto,
          outgoingBandwidth: "default",
          incomingBandwidth: "default",
          useStereo: true,
          dedEnc: false,
          tag: "webcam",
          deviceParams: {
            useMic: "any",
            useSpeak: "any",
            useCamera: "any",
          },
        });
        this.$store.dispatch("setAdminState", 2);
      }
      this.selectNowCall = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
    },

    // 实现管理员对指定通话的强拆
    strongDelete() {
      if (this.selectRingCall.length == 0 && this.selectNowCall.length == 0) {
        this.$message.success("请选择一个通话或呼叫中的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      if (this.selectNowCall.length > 0) {
        this.selectNowCall.forEach((call) => {
          this.fsAPI(
            "uuid_kill",
            call.channelUUID,
            function (res) {
              ("qiang delete");
            }.bind(this)
          );
          this.selectNowCall = [];
        });
      }
      if (this.selectRingCall.length > 0) {
        this.selectRingCall.forEach((call) => {
          this.fsAPI(
            "uuid_kill",
            call.channelUUID,
            function (res) {
              ("qiang delete");
            }.bind(this)
          );
          this.selectRingCall = [];
        });
      }
      this.$store.dispatch("setAdminState", 6);
    },

    // 实现管理员对指定通话的强插
    async strongJoin() {
      if (this.selectNowCall.length == 0 || this.selectNowCall.length > 1) {
        this.$message.success("请选择一个正在通话中的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let select = this.selectNowCall[0];
      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }

      if (found) {
        this.fsAPI(
          "originate",
          "{absolute_codec_string=^^:OPUS:G722:PCMU:PCMA:AMR:AMR-WB}{origination_caller_id_number=" +
            select.userID +
            "}user/" +
            leftdevice +
            " *9803" +
            select.channelUUID +
            " XML default"
        );
        this.$store.dispatch("setAdminState", 3);
      } else {
        this.vertoHandle.newCall({
          destination_number: "*9803" + select.channelUUID,
          caller_id_name: this.verto,
          caller_id_number: this.verto,
          outgoingBandwidth: "default",
          incomingBandwidth: "default",
          useStereo: true,
          dedEnc: false,
          tag: "webcam",
          deviceParams: {
            useMic: "any",
            useSpeak: "any",
            useCamera: "any",
          },
        });
        this.$store.dispatch("setAdminState", 3);
      }
      this.selectNowCall = [];
      $(".callingSelected").removeClass("callingSelected").addClass("calling");
    },

    // 实现管理员对指定通话的监听
    async observe() {
      if (this.selectNowCall.length == 0 || this.selectNowCall.length > 1) {
        this.$message.success("请选择一个正在通话中的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let select = this.selectNowCall[0];
     //获取该组织下值班组的话机
     let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      if (found) {
        this.fsAPI(
          "originate",
          "{absolute_codec_string=^^:OPUS:G722:PCMU:PCMA:AMR:AMR-WB}{origination_caller_id_number=" +
            select.userID +
            "}user/" +
            leftdevice +
            " *9802" +
            select.channelUUID +
            " XML default"
        );
        this.$store.dispatch("setAdminState", 4);
      } else {
        this.vertoHandle.newCall({
          destination_number: "*9802" + select.channelUUID,
          caller_id_name: this.verto,
          caller_id_number: this.verto,
          outgoingBandwidth: "default",
          incomingBandwidth: "default",
          useStereo: true,
          dedEnc: false,
          tag: "webcam",
          deviceParams: {
            useMic: "any",
            useSpeak: "any",
            useCamera: "any",
          },
        });
        this.$store.dispatch("setAdminState", 4);
      }
      this.selectNowCall = [];
      $(".callingSelected").removeClass("callingSelected").addClass("calling");
    },

    // 实现第三方对于指定通话中一方的代接
    async daiJie() {
      if (this.selectRingCall.length == 0 || this.selectRingCall.length > 1) {
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        this.$message.success("请选择一个正在呼叫中的设备进行操作");
        return;
      }
      let users = this.deviceList;
      let userChanged = false;
      let select = this.selectRingCall[0];
      let main_userid;
      if (select.oppoChannelUUID == select.channelUUID)
        main_userid = select.userID;
      else main_userid = select.calling;

      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }

      if (found) {
        this.fsAPI("uuid_transfer",this.selectRingCall[0].oppoChannelUUID + " " + leftdevice + " XML default");
        this.$store.dispatch("setAdminState", 5);
      } else {
        this.vertoHandle.newCall({
          destination_number: "*9804" + this.selectRingCall[0].oppoChannelUUID,
          caller_id_name: this.verto,
          caller_id_number: this.verto,
          outgoingBandwidth: "default",
          incomingBandwidth: "default",
          useStereo: true,
          dedEnc: false,
          tag: "webcam",
          deviceParams: {
            useMic: "any",
            useSpeak: "any",
            useCamera: "any",
          },
        });
        this.$store.dispatch("setAdminState", 5);
      }
      this.selectRingCall = [];
    },

    // 实现两个在线非通话的设备进行操作
    async connect() {
      if (this.selectPhone.length != 2) {
        this.$message.success("请选两个在线非通话的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let caller = this.selectPhone[0].userID;
      let callee = this.selectPhone[1].userID;
      this.fsAPI(
        "originate",
        "{absolute_codec_string=^^:OPUS:G722:PCMU:PCMA:AMR:AMR-WB}{origination_caller_id_number=" +
          callee +
          "}user/" +
          caller  +"  "+callee+" XML default");
      this.$store.dispatch("setAdminState", 8);
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
      $(".callingSelected").removeClass("callingSelected").addClass("calling");
      $(".waittingSelected")
        .removeClass("waittingSelected")
        .addClass(".waitting");
      this.selectRingCall = [];
      this.selectPhone = [];
      this.selectNowCall = [];
    },
    //转到功能，将管理员进行的通话转给选中的在线话机
    async callTraverse() {
      if (this.selectPhone.length == 0 || this.selectPhone.length > 1) {
        this.$message.success("请选择一个在线非通话的设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
 
      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'active')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      let uuid;
      let queue;
      let calling;
      if (leftdevice != undefined) {
        this.deviceList.forEach((item) => {
          if (item.userID == leftdevice && leftdevice!= item.calling) 
          {
            calling = item.calling;
          }
          if (leftdevice== item.calling && leftdevice!= item.userID) 
          {
            calling = item.userID;
          }
        });
        if (calling != undefined) queue = this.deviceStatus[calling];
        for (let uid in queue) {
          if (uid!="name" &&
            queue[uid].deviceState == "active" &&
            queue[uid].calling == leftdevice
          ) {
            uuid = uid;
            break;
          }
        }
      } else {
        queue = this.deviceStatus[this.currentLoginUser.userID];
        //遍历deviceStatus对象，有时候其中的元素name的值为undefine，所以跳过这个元素
        for (let uid in queue) {
          if(uid!="name" && queue[uid].deviceState == "active")
          {
           calling = queue[uid].calling;
           break;
          }
        }

        queue = this.deviceStatus[calling];
        for (let uid in queue) {
          if (uid!="name" &&
            queue[uid].deviceState == "active" &&
            queue[uid].calling == this.currentLoginUser.userID
          ) {
            uuid = uid;
            break;
          }
        }
      }
      if (uuid != undefined) {
        this.fsAPI("uuid_transfer",uuid + " " + this.selectPhone[0].userID + " XML default");
      }
      this.$store.dispatch("setAdminState", 7);
      this.selectPhone = [];
      this.selectNowCall = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
      $(".callingSelected").removeClass("callingSelected").addClass("calling");
      $(".waittingSelected")
        .removeClass("waittingSelected")
        .addClass(".waitting");
    },

        //保留功能，将与管理员进行的通话转到等待会议室中
        async callHoldOn() {
      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'active')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      let uuid;
      let queue;
      let calling;
      if (leftdevice != undefined) {
        this.deviceList.forEach((item) => {
          if (item.userID == leftdevice && leftdevice!= item.calling) 
          {
            calling = item.calling;
          }
          if (leftdevice== item.calling && leftdevice!= item.userID) 
          {
            calling = item.userID;
          }
        });
        if (calling != undefined) queue = this.deviceStatus[calling];
        for (let uid in queue) {
          if (uid!="name" &&
            queue[uid].deviceState == "active" &&
            queue[uid].calling == leftdevice
          ) {
            uuid = uid;
            break;
          }
        }
      } else {
        queue = this.deviceStatus[this.currentLoginUser.userID];
        //遍历deviceStatus对象，有时候其中的元素name的值为undefine，所以跳过这个元素
        for (let uid in queue) {
          if(uid!="name" && queue[uid].deviceState == "active")
          {
           calling = queue[uid].calling;
           break;
          }
        }

        queue = this.deviceStatus[calling];
        for (let uid in queue) {
          if (uid!="name" &&
            queue[uid].deviceState == "active" &&
            queue[uid].calling == this.currentLoginUser.userID
          ) {
            uuid = uid;
            break;
          }
        }
      }
      if (uuid != undefined) {
        // 组织所属的等待会议室为92XX,为了不占用电话号码，所以路由规则为*92，在dialplan里面会去掉*
        this.fsAPI("uuid_transfer",uuid + " *" + this.voice + " XML default");
      }
      this.$store.dispatch("setAdminState", 10);
      this.selectPhone = [];
      this.selectNowCall = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
      $(".callingSelected").removeClass("callingSelected").addClass("calling");
      $(".waittingSelected")
        .removeClass("waittingSelected")
        .addClass(".waitting");
    },

    //点名功能，可以对选中终端进行点名工作。或者对所有在线的设备进行点名操作
    //值班组的设备不需要参加点名
    async rollCall() {
      let members = [];

      if (this.selectNowCall.length > 0 || this.selectRingCall.length > 0) {
        this.showTip("只允许对空闲用户发起点名操作！", false);
        return;
      } 
      
      if (this.selectPhone.length > 0) {
        this.selectPhone.forEach((a, i) => {
          members.push({
            memberID: a.userID,
            isMute: "true",
            isDeaf: "false"
          })
        });
        
        this.selectPhone = [];
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
      } else {
        this.deviceList.forEach((device) => {
          if (-1 == this.left_devices.indexOf(device.userID) && (this.groupShow == "" || this.returnGroup(device) == true) && device.deviceState == "registered")
            members.push({
              memberID: device.userID,
              isMute: "true",
              isDeaf: "false"
            });
        });
      }           

      this.$store.dispatch("setAdminState", 11);
      const res = await this.instance({
        method: "post",
        url: "/Rollcall/Create",
        data: {
          members: members,
          roomname: this.rollcallid
        }
      });

      if (res.data.code != 1) {
          this.showTip('网络请求失败！', false);
          return;
      } else if (res.data.result.code != 1) {
        this.showTip(res.data.result.message, false);
        return;
      }
      
      this.instance({
        method: "post",
        url: "/conference/pullpeople",//接口传递的参数都需要是字符串格式
        data: {
          conference_room: this.rollcallid,
          conference_name: "点名",
          conference_type: "audio",
          members: members
        }
      }).then((res) => {
        console.log(res.data);
        console.log(res.data.code);
        res.data.code === 1 ? this.showTip("点名发起成功！", true) : this.showTip("广播发起失败！", false);
      });
    },

    // call
    async call() {
      if (
        this.selectPhone.length +
          this.selectNowCall.length +
          this.selectRingCall.length !=
        1
      ) {
        this.$message.success("请选择单个设备进行操作");
        $(".onlineSelected").removeClass("onlineSelected").addClass("online");
        $(".callingSelected")
          .removeClass("callingSelected")
          .addClass("calling");
        $(".waittingSelected")
          .removeClass("waittingSelected")
          .addClass(".waitting");
        this.selectRingCall = [];
        this.selectPhone = [];
        this.selectNowCall = [];
        return;
      }
      let des;
      if (this.selectPhone.length > 0) des = this.selectPhone[0].userID;
      else if (this.selectNowCall.length > 0)
        des = this.selectNowCall[0].userID;
      else if (this.selectRingCall.length > 0)
        des = this.selectRingCall[0].userID;
      //获取该组织下值班组的话机
      let result = await this.instance({
        method: "get",
        url: "/watcher/left/" + this.organizationid,
      });
            
      let devices =result.data.result;
      let found = false;
      let leftdevice;
      for (let index in devices)
      {
        if(devices[index].state == 'registered')
        {
          found = true;
          leftdevice = devices[index].devicecode;
          break;
        }
      }
      if (found) {
        this.fsAPI(
          "originate",
          "{origination_caller_id_number=" +
            des +
            "}{absolute_codec_string=^^:OPUS:G722:PCMU:PCMA:AMR:AMR-WB}user/" +
            leftdevice +
            " " +
            des +
            " XML default"
        );
        this.$store.dispatch("setAdminState", 1);
      } else {
        this.vertoHandle.newCall(
          {
            destination_number: des,
            caller_id_name: this.verto,
            caller_id_number: this.verto,
            useVideo: false,
            useCamera: "any",
            useStereo: true,
            outgoingBandwidth: "default",
            incomingBandwidth: "default",
            tag: "webcam",
            deviceParams: {
              useMic: "any",
              useSpeak: "any",
              useCamera: "any",
            },
          },
          function () {
            ("添加视频成功");
          }
        );
        this.$store.dispatch("setAdminState", 1);
      }
      this.selectPhone = [];
      $(".onlineSelected").removeClass("onlineSelected").addClass("online");
    },
    hangupCall() {
      this.vertoHandle.hangup();
    },
    play() {
      $(".playMenu").removeClass("Hide").addClass("Show");
    },
    selectAll() {
      this.selectPhone = [];
      this.deviceList.forEach((device) => {
        if (this.groupShow == "" || this.returnGroup(device) == true)
          this.selectPhone.push(device);
      });
      $(".online").addClass("onlineSelected");
    },
  },
};
</script>

<style scoped>
.video {
  padding-top: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: calc(95% - 115px);
}

.myButtonUp, .myButtonDown {
  position: absolute;
  right: 1%;
  z-index: 2000;
}

.myButtonUp{
  bottom: 60%;
}

.myButtonDown {
  bottom: 50%;
}
</style>
