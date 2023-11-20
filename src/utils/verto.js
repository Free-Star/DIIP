import { mapGetters, mapActions } from "vuex";
/**
 * verto ��ʼ������
 */
export function vertoParams () {
  let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  let port = '8082'
  let username = '9000' // localStorage.getItem('xui.username')
  let password = '1234' // localStorage.getItem('xui.password')
  // let vidWidth = localStorage.getItem('phone.video.width')
  let host = window.location.hostname
  return {
    login: username + '@' + host,
    passwd: password,
    socketUrl: protocol + host + ':' + port,
    tag: 'audio-container',
    ringFile: '/assets/sounds/bell_ring2.mp3',
    iceServers: [],
    videoParams: {
      'minWidth': '1280',
      'minHeight': '720',
      'minFrameRate': 30
    },
    deviceParams: {
      useMic: 'any',
      useSpeak: 'any'
    }
  }
}
/**
 * verto �ص�����
 */
export const vertoCallbacks = {
  onWSLogin (verto, success) {
    // ��¼�ص�
    _this.refresh()
    console.log('onWSLogin', success);
  },
  onWSClose(verto, success) {
    console.log('onWSClose', success);
  },
  onDialogState(d) {
    let arr = []
    let callType = d.direction.name
    if (d.cause == "USER_NOT_REGISTERED") {
      //do nothing
    } else {
      switch (d.state.name) {
        case "trying":
          break;
        case "ringing": // ���壬װ�ؽ�����
          arr.push({
            curCall: d,
            state: d.state.name,
            caller: d.params.caller_id_number,
            des: d.params.callee_id_number
          })
          _this.$store.dispatch('setCallQueue', arr)
          break;
        case "requesting":
          arr.push({
            curCall: d,
            state: d.state.name,
            caller: d.params.caller_id_number,
            des: d.params.destination_number
          })
          _this.$store.dispatch('setCallQueue', arr)
          break;
        case "answering": // �����绰���ı�״̬
          break;
        case "active":
          break;
        case "hangup": //  �ܽӣ��ı�״̬
          arr = _this.$store.getters.callQueue
          arr.forEach(function (a, i) {
            if (a.caller == d.params.caller_id_number && (a.des == d.params.destination_number || a
              .des == d.params.callee_id_number)) {
              arr.splice(i, 1);
            }
          })
          _this.$store.dispatch('setCallQueue', arr)
          console.log("Call ended with cause: " + d.cause);
          break;
        case "destroy":
          // Some kind of client side cleanup...
          break;
        default:
          console.log(d.state.name);
      }
    }
  },
  onMessage(verto, dialog, message, data) {
    // �������
    debugger
  }
}
/**
 *  verto ����绰
 * @param {*} verto  // verto����ʵ����
 * @param {*} params // ����绰��Ҫ�Ĳ���
 */
export function newCall (verto, params) {
  verto.newCall({
    destination_number: params.destination_number,
    caller_id_name: params.caller_id_name,
    caller_id_number: params.caller_id_number,
    outgoingBandwidth: 'default',
    incomingBandwidth: 'default',
    useStereo: true,
    dedEnc: false,
    tag: 'webcam',
    deviceParams: {
      useMic: 'any',
      useSpeak: 'any',
      useCamera: 'any'
    }
  })
}


export function initVertoHandle(status) {
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
          console.log("onWSLogin", success);
        },
        onWSClose(verto, success) {
          _this.$store.dispatch("setVertoClose", 1);
          console.log("onWSClose", success);
        },
        onDialogState: function (d) {
          console.log(d);
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
                _this.$store.dispatch("setCallQueue", arr);
                break;
              case "destroy":
                arr.forEach(function (a, i) {
                  if (a.caller == d.params.caller_id_number) {
                    arr.splice(i, 1);
                  }
                });
                _this.$store.dispatch("setCallQueue", arr);
                console.log("Call ended with cause: " + d.cause);
                break;
              default:
                console.log(d.state.name);
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
                    console.log("conference user added");

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
                      liveArrayObj.name ==
                        _this.voice + "-scc.yuqi.com" &&
                      !arr.some((it) => {
                        return it.caller_id_number == _this.verto;
                      }) &&
                      _this.currentLoginUser.deviceState == "registered"
                    ) {
                      _this.$refs.voice.play();
                    } else if (
                      liveArrayObj.name ==
                        _this.voice + "-scc.yuqi.com" &&
                      args.data[1] != _this.verto
                    ) {
                      _this.$refs.voice.play();
                    }
                    if (
                      liveArrayObj.name ==
                        _this.alarm + "-scc.yuqi.com" &&
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
                                  let parsed = JSON.parse(
                                    re.details
                                  ).groups_name;
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
                    if (
                      liveArrayObj.name ==
                        _this.voice + "-scc.yuqi.com" &&
                      args.data[1] != _this.verto &&
                      args.data[2] == args.data[1]
                    ) {
                      _this
                        .instance({
                          method: "get",
                          url: "organization/" + _this.orgid,
                        })
                        .then((res) => {
                          if (res.data.enable_left_watcher != true)
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
                    console.log("conference user deleted");
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
                    console.log("conference user changed");
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
              console.log("info");
              break;
            // TODO: Needs doc.
            case $.verto.enum.message.display:
              console.log("display");
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
              console.log("verto channel ready");
              break;
          }
        },
      }
    )
  );
}

export async function refresh() {
  let xuiUsername = this.verto; // 过滤掉登陆者
  let result = await this.instance({
    method: "get",
    url: "/organization/" + this.organizationid,
  });
  this.leftPhone = result.data.left_watcher;
  this.ifLeftPhone = result.data.enable_left_watcher;
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
                      deviceList[index].groupid =
                        this.usermap[deviceList[index].userID].list;
                      deviceList[index].type =
                        this.usermap[deviceList[index].userID].type;
                      deviceList[index].name =
                        this.usermap[deviceList[index].userID].name;
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
                                            let apiKey =
                                              basic_id.split("/")[0];
                                            let groupKey =
                                              basic_id.split("/")[2];
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
                            deviceStatus[curNumber][uuid].calling =
                              deviceStatus[curNumber][uuid].calling.slice(
                                deviceStatus[curNumber][
                                  uuid
                                ].calling.indexOf(":") + 1,
                                deviceStatus[curNumber][
                                  uuid
                                ].calling.indexOf("@")
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
                            if (cur_queue[ce].deviceState == "active") {
                              cur_status = "active";
                              cur_calling = cur_queue[ce].calling;
                              cur_uuid = ce;
                              created = cur_queue[ce].created;
                              break;
                            }
                          }
                          if (cur_status == "")
                            for (let ce in cur_queue) {
                              if (cur_queue[ce].deviceState == "ringing") {
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
                    deviceList[index].groupid =
                      this.usermap[deviceList[index].userID].list;
                    deviceList[index].type =
                      this.usermap[deviceList[index].userID].type;
                    deviceList[index].name =
                      this.usermap[deviceList[index].userID].name;
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
                                          let apiKey =
                                            basic_id.split("/")[0];
                                          let groupKey =
                                            basic_id.split("/")[2];
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
                          if (cur_queue[ce].deviceState == "active") {
                            cur_status = "active";
                            cur_calling = cur_queue[ce].calling;
                            cur_uuid = ce;
                            created = cur_queue[ce].created;
                            break;
                          }
                        }
                        if (cur_status == "")
                          for (let ce in cur_queue) {
                            if (cur_queue[ce].deviceState == "ringing") {
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
                      console.log("test2", deviceStatus);
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
      console.log("error:" + data);
    }.bind(this)
  );
}
