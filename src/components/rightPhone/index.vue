<template>
  <div>
    <div class="phone right">
      <div class="phoneTitle">
        <i class="fa fa-phone" aria-hidden="true"></i
        >{{ "告警队列 &nbsp &nbsp" + alarm }}
        <div
          :class="
            !this.flag_confalarm && this.confAlarm.length > 0
              ? 'phoneMeeting meetingOut'
              : this.flag_confalarm
              ? 'phoneMeeting meetingIn'
              : 'phoneMeeting'
          "
          @click="toggle_enter"
        >
          <!--进入为phoneMeeting 离开添加meetingOut-->
          <i
            aria-hidden="true"
            :class="
              this.flag_confalarm
                ? 'fa fa-sign-out fixed-nav'
                : this.confLeft.length > 0
                ? 'fa fa-volume-control-phone fixed-nav'
                : 'fa fa-plus fixed-nav'
            "
          ></i>
          {{ this.flag_confalarm ? "离开" : "进入" }}
        </div>
        <!--进入为fa-plus 离开为fa-sign-out 有语音呼入为fa-volume-control-phone fixed-nav-->
      </div>
      <div class="numList">
        <div>
          <ul class="callNum">
            <li
              class="unselected"
              v-if="item.caller_id_number != verto"
              v-for="item in confAlarm"
              @click.stop="select($event, item)"
            >
              <i class="fa fa-circle red" aria-hidden="true"></i>
              {{ item.caller_id_number }}
            </li>
            <!--<li><i class="fa fa-clock-o" aria-hidden="true"></i>1005</li>-->
          </ul>
        </div>
      </div>
      <div class="phoneDial">
        <div class="numDisplay">
          <span>{{ destination_number }}</span>
        </div>
        <div class="numDisplay">
          <span>{{ this.nowCalling }}</span>
          <img @click="clear" src="../../assets/img/delate.fw.png" />
        </div>
        <div class="dialDisplay">
          <div
            v-for="(item, index) in btnData"
            @click="keypad(item.name)"
            @touchstart="$btnMousedown"
            @touchend="$btnMouseup"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            class="dial"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="dialAction">
          <div
            :class="
              !(flag_confleft || flag_callqueue)
                ? 'dial ring active'
                : flag_call
                ? 'dial ring active'
                : 'dial ring disable'
            "
            @click="
              !(flag_confleft || flag_callqueue)
                ? makeCall()
                : flag_call
                ? answerCall()
                : ''
            "
            @mouseup="
              !(flag_confleft || flag_callqueue)
                ? $btnMouseup($event)
                : flag_call
                ? $btnMouseup($event)
                : ''
            "
            @mousedown="
              !(flag_confleft || flag_callqueue)
                ? $btnMousedown($event)
                : flag_call
                ? $btnMousedown($event)
                : ''
            "
            @touchstart="
              !(flag_confleft || flag_callqueue)
                ? $btnMousedown($event)
                : flag_call
                ? $btnMousedown($event)
                : ''
            "
            @touchend="
              !(flag_confleft || flag_callqueue)
                ? $btnMouseup($event)
                : flag_call
                ? $btnMouseup($event)
                : ''
            "
          >
            <i
              :class="
                !(flag_confleft || flag_callqueue)
                  ? 'fa fa-phone fa-2x'
                  : flag_call
                  ? 'fa fa-phone fa-2x'
                  : 'fa fa-microphone fa-2x'
              "
              aria-hidden="true"
            ></i>
          </div>
          <div
            class="dial hangup"
            @click="hangupCall"
            @mousedown="$btnMousedown"
            @mouseup="$btnMouseup"
            @touchstart="$btnMousedown"
            @touchend="$btnMouseup"
          >
            挂断
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getHeight } from "utils/height";
import { GET_USER_INFO } from "store/getters/type";
export default {
  props: {},
  data() {
    return {
      destination_number: "",
      status: "进入",
      btnData: [
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "5" },
        { name: "6" },
        { name: "7" },
        { name: "8" },
        { name: "9" },
        { name: "*" },
        { name: 0 },
        { name: "#" },
      ],
      flag_callqueue: false,
      flag_confleft: false,
      flag_confalarm: false,
      flag_call: false, //有人打电话进来的标记位
      nowCalling: "",
      verto: "",
      meeting: "",
      voice: "",
      broad: "",
      alarm: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001",
      }),
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      this.organizationid = this.get_user_info.user.organizationid;//记录organizationid,用于查询
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.alarm = this.get_user_info.freeswitchData.AlarmID;
      this.broad = this.get_user_info.freeswitchData.BroadID;

      //$.verto.init({}, this.bootstrap);
    });
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      group_users: "group_users",
      users: "users",
      currentLoginUser: "currentLoginUser",
      confLeft: "confLeft",
      callQueue: "callQueue",
      confAlarm: "confAlarm",
      selectedAlarm: "selectedAlarm",
      get_user_info: GET_USER_INFO,
    }),
  },
  watch: {
    callQueue: function (callqueue) {
      if (
        callqueue.length > 0 &&
        callqueue[callqueue.length - 1].des == this.verto
      ) {
        this.flag_call = true;
        this.nowCalling = callqueue[0].caller + "正在呼叫您，请及时接听";
      } else {
        this.nowCalling = "";
        this.flag_call = false;
      }
      if (callqueue.length > 0) {
        if (callqueue[0].caller == this.verto || callqueue[0].des == this.verto)
          this.flag_callqueue = true;
        else this.flag_callqueue = false;
      } else this.flag_callqueue = false;
    },
    confLeft: function (confleft) {
      for (var i = 0; i < confleft.length; i++)
        if (confleft[i].caller_id_number == this.verto) {
          this.flag_confleft = true;
          break;
        }
      if (i == confleft.length) this.flag_confleft = false;
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
  methods: {
    toggle_enter() {
      this.instance({
        url: "organization/" + this.organizationid,
        method: "get",
      }).then((res) => {
        let right_watcher = res.data.right_watcher;
        if (this.flag_confalarm == true)
          this.confAlarm.forEach((item, index, array) => {
            if (
              item.caller_id_number ==
              (res.data.enble_right_watcher ? right_watcher : this.verto)
            )
              this.fsAPI(
                "conference",
                this.alarm +
                  "-scc.yuqi.com" +
                  " " +
                  "hup" +
                  " " +
                  item.conf_id
              );
          });
        else if (this.confAlarm.length > 0) {
          if (!res.data.enble_right_watcher)
            this.vertoHandle.newCall({
              destination_number: this.alarm,
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
          else
            this.fsAPI(
              "conference",
              this.alarm +
                "-scc.yuqi.com" +
                " " +
                " bgdial user/" +
                " " +
                right_watcher +
                " " +
                this.alarm
            );
        }
      });
    },
    select(e, item) {
      let _this = this;
      let target = e.currentTarget;
      if ($(target).hasClass("unselected")) {
        $(target).removeClass().addClass("selected");
        if (
          this.selectedAlarm.findIndex(function (caller, index, array) {
            return caller.conf_id == item.conf_id;
          }) == -1
        ) {
          this.selectedAlarm.push(item);
        }
      } else if ($(target).hasClass("selected")) {
        $(target).removeClass().addClass("unselected");
        this.selectedAlarm.forEach(function (a, i) {
          if (a.conf_id == item.conf_id) _this.selectedAlarm.splice(i, 1);
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
    answerCall(item, index) {
      let that = this;
      if (this.callQueue[this.callQueue.length - 1].curCall.params.wantVideo) {
        this.callQueue[this.callQueue.length - 1].curCall.params.useVideo = true;
        this.$store.dispatch("setVideoVisible",true)
        this.callQueue[this.callQueue.length - 1].curCall.answer();
        this.nowCalling = "";
        this.flag_call = false;
        this.$store.dispatch("setInit",true)
        if(this.$route.path=='/alarm'){
          setTimeout(() => {
            that.$router.go(0)
          }, 1500);
        }else{
          setTimeout(() => {
            that.$store.dispatch("setFromm",that.$route.path)
            if(that.$route.path!='/alarm'){
              that.$router.push('/alarm')
            }
          }, 1500);
        }
      }else{
        this.callQueue[this.callQueue.length - 1].curCall.answer();
        this.nowCalling = "";
        this.flag_call = false;
      }
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
    async makeCall() {
      if (this.destination_number) {
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
          this.destination_number +
            "}{absolute_codec_string=^^:OPUS:G722:PCMU:PCMA}user/" +
            leftdevice +
            " " +
            this.destination_number +
            " XML default"
        );
      } else this.vertoHandle.newCall({
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
      }
    },
    hangupCall() {
      this.vertoHandle.hangup();
    },
    btnMousedown(event) {
      let target = event.currentTarget;
      $(target).css("background", "#575E64");
    },
    btnMouseup(event) {
      let target = event.currentTarget;
      $(target).css("background", "none");
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
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
