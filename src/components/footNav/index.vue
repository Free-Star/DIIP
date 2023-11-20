<template>
  <div class="bottomTools">
    <div class="userInfo">
      <div class="userName">
        <span
          >您好 {{ username }}<a @click="logout()"> [退出]</a>
          <a @click="setting()"><i class="fa fa-cogs"></i>系统设置</a>
          <a @click="$router.go(0)"
            ><i class="fa fa-refresh"></i>刷新页面</a
          ></span
        >
      </div>
    </div>
    <audio id="music"></audio>
    <div class="span_large">
      <!-- 启动自动分发的图标关掉了，后面看有没有别的图标需要添加的 -->
      <!-- <el-tooltip
        :content="leftwatcher"
        placement="top"
        :disabled="leftwatcher == ''"
      >
        <div
          :class="this.enable_leftwatcher == false ? '' : 'fa fa-bolt fa-2x'"
        ></div>
      </el-tooltip> -->
      <el-tooltip :content="mobile" placement="top" :disabled="mobile == ''">
        <div
          :class="this.enable_mobile == false ? '' : 'fa fa-mobile fa-2x'"
        ></div>
      </el-tooltip>
      <div :class="this.vertoClose == 0 ? '' : 'location_indicator'"></div>
    </div>
    <div class="audio-box" style="top: 5px">
      <audio ref="audio"></audio>
      <div class="audio-container">
        <div class="audio-view">
          <span
            >{{
              this.selectPhonex == null
                ? ""
                : "设备号码:" + this.selectPhonex.userID
            }}
            {{
              this.selectPhonex == null
                ? ""
                : "设备名字:" + this.selectPhonex.name
            }}
            {{
              this.selectPhonex == null || this.selectPhonex.networkIP == null
                ? ""
                : "IP地址:" +
                  this.selectPhonex.networkIP +
                  ":" +
                  this.selectPhonex.networkPort
            }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";
import { SET_USER_INFO } from "store/actions/type";
export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeIndex: -1, //  当前播放歌曲角标
      songlistShow: false, //  播放列表显示或隐藏
      playSwitch: true,
      totalTime: "00:00",
      now: "00:00",
      caonima: null,
      enable_leftwatcher: false,
      enable_mobile: false,
      leftwatcher: "",
      mobile: "",
    };
  },
  /*mounted() {
      this.$refs.audio.addEventListener('play', function() {
        // 播放时长解析
        // 1. 进度条移动
        let progressWidth = parseInt($('.audio-setbacks').css('width'))
        let totalTime = this.transformSeconds(this.playlist[this.activeIndex].FileTime)
        let speed = progressWidth/totalTime
        this.now = this.transformTime(this.$refs.audio.currentTime)

        this.caonima = setInterval(() => {
          this.now = this.transformTime(this.$refs.audio.currentTime)
          $('.audio-backs-btn').css('right', this.transformSeconds(this.now )*speed * - 1 +'px')
        }, 1000);
      }.bind(this), false)

      this.$refs.audio.addEventListener('ended', function () {
        // 监听播放器是否播放完成
        if(this.playlist.length != 0) {
          if(this.activeIndex + 2 < this.playlist.length) {
            this.$refs.audio.src = this.playlist[this.activeIndex].MediaPath
            this.$refs.audio.play()
          }else {
            if(this.playlist.length == 1) {
              this.activeIndex = 0
            }else {
              this.activeIndex =  this.activeIndex +1
            }


          }
        }
        clearInterval(this.caonima)
            this.now = '00:00'
         $('.audio-backs-btn').css('right', "-4px")
      }.bind(this), false);
    },*/
  created() {
    let orgid = this.get_user_info.user.organizationid;
    this.$ajax
      .get(`https://scc.yuqi.com:8001/organization/${orgid}`)
      .then((res) => {
        this.enable_leftwatcher = res.data.enable_left_watcher;
        this.enable_mobile = res.data.enable_out_watcher;
        this.leftwatcher = res.data.left_watcher;
        this.mobile = res.data.out_watcher;
        if (this.enable_mobile == true) this.enable_leftwatcher = false;
      });
  },
  computed: {
    ...mapGetters({
      play: "play",
      playlist: "playlist",
      mediaPath: "mediaPath",
      selectPhonex: "selectPhonex",
      vertoClose: "vertoClose",
      get_user_info: GET_USER_INFO,
    }),
  },
  watch: {
    play: function () {
      if (this.play && this.playlist.length != 0) {
        this.$nextTick(() => {
          this.activeIndex = 0;
          this.$refs.audio.src = this.playlist[this.activeIndex].MediaPath;
          this.$refs.audio.playbackRate = 12;
          this.$refs.audio.play();
          this.playSwitch = false;
        });
      }
    },
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO,
    }),
    transformSeconds(total) {
      // 秒数转换
      let arr = total.split(":").reverse();
      let time = parseInt(arr[0]);
      arr.forEach((t, i) => {
        if (i > 0) {
          time = time + parseInt(t) * Math.pow(60, i);
        }
      });
      return time;
    },
    logout() {
      this.$confirm("此操作将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--primary",
        type: "warning",
      })
        .then(() => {
          this.$message.success("退出成功");
          this.set_user_info(null);
          setTimeout(this.$router.replace({ name: "login" }), 500);
        })
        .catch(() => {});
    },
    setting() {
      this.$router.push("/setting");
    },
    prev() {
      console.log(this.mediaPath);
      if (this.playlist.length > 1) {
        if (this.activeIndex - 1 >= 0) {
          this.activeIndex = this.activeIndex - 1;
          this.$refs.audio.src = this.playlist[this.activeIndex].MediaPath;
          this.$refs.audio.play();
        } else {
          this.activeIndex = this.playlist.length - 1;
          this.$refs.audio.src = this.playlist[
            this.playlist.length - 1
          ].MediaPath;
          this.$refs.audio.play();
        }
      }
    },
    next() {
      if (this.playlist.length > 1) {
        if (this.activeIndex + 2 <= this.playlist.length) {
          this.activeIndex = this.activeIndex + 1;
          this.$refs.audio.src = this.playlist[this.activeIndex].MediaPath;
          this.$refs.audio.play();
        } else {
          this.activeIndex = 0;
          this.$refs.audio.src = this.playlist[0].MediaPath;
          this.$refs.audio.play();
        }
      }
    },
    playToggle() {
      var audio = document.getElementById("music");
      audio.src = this.mediaPath;
      audio.play();
      if (this.playlist.length != 0) {
        if (this.playSwitch) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
        this.playSwitch = !this.playSwitch;
      }
    },
    openSonglist() {
      // 播放列表显示或隐藏
      this.songlistShow = !this.songlistShow;
    },
    mute() {
      this.$refs.audio.muted = !this.$refs.audio.muted;
    },
    transformTime(seconds) {
      let m, s;
      m = Math.floor(seconds / 60);
      m = m.toString().length == 1 ? "0" + m : m;
      s = Math.floor(seconds - 60 * m);
      s = s.toString().length == 1 ? "0" + s : s;
      return m + ":" + s;

    },
    close() {},
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
.audio-inline {
  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
