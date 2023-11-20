<template>
  <div>
    <div class="leftList">
      <div class="orgTitle">本机号码9901</div>
      <ul class="orgList">
        <li @click="playVideo(item.userID)" v-for="item in deviceList">
          <i class="fa fa-user" aria-hidden="true"></i>{{ item.userID }}
        </li>
      </ul>
    </div>
    <div class="videoRight">
      <div class="screenDisplay">
        <div class="singleScreen">
          <div class="tip">提示信息</div>
          <video
            width="800"
            id="webcam"
            autoplay="autoplay"
            hidden="true"
          ></video>
          <!--       <ul class="screenTools" >
                   <li><i class="fa fa-times red" aria-hidden="true" @click="off"></i>断开</li>
                   <li><i class="fa fa-play green" aria-hidden="true" @click="gmod"></i>录像</li>
                   <li><i class="fa fa-share orange" aria-hidden="true" @click="transpond"></i>转发</li>
                   <li><i class="fa fa-video-camera blue" aria-hidden="true" @click="video"></i>视频</li>
                   <li><i class="fa fa-microphone-slash red" aria-hidden="true" @click="mute"></i>静音</li>
                   <li><i class="fa fa-arrows-alt" aria-hidden="true" @click="fullScreen"></i>全屏</li>
                 </ul>-->
        </div>
        <div class="meetingMemberList">
          <div class="orgTitle">视频会议成员</div>
          <ul class="screenSelected">
            <li class="selected">1001</li>
            <li>1001</li>
            <li>1001</li>
            <li>1001</li>
            <li>1001</li>
          </ul>

          <ul class="screenTools">
            <li class="callOff" @click="stopVideo">
              <i class="fa fa-times" aria-hidden="true" @click="off"
                ><br />断开</i
              >
            </li>
            <li class="callRecrod">
              <i class="fa fa-play" aria-hidden="true" @click="gmod"
                ><br />录像</i
              >
            </li>
            <li class="mainScreen">
              <i class="fa fa-video-camera" aria-hidden="true" @click="video"
                ><br />主屏</i
              >
            </li>
            <li class="callSilent">
              <i class="fa fa-microphone-slash" aria-hidden="true" @click="mute"
                ><br />禁言</i
              >
            </li>
            <li class="middleCircle"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getHeight } from "utils/height";

export default {
  data() {
    return {
      currentScreen: "1分屏",
      currentScreen: "四分屏",
      num: 4,
      videoDevice: [],
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      this.refresh();
    });
  },
  computed: {
    ...mapGetters({
      vertoHandle: "vertoHandle",
      deviceList: "deviceList",
      users: "users",
      currentLoginUser: "currentLoginUser",
    }),
  },
  methods: {
    refresh() {
      this.$ajax.get("api/groups/group_users", {}).then(
        function (res) {
          let result = res.data;
          this.deviceList = result;
          console.log(this.deviceList);
          this.detailsData;
        }.bind(this)
      );
    },
    playVideo(num) {
      this.videoDevice.push(num);
      var vid_width = 640;
      var vid_height = 360;

      /*   switch (ds.resolution) {
         case "120p": vid_width = 160; vid_height = 120; break;
         case "QVGA": vid_width = 320; vid_height = 240; break;
         case "VGA":  vid_width = 640; vid_height = 480; break;
         case "SVGA": vid_width = 800; vid_height = 600; break;
         case "180p": vid_width = 320; vid_height = 180; break;
         case "360p": vid_width = 640; vid_height = 360; break;
         case "720p": vid_width =1280; vid_height = 720; break;
         case "1080p":vid_width =1920; vid_height = 1080;break;
         case "QCIF": vid_width = 176; vid_height = 144; break;
         case "CIF":  vid_width = 352; vid_height = 288; break;
         case "4CIF": vid_width = 704; vid_height = 576; break;
         }*/

      this.vertoHandle.videoParams({
        minWidth: 640,
        minHeight: 360,
        maxWidth: 640,
        maxHeight: 360,
        minFrameRate: 15,
        vertoBestFrameRate: 15,
      });
      this.vertoHandle.newCall(
        {
          destination_number: num,
          caller_id_name: "LegalHigh",
          caller_id_number: "1008",
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
          console.log("添加视频成功");
        }
      );
    },
    stopVideo() {
      this.vertoHandle.hangup();
    },
    videoClick(e) {
      $(e.target).toggleClass("screenSelected");
    },
    splitScreen(name) {
      // 分屏
      this.currentScreen = name;
    },
    off() {
      // 断开
    },
    gmod() {
      // 录像
    },
    transpond() {
      // 转发
    },
    video() {
      // 视频
    },
    mute() {
      // 静音
    },
    fullScreen() {
      // 全屏
    },
  },
};
</script>

<style scoped>
</style>
