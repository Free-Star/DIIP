<!-- 引用leftPhone的页面必须要自己添加webcam，否则webrtc会有问题 -->
<template>
  <div class="phone left">
    <div class="phoneTitle">
      <i class="fa fa-phone" aria-hidden="true"></i
      >{{
        this.confname.show +
        "号码 &nbsp" +
        (this.confname.name == "confleft"
          ? this.deskPhone == true
            ? this.phone
            : this.verto
          : "")
      }}

      <div style="display: inline">
        <el-dropdown
          @command="handleCommand"
          :hide-on-click="true"
          trigger="click"
          @visible-change="count"
          v-if="confname.name != 'confleft'"
        >
          <el-button type="primary">
            {{ this.choosenConf
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="con in conf_detail"
              :command="con.conf_num"
              :key="con.conf_num"
              >{{
                con.conf_num + " " + con.group_name + " 人数:" + con.num
              }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--启动/关闭自动通话应答 -->
      <button type="button"
        class="btn btn-sm btn-info watcher"
        style="margin-left: 10px; border: black; outline: none;"
        :title="enable_left_watcher ? '关闭自动通话应答' : '开启自动通话应答'"
        :style="enable_left_watcher ? 'background: green;' : 'background: black;'"
        @click = "enable_left_watcher == true ? setLeftWatcherState(false) : setLeftWatcherState(true)" >
          自动应答
      </button>
      
      <div
        style="display: inline"
        :class="
          !flag_conf && conf.length > 0
            ? 'phoneMeeting meetingOut'
            : flag_conf
            ? 'phoneMeeting meetingIn'
            : 'phoneMeeting'
        "
        @click="toggle_enter"
      >
        <!--进入为phoneMeeting 离开添加meetingOut-->
        <i
          aria-hidden="true"
          :class="
            flag_conf
              ? 'fa fa-sign-out fixed-nav'
              : conf.length > 0
              ? 'fa fa-volume-control-phone fixed-nav'
              : 'fa fa-plus fixed-nav'
          "
        ></i>
        {{ flag_conf ? "离开" : "进入" }}
      </div>
      <!--进入为fa-plus 离开为fa-sign-out 有语音呼入为fa-volume-control-phone fixed-nav-->
    </div>
    <div class="numList">
      <div>
        <ul class="callNum">
          <!--<li v-for="item in callQueue">-->
          <!--<i  class="fa fa-circle red" aria-hidden="true"></i>-->
          <!--1005-->
          <!--<span>00:00:01</span>-->
          <!--</li>-->
          <li
            class="unselected"
            v-if="item.caller_id_number != verto"
            v-for="item in conf"
            @click.stop="select($event, item)"
          >
            <i :class="callStatus(item)" aria-hidden="true"></i> 
            {{ item.caller_id_number }}
          </li>
          <!--<li><i class="fa fa-clock-o" aria-hidden="true"></i>1005</li>-->
        </ul>
      </div>
    </div>
    <div>
      <!-- 引用leftPhone的页面必须要自己添加webcam，否则webrtc会有问题 -->
      <!-- <video width="800" id="webcam" autoplay="autoplay" hidden="true"></video> -->
    </div>
    <div class="phoneDial">
      <div
        class="dial rightdial"
        v-for="(item, index) in btnData"
        @click.stop="buttonclick(item.name)"
        @touchstart="$btnMousedown"
        @touchend="$btnMouseup"
        @mousedown="$btnMousedown"
        @mouseup="$btnMouseup"
      >
        <el-tooltip :content="item.content" placement="top" :open-delay="1000">
          <i aria-hidden="true" class="fa" :class="item.class"></i>
        </el-tooltip>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";
const btnData = [
  {
    name: "邀请成员",
    class: "fa-user-plus",
    content: "邀请右侧非离线状态的选中设备进入会议",
  },
  {
    name: "允许通话",
    class: "fa-microphone",
    content: "允许上方选中的会议成员通话",
  },
  {
    name: "排队等待",
    class: "fa-spinner",
    content: "使上方选中的会议成员进入排队等待状态，不能通话也不能听见他人通话",
  },
  {
    name: "踢出队列",
    class: "fa-user-times",
    content: "使上方选中的会议成员离开等待队列",
  },
  {
    name: "只听不说",
    class: "fa-microphone-slash",
    content: "允许上方选中的会议成员听见他人通话,禁止上方选中的会议成员通话",
  },
  {
    name: "结束服务",
    class: "fa-window-close-o",
    content: "踢出会议所有成员并结束会议",
  },
  {
    name: "通话转出",
    class: "fa-share-square-o",
    content: "将选定的通话转给指定设备",
  },
  {
    name: "群答功能",
    class: "fa-th",
    content: "等待室中的所有成员能够相互通话",
  },
  {
    name: "通话应答",
    class: "fa-phone",
    content: "将队列前或指定的通话交给值班组应答",
  },
];
export default {
  props: {
    selectPhone: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      btnData,
      selected: [],
      status: "进入",
      conf: [],
      confname: {},
      userDeflect: "",
      flag_conf: false, //控制端是否在会议室里面，true为在会议室，点击为退出
      flag_confalarm: false,
      flag_callqueue: false,
      verto: "",
      meeting: "",
      voice: "",
      broad: "",
      alarm: "",
      org: "",
      choosenConf: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      conf_detail: [],
      role_id: "",
      deskPhone: true,
      phone: "",
      enable_left_watcher: ""
    };
  },
  created() {
    this.$nextTick(function () {
      // getHeight()
      // $.verto.init({}, this.bootstrap);
      this.organizationid = this.get_user_info.user.organizationid;
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.alarm = this.get_user_info.freeswitchData.AlarmID;
      this.broad = this.get_user_info.freeswitchData.BroadID;
      this.org = this.get_user_info.user.orgname;
      if (this.$router.history.current.fullPath == "/voiceCall") {
        this.conf = this.$store.getters.confLeft;
        this.confname = { name: "confleft", num: this.voice, show: "通话" };
        this.choosenConf = this.voice;
      } else if (this.$router.history.current.fullPath == "/ipBroad") {
        this.conf = this.$store.getters.confIpBoard;
        this.confname = { name: "confipboard", num: this.broad, show: "广播" };
        this.choosenConf = this.broad;
      } else if (this.$router.history.current.fullPath == "/meeting") {
        this.conf = this.$store.getters.confMeeting;
        this.confname = {
          name: "confmeeting",
          num: this.meeting,
          show: "会议",
        };
        this.choosenConf = this.meeting;
      } else if (this.$router.history.current.fullPath == "/radio") {
        this.conf = this.$store.getters.confMeeting;
        this.confname = {
          name: "confmeeting",
          num: this.meeting,
          show: "对讲",
        };
        this.choosenConf = this.meeting;
      } else if (this.$router.history.current.fullPath == "/alarm") {
        this.conf = this.$store.getters.confLeft;
        this.confname = { name: "confleft", num: this.voice, show: "语音" };
        this.choosenConf = this.voice;
      }
      this.refresh();
    });
  },
  mounted() {},
  watch: {
    choosenConfLeft: function (conf) {
      if (conf != "" && conf != undefined) {
        if (this.confname.name == "confleft") this.confname.num = conf;
        this.voice = conf;
      }
    },
    choosenConfMeeting: function (conf) {
      if (conf != "" && conf != undefined) {
        if (this.confname.name == "confmeeting") this.confname.num = conf;
        this.meeting = conf;
      }
    },
    choosenConfIpboard: function (conf) {
      if (conf != "" && conf != undefined) {
        if (this.confname.name == "confipboard") this.confname.num = conf;
        this.broad = conf;
      }
    },
    callQueue: function (callqueue) {
      if (callqueue.length > 0) {
        if (callqueue[0].caller == this.verto || callqueue[0].des == this.verto)
          this.flag_callqueue = true;
        else this.flag_callqueue = false;
      } else this.flag_callqueue = false;
    },
    conf: function (conf) {
      this.instance({
        url: "/watcher/left/" + this.organizationid,
        method: "get",
      }).then((res) => {
        let devices = res.data.result;
        let leftdevice = [];
        for (let index in devices) {
          leftdevice.push(devices[index].devicecode);
        }
        for (var i = 0; i < conf.length; i++)
          if (conf[i].caller_id_number == this.verto || -1 != leftdevice.indexOf(conf[i].caller_id_number)) {
            this.flag_conf = true;
            break;
          }
        if (i == conf.length) this.flag_conf = false;
        if (
          conf.length > 0 &&
          conf.every((item, index, array) => {
            return (
              item.caller_id_number == this.verto ||
              -1 != leftdevice.indexOf(item.caller_id_number)
            );
          })
        ) {
          conf.forEach((item) => {
            this.fsAPI(
              "conference",
              this.confname.num +
                "-scc.yuqi.com" +
                " " +
                "hup" +
                " " +
                item.conf_id
            );
          });
        }
      });
    },
    confAlarm: function (confalarm) {
      for (var i = 0; i < confalarm.length; i++)
        if (confalarm[i].caller_id_number == this.verto) {
          this.flag_confalarm = true;
          break;
        }
      if (i == confalarm.length) this.flag_confalarm = false;
    },
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      group_users: "group_users",
      users: "users",
      currentLoginUser: "currentLoginUser",
      callQueue: "callQueue",
      confLeft: "confLeft",
      confAlarm: "confAlarm",
      confIpBoard: "confIpBoard",
      selectedAlarm: "selectedAlarm",
      get_user_info: GET_USER_INFO,
      vertoHandle: "vertoHandle",
      choosenConfLeft: "choosenConfLeft",
      choosenConfMeeting: "choosenConfMeeting",
      choosenConfIpboard: "choosenConfIpboard",
      deviceList: "deviceList",
    }),
  },
  methods: {
    count(status) {
      console.log(status);
      this.conf_detail.forEach((co, index) => {
        this.vertoHandle.sendMethod(
          "jsapi",
          {
            command: "fsapi",
            data: {
              cmd: "conference",
              arg: co.conf_name + " " + "list as xml",
            },
          },
          (data) => {
            if (data.message.slice(0, 4) == "-ERR") {
              co.num = 0;
              this.$set(this.conf_detail, index, co);
            } else {
              co.num = data.message.split("\n").length - 1;
              this.$set(this.conf_detail, index, co);
            }
          }
        );
      });
      this.conf_detail.sort((x, y) => {
        return y.num - x.num;
      });
    },
    async refresh() {
      let _this = this;
      this.$ajax.post(`Role/List`).then(async (res) => {
        if (res.data.code === 1) {
          let groupList = res.data.result;
          groupList.forEach((element) => {
            if (element.rolename == _this.get_user_info.user.orgname) {
              _this.roleid = element.roleid;
            }
          });
          let re1 = await _this.instance({
            method: "get",
            url: `organization/${this.organizationid}`,
          });
          _this.deskPhone = !!re1.data.left_watcher;
          _this.phone = re1.data.left_watcher;
          _this.enable_left_watcher = re1.data.enable_left_watcher;

          let re2 = await _this.instance({
            method: "post",
            url: "Conference/Detail",
            data: {
              confname: _this.$router.history.current.fullPath.slice(1),
              organizationid: _this.organizationid,
              roleid: _this.roleid,
            },
          });
          _this.conf_detail = re2.data.result;
          _this.conf_detail.forEach((co) => {
            co.num = 0;
          });
        }
      });
    },
    handleCommand(conf) {
      if (this.choosenConf == conf) return;
      else {
        this.choosenConf = conf;
        let application_des = "";
        let arr = [];
        switch (this.confname.name) {
          case "confleft":
            arr = this.$store.getters.confLeft;
            while (arr.length > 0) arr.pop();
            this.$store.dispatch("setConfLeft", arr);
            this.$store.dispatch("setChoosenConfLeft", conf);
            break;
          case "confipboard":
            arr = this.$store.getters.confIpBoard;
            while (arr.length > 0) arr.pop();
            this.$store.dispatch("setConfIpBoard", arr);
            this.$store.dispatch("setChoosenConfIpboard", conf);
            break;
          case "confmeeting":
            arr = this.$store.getters.confMeeting;
            while (arr.length > 0) arr.pop();
            this.$store.dispatch("setConfMeeting", arr);
            this.$store.dispatch("setChoosenConfMeeting", conf);
            break;
        }
      }
    },
    callStatus(item) {
      if (item.muted == true && item.deaf == true) return "fa fa-spinner red";
      else if (item.muted == true && item.deaf == false)
        return "fa fa-microphone-slash blue";
      else if (item.muted == false && item.deaf == false)
        return "fa fa-microphone green";
      else return "fa fa-circle orange";
    },
    // 值班组进入或者退出会议室
    toggle_enter() {
      this.instance({
        url: "organization/" + this.organizationid,
        method: "get",
      }).then((res) => {
        let _this = this;
        let left_watcher = res.data.left_watcher;
        let right_watcher = res.data.right_watcher;
        let leftgroup = "";
        leftgroup = res.data.leftgroup;
        //不确认这个函数是否自动在播和停之间切换嘛
        if (_this.conf.length > 0)
          _this.fsAPI(
            "conference",
            _this.confname.num +
              "-scc.yuqi.com" +
              " " +
              "pause_play" +
              " " +
              _this.conf[0].conf_id
          );
        //flag_conf为true表面，控制端已经在会议里面，所以点击是为了退出
        if (_this.flag_conf == true) {
        let leftdevice = [];
        for (let index in leftgroup) {
          leftdevice.push(leftgroup[index].devicecode);
        }
          _this.conf.forEach((item, index, array) => {
            if (
              _this.confname.num != _this.alarm &&               
                ( leftgroup != ""
                  ? -1 != leftdevice.indexOf(item.caller_id_number) 
                  : item.caller_id_number == _this.verto)
            )
            _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "hup" +
                  " " +
                  item.conf_id
              );
            else if ( //todo 告警组稍微处理
              _this.confname.num == _this.alarm &&
              item.caller_id_number ==
                (res.data.enable_right_watcher == true
                  ? res.data.right_watcher
                  : _this.verto)
            )
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "hup" +
                  " " +
                  item.conf_id
              );
            if (_this.confname.num != _this.alarm) {
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "mute" +
                  " " +
                  item.conf_id
              );
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "deaf" +
                  " " +
                  item.conf_id
              );
            }
          });
        } else {//如果这个会议室是告警会议室
          if (_this.confname.num == _this.alarm) {
            if ( leftgroup == "") {
              _this.vertoHandle.hangup();
              _this.vertoHandle.newCall({
                destination_number: _this.confname.num,
                caller_id_name: "LegalHigh",
                caller_id_number: _this.verto,
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
            } else {
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " bgdial user/" +
                  res.data.right_watcher +
                  " " +
                  _this.confname.num
              );
            }
          } else {//该会议室是值班等候室
            let leftdevice;
            let found = false;
            for (let index in leftgroup) {
              if (leftgroup[index].state == 'registered' && leftgroup[index].type <= 1) {  //0为语音设备 1为视频设备
                found = true;
                leftdevice = leftgroup[index].devicecode;
                break;
              }
            }
            if (found == false) {
              _this.vertoHandle.hangup();
              _this.vertoHandle.newCall({
                destination_number: _this.confname.num,
                caller_id_name: _this.verto,
                caller_id_number: _this.verto,
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
            } else {
              if(_this.confname.num == _this.broad) //如果进入广播会议室，先静音，否则容易造成直播事故
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com++flags{mute}" +
                  " bgdial user/" +
                  leftdevice +
                  " " +
                  _this.confname.num
              );
              else    //其他会议，管理员进入可以直接说话
              _this.fsAPI(
                "conference",
                _this.confname.num +
                  "-scc.yuqi.com" +
                  " bgdial user/" +
                  leftdevice +
                  " " +
                  _this.confname.num
              );

            }
          }
          //原本值班组进入后，会自动和队列的第一个话机通话
          //现在关闭该功能
          // if (_this.confname.num == _this.voice) {
          //   _this.fsAPI(
          //     "conference",
          //     _this.confname.num +
          //       "-scc.yuqi.com" +
          //       " " +
          //       "unmute" +
          //       " " +
          //       _this.conf[0].conf_id
          //   );
          //   _this.fsAPI(
          //     "conference",
          //     _this.confname.num +
          //       "-scc.yuqi.com" +
          //       " " +
          //       "undeaf" +
          //       " " +
          //       _this.conf[0].conf_id
          //   );
          // }
        }
      });
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
    buttonclick(name) {
      switch (name) {
        case "踢出队列":
          if (this.selected.length > 0)
            this.selected.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "hup" +
                  " " +
                  a.conf_id
              );
            });
          if (this.selectedAlarm.length > 0)
            this.selectedAlarm.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.alarm + "-scc.yuqi.com" + " " + "hup" + " " + a.conf_id
              );
            });
          $(".selected").removeClass().addClass("unselected");
          this.selected = [];
          break;
        case "允许通话":
          if (this.selected.length > 0) {
            this.selected.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "stop all" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "unmute" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "undeaf" +
                  " " +
                  a.conf_id
              );
            });

            $(".selected").removeClass().addClass("unselected");
            this.selected = [];
          }
          if (this.selectedAlarm.length > 0) {
            this.selectedAlarm.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "pause_play" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.alarm + "-scc.yuqi.com" + " " + "unmute" + " " + a.conf_id
              );
              this.fsAPI(
                "conference",
                this.alarm + "-scc.yuqi.com" + " " + "undeaf" + " " + a.conf_id
              );
            });
            //this.selectedAlarm.forEach(function(a,i){
            //  _this.fsAPI('conference',"9110-scc.yuqi.com"+" "+"undeaf"+" "+a.conf_id)})
            $(".selected").removeClass().addClass("unselected");
            this.$store.dispatch("setSelectedAlarm", []);
          }
          break;
        case "排队等待":
          if (this.selected.length > 0) {
            this.selected.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "play /usr/local/freeswitch/sounds/music/8000/danza-espanola-op-37-h-142-xii-arabesca.wav" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "mute" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "deaf" +
                  " " +
                  a.conf_id
              );
              //this.fsAPI('conference',this.confname.num+"-scc.yuqi.com"+" "+"pause_play"+" "+a.conf_id)
            });
            $(".selected").removeClass().addClass("unselected");
            this.selected = [];
          }
          if (this.selectedAlarm.length > 0) {
            this.selectedAlarm.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.alarm + "-scc.yuqi.com" + " " + "mute" + " " + a.conf_id
              );
            });
            // this.selectedAlarm.forEach(function(a,i){
            //  _this.fsAPI('conference',"9110-scc.yuqi.com"+" "+"deaf"+" "+a.conf_id)})

            $(".selected").removeClass().addClass("unselected");
            this.$store.dispatch("setSelectedAlarm", []);
          }
          break;
        case "结束服务":
          if (this.conf)
            this.conf.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "kick" +
                  " " +
                  a.conf_id
              );
            });
          if (this.confAlarm)
            this.confAlarm.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.alarm + "-scc.yuqi.com" + " " + "kick" + " " + a.conf_id
              );
            });
          break;
        case "通话转出":
        if (this.flag_confalarm == true && this.selectedAlarm.length > 0)
            this.userDeflect = this.selectedAlarm[0].channel_uuid;
          else if (this.selected.length > 0)
            this.userDeflect = this.selected[0].channel_uuid;

          if (this.userDeflect != "") {
            console.log("uuid_transfer "+ this.userDeflect+" "+ this.selectPhone[0].userID+ " XML default");
            this.fsAPI("uuid_transfer", this.userDeflect + " " + this.selectPhone[0].userID + " XML default"); 
          }
          this.userDeflect = "";
          $(".selected").removeClass().addClass("unselected");
          this.selected = [];
          this.$store.dispatch("setSelectedAlarm", []);
          this.$emit("reset");
          break;
        case "群答功能":
        this.conf.forEach((a, i) =>{
          this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "stop all" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "unmute" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "undeaf" +
                  " " +
                  a.conf_id
              );
        });
       
       break;
        case "通话应答": //原来是接通等待室里的值班和用户，现在是把等待室里的用户转到值班组
          let selected = this.selected;
          let deviceList = this.deviceList;
          let currentLoginUser = this.currentLoginUser;
          let fsAPI = this.fsAPI;
          let voice = this.voice;
          this.instance({
            url: "organization/" + this.organizationid,
            method: "get",
          }).then((res) => {
            let _this = this;
            let uuid;
            //如果不指定通话，则把等待室里面排在最前面的分发出去
            if (selected.length > 0)
              uuid = selected[0].channel_uuid;
            else
              uuid = _this.conf[0].channel_uuid;
            //如果有值班组，但是值班组都忙，那么该项操作不起作用  
            let leftgroup = res.data.leftgroup;
            if (leftgroup != undefined) {
            let leftdevice;
            let found = false;
            for (let index in leftgroup) {
              if (leftgroup[index].state == 'registered' && leftgroup[index].type <= 1) {  //0为语音设备 1为视频设备
                found = true;
                leftdevice = leftgroup[index].devicecode;
                break;
              }
            }

              if (found == true)
              fsAPI("uuid_transfer", uuid + " " + leftdevice + " XML default"); 
            } else
              fsAPI("uuid_bridge", uuid + " " + currentLoginUser.channelUUID);

              _this.$store.dispatch("setSelectedAlarm", []);
            $(".selected").removeClass().addClass("unselected");
            _this.selected = [];
          });
          //this.$store.dispatch('setSelectedAlarm',[])
          //$('.selected').removeClass().addClass('unselected')
          //this.selected = []
          break;
        case "邀请成员":
          if (this.selectPhone.length > 0 && this.flag_confalarm == true) {
            this.selectPhone.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.alarm +
                  "-scc.yuqi.com" +
                  " " +
                  "bgdial" +
                  " " +
                  (a.type == 2 ? "loopback/" : "user/") +
                  a.userID +
                  " " +
                  this.alarm +
                  "warning"
              );
            });
          } else if (this.selectPhone.length > 0) {
            this.selectPhone.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  (this.confname.num == this.broad ? "++flags{mute}" : "") +
                  " " +
                  "bgdial" +
                  " {absolute_codec_string=^^:OPUS:G722:PCMU:PCMA:AMR:AMR-WB}" +
                  (a.type == 2 ? "loopback/" : "user/") +
                  a.userID +
                  " " +
                  this.confname.num
              );
            });
          }
          this.$emit("reset");
          break;
        case "只听不说":
          if (this.selected.length > 0) {
            this.selected.forEach((a, i) => {
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "stop all" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "mute" +
                  " " +
                  a.conf_id
              );
              this.fsAPI(
                "conference",
                this.confname.num +
                  "-scc.yuqi.com" +
                  " " +
                  "undeaf" +
                  " " +
                  a.conf_id
              );
            });
            $(".selected").removeClass().addClass("unselected");
            this.selected = [];
          }
          break;
      }
    },

    setLeftWatcherState(state) {
      this.enable_left_watcher = state;
      this.instance({
        method: "post",
        url: "/watcher/left/" + this.organizationid,
        data: {
          enable_left_watcher: state,
        },
      }).then((res) => {});
    },

    select(e, item) {
      console.log(e);
      let _this = this;
      let target = e.currentTarget;
      console.log(e.currentTarget.parentElement.nextElementSibling);
      if ($(target).hasClass("unselected")) {
        $(target).removeClass().addClass("selected");
        if (
          this.selected.findIndex(function (caller, index, array) {
            return caller.conf_id == item.conf_id;
          }) == -1
        ) {
          this.selected.push(item);
        }
      } else if ($(target).hasClass("selected")) {
        $(target).removeClass().addClass("unselected");
        this.selected.forEach((a, i) => {
          if (a.conf_id == item.conf_id) this.selected.splice(i, 1);
        });
      }
    },
    clear() {
      this.destination_number = this.destination_number.substring(
        0,
        this.destination_number.length - 1
      );
    },
    keypad(value) {
      this.destination_number = this.destination_number + value;
    },
    answerCall(item) {
      this.callQueue[0].curCall.answer();
    },
    callDivert() {
      // 呼叫转移
      if (this.destination_number != "") {
        this.$store.dispatch("CallDivert", {
          type: true,
          num: this.destination_number,
        });
      }
    },
    makeCall() {
      this.vertoHandle.newCall({
        // Extension to dial.
        destination_number: this.destination_number,
        caller_id_name: "LegalHigh",
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
    },
    hangupCall() {
      this.vertoHandle.hangup();
    },
  },
};
</script>

<style scoped>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown-group {
  background-color: #4e545a;
  color: white;
  border: none;
}
.el-dropdown-menu {
  background-color: #4e545a;
  color: white;
  border: none;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-button {
  background-color: #69c7f9;
  padding: 8px 4px;
  margin-left: 5px;
}
</style>
