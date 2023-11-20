<template>
  <div class="module playMenu" id="music">
    <ul
      class="nav nav-justified broadcast"
      data-name="title"
      @click="tabClick($event)"
    >
      <li class="on">播放列表</li>
      <li>实时文本</li>
    </ul>
    <div class="con" v-show="tabType == '播放列表'">
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
              class="songSheetName songSheetNameSelect"
              @click="addMusic(songlist)"
            >
              <div class="songSetting">
                <span class="toggle"
                  ><i class="fa fa-angle-right" aria-hidden="true"></i
                ></span>
                <p>{{ songlist.foldername }}</p>
                <span class="musicNum"
                  >[{{ songlist.Files ? songlist.Files.length : 0 }}]</span
                >
              </div>
              <span class="songSheetTool">选择</span>
            </div>
            <ul class="musicList" v-if="songlist.unfold">
              <li v-for="fileItem in songlist.Files">
                <p>{{ fileItem.filename }}</p>
                <ul class="musicListTools">
                  <li>
                    <i class="fa fa-play-circle" aria-hidden="true"></i>试听
                  </li>
                </ul>
                <span class="totalTime" v-if="fileItem.mediatype == 1">
                  {{ fileItem.filetime }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="textFlies" v-show="tabType == '实时文本'">
      <textarea v-model="text" class="form-control" rows="7"></textarea>
    </div>

    <div class="btnDiv">
      <button type="button" class="btn btn-info" @click="play">播放</button>
      <button type="button" class="btn btn-default" @click="close">取消</button>
    </div>
  </div>
</template>
<script>
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/ipBroad";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    selectPhone: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tabType: "播放列表",
      playList: [],
      name: "9111" + "-" + window.location.hostname,
      selectPlayList: [],
      anotherSong: [],
      text: "",
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.refresh();
    });
  },
  computed: {
    ...mapGetters(["vertoHandle", "whetherPlayAnotherSong"]),
  },
  methods: {
    addMusic(item) {
      if (this.selectPlayList[0] == null) {
        console.log("none");
        this.selectPlayList.push(item);
      } else {
        console.log("one");
        this.anotherSong.push(item);
      }
    },
    refresh() {
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
            });
            this.playList = result;
          }
        });
    },
    tabClick(e) {
      this.tabType = e.target.innerText;
      console.log(this.tabType);
    },
    play() {
      if (this.text != "") {
        this.fsAPI("conference", this.name + " " + "say" + " " + this.text);
        this.text = "";
      }
      this.$store.dispatch("setWhetherPlayAnotherSong", "yes");
      let files = [];
      if (this.selectPhone.length != 0) {
        if (this.anotherSong[0] == null) {
          let usera = this.selectPlayList[0];
          let _this = this;
          let file_string = "file_string://";
          usera.Files.forEach((usern, index) => {
            let x = usern.MediaPath.indexOf("IpBcFiles");
            let y = usern.MediaPath.substring(x);
            let z = "/var/lib/tomcat9/webapps/" + y;
            files.push(z);
          });
          file_string += files.join("!");
          _this.fsAPI(
            "conference",
            " " + _this.name + " " + "play" + " " + file_string,
            function (res) {
              console.log("bofang");
            }
          );
        } else {
          this.selectPlayList[0] = this.anotherSong[0];
          let usera = this.selectPlayList[0];
          let users = this.selectPhone;
          let file_string = "file_string://";
          let _this = this;
          _this.fsAPI(
            "conference",
            " " + _this.name + " " + "stop",
            function (res) {
              console.log("qie ge");
            }
          );
          usera.Files.forEach((usern, index) => {
            let x = usern.MediaPath.indexOf("IpBcFiles");
            let y = usern.MediaPath.substring(x);
            let z = "/var/lib/tomcat9/webapps/" + y;
            files.push(z);
          });
          file_string += files.join("!");
          _this.fsAPI(
            "conference",
            " " + _this.name + " " + "play" + " " + file_string,
            function (res) {
              console.log("bofang");
            }
          );
        }
      }
    },
    broadcast(channel, params) {
      let msg = {
        eventChannel: channel,
        data: {},
      };
      for (var i in params) {
        msg.data[i] = params[i];
      }
      this.vertoHandle.sendMethod("verto.broadcast", msg);
    },
    getChannelName(what) {
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

    close() {
      console.log(this.playList[0].FolderName);
      this.$emit("closeDialog");
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
textarea {
  margin: 10px 0px;
}
</style>
