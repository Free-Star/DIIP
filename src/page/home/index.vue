<template>
  <div>
    <!-- <div id="media">
      <video width="800" id="webcam" autoplay="autoplay" hidden="hidden"></video>
    </div> -->
    <!-- <video width="800" id="webcam" autoplay="autoplay"></video> -->
    <topMenu></topMenu>
    <container></container>
    <footNav :username="username"></footNav>
    <switch-left></switch-left>
    <tree-list @refresh="refresh"> </tree-list>
    <!--audio ref = "alarm"  src = "/static/alarm.mp3" ></audio-->
    <audio ref="alarm" src="alarm.mp3"></audio>
    <!--audio ref = "voice"  src = "/static/voice.mp3" ></audio-->
    <audio ref="voice" src="voice.mp3"></audio>
    <el-dialog
      title="告警情况录入"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="25%"
    >
      <textarea
        style="height: 300px; color: #000; background-color: #fff"
        class="form-control"
        v-model="alarmDescription"
        id="textarea"
      ></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import parseXML from "utils/xml_parser";
import { mapGetters, mapActions } from "vuex";
import { isArray, isObject, isString } from "utils/tool";
import { topMenu, footNav, container, treeList, switchLeft } from "components";
import { GET_USER_INFO } from "store/getters/type";
import { getHeights } from "utils/page/home";
export default {
  data() {
    return {
      ifLeftPhone: false,
      leftPhone: "",
      flag_router: 0,
      flag: "",
      liveArray: {},
      vertoConf: {},
      group_list: [],
      usermap: {},
      last_id: "",
      targetUserGroupId: "",
      verto: "",
      meeting: "",
      voice: "",
      broad: "",
      alarm: "",
      username: "",
      orgid: "",
      deviceGroup_conf: [],
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      dialogVisible: false,
      alarmDescription: "",
      alarmcalluuid: "",
    };
  },
  created() {
    this.$nextTick(() => {
      getHeights();
      this.get_user_info;
      this.orgid = this.get_user_info.user.organizationid;
      this.username = this.get_user_info.user.username;
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.meeting = this.get_user_info.freeswitchData.MeetingID;
      this.voice = this.get_user_info.freeswitchData.VoiceCallID;
      this.alarm = this.get_user_info.freeswitchData.AlarmID;
      this.broad = this.get_user_info.freeswitchData.BroadID;
      this.organizationid = this.get_user_info.user.organizationid;
      this.instance({
        url: "Organization/getDeviceGroup/" + this.orgid,
        method: "get",
      }).then((res) => {
        if (res.data.code === 1) {
          this.deviceGroup_conf = res.data.result;
        }
      });
      $.verto.init({}, this.initVertoHandle);

      this.$router.afterEach((to, from, next) => {
        this.flag_router = 1;
        if (this.currentLoginUser.deviceState != "registered") {
          this.vertoHandle.logout();
          $.verto.init({}, this.initVertoHandle);
        }
      });
    });
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      group_users: "group_users",
      users: "users",
      currentLoginUser: "currentLoginUser",
      deviceList: "deviceList",
      deviceGroup: "deviceGroup",
      callQueue: "callQueue",
      confLeft: "confLeft",
      confAlarm: "confAlarm",
      confMeeing: "confMeeing",
      confIpBoard: "confIpBoard",
      choosenConfLeft: "choosenConfLeft",
      choosenConfMeeting: "choosenConfMeeting",
      choosenConfIpboard: "choosenConfIpboard",
      TreeData: "TreeData",
      freeswitchData: "freeswitchData",
      get_user_info: GET_USER_INFO,
      vertoClose: "vertoClose",
      adminState: "adminState",
      deviceStatus: "deviceStatus",
      firstInRadioQueue: "",
      videoVisible: "videoVisible",
      init: "init",
      isVideo: "isVideo",
      fromm: "fromm",
      sx:"sx"
    }),
  },
  watch: {
    choosenConfLeft: function (conf) {
      if (conf != "" && conf != undefined) {
        this.voice = conf;
        //this.vertoHandle.logout()
        this.flag = true;
        this.refresh();
        //$.verto.init({}, this.initVertoHandle)
      }
    },
    init: function (v) {
      if (v) {
        ("2334");
        $.verto.init({}, this.initVertoHandle);
      }
    },
    choosenConfMeeting: function (conf) {
      if (conf != "" && conf != undefined) {
        this.meeting = conf;
        //this.vertoHandle.logout()
        this.flag = true;
        this.refresh();
        //$.verto.init({}, this.initVertoHandle)
      }
    },
    choosenConfIpboard: function (conf) {
      if (conf != "" && conf != undefined) {
        this.broad = conf;
        //this.vertoHandle.logout()
        this.flag = true;
        this.refresh();
        //$.verto.init({}, this.initVertoHandle)
      }
    },
    TreeData: function (data) {
      if (this.vertoHandle) this.refresh();
    },
    callQueue: function (conf) {
      // let that=this
      // conf.forEach((item)=>{
      //   for(let i=0;i<this.deviceList.length;i++){
      //     if(item.caller==this.deviceList[i].userID){
      //       this.deviceList[i].deviceState=item.state
      //     }
      //   }
      // })
    },
    sx:function(v){
      if(v){
        this.$store.dispatch("setSx", false);
        this.$router.go(-1)
      }
    },
    confAlarm: function (conf) {
      if (
        conf.length > 0 &&
        !conf.some((item, indexs, array) => {
          return item.caller_id_number == this.verto;
        })
      ) {
        if (
          this.callQueue.some((item, index, array) => {
            return item.des == this.verto;
          })
        )
          this.vertoHandle.hangup();
        this.vertoHandle.newCall({
          // Extension to dial.
          destination_number: this.alarm,
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
      } else if (
        conf.length > 0 &&
        conf.every((item, index, array) => {
          return item.caller_id_number == this.verto;
        })
      ) {
        conf.forEach((item) => {
          this.fsAPI(
            "conference",
            this.alarm + "-scc.yuqi.com" + " " + "hup" + " " + item.conf_id
          );
        });
        this.$store.dispatch("setConfAlarm", []);
      }
    },
    confLeft: function (conf) {
      for (var i = 0; i < conf.length; i++)
        if (conf[i].caller_id_number == this.verto) {
          this.flag_conf = true;
          this.$refs.voice.pause();
          this.$refs.voiceLong.pause();
          break;
        }
      if (i == conf.length) this.flag_conf = false;
    },
  },
  methods: {
    async dialConfirm() {
      if (this.alarmDescription == "") this.$message.success("请录入告警信息");
      else {
        let data = { callid: this.alarmcalluuid, text: this.alarmDescription };
        let db = await this.instance({
          url: "Callrecord/Description",
          method: "post",
          data: data,
        });
        this.alarmDescription = "";
        this.dialogVisible = false;
      }
    },
    initVertoHandle(status) {
      let _this = this;
      this.$store.dispatch(
        "setVertoInit",
        new jQuery.verto(
          {
            login: _this.verto + "@" + window.location.hostname,
            passwd: "1234",
            socketUrl: "wss://" + window.location.hostname + ":8082",
            ringFile: "sounds/bell_ring2.wav",
            videoParams: {
              // Dimensions of the video feed to send.
              minWidth: 320,
              minHeight: 240,
              maxWidth: 640,
              maxHeight: 480,
              // The minimum frame rate of the client camera, Verto will fail if it's
              // less than this.
              minFrameRate: 15,
              // The maximum frame rate to send from the camera.
              vertoBestFrameRate: 30,
            },
            iceServers: [],
            tag: "webcam",
            deviceParams: {
              useMic: "any",
              useSpeak: "any",
              useCamera: "any",
            },
          },
          {
            onWSLogin(verto, success) {
              // 登录回调
              _this.$store.dispatch("setVertoClose", 0);
              if (_this.flag_router != 1) {
                _this.refresh();
              }
              "onWSLogin", success;
            },
            onWSClose(verto, success) {
              _this.$store.dispatch("setVertoClose", 1);
              "onWSClose", success;
            },
            onDialogState: function (d) {
              let callType = d.direction.name;
              let arr = _this.$store.getters.callQueue;
              if (d.cause == "USER_NOT_REGISTERED") {
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i].caller == d.params.caller_id_number) {
                    arr.splice(i, 1);
                    i -= 1;
                  }
                }
                _this.$store.dispatch("setCallQueue", arr);
              } else {
                switch (d.state.name) {
                  case "trying":
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "trying";
                        break;
                      }
                    }
                    if (i == arr.length) {
                      arr.push({
                        curCall: d,
                        state: d.state.name,
                        caller: d.params.caller_id_number,
                        des: d.params.callee_id_number,
                      });
                    }
                    _this.$store.dispatch("setCallQueue", arr);
                    break;
                  case "ringing": // 振铃，装载进队列
                    if (d.params.wantVideo) {
                      d.params.useVideo = true;
                    }
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "ringing";
                        break;
                      }
                    }
                    if (i == arr.length) {
                      arr.push({
                        curCall: d,
                        state: d.state.name,
                        caller: d.params.caller_id_number,
                        des: d.params.callee_id_number,
                      });
                    }
                    _this.$store.dispatch("setCallQueue", arr);
                    break;
                  case "requesting":
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "requesting";
                        break;
                      }
                    }
                    if (i == arr.length) {
                      arr.push({
                        curCall: d,
                        state: d.state.name,
                        caller: d.params.caller_id_number,
                        des: d.params.destination_number,
                      });
                    }
                    _this.$store.dispatch("setCallQueue", arr);
                    break;
                  case "answering": // 接听电话，改变状态
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "answering";
                        break;
                      }
                    }
                    _this.$store.dispatch("setCallQueue", arr);
                    break;
                  case "active":
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "active";
                        break;
                      }
                    }
                    _this.$store.dispatch("setCallQueue", arr);
                    break;
                  case "hangup": //  拒接，改变状态
                    for (var i = 0; i < arr.legnth; i++) {
                      if (arr[i].caller == d.params.caller_id_number) {
                        arr[i].state = "hangup";
                        break;
                      }
                    }
                    console.log(arr);
                    _this.$store.dispatch("setCallQueue", arr);
                    if (_this.fromm != "") {
                      let a = _this.fromm;
                      _this.$store.dispatch("setFromm", "");
                      _this.$store.dispatch("setSx", true);
                      setTimeout(() => {
                        _this.$router.push(a);
                      }, 0);
                    }
                    break;
                  case "destroy":
                    arr.forEach(function (a, i) {
                      if (a.caller == d.params.caller_id_number) {
                        arr.splice(i, 1);
                      }
                    });
                    _this.$store.dispatch("setCallQueue", arr);
                    "Call ended with cause: " + d.cause;
                    break;
                  default:
                    d.state.name;
                }
              }
            },

            onMessage: function (verto, dialog, message, data) {
              var initLiveArray = function (verto, dialog, data, pbx, room) {
                // Set up addtional configuration specific to the call.
                var config = {
                  subParams: { callID: dialog ? dialog.callID : null },
                };
                // Set up the live array, using the live array data received from FreeSWITCH.
                _this.liveArray = new $.verto.liveArray(
                  verto,
                  pbx,
                  room,
                  config
                );
                // Subscribe to live array changes.
                _this.liveArray.onChange = function (liveArrayObj, args) {
                  let device = _this.$store.getters.deviceList;
                  let action = "";
                  let arr = [];
                  let hash = Object.keys(liveArrayObj.hash());
                  if (liveArrayObj.name == _this.voice + "-scc.yuqi.com") {
                    arr = _this.$store.getters.confLeft;
                    action = "setConfLeft";
                  } else if (
                    liveArrayObj.name ==
                    _this.alarm + "-scc.yuqi.com"
                  ) {
                    arr = _this.$store.getters.confAlarm;
                    action = "setConfAlarm";
                  } else if (
                    liveArrayObj.name ==
                    _this.broad + "-scc.yuqi.com"
                  ) {
                    arr = _this.$store.getters.confIpBoard;
                    action = "setConfIpBoard";
                  } else if (
                    liveArrayObj.name ==
                    _this.meeting + "-scc.yuqi.com"
                  ) {
                    arr = _this.$store.getters.confMeeting;
                    action = "setConfMeeting";
                  } else {
                    return;
                  }
                  try {
                    switch (args.action) {
                      // Initial list of existing conference users.
                      case "bootObj":
                        break;

                      // New user joined conference.
                      case "add":
                        if (_this.currentLoginUser.userID == args.data[1]) {
                          let currentLoginUser = _this.currentLoginUser;
                          currentLoginUser.deviceState = "active";
                          _this.$store.dispatch(
                            "setCurrentLoginUser",
                            currentLoginUser
                          );
                        }
                        "conference user added";

                        var data = JSON.parse(args.data[4]);
                        if (
                          !arr.some((it) => {
                            return it.caller_id_number == args.data[1];
                          })
                        )
                          arr.push({
                            conf_id: parseInt(args.data[0]).toString(),
                            caller_id_number: args.data[1],
                            muted: data["audio"]["muted"],
                            deaf: data["audio"]["deaf"],
                            talking: data["audio"]["talking"],
                            channel_uuid: hash[arr.length],
                            key: args.key,
                          });
                        _this.$store.dispatch(action, arr);
                        if (
                          liveArrayObj.name == _this.voice + "-scc.yuqi.com" &&
                          !arr.some((it) => {
                            return it.caller_id_number == _this.verto;
                          }) &&
                          _this.currentLoginUser.deviceState == "registered"
                        ) {
                          _this.$refs.voice.play();
                        } else if (
                          liveArrayObj.name == _this.voice + "-scc.yuqi.com" &&
                          args.data[1] != _this.verto
                        ) {
                          _this.$refs.voice.play();
                        }
                        //有人进入告警会议室
                        if (
                          liveArrayObj.name == _this.alarm + "-scc.yuqi.com" &&
                          args.data[1] != _this.verto
                        ) {
                          _this.$refs.alarm.play();
                          let deviceCode = args.data[1];
                          _this.$ajax.post("Basic/List").then((res) => {
                            if (
                              res.data.code === 1 &&
                              res.data.result.length > 0
                            ) {
                              let basic_id = res.data.result[0].uniqueid;
                              ////////////////////////////////////////////////
                              ////////////////////////////////////////////////
                              ////////////////////////////////////////////////
                              ///这里实现开启shinobi摄像头的功能
                              let apiKey = basic_id.split("/")[0];
                              let groupKey = basic_id.split("/")[2];
                              let startUrl =
                                "https://nvr.yuqi.com:8432/" +
                                apiKey +
                                "/monitor/" +
                                groupKey;
                              _this.$ajax.get(startUrl).then((res) => {
                                if (res.status == 200) {
                                  let axios = [];
                                  if (res.data instanceof Array)
                                    res.data.forEach((re) => {
                                      let parsed = JSON.parse(re.details)
                                        .groups_name;
                                      if (
                                        (re.mode == "idle" ||
                                          re.mode == "stop") &&
                                        parsed
                                          .slice(1, parsed.length - 1)
                                          .split(",")
                                          .some((item) => {
                                            return (
                                              item == '"' + deviceCode + '"'
                                            );
                                          })
                                      )
                                        axios.push(
                                          _this.$ajax.get(
                                            "https://nvr.yuqi.com:8432/" +
                                              apiKey +
                                              "/monitor/" +
                                              groupKey +
                                              "/" +
                                              re.mid +
                                              "/start" +
                                              "/10"
                                          )
                                        );
                                    });
                                  _this.$ajax.all(axios).then((res) => {
                                    res.forEach((element) => {});
                                  });
                                }
                              });
                              ////////////////////////////////////////////////
                              ////////////////////////////////////////////////
                              ////////////////////////////////////////////////
                              let alarm_devices = [];
                              _this
                                .instance({
                                  method: "get",
                                  url: "organization/" + _this.orgid,
                                })
                                .then((res) => {
                                  if (deviceCode != res.data.right_watcher) {
                                    arr.forEach((de) => {
                                      if (de.caller_id_number != _this.verto)
                                        alarm_devices.push(de.caller_id_number);
                                    });
                                  } else {
                                    arr.forEach((de) => {
                                      if (
                                        de.caller_id_number != deviceCode &&
                                        de.caller_id_number != _this.verto
                                      )
                                        alarm_devices.push(de.caller_id_number);
                                    });
                                  }
                                  _this
                                    .instance({
                                      method: "get",
                                      url: "alarm_control/" + _this.orgid,
                                    })
                                    .then((res) => {
                                      let url =
                                        "https://nvr.yuqi.com:8432/" +
                                        basic_id +
                                        alarm_devices.join("|");
                                      if (res.data.alarm_control == "popup") {
                                        if (
                                          basic_id == "" ||
                                          basic_id == "请输入视频联动存储密匙"
                                        ) {
                                          _this.$message.success(
                                            "请输入视频联动存储密匙"
                                          );
                                          return;
                                        }
                                        window.open(
                                          url,
                                          "newwindow",
                                          "height=1920,width=1080,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no"
                                        );
                                      } else if (
                                        res.data.alarm_control == "router"
                                      ) {
                                        if (
                                          basic_id == "" ||
                                          basic_id == "请输入视频联动存储密匙"
                                        ) {
                                          _this.$message.success(
                                            "请输入视频联动存储密匙"
                                          );
                                          return;
                                        }
                                        _this.$store.dispatch(
                                          "setAlarmAddress",
                                          url
                                        );
                                        _this.$router.push("/alarm");
                                      } else if (
                                        res.data.alarm_control == "matrix"
                                      ) {
                                        _this.$ajax.get(
                                          "https://scc.yuqi.com:8001/" +
                                            "kbs_wc/" +
                                            alarm_devices.join("|")
                                        );
                                      }
                                    });
                                });
                            }
                          }); //device获取videourl
                        } //liveArrayObj.name =='9110-scc.yuqi.com'i && args.data[1]!='9000'
                        //有人进入语音等待会议室
                        if (
                          liveArrayObj.name == _this.voice + "-scc.yuqi.com" &&
                          args.data[1] != _this.verto &&
                          args.data[2] == args.data[1]
                        ) {
			//通过新接口判断某个号码是否属于该组织的值班组
                          _this
                            .instance({
                              method: "get",
                              url: "watcher/isleft/" + _this.orgid + "/"+args.data[1],
                            })
                            .then((res) => {
                              if (res.data.result.length == 0)
                                _this.fsAPI(
                                  "conference",
                                  liveArrayObj.name +
                                    " " +
                                    "play" +
                                    " " +
                                    "/usr/local/freeswitch/sounds/music/8000/danza-espanola-op-37-h-142-xii-arabesca.wav" +
                                    " " +
                                    parseInt(args.data[0]).toString()
                                );
                            });
                        }
                        break;

                      // User left conference.
                      case "del":
                        "conference user deleted";
                        arr.forEach(function (a, i) {
                          if (a.key == args.key) arr.splice(i, 1);
                        });
                        if (
                          liveArrayObj.name.slice(0, 2) == "83" &&
                          arr.length == 0
                        )
                          _this.firstInRadioQueue = "";
                        _this.$store.dispatch(action, arr);
                        break;

                      // Existing user's state changed (mute/unmute, talking, floor, etc)
                      case "modify":
                        "conference user changed";
                        var data = JSON.parse(args.data[4]);
                        if (
                          arr.length == 0 ||
                          arr.every(function (item, index, array) {
                            return item.key != args.key;
                          })
                        ) {
                          arr.push({
                            conf_id: parseInt(args.data[0]).toString(),
                            caller_id_number: args.data[1],
                            muted: data["audio"]["muted"],
                            deaf: data["audio"]["deaf"],
                            talking: data["audio"]["talking"],
                            channel_uuid: hash[arr.length],
                            key: args.key,
                          });
                        } else {
                          arr.forEach(function (item, index) {
                            if (item.key == args.key) {
                              (arr[index].conf_id = parseInt(
                                args.data[0]
                              ).toString()),
                                (arr[index].caller_id_number = args.data[1]),
                                (arr[index].muted = data["audio"]["muted"]),
                                (arr[index].deaf = data["audio"]["deaf"]),
                                (arr[index].talking = data["audio"]["talking"]),
                                (arr[index].channel_uuid = hash[index]),
                                (arr[index].key = args.key);
                            }
                          });
                        }
                        _this.$store.dispatch(action, arr);
                        break;
                    }
                  } catch (err) {
                    console.error("ERROR: " + err);
                  }
                };
                // Called if the live array throws an error.
                _this.liveArray.onErr = function (obj, args) {
                  console.error("Error: ", obj, args);
                };
              };
              switch (message) {
                case $.verto.enum.message.pvtEvent:
                  if (data.pvtData) {
                    switch (data.pvtData.action) {
                      // This client has joined the live array for the conference.
                      case "conference-liveArray-join":
                        // With the initial live array data from the server, you can
                        // configure/subscribe to the live array.
                        break;
                      // This client has left the live array for the conference.
                      case "conference-liveArray-part":
                        // Some kind of client-side wrapup...
                        break;
                    }
                  }
                  break;
                // TODO: Needs doc.
                case $.verto.enum.message.info:
                  "info";
                  break;
                // TODO: Needs doc.
                case $.verto.enum.message.display:
                  "display";
                  break;
                case $.verto.enum.message.clientReady:
                  // 1.8.x+
                  // Fired when the server has finished re-attaching any active sessions.
                  // data.reattached_sessions contains an array of session IDs for all
                  // sessions that were re-attached.
                  _this.vertoHandle.subscribe("FSevent.custom::sofia::expire", {
                    handler: _this.handleExpire.bind(_this),
                  });
                  _this.vertoHandle.subscribe(
                    "FSevent.custom::sofia::register",
                    { handler: _this.handleFSEventRegister.bind(_this) }
                  );
                  _this.vertoHandle.subscribe(
                    "FSevent.custom::sofia::unregister",
                    { handler: _this.handleFSEventRegister.bind(_this) }
                  );
                  _this.vertoHandle.subscribe("FSevent.channel_callstate", {
                    handler: _this.handleFSEventChannel.bind(_this),
                  });
                  _this.vertoHandle.subscribe("FSevent.message", {
                    handler: _this.handleMessage.bind(_this),
                  });
                  _this.vertoHandle.subscribe(
                    "FSevent.custom::conference::maintenance",
                    { handler: _this.closeMeeting.bind(_this) }
                  );
                  initLiveArray(
                    verto,
                    dialog,
                    data,
                    "conference-liveArray." +
                      _this.voice +
                      "-scc.yuqi.com@scc.yuqi.com",
                    _this.voice + "-scc.yuqi.com"
                  );
                  initLiveArray(
                    verto,
                    dialog,
                    data,
                    "conference-liveArray." +
                      _this.alarm +
                      "-scc.yuqi.com@scc.yuqi.com",
                    _this.alarm + "-scc.yuqi.com"
                  );
                  initLiveArray(
                    verto,
                    dialog,
                    data,
                    "conference-liveArray." +
                      _this.broad +
                      "-scc.yuqi.com@scc.yuqi.com",
                    _this.broad + "-scc.yuqi.com"
                  );
                  initLiveArray(
                    verto,
                    dialog,
                    data,
                    "conference-liveArray." +
                      _this.meeting +
                      "-scc.yuqi.com@scc.yuqi.com",
                    _this.meeting + "-scc.yuqi.com"
                  );
                  _this.deviceGroup_conf.forEach((con) => {
                    initLiveArray(
                      verto,
                      dialog,
                      data,
                      "conference-liveArray." +
                        con.conf_num +
                        "-scc.yuqi.com@scc.yuqi.com",
                      con.conf_num + "-scc.yuqi.com"
                    );
                  });
                  "verto channel ready";
                  break;
              }
            },
          }
        )
      );
    },
    //  设备状态实时更新
    changeDeviceState(d, type) {
      if (type == "inbound") {
      }
    },
    async handleMessage(v, e) {
      let message = e.data._body;
      if (message === "zhaiji") {
        ("zhaiji");
        this.callQueue[this.callQueue.length - 1].curCall.answer();
      }
    },
    //这个函数写的很乱，数据尽量由后台整理后再传给前端，别让前端花时间去处理了202303118
    // 查询所有设备 以及事件初始化
    async refresh() {
      let xuiUsername = this.verto; // 过滤掉登陆者
      let result = await this.instance({
        method: "get",
        url: "/organization/" + this.organizationid,
      });
      this.leftPhone = result.data.left_watcher;
      this.ifLeftPhone = result.data.left_watcher !="";
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

          let deviceStatus = this.$store.getters.deviceStatus;
          let registrations = [];
          let deviceList = [];
          deviceStatus[xuiUsername] = { name: this.get_user_info.user.orgname };
          this.usermap = new Object();
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

          this.$ajax.post(`Role/List`).then((res) => {
            if (res.data.code === 1) {
              let groupList = res.data.result;
              this.targetUserGroupId = "";
              groupList.forEach((element) => {
                if (element.rolename == this.TreeData.orgname) {
                  this.targetUserGroupId = element.roleid;
                }
              });
            }
            let organizationID_requests = [];
            organizationID_requests.push(
              this.$ajax.get(
                `Feature/getFeatureByOrg/${this.TreeData.organizationid}?flag=true`
              )
            );
            organizationID_requests.push(
              this.$ajax.get(
                `Feature/getFeatureByOrg/${this.TreeData.organizationid}?flag=false`
              )
            );
            this.$ajax.all(organizationID_requests).then((res) => {
              let all_devices = [];
              if (res[0].data.code == 1)
                all_devices = all_devices.concat(res[0].data.result);
              if (res[1].data.code == 1)
                all_devices = all_devices.concat(res[1].data.result);
              all_devices.forEach((r, i) => {
                if (r != null && this.usermap.hasOwnProperty(r.devicecode)) {
                } else if (r != null) {
                  this.usermap[r.devicecode] = {};
                  this.usermap[r.devicecode].list = [];
                  this.usermap[r.devicecode].type = r.type;
                  this.usermap[r.devicecode].name = r.devicename;
                  this.usermap[r.devicecode].ip =
                    r.type == 2 ? r.ipaddress : null;
                  this.usermap[r.devicecode].port = r.type == 2 ? r.port : null;
                }
              });
              if (this.targetUserGroupId != "" || this.TreeData.parentid == "0")
                this.instance({
                  method: "get",
                  url: `Role/getDeviceGroup/${this.targetUserGroupId}`,
                }).then((res) => {
                  if (res.data.code === 1) {
                    this.group_list = res.data.result;
                    for (let g in this.group_list)
                      this.group_list[g].selected = false;
                    this.$store.dispatch("setUserGroup", this.group_list);
                    let axios = [];
                    this.group_list.forEach((item, index) => {
                      axios.push(
                        this.$ajax.get(
                          `DeviceGroup/Detail/${item.devicegroupid}`
                        )
                      );
                    });
                    this.$ajax.all(axios).then((res) => {
                      for (let i = 0; i < res.length; i++) {
                        let group = res[i]
                          ? res[i].data.result.deviceGroups
                          : [];
                        group.forEach((r, i) => {
                          if (this.usermap.hasOwnProperty(r.devicecode)) {
                            this.usermap[r.devicecode].list.push(
                              r.devicegroupid
                            );
                            this.usermap[r.devicecode].type = r.type;
                            this.usermap[r.devicecode].name = r.devicename;
                          } else {
                            this.usermap[r.devicecode] = {};
                            this.usermap[r.devicecode].list = [r.devicegroupdd];
                            this.usermap[r.devicecode].type = r.type;
                            this.usermap[r.devicecode].name = r.devicename;
                          }
                        });
                      }
                      for (let index in deviceList) {
                        if (
                          this.usermap.hasOwnProperty(deviceList[index].userid)
                        ) {
                          deviceList[index].groupid = this.usermap[
                            deviceList[index].userID
                          ].list;
                          deviceList[index].type = this.usermap[
                            deviceList[index].userID
                          ].type;
                          deviceList[index].name = this.usermap[
                            deviceList[index].userID
                          ].name;
                          delete this.usermap[deviceList[index].userid];
                        }
                      }
                      for (let item in this.usermap) {
                        let user = {};
                        user.deviceState =
                          this.usermap[item].type == 2
                            ? "registeredM"
                            : "unregistered";
                        user.calling = "";
                        user.userID = item;
                        user.callDirection = null;
                        user.channelUUID = null;
                        user.networkIP =
                          this.usermap[item].type == 2
                            ? this.usermap[item].ip
                            : null;
                        user.networkPort =
                          this.usermap[item].type == 2
                            ? this.usermap[item].port
                            : null;
                        user.operationState = 0;
                        user.oppoChannelUUID = null;
                        user.groupid = this.usermap[item].list;
                        user.type = this.usermap[item].type;
                        user.name = this.usermap[item].name;
                        user.timer = { s: 0, m: 0, h: 0, id: [], clock: false };
                        deviceStatus[user.userID] = { name: user.name };
                        deviceList.push(user);
                      }
                      registrations.forEach((r) => {
                        for (let i = 0; i < deviceList.length; i++) {
                          if (deviceList[i].userID == r.reg_user) {
                            if (r.reg_user != xuiUsername) {
                              //(!deviceList.some((item)=>{return item.userID == r.reg_user}))
                              deviceList[i].deviceState = "registered";
                              deviceList[i].userID = r.reg_user;
                              deviceList[i].callDirection = null;
                              deviceList[i].channelUUID = null;
                              deviceList[i].networkIP = r.network_ip;
                              deviceList[i].networkPort = r.network_port;
                              deviceList[i].operationState = 0;
                              deviceList[i].oppoChannelUUID = null;
                              deviceList[i].timer = {
                                s: 0,
                                m: 0,
                                h: 0,
                                id: [],
                                clock: false,
                              };
                              deviceList[i].calling = null;
                              //deviceList[i].name = null
                            }
                          }
                        }
                      });
                      //这时deviceList已经更新
                      this.vertoHandle.sendMethod(
                        "jsapi",
                        {
                          command: "fsapi",
                          data: { cmd: "show", arg: "channels as xml" },
                        },
                        (data) => {
                          const parser = new DOMParser();
                          const doc = parser.parseFromString(
                            data.message,
                            "text/xml"
                          );
                          const msg = parseXML(doc);
                          if (msg != 0) {
                            let channel_data = msg.row;
                            if (!(channel_data instanceof Array))
                              channel_data = [channel_data];
                            channel_data.forEach((item, index) => {
                              let application_des = "";
                              let arr = [];
                              if (item.application == "conference") {
                                if (
                                  item.application_data.slice(0, 2) == "93" ||
                                  item.application_data.slice(0, 2) == "85" ||
                                  item.application_data.slice(0, 2) == "92" ||
                                  item.application_data.slice(0, 2) == "91"
                                ) {
                                  item.application_data =
                                    item.application_data.slice(
                                      0,
                                      item.application_data.indexOf("-")
                                    ) + "-scc.yuqi.com";
                                }
                                this.vertoHandle.sendMethod(
                                  "jsapi",
                                  {
                                    command: "fsapi",
                                    data: {
                                      cmd: "conference",
                                      arg:
                                        item.application_data +
                                        " " +
                                        "list as xml",
                                    },
                                  },
                                  (data) => {
                                    switch (item.application_data) {
                                      case this.voice + "-scc.yuqi.com":
                                        application_des = "setConfLeft";
                                        arr = this.$store.getters.confLeft;
                                        break;
                                      case this.alarm + "-scc.yuqi.com":
                                        application_des = "setConfAlarm";
                                        arr = this.$store.getters.confAlarm;
                                        break;
                                      case this.broad + "-scc.yuqi.com":
                                        application_des = "setConfIpBoard";
                                        arr = this.$store.getters.confIpBoard;
                                        break;
                                      case this.meeting + "-scc.yuqi.com":
                                        application_des = "setConfMeeting";
                                        arr = this.$store.getters.confMeeting;
                                        break;
                                    }
                                    let conferences = data.message.split("\n");
                                    conferences.forEach((element, index) => {
                                      /////对于每个conference的状态，都要进行判断

                                      if (element != "") {
                                        let conference_data =
                                          element.split(";");
                                        let sound =
                                          conference_data[5].split("|");
                                        if (
                                          conference_data[4] ==
                                            item.presence_id.slice(
                                              0,
                                              item.presence_id.indexOf("@")
                                            ) ||
                                          conference_data[4] == item.cid_num
                                        ) {
                                          if (
                                            arr.length == 0 ||
                                            arr.every(function (
                                              item,
                                              index,
                                              array
                                            ) {
                                              return (
                                                item.key != conference_data[2]
                                              );
                                            })
                                          )
                                            arr.push({
                                              conf_id: conference_data[0],
                                              caller_id_number:
                                                conference_data[4],
                                              muted:
                                                sound.findIndex((item) => {
                                                  return item == "speak";
                                                }) == -1
                                                  ? true
                                                  : false,
                                              deaf:
                                                sound.findIndex((item) => {
                                                  return item == "hear";
                                                }) == -1
                                                  ? true
                                                  : false,
                                              talking: false,
                                              channel_uuid: conference_data[2],
                                              key: conference_data[2],
                                            });
                                        }
                                        if (
                                          item.application_data ==
                                          this.alarm + "-scc.yuqi.com"
                                        ) {
                                          let groupName = conference_data[4];
                                          let deviceCode = conference_data[4];
                                          this.$ajax
                                            .post("Basic/List")
                                            .then((res) => {
                                              if (
                                                res.data.code === 1 &&
                                                res.data.result.length > 0
                                              ) {
                                                let basic_id =
                                                  res.data.result[0].uniqueid;
                                                ////////////////////////////////////////////////
                                                ////////////////////////////////////////////////
                                                ////////////////////////////////////////////////
                                                ///这里实现开启shinobi摄像头的功能
                                                let apiKey = basic_id.split(
                                                  "/"
                                                )[0];
                                                let groupKey = basic_id.split(
                                                  "/"
                                                )[2];
                                                let startUrl =
                                                  "https://nvr.yuqi.com:8432/" +
                                                  apiKey +
                                                  "/monitor/" +
                                                  groupKey;
                                                this.$ajax
                                                  .get(startUrl)
                                                  .then((res) => {
                                                    if (res.status == 200) {
                                                      let axios = [];
                                                      res.data.forEach((re) => {
                                                        let parsed = JSON.parse(
                                                          re.details
                                                        ).groups_name;
                                                        if (
                                                          (re.mode == "idle" ||
                                                            re.mode ==
                                                              "stop") &&
                                                          parsed
                                                            .slice(
                                                              1,
                                                              parsed.length - 1
                                                            )
                                                            .split(",")
                                                            .some((item) => {
                                                              return (
                                                                item ==
                                                                '"' +
                                                                  groupName +
                                                                  '"'
                                                              );
                                                            })
                                                        )
                                                          axios.push(
                                                            this.$ajax.get(
                                                              "https://nvr.yuqi.com:8432/" +
                                                                apiKey +
                                                                "/monitor/" +
                                                                groupKey +
                                                                "/" +
                                                                re.mid +
                                                                "/start/10"
                                                            )
                                                          );
                                                      });
                                                      this.$ajax
                                                        .all(axios)
                                                        .then((res) => {
                                                          res.forEach(
                                                            (element) => {}
                                                          );
                                                        });
                                                    }
                                                  });
                                                ////////////////////////////////////////////////
                                                ////////////////////////////////////////////////
                                                ////////////////////////////////////////////////
                                                if (basic_id == "") return;
                                                let alarm_devices = [];
                                                this.instance({
                                                  method: "get",
                                                  url:
                                                    "organization/" +
                                                    this.orgid,
                                                }).then((res) => {
                                                  if (
                                                    deviceCode !=
                                                    res.data.right_watcher
                                                  ) {
                                                    arr.forEach((de) => {
                                                      if (
                                                        de.caller_id_number !=
                                                        this.verto
                                                      )
                                                        alarm_devices.push(
                                                          de.caller_id_number
                                                        );
                                                    });
                                                  } else {
                                                    arr.forEach((de) => {
                                                      if (
                                                        de.caller_id_number !=
                                                          deviceCode &&
                                                        de.caller_id_number !=
                                                          this.verto
                                                      )
                                                        alarm_devices.push(
                                                          de.caller_id_number
                                                        );
                                                    });
                                                  }
                                                  this.instance({
                                                    method: "get",
                                                    url:
                                                      "alarm_control/" +
                                                      this.orgid,
                                                  }).then((res) => {
                                                    let url =
                                                      "https://nvr.yuqi.com:8432/" +
                                                      basic_id +
                                                      alarm_devices.join("|");
                                                    if (
                                                      res.data.alarm_control ==
                                                      "popup"
                                                    ) {
                                                      window.open(
                                                        url,
                                                        "newwindow",
                                                        "height=1920,width=1080,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no"
                                                      );
                                                    } else {
                                                      this.$store.dispatch(
                                                        "setAlarmAddress",
                                                        url
                                                      );
                                                      this.$router.push(
                                                        "/alarm"
                                                      );
                                                    }
                                                  });
                                                });
                                              }
                                            }); //device获取videourl
                                        } //liveArrayObj.name =='9110-scc.yuqi.com'i && args.data[1]!='9000'
                                      }
                                    });
                                    if (
                                      application_des == "setConfLeft" ||
                                      application_des == "setConfAlarm" ||
                                      application_des == "setConfIpBoard" ||
                                      application_des == "setConfMeeting"
                                    )
                                      this.$store.dispatch(
                                        application_des,
                                        arr
                                      );
                                  }
                                );
                              }
                              let channelCallState = "";
                              let callerNumber = item["cid_num"]; //主叫号码
                              let calleeNumber = item["callee_num"];
                              let curNumber = item.presence_id.slice(
                                0,
                                item.presence_id.indexOf("@")
                              );
                              let deviceList = this.$store.getters.deviceList;
                              let queue = deviceStatus[curNumber];
                              let temp = this.deviceList.find((device) => {
                                return device.userID == curNumber;
                              });
                              let uuid = item["uuid"];
                              if (
                                item.callstate == "RINGING" ||
                                item.callstate == "EARLY" ||
                                item.callstate == "RING_WAIT"
                              ) {
                                channelCallState = "ringing";
                              } else if (item.callstate == "ACTIVE") {
                                channelCallState = "active";
                              }
                              if (deviceStatus.hasOwnProperty(curNumber) && !isNaN(curNumber))
                                deviceStatus[curNumber][uuid] = {
                                  deviceState: channelCallState,
                                  calling:
                                    curNumber == callerNumber
                                      ? calleeNumber
                                      : callerNumber,
                                  created: item.created,
                                };
                              if (
                                isNaN(
                                  Number(deviceStatus[curNumber][uuid].calling)
                                )
                              )
                                deviceStatus[curNumber][
                                  uuid
                                ].calling = deviceStatus[curNumber][
                                  uuid
                                ].calling.slice(
                                  deviceStatus[curNumber][uuid].calling.indexOf(
                                    ":"
                                  ) + 1,
                                  deviceStatus[curNumber][uuid].calling.indexOf(
                                    "@"
                                  )
                                );
                              if (this.verto == curNumber) {
                                this.$store.dispatch("setCurrentLoginUser", {
                                  deviceState: "active",
                                  userID: xuiUsername,
                                  callDirection: null,
                                  channelUUID: null,
                                  oppoChannelUUID: null,
                                  calling:
                                    curNumber == callerNumber
                                      ? calleeNumber
                                      : callerNumber,
                                });
                              }
                            });
                            deviceList.forEach((device, index) => {
                              let cur_queue = deviceStatus[device.userID];
                              let cur_status = "";
                              let cur_calling;
                              let cur_uuid;
                              let created;
                              for (let ce in cur_queue) {
                                if (ce!="name" && cur_queue[ce].deviceState == "active") {
                                  cur_status = "active";
                                  cur_calling = cur_queue[ce].calling;
                                  cur_uuid = ce;
                                  created = cur_queue[ce].created;
                                  break;
                                }
                              }
                              if (cur_status == "")
                                for (let ce in cur_queue) {
                                  if (ce!="name" && cur_queue[ce].deviceState == "ringing") {
                                    cur_status = "ringing";
                                    cur_calling = cur_queue[ce].calling;
                                    cur_uuid = ce;
                                    created = cur_queue[ce].created;
                                  }
                                }
                              if (cur_status == "") {
                                if (device.deviceState == "unregistered") {
                                  cur_status = "unregistered";
                                } else {
                                  cur_status =
                                    device.type == 2
                                      ? "registeredM"
                                      : "registered";
                                }
                                cur_calling = "";
                                cur_uuid = "";
                              }
                              device.deviceState = cur_status;
                              device.channelUUID = cur_uuid;
                              device.calling = cur_calling;
                              if (
                                device.deviceState == "active" &&
                                device.timer.clock == false
                              ) {
                                created = created.replace(/\-/g, "/");
                                let time = new Date(created);
                                let now = new Date();
                                device.timer.h = parseInt(
                                  parseInt(now - time) / 1000 / 60 / 60
                                );
                                device.timer.m = parseInt(
                                  parseInt(
                                    now - time - device.timer.h * 1000 * 60 * 60
                                  ) /
                                    1000 /
                                    60
                                );
                                device.timer.s = parseInt(
                                  parseInt(
                                    now -
                                      time -
                                      device.timer.h * 1000 * 60 * 60 -
                                      device.timer.m * 1000 * 60
                                  ) / 1000
                                );
                                var t = setInterval(() => {
                                  device.timer.s += 1;
                                  if (device.timer.s > 59.5) {
                                    device.timer.s = 0;
                                    device.timer.m += 1;
                                  }
                                  if (
                                    device.timer.s > 59.5 ||
                                    device.timer.m > 59
                                  ) {
                                    device.timer.m = 0;
                                    device.timer.h += 1;
                                  }
                                }, 1000);
                                device.timer.clock = true;
                                device.timer.id.push(t);
                              } //开启计时器
                            }); //deviceList
                            this.$store.dispatch("setDeviceList", deviceList);
                            this.$store.dispatch(
                              "setDeviceStatus",
                              deviceStatus
                            );
                            for (let i in deviceStatus) {
                              window.sessionStorage.setItem(
                                i,
                                deviceStatus[i].name
                              );
                            }
                          }
                          this.$store.dispatch("setDeviceList", deviceList);
                          this.$store.dispatch("setDeviceStatus", deviceStatus);
                          for (let i in deviceStatus) {
                            window.sessionStorage.setItem(
                              i,
                              deviceStatus[i].name
                            );
                          } //msg
                        }
                      );
                    });
                  } else {
                    for (let index in deviceList) {
                      if (
                        this.usermap.hasOwnProperty(deviceList[index].userid)
                      ) {
                        deviceList[index].groupid = this.usermap[
                          deviceList[index].userID
                        ].list;
                        deviceList[index].type = this.usermap[
                          deviceList[index].userID
                        ].type;
                        deviceList[index].name = this.usermap[
                          deviceList[index].userID
                        ].name;
                        delete this.usermap[deviceList[index].userid];
                      }
                    }
                    for (let item in this.usermap) {
                      let user = {};
                      user.deviceState = "unregistered";
                      user.calling = "";
                      user.userID = item;
                      user.callDirection = null;
                      user.channelUUID = null;
                      user.networkIP = null;
                      user.networkPort = null;
                      user.operationState = 0;
                      user.oppoChannelUUID = null;
                      user.groupid = this.usermap[item].list;
                      user.type = this.usermap[item].type;
                      user.name = this.usermap[item].name;
                      user.timer = { s: 0, m: 0, h: 0, id: [], clock: false };
                      deviceStatus[user.userID] = { name: user.name };
                      deviceList.push(user);
                    }
                    registrations.forEach((r) => {
                      for (let i = 0; i < deviceList.length; i++) {
                        if (deviceList[i].userID == r.reg_user) {
                          if (r.reg_user != xuiUsername) {
                            //(!deviceList.some((item)=>{return item.userID == r.reg_user}))
                            deviceList[i].deviceState = "registered";
                            deviceList[i].userID = r.reg_user;
                            deviceList[i].callDirection = null;
                            deviceList[i].channelUUID = null;
                            deviceList[i].networkIP = r.network_ip;
                            deviceList[i].networkPort = r.network_port;
                            deviceList[i].operationState = 0;
                            deviceList[i].oppoChannelUUID = null;
                            deviceList[i].timer = {
                              s: 0,
                              m: 0,
                              h: 0,
                              id: [],
                              clock: false,
                            };
                            deviceList[i].calling = null;
                            //deviceList[i].name = null
                          }
                        }
                      }
                    });
                    //这时deviceList已经更新
                    this.vertoHandle.sendMethod(
                      "jsapi",
                      {
                        command: "fsapi",
                        data: { cmd: "show", arg: "channels as xml" },
                      },
                      (data) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(
                          data.message,
                          "text/xml"
                        );
                        const msg = parseXML(doc);
                        if (msg != 0) {
                          let channel_data = msg.row;
                          if (!(channel_data instanceof Array))
                            channel_data = [channel_data];
                          channel_data.forEach((item, index) => {
                            let application_des = "";
                            let arr = [];
                            if (item.application == "conference") {
                              if (
                                item.application_data.slice(0, 2) == "93" ||
                                item.application_data.slice(0, 2) == "85" ||
                                item.application_data.slice(0, 2) == "91"
                              ) {
                                item.application_data =
                                  item.application_data.slice(
                                    0,
                                    item.application_data.indexOf("-")
                                  ) + "-scc.yuqi.com";
                              }
                              this.vertoHandle.sendMethod(
                                "jsapi",
                                {
                                  command: "fsapi",
                                  data: {
                                    cmd: "conference",
                                    arg:
                                      item.application_data +
                                      " " +
                                      "list as xml",
                                  },
                                },
                                (data) => {
                                  switch (item.application_data) {
                                    case this.voice + "-scc.yuqi.com":
                                      application_des = "setConfLeft";
                                      arr = this.$store.getters.confLeft;
                                      break;
                                    case this.alarm + "-scc.yuqi.com":
                                      application_des = "setConfAlarm";
                                      arr = this.$store.getters.confAlarm;
                                      break;
                                    case this.broad + "-scc.yuqi.com":
                                      application_des = "setConfIpBoard";
                                      arr = this.$store.getters.confIpBoard;
                                      break;
                                    case this.meeting + "-scc.yuqi.com":
                                      application_des = "setConfMeeting";
                                      arr = this.$store.getters.confMeeting;
                                      break;
                                  }
                                  let conferences = data.message.split("\n");
                                  conferences.forEach((element, index) => {
                                    if (element != "") {
                                      let conference_data = element.split(";");
                                      let sound = conference_data[5].split("|");
                                      if (
                                        conference_data[4] ==
                                          item.presence_id.slice(
                                            0,
                                            item.presence_id.indexOf("@")
                                          ) ||
                                        conference_data[4] == item.cid_num
                                      ) {
                                        if (
                                          arr.length == 0 ||
                                          arr.every(function (
                                            item,
                                            index,
                                            array
                                          ) {
                                            return (
                                              item.key != conference_data[2]
                                            );
                                          })
                                        )
                                          arr.push({
                                            conf_id: conference_data[0],
                                            caller_id_number:
                                              conference_data[4],
                                            muted:
                                              sound.findIndex((item) => {
                                                return item == "speak";
                                              }) == -1
                                                ? true
                                                : false,
                                            deaf:
                                              sound.findIndex((item) => {
                                                return item == "hear";
                                              }) == -1
                                                ? true
                                                : false,
                                            talking: false,
                                            channel_uuid: conference_data[2],
                                            key: conference_data[2],
                                          });
                                      }
                                      if (
                                        item.application_data ==
                                        this.alarm + "-scc.yuqi.com"
                                      ) {
                                        let groupName = conference_data[4];
                                        let deviceCode = conference_data[4];
                                        this.$ajax
                                          .post("Basic/List")
                                          .then((res) => {
                                            if (
                                              res.data.code === 1 &&
                                              res.data.result.length > 0
                                            ) {
                                              let basic_id =
                                                res.data.result[0].uniqueid;
                                              ////////////////////////////////////////////////
                                              ////////////////////////////////////////////////
                                              ////////////////////////////////////////////////
                                              ///这里实现开启shinobi摄像头的功能
                                              let apiKey = basic_id.split(
                                                "/"
                                              )[0];
                                              let groupKey = basic_id.split(
                                                "/"
                                              )[2];
                                              let startUrl =
                                                "https://nvr.yuqi.com:8432/" +
                                                apiKey +
                                                "/monitor/" +
                                                groupKey;
                                              this.$ajax
                                                .get(startUrl)
                                                .then((res) => {
                                                  if (res.status == 200) {
                                                    let axios = [];
                                                    res.data.forEach((re) => {
                                                      let parsed = JSON.parse(
                                                        re.details
                                                      ).groups_name;
                                                      if (
                                                        (re.mode == "idle" ||
                                                          re.mode == "stop") &&
                                                        parsed
                                                          .slice(
                                                            1,
                                                            parsed.length - 1
                                                          )
                                                          .split(",")
                                                          .some((item) => {
                                                            return (
                                                              item ==
                                                              '"' +
                                                                groupName +
                                                                '"'
                                                            );
                                                          })
                                                      )
                                                        axios.push(
                                                          this.$ajax.get(
                                                            "https://nvr.yuqi.com:8432/" +
                                                              apiKey +
                                                              "/monitor/" +
                                                              groupKey +
                                                              "/" +
                                                              re.mid +
                                                              "/start/10"
                                                          )
                                                        );
                                                    });
                                                    this.$ajax
                                                      .all(axios)
                                                      .then((res) => {
                                                        res.forEach(
                                                          (element) => {}
                                                        );
                                                      });
                                                  }
                                                });
                                              ////////////////////////////////////////////////
                                              ////////////////////////////////////////////////
                                              ////////////////////////////////////////////////
                                              if (basic_id == "") return;
                                              let alarm_devices = [];
                                              this.instance({
                                                method: "get",
                                                url:
                                                  "organization/" + this.orgid,
                                              }).then((res) => {
                                                if (
                                                  deviceCode !=
                                                  res.data.right_watcher
                                                ) {
                                                  arr.forEach((de) => {
                                                    if (
                                                      de.caller_id_number !=
                                                      this.verto
                                                    )
                                                      alarm_devices.push(
                                                        de.caller_id_number
                                                      );
                                                  });
                                                } else {
                                                  arr.forEach((de) => {
                                                    if (
                                                      de.caller_id_number !=
                                                        deviceCode &&
                                                      de.caller_id_number !=
                                                        this.verto
                                                    )
                                                      alarm_devices.push(
                                                        de.caller_id_number
                                                      );
                                                  });
                                                }
                                                this.instance({
                                                  method: "get",
                                                  url:
                                                    "alarm_control/" +
                                                    this.orgid,
                                                }).then((res) => {
                                                  let url =
                                                    "https://nvr.yuqi.com:8432/" +
                                                    basic_id +
                                                    alarm_devices.join("|");
                                                  if (
                                                    res.data.alarm_control ==
                                                    "popup"
                                                  ) {
                                                    window.open(
                                                      url,
                                                      "newwindow",
                                                      "height=1920,width=1080,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,location=no, status=no"
                                                    );
                                                  } else {
                                                    this.$store.dispatch(
                                                      "setAlarmAddress",
                                                      url
                                                    );
                                                    this.$router.push("/alarm");
                                                  }
                                                });
                                              });
                                            }
                                          }); //device获取videourl
                                      } //liveArrayObj.name =='9110-scc.yuqi.com'i && args.data[1]!='9000'
                                    }
                                  });
                                  this.$store.dispatch(application_des, arr);
                                }
                              );
                            }
                            let channelCallState = "";
                            let callerNumber = item["cid_num"]; //主叫号码
                            let calleeNumber = item["callee_num"];
                            let curNumber = item.presence_id.slice(
                              0,
                              item.presence_id.indexOf("@")
                            );
                            let deviceList = this.$store.getters.deviceList;
                            let queue = deviceStatus[curNumber];
                            let temp = this.deviceList.find((device) => {
                              return device.userID == curNumber;
                            });
                            let uuid = item["uuid"];
                            if (
                              item.callstate == "RINGING" ||
                              item.callstate == "EARLY" ||
                              item.callstate == "RING_WAIT"
                            ) {
                              channelCallState = "ringing";
                            } else if (item.callstate == "ACTIVE") {
                              channelCallState = "active";
                            }
                            if (deviceStatus.hasOwnProperty(curNumber) && !isNaN(curNumber))
                              deviceStatus[curNumber][uuid] = {
                                deviceState: channelCallState,
                                calling:
                                  curNumber == callerNumber
                                    ? calleeNumber
                                    : callerNumber,
                                created: item.created,
                              };

                            if (this.verto == curNumber) {
                              this.$store.dispatch("setCurrentLoginUser", {
                                deviceState: "active",
                                userID: xuiUsername,
                                callDirection: null,
                                channelUUID: null,
                                oppoChannelUUID: null,
                                calling:
                                  curNumber == callerNumber
                                    ? calleeNumber
                                    : callerNumber,
                              });
                            }
                          });
                          deviceList.forEach((device, index) => {
                            let cur_queue = deviceStatus[device.userID];
                            let cur_status = "";
                            let cur_calling;
                            let cur_uuid;
                            let created;
                            for (let ce in cur_queue) {
                              if (ce!="name" && cur_queue[ce].deviceState == "active") {
                                cur_status = "active";
                                cur_calling = cur_queue[ce].calling;
                                cur_uuid = ce;
                                created = cur_queue[ce].created;
                                break;
                              }
                            }
                            if (cur_status == "")
                              for (let ce in cur_queue) {
                                if (ce!= "name" && cur_queue[ce].deviceState == "ringing") {
                                  cur_status = "ringing";
                                  cur_calling = cur_queue[ce].calling;
                                  cur_uuid = ce;
                                  created = cur_queue[ce].created;
                                }
                              }
                            if (cur_status == "") {
                              if (device.deviceState == "unregistered") {
                                cur_status = "unregistered";
                              } else {
                                cur_status =
                                  device.type == 2
                                    ? "registeredM"
                                    : "registered";
                              }
                              cur_calling = "";
                              cur_uuid = "";
                            }
                            device.deviceState = cur_status;
                            device.channelUUID = cur_uuid;
                            device.calling = cur_calling;
                            if (
                              device.deviceState == "active" &&
                              device.timer.clock == false
                            ) {
                              created = created.replace(/\-/g, "/");
                              let time = new Date(created);
                              let now = new Date();
                              device.timer.h = parseInt(
                                parseInt(now - time) / 1000 / 60 / 60
                              );
                              device.timer.m = parseInt(
                                parseInt(
                                  now - time - device.timer.h * 1000 * 60 * 60
                                ) /
                                  1000 /
                                  60
                              );
                              device.timer.s = parseInt(
                                parseInt(
                                  now -
                                    time -
                                    device.timer.h * 1000 * 60 * 60 -
                                    device.timer.m * 1000 * 60
                                ) / 1000
                              );
                              var t = setInterval(() => {
                                device.timer.s += 1;
                                if (device.timer.s > 59.5) {
                                  device.timer.s = 0;
                                  device.timer.m += 1;
                                }
                                if (
                                  device.timer.s > 59.5 ||
                                  device.timer.m > 59
                                ) {
                                  device.timer.m = 0;
                                  device.timer.h += 1;
                                }
                              }, 1000);
                              device.timer.clock = true;
                              device.timer.id.push(t);
                            } //开启计时器
                          }); //遍历userid

                          this.$store.dispatch("setDeviceList", deviceList);
                          "test2", deviceStatus;
                          for (let i in deviceStatus) {
                            window.sessionStorage.setItem(
                              i,
                              deviceStatus[i].name
                            );
                          }
                          this.$store.dispatch("setDeviceStatus", deviceStatus);
                          // 遍历启动的channel
                        } //msg
                        this.$store.dispatch("setDeviceList", deviceList);
                        this.$store.dispatch("setDeviceStatus", deviceStatus);
                        for (let i in deviceStatus) {
                          window.sessionStorage.setItem(
                            i,
                            deviceStatus[i].name
                          );
                        }
                      }
                    );
                  }
                });
            });
            if (this.targetUserGroupId == "")
              this.$store.dispatch("setUserGroup", []);
          });

          if (this.flag == false) {
            this.$store.dispatch("setDeviceList", deviceList);
            /*
	    for(let i in deviceStatus){
              window.sessionStorage.setItem(i,deviceStatus[i].name)
            }
            this.$store.dispatch('setDeviceStatus',deviceStatus)
	   */
          }
          if (!this.$store.getters.currentLoginUser.hasOwnProperty("userID")) {
            this.$store.dispatch("setCurrentLoginUser", {
              deviceState: "registered",
              userID: xuiUsername,
              callDirection: null,
              channelUUID: null,
              oppoChannelUUID: null,
              calling: null,
            });
          }
        }.bind(this),
        function (data) {
          "error:" + data;
        }.bind(this)
      );
    },
    // 注册事件 和 取消注册事件
    handleExpire(v, e) {
      let deviceList = this.deviceList;
      deviceList.forEach((d, i) => {
        if (d.userID == e.data["from-user"]) {
          deviceList[i].deviceState = "unregistered";
        }
      });
      this.$store.dispatch("setDeviceList", deviceList);
    },
    handleFSEventRegister(v, e) {
      let deviceList = this.$store.getters.deviceList;
      let deviceStatus = this.$store.getters.deviceStatus;
      if (e.eventChannel == "FSevent.custom::sofia::register") {
        let isContinue = true;
        deviceList.forEach((d, i) => {
          if (d.userID == e.data["from-user"]) {
            if (deviceList[i].deviceState == "unregistered")
              deviceList[i].deviceState = "registered";
            deviceList[i].networkIP = e.data["network-ip"];
            deviceList[i].networkPort = e.data["network-port"];
            return;
          }
        });
        /*
          if(isContinue) {
            let user = {}
            user.deviceState = "registered"
            user.userID = e.data['to-user']
            user.callDirection = null
            user.channelUUID = null
            user.groupid = this.usermap.hasOwnProperty(user.userID)?usermap[userID].list:[]
            user.type = this.usermap.hasOwnProperty(user.userID)?usermap[userID].type:""
	          user.timer = {s:0,m:0,h:0,id:[],clock:false}
	          user.name = this.usermap.hasOwnProperty(user.userID)?usermap[userID].name:null
            deviceList.push(user)

          }
          */
      } else if (e.eventChannel == "FSevent.custom::sofia::unregister") {
        deviceList.forEach(function (d, i) {
          if (d.userID == e.data["from-user"]) {
            deviceList[i].deviceState = "unregistered";
          }
        });
        if (deviceStatus.hasOwnProperty(e.data["from-user"]))
          deviceStatus[e.data["from-user"]] = {};
      }

      this.$store.dispatch("setDeviceList", Object.assign([], deviceList));
      this.$store.dispatch("setDeviceStatus", deviceStatus);
    },
    //  获取正在振铃或者通话中的状态
    closeMeeting(v, e) {
      if (
        e.data["Action"] == "conference-destroy" &&
        e.data["Conference-Name"] == this.alarm + "-scc.yuqi.com"
      ) {
        this.alarmcalluuid = e.data["Conference-Unique-ID"];
        this.dialogVisible = true;
      }
      if (
        e.data["Action"] == "play-file-done" &&
        e.data["Conference-Name"] == this.broad + "-scc.yuqi.com" &&
        this.playFileDoneFlag == true
      ) {
        ("ordered file playing is finished");
        this.fsAPI(
          "conference",
          this.broad + "-scc.yuqi.com" + " " + "hup" + " " + "all"
        );
      } else if (this.playFileDoneFlag == true)
        this.$store.dispatch("setPlayFileDoneFlag", false);
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
    handleFSEventChannel(v, e) {
      let users = this.deviceList;
      let unique_uuid = e.data["Unique-ID"];
      let callerNumber = e.data["Caller-Caller-ID-Number"]; //主叫号码
      let calleeNumber = e.data.hasOwnProperty("Caller-Callee-ID-Number")
        ? e.data["Caller-Callee-ID-Number"]
        : e.data["Caller-Destination-Number"]; //被叫号码
      let temp1 = e.data["Channel-Name"].slice(
        15,
        e.data["Channel-Name"].indexOf("@")
      ); //1006
      let temp2 = e.data["Channel-Name"].slice(
        e.data["Channel-Name"].indexOf("/") + 1
      ); //internal/1006@10.3.200.25
      let curNumber;
      let voicemail = false;
      let channelUUID = e.data["Unique-ID"]; //id
      let channelCallState = e.data["Channel-Call-State"]; //hangup
      let currentLoginUser = this.$store.getters.currentLoginUser;
      let currentLoginUserChanged = false;
      let usersChanged = false;
      let _this = this;
      let cur_status = "";
      let cur_calling = "";
      let deviceStatus = this.$store.getters.deviceStatus;
      if (calleeNumber != undefined && calleeNumber.split(" ").length == 3) {
        curNumber = callerNumber;
        voicemail = true;
      } else if (e.data["Channel-Name"].includes("verto.rtc"))
        curNumber = this.verto;
      else if (isNaN(Number(temp1))) {
        if (isNaN(Number(temp2)))
          curNumber = e.data.hasOwnProperty("Channel-Presence-ID")
            ? e.data["Channel-Presence-ID"].slice(
                0,
                e.data["Channel-Presence-ID"].indexOf("@")
              )
            : callerNumber;
        else curNumber = temp2;
      } else curNumber = temp1;
      if (e.data.hasOwnProperty("Caller-RDNIS")) {
        calleeNumber = e.data["Caller-RDNIS"];
      }
      let cur_queue = deviceStatus[curNumber];
      let callDirection = e.data["Call-Direction"]; //入栈还是出栈
      //if(isNaN(parseInt(callerNumber)) || isNaN(parseInt(calleeNumber)))
      //  return

      if (
        channelCallState == "RINGING" ||
        channelCallState == "EARLY" ||
        channelCallState == "RING_WAIT"
      ) {
        channelCallState = "ringing";
        if (currentLoginUser.userID == calleeNumber) {
          // this.$store.dispatch('setAdminState', 1)
        }
      } else if (channelCallState == "ACTIVE") {
        channelCallState = "active";
        let time_add = 1;
        users.forEach(function (user) {
          if (user.userID == curNumber && !user.timer.clock) {
            var t = setInterval(() => {
              user.timer.s += time_add;
              if (user.timer.s > 59.5) {
                user.timer.s = 0;
                user.timer.m += 1;
              }
              if (user.timer.s > 59.5 || user.timer.m > 59) {
                user.timer.m = 0;
                user.timer.h += 1;
              }
            }, 1000);
            user.timer.clock = true;
            user.timer.id.push(t);
          }
        });
        if (callerNumber == _this.verto && _this.isVideo) {
          if (_this.$route.path == "/alarm") {
            setTimeout(() => {
              _this.$store.dispatch("setIsVideo", false);
              _this.$router.go(0);
            }, 1500);
          } else {
            setTimeout(() => {
              if (_this.$route.path != "/alarm") {
                _this.$store.dispatch("setIsVideo", false);
                _this.$router.push("/alarm");
              }
            }, 1500);
          }
        }
      } //number
      else if (channelCallState == "HANGUP") {
        if (
          currentLoginUser.userID == callerNumber ||
          currentLoginUser.userID == calleeNumber ||
          (this.ifLeftPhone == true && this.leftPhone == callerNumber) ||
          (this.ifLeftPhone == true && this.leftPhone == calleeNumber)
        ) {
          if (curNumber == "9901") {
            _this.$store.dispatch("setAdminState", 0);
          }
        }
        let flag = false;
        if (calleeNumber != undefined && calleeNumber.slice(0, 2) == "96") {
          flag = true;
        }
        channelCallState = "hungup";
        users.forEach((user) => {
          //if(user.userID == e.data["Caller-Caller-ID-Number"] || (e.data.hasOwnProperty("Channel-Presence-ID") && user.userID == e.data["Channel-Presence-ID"].slice(0,e.data["Channel-Presence-ID"].indexOf('@'))) || (!e.data.hasOwnProperty("Channel-Presence-ID") && user.userID == e.data["Channel-Name"].slice(15,e.data["Channel-Name"].indexOf('@'))) || (!e.data.hasOwnProperty("Channel-Presence-ID") && (e.data["Channel-Name"].slice(0,8)=="loopback")&& (e.data["Channel-Name"].slice(9,13)==user.userID)) || flag && (user.userID == e.data["Caller-Destination-Number"] ) ) {
          if (
            user.userID == curNumber ||
            (e.data["Channel-Name"].slice(0, 8) == "loopback" &&
              user.userID == e.data["Channel-Name"].slice(9, 13))
          ) {
            let temp_a = this.deviceList.find((device) => {
              return device.userID == callerNumber;
            });
            let temp_b = this.deviceList.find((device) => {
              return device.userID == calleeNumber;
            });
            if (
              (temp_a != undefined &&
                temp_a.deviceState == "unregistered" &&
                user.userID == callerNumber) ||
              (e.data["Channel-Name"].slice(0, 8) == "loopback" &&
                user.userID == e.data["Channel-Name"].slice(9, 13))
            )
              return;
            if (
              (temp_b != undefined &&
                temp_b.deviceState == "unregistered" &&
                user.userID == calleeNumber) ||
              (e.data["Channel-Name"].slice(0, 8) == "loopback" &&
                user.userID == e.data["Channel-Name"].slice(9, 13))
            )
              return;
            let numbers = [callerNumber, calleeNumber];
            let other_number =
              curNumber == numbers[0] ? numbers[1] : numbers[0];
            let queue = deviceStatus[curNumber];
            if (
              e.data.hasOwnProperty("Caller-RDNIS") &&
              queue.hasOwnProperty(e.data["Caller-RDNIS"])
            )
              delete queue[e.data["Caller-RDNIS"]];
            let flag = false;
            //if(e.data["Caller-Unique-ID"] == e.data["Channel-Call-UUID"])
            for (let call in queue) {
              if (
                call != "" &&
                (queue[call].deviceState == "active" ||
                  queue[call].deviceState == "ringing") &&
                call != unique_uuid
              ) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              user.deviceState = user.type == 2 ? "registeredM" : "registered";
              user.calling = null;
              user.timer.s = 0;
              user.timer.m = 0;
              user.timer.h = 0;
              user.timer.clock = false;
              user.timer.id.forEach((id) => {
                clearInterval(id);
              });
            }
          }
        });
        if (
          currentLoginUser.userID == curNumber ||
          (e.data.hasOwnProperty("Channel-Presence-ID") &&
            currentLoginUser.userID ==
              e.data["Channel-Presence-ID"].slice(
                0,
                e.data["Channel-Presence-ID"].indexOf("@")
              ))
        ) {
          currentLoginUser.deviceState = "registered";
          currentLoginUser.calling = null;
          currentLoginUserChanged = true;
        }
      } else if (channelCallState == "HELD") {
        channelCallState = "ringing";
      }
      // 入栈
      let callernumber = parseInt(callerNumber);
      let calleenumber = parseInt(calleeNumber);
      if (channelCallState != "hungup") {
        if (deviceStatus.hasOwnProperty(curNumber) && !isNaN(curNumber)) {
          let obj = {};
          obj.deviceState = channelCallState;
          if (voicemail == true)
            obj.calling = calleeNumber.split(" ")[2] + "语音信箱";
          else if (curNumber != callerNumber) obj.calling = callerNumber;
          else obj.calling = calleeNumber;
          obj.created = e.data["Event-Date-Local"];
          deviceStatus[curNumber][unique_uuid] = obj;
        }
      } else {
        if (deviceStatus.hasOwnProperty(curNumber) && !isNaN(curNumber))
          delete deviceStatus[curNumber][unique_uuid];
      }

      let temp = this.deviceList.find((device) => {
        return device.userID == curNumber;
      });
      let type;
      let time;
      if (temp != undefined) type = temp.type;
      if (channelCallState != "hungup") {
        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////
        ///////////////对于caller一方的处理，先判断是active，再判断ringring，否则就是hungup
        if ((temp != undefined && temp.deviceState != "unregistered")) {
          for (let ce in cur_queue) {
            if (ce != "name" && cur_queue[ce].deviceState == "active") {
              cur_status = "active";
              cur_calling = cur_queue[ce].calling;
              time = cur_queue[ce].created;
              break;
            }
          }
          if (cur_status == "")
            for (let ce in cur_queue) {
              if (ce != "name" && cur_queue[ce].deviceState == "ringing") {
                cur_status = "ringing";
                cur_calling = cur_queue[ce].calling;
                time = cur_queue[ce].created;
              }
            }
          if (cur_status == "") {
            cur_status = type == 2 ? "registeredM" : "registered";
            cur_calling = "";
            time = "";
          }
        } else cur_status = "unregistered";
        ///////////////////////////////////////////////////////////
        if (currentLoginUser.userID == curNumber) {
          currentLoginUser;
          currentLoginUser.deviceState = cur_status;
          currentLoginUser.channelUUID = channelUUID;
          currentLoginUser.callDirection = callDirection;
          currentLoginUser.calling = cur_calling;
          currentLoginUserChanged = true;
        }

        if (callDirection == "inbound") {
          if (
            "9000" == callerNumber &&
            "9001" == calleeNumber &&
            channelCallState == "ringing"
          ) {
            users.forEach(function (user) {
              if (user.operationState == 1) {
                user.operationState = 0;
                _this.fsAPI(
                  "uuid_bridge",
                  channelUUID + " " + user.channelUUID,
                  function (res) {
                    ("qiang call");
                  }.bind(this)
                );
                usersChanged = true;
              } else if (user.operationState == 2) {
                user.operationState = 0;
                _this.fsAPI(
                  "uuid_bridge",
                  channelUUID + " " + user.oppoChannelUUID,
                  function (res) {
                    ("qiang delete");
                  }.bind(this)
                );
                usersChanged = true;
              } else if (user.operationState == 3) {
                user.operationState = 0;
                _this.fsAPI(
                  "uuid_bridge",
                  user.oppoChannelUUID + " " + channelUUID,
                  function (res) {
                    ("daijie");
                  }.bind(this)
                );
                usersChanged = true;
              }
            });
          }
          users.forEach(function (user) {
            if (user.userID == curNumber) {
              user.created = time;
              user.deviceState = cur_status;
              user.calling = cur_calling;
              user.channelUUID = channelUUID;
              user.oppoChannelUUID = channelUUID;
              user.callDirection = callDirection;
              usersChanged = true;
            }
          });

          // 出栈
        } else if (callDirection == "outbound") {
          let opChannelUUID = e.data["Other-Leg-Unique-ID"];
          users.forEach(function (user) {
            if (user.userID == curNumber) {
              user.created = time;
              user.deviceState = cur_status;
              user.calling = cur_calling;
              user.channelUUID = channelUUID;
              user.callDirection = callDirection;
              user.oppoChannelUUID = opChannelUUID;
              usersChanged = true;
            }
          });
        }
        this.$store.dispatch("setCurrentLoginUser", currentLoginUser);
        if (usersChanged) this.$store.dispatch("setDeviceList", users);
        this.$store.dispatch("setDeviceStatus", deviceStatus);
      }
    },
  },
  components: {
    topMenu,
    footNav,
    container,
    switchLeft,
    treeList,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
