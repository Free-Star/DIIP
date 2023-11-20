<template>
  <div>
    <!--tab01文件管理-->
    <div class="musicMenuHalf">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>播放列表
        <p @click="addSongList">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </p>
      </div>
      <div id="height08">
        <div
          class="songSheet"
          v-for="(songList, index) in playList"
          :key="songList.folderid"
          @click="() => (songList.unfold = !songList.unfold)"
        >
          <div class="songSheetName">
            <div class="songSetting">
              <span class="toggle"
                ><i class="fa fa-angle-right" aria-hidden="true"></i
              ></span>
              <p
                :id="index"
                v-focus="ifFocus"
                :contenteditable="songList.contenteditable"
                @blur="renameSongList(songList, $event)"
              >
                {{ songList.foldername }}
              </p>
              <span class="musicNum" @click="qsss(songList, index)"
                >[{{ songList.Files ? songList.Files.length : 0 }}]</span
              >
              <span class="nameSetting" @click.stop="getFocus(songList, index)"
                ><button
                  type="button"
                  class="btn btn-sm btn-info"
                  style="overflow: hidden; height: 25px"
                >
                  重命名
                </button></span
              >
              <span
                class="nameSetting"
                @click.stop="deleteSongList(songList.folderid)"
                ><button
                  type="button"
                  class="btn btn-sm btn-info"
                  style="overflow: hidden; height: 25px"
                >
                  删除歌单
                </button></span
              >
            </div>
          </div>
          <div v-if="songList.unfold">
            <ul class="musicList" v-for="fileItem in songList.Files">
              <li>
                <p>{{ fileItem.filename }}</p>
                <ul class="musicListTools">
                  <li @click="removeFile(songList, fileItem)">
                    <button type="button" class="btn btn-sm btn-info">
                      移除
                    </button>
                  </li>
                </ul>
                <span class="totalTime Grid-cell">{{ fileItem.filetime }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="musicMenuHalf">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>默认列表
      </div>

      <div class="addFiles">
        <span @click="uploadFile">
          <!-- <i class="fa fa-file-o" aria-hidden='true'></i> -->
          <button class="btn btn-sm btn-info" type="button">
            <input
              type="file"
              class="uploadFiles"
              @change="uploadFileChange($event)"
              style="display: none"
              accept="audio/*"
              value=""
            />上传文件
          </button>
        </span>
      </div>
      <!--  <div class="tableTool Grid">
        <ul class="musicListTools Grid-cell">
          <li @click.stop="audition('')"><i class="fa fa-play-circle" aria-hidden="true"></i>试听</li>
          <li @click.stop="download('')"><i class="fa fa-cloud-download" aria-hidden="true"></i>下载</li>
          <li @click.stop="deleteFileList"><i class="fa fa-times" aria-hidden="true"></i>删除</li>
          <li accept="audio/*"  @click.stop="uploadFileChange($event)"><i class="fa fa-cloud-download" aria-hidden="true"></i>上传</li>
          <li>
            <i class="fa fa-plus" ></i>
            <input type="button"
                   @click.stop="addBlur()"  value="添加到">
            <div v-if="songListShow" v-for="songList in playList" @mouseout="addBlur()">
              <span style="height:100px;width:100px;"  @click.self="addFileToPlaylist('', songList)">{{songList.foldername}}</span>
            </div>

          </li>
        </ul>
       <div class="operate Grid-cell">
          <form class="form-inline">
            <div class="form-group">
              <label>文件名</label>
              <input type="text" class="form-control" v-model="queryFileName">
              <button type="button" @click="queryDefaultList" class="btn btn-info">
                <i class="fa fa-search" aria-hidden="true"></i>查询
              </button>

            </div>
          </form>
        </div>
      </div> -->
      <ul class="musicList" id="height09">
        <li
          class="Grid"
          :class="{ selected: file.selected }"
          v-for="(file, index) in defaultList"
          @click="fileClick(file, index)"
        >
          <p class="Grid-cell" style="overflow: hidden; height: 35px">
            {{ file.filename }}
          </p>
          <ul class="musicListTools Grid-cell">
            <li v-if="file.mediatype == 3" @click.stop="priview(file)">
              <button
                type="button"
                class="btn btn-sm btn-info"
                style="overflow: hidden; height: 30px"
              >
                预览
              </button>
            </li>
            <li @click="prePlay(file)" v-if="file.mediatype == 1">
              <button type="button" class="btn btn-sm btn-info">试听</button>
            </li>
            <li @click="stopMusic(file)" v-if="file.mediatype == 1">
              <button type="button" class="btn btn-sm btn-info">停止</button>
            </li>
            <li @click.stop="download(file)">
              <button type="button" class="btn btn-sm btn-info">下载</button>
            </li>
            <li @click.stop="deleteFile(file)">
              <button type="button" class="btn btn-sm btn-info">删除</button>
            </li>
            <li>
              <!-- <button type="button" class="btn btn-sm btn-info"
                 @click.stop="addBlur(file)">添加-->
              <el-dropdown style="top: 0px; background-color: #333">
                <!-- <el-button type="primary">添加到<i class="el-icon-arrow-down el-icon--right"></i></el-button>  -->
                <button type="button" class="btn btn-sm btn-info">
                  添加到<i class="el-icon-arrow-down el-icon--right"></i>
                </button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="songList in playList"
                    @click.native="addFileToPlaylist(file, songList)"
                    :key="songList.folderid"
                    ><span style="color: #333">{{
                      songList.foldername
                    }}</span></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
          <span class="totalTime Grid-cell">
            <span v-if="file.mediatype == 1"> {{ file.filetime }}</span>
          </span>
        </li>
      </ul>
      <div class="menuType">
        <i class="fa fa-file" aria-hidden="true"></i>添加文本
      </div>
      <div class="padding">
        <form class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label"
              >文本标题</label
            >
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="inputEmail3"
                v-model="TextSubject"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label"
              >文本内容</label
            >
            <div class="col-sm-10">
              <textarea
                class="form-control"
                rows="3"
                v-model="Content"
              ></textarea>
            </div>
          </div>
        </form>
        <div class="localFile">
          <button class="btn btn-info" type="button" @click="addText">
            添加
          </button>
        </div>
      </div>
      <!--<div class="localFile">
        <button type="button" class="btn btn-info ">选择本地文件</button>
        <button type="button" class="btn btn-info ">选择本地文件夹</button>
    </div>-->

      <audio id="music"></audio>
    </div>
    <confirm-dialog @submit="confirm">
      <div slot="content">
        <p>{{ dialogText }}</p>
      </div>
    </confirm-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { confirmDialog } from "components";
export default {
  data() {
    return {
      playList: [], //播放列表,
      defulatList: [], //默认列表
      submitType: 0, //确定按钮的状态，1为歌单，2为文件
      deleteId: null, //要删除的文件或歌单的id
      dialogText: null, //弹窗显示的文本内容
      activeIndex: "", //当前点击的添加歌单
      TextSubject: "", //文本标题
      Content: "", //文本内容
      defaultList: [], //默认文件列表
      filePaths: [], //勾选的默认文件列表
      songListShow: false, //批量添加到歌单 显示隐藏
      queryFileName: "",
      whetherChange: false,
      renameChange: false,
      ifFocus: false,
    };
  },
  created() {
    this.$nextTick(function () {
      this.refresh();
    });
  },
  components: {
    confirmDialog,
  },
  computed: {
    ...mapGetters({
      dialogStatu: "dialogStatu",
      selectPhonex: "selectPhonex",
    }),
  },
  directives: {
    focus: {
      update: function (el) {
        el.focus();
      },
    },
  },
  methods: {
    getFocus(item, index) {
      item.contenteditable = true;
      this.renameChange = true;
      this.ifFocus = true;
    },
    addBlur(file) {
      if (file) {
        file.songListShow = !file.songListShow;
      } else {
        this.songListShow = !this.songListShow;
      }
    },
    refresh() {
      this.$store.dispatch("setSelectPhonex", null);
      // 1、查询歌单数组
      this.$ajax
        .get("Folder/getTreeFiles", {
          params: { UserID: "133585596bb04c9cbe311d0859dd7196" },
        })
        .then((res) => {
          if (res.data.code == 1) {
            let result = res.data.result;
            result.forEach(function (r, i) {
              r.contenteditable = false;
              r.unfold = false;
            });
            this.playList = result;
          }
        });
      this.queryDefaultList();
    },
    queryDefaultList() {
      // 2、查询右侧所有文件
      if (this.queryFileName != "") {
        this.$ajax
          .post("File/List", { FileName: this.queryFileName })
          .then((res) => {
            if (res.data.code == 1) {
              let result = res.data.result;
              result.forEach(function (r, i) {
                r.songListShow = false;
                r.selected = false;
              });
              this.defaultList = result;
            }
          });
      } else {
        this.$ajax
          .post("File/List", { pageIndex: 1, pageSize: 1000 })
          .then((res) => {
            if (res.data.code == 1) {
              let result = res.data.result;
              if (result != null) {
                result.forEach(function (r, i) {
                  r.songListShow = false;
                  r.selected = false;
                });
              }
              this.defaultList = result;
            }
          });
      }
    },
    prePlay(file) {
      var audio = document.getElementById("music");
      audio.src = file.mediapath;
      audio.play();
    },
    stopMusic(file) {
      var audio = document.getElementById("music");
      audio.currentTime = 0;
      audio.pause();
    },
    audition(file) {
      let playlist = this.$store.state.player.playlist;
      if (file != "") {
        playlist.push(file);
        this.$store.dispatch("setPlaylist", playlist);
        this.$store.dispatch("setPlay", true);
      } else {
        if (this.filePaths.length != 0) {
          this.filePaths.forEach(function (r, i) {
            playlist.push(r);
          });
          debugger;
          this.$store.dispatch("setPlaylist", playlist);
          this.$store.dispatch("setPlay", true);
        }
      }
    },

    // 新建歌单，歌单默认名字是新建歌单
    addSongList() {
      // 添加歌单
      let request = {
        folderid: "",
        foldername: "新建歌单",
        userid: "133585596bb04c9cbe311d0859dd7196",
        foldertype: 1,
      };
      this.$ajax.post("Folder/Create", request).then((res) => {
        let result = res.data.result;
        if (res.data.code == 1) {
          request.folderid = result.folderid;
          this.playList.push({
            foldername: "新建歌单",
            folderid: result.folderid,
            contenteditable: false,
            musicList: [],
          });
        }
      });
    },

    // 添加指定歌曲到指定歌单
    addFileToPlaylist(file, songList) {
      if (file == "") {
        if (this.filePaths.length != 0) {
          this.$ajax
            .post(`FolderMedia/CreateList/${songList.folderid}`, this.filePaths)
            .then((res) => {
              if (res.data.code == 1) {
              }
            });
        } else {
          this.submitType = 6;
          this.dialogText = "所选文件不能为空";
        }
      } else {
        let request = {
          FolderID: songList.folderid,
          MediaID: file.mediaid,
        };

        this.$ajax.post("FolderMedia/Create", request).then((res) => {
          file.songListShow = false;

          if (res.data.code == 1) {
            this.refresh();
          } else {
          }
        });
      }
    },

    renameSongList(item, event) {
      // 歌单重命名
      if (this.renameChange) {
        var s = event.target.textContent;
        var s1 = s.replace(" ", "");
        var s2 = s1.replace(/[\'\"\\\/\b\f\n\r\t]/g, "");
        var s3 = s2.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/, "");
        item.contenteditable = true;
        let request = {
          foldername: s3,
          userid: "133585596bb04c9cbe311d0859dd7196",
          foldertype: 1,
          folderid: item.folderid,
        };
        if (item.foldername != request.foldername) {
          this.whetherChange = true;
        }
        if (this.whetherChange) {
          this.playList = null;
          this.whetherChange = false;
        }
        this.$ajax.put("Folder/Edit", request).then((res) => {
          if (res.data.code == 1) {
            console.log("修改成功");
            this.refresh();
          }
        });
        this.renameChange = false;
      } else {
        this.playList = null;
        this.refresh();
      }
    },

    removeFile(songList, file) {
      // 从歌单删除文件
      this.$store.dispatch("setDialogShow", true);
      this.submitType = 2;
      this.deleteId = [songList, file];
      this.dialogText = "您确定要从歌单移除此文件吗?";
    },
    deleteSongList(id) {
      // 删除歌单
      this.$store.dispatch("setDialogShow", true);
      this.submitType = 1;
      this.deleteId = id;
      this.dialogText = "您确定要删除此歌单吗?";
    },

    uploadFile() {
      $(".uploadFiles").click();
    },

    uploadFileChange(event) {
      // 监听上传文件事件
      let files = event.target.files;
      let request = new FormData();
      request.append("file", files[0]);
      if (files.length != 0) {
        console.log("请选择文件");
        this.$ajax
          .post(
            `File/UploadFiles/${"133585596bb04c9cbe311d0859dd7196"}`,
            request
          )
          .then((res) => {
            if (res.data.code == 1) {
              console.log("上传成功");
              this.refresh();
            }
          });
      }
    },

    confirm() {
      // 弹窗确定事件
      if (this.submitType == 1) {
        // 移除歌单
        this.$ajax.delete(`Folder/Remove/${this.deleteId}`, "").then((res) => {
          if (res.data.code == 1) {
            this.$store.dispatch("setDialogShow", false);
            this.refresh();
            this.deleteId = [];
          } else {
          }
        });
      } else if (this.submitType == 2) {
        //移除歌单中文件
        let request = [
          {
            folderid: this.deleteId[0].folderid,
            mediaid: this.deleteId[1].mediaid,
          },
        ];
        this.$ajax.post("FolderMedia/RemoveList", request).then((res) => {
          if (res.data.code == 1) {
            this.refresh();
            this.deleteId = [];
            this.$store.dispatch("setDialogShow", false);
          }
        });
      } else if (this.submitType == 3) {
        //删除文件
        this.$ajax.post("File/RemoveList", this.filePaths).then((res) => {
          if (res.data.code == 1) {
            console.log("删除文件成功");
            this.refresh();
            this.$store.dispatch("setDialogShow", false);
          }
        });
      } else if (this.submitType == 4) {
        // 添加文本
        let request = {
          userid: "133585596bb04c9cbe311d0859dd7196",
          textsubject: this.TextSubject,
          content: this.Content,
        };
        this.$ajax.post("File/UploadText", request).then((res) => {
          if (res.data.code == 1) {
            this.refresh();
            this.Content = "";
            this.TextSubject = "";
            console.log("添加文本成功");
            this.$store.dispatch("setDialogShow", false);
          } else {
          }
        });
      } else if (this.submitType == 5) {
        // 批量删除
        this.$ajax.post("File/RemoveList", this.filePaths).then((res) => {
          if (res.data.code == 1) {
            this.refresh();
            this.filePaths = [];
            this.$store.dispatch("setDialogShow", false);
          }
        });
      } else if (this.submitType == 6) {
        // 确定事件为关闭弹窗
        this.$store.dispatch("setDialogShow", false);
      }
      this.submitType = 0;
    },

    /* 默认列表相关事件 */
    deleteFile(file) {
      // 删除列表文件
      this.$store.dispatch("setDialogShow", true);
      this.filePaths = [file.mediapath];
      this.submitType = 3;
      this.dialogText = "您确定要从默认列表中删除此文件吗?";
    },
    deleteFileList() {
      // 批量删除列表文件
      if (this.filePaths.length != 0) {
        this.submitType = 5;
        this.$store.dispatch("setDialogShow", true);
        this.dialogText = "您确定要从默认列表中删除这些文件吗?";
      }
    },

    download(file) {
      // 下载文件
      if (file == "") {
        if (this.filePaths.length != 0) {
          this.filePaths.forEach(function (f, i) {
            window.open(
              `https://scc.yuqi.com:8001/file/download/audios/${f.mediaid}`
            );
          });
        }
      } else {
        window.open(
          `https://scc.yuqi.com:8001/file/download/audios/${file.mediaid}`
        );
      }
    },
    addText() {
      // 添加文本
      if (this.TextSubject == "" || this.Content == "") {
        return;
      }
      this.$store.dispatch("setDialogShow", true);
      this.submitType = 4;
      this.dialogText = "您确定要添加文本吗?";
    },
    fileClick(file, index) {
      // 文件点击事件
      if (file.selected) {
        this.filePaths.splice(index, 1);
      } else {
        this.filePaths.push(file);
      }
      file.selected = !file.selected;
    },
    priview(file) {
      // 预览文本
      this.$ajax.get(`File/PreviewText/${file.mediaid}`).then((res) => {
        if (res.data.code == 1) {
          this.$store.dispatch("setDialogShow", true);
          this.submitType = 6;
          this.dialogText = res.data.result.content;
        }
      });
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
.songSetting {
  display: flex;
  input {
    border: none;
    margin-left: 10px;
    background: #313439;
    color: #ddd;
    flex: 1;
  }
}
.Grid {
  display: flex;
  .Grid-cell:first-child {
    margin-left: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Grid-cell:last-child {
    flex: 1;
  }
  .Grid-cell {
    flex: 3;
  }
  .totalTime {
    text-align: center;
  }
}
#height09 {
  .Grid {
    display: flex;
    .Grid-cell:first-child {
      flex: 2;
      margin-left: 10px;
    }
    .Grid-cell:last-child {
      flex: 1;
    }
    .Grid-cell {
      flex: 3;
    }
    .totalTime {
      text-align: center;
    }
  }
}

#add {
  input {
    background: none;
    border: none;
    padding: 0;
    outline: none;
  }
  input:hover {
    border: none;
    color: #fff;
    padding: 0;
  }
}
.musicListTools {
  a {
    color: #fff;
  }
  a:hover {
    text-decoration: none;
  }
}
#height09 .selected {
  background: #000;
}
.form-inline .form-group {
  margin-right: 0;
}
.tableTool {
  line-height: 35px;
  input[type="button"] {
    border: none;
    background: #313439;
    color: #fff;
    flex: 1;
    padding: 0;
    outline: none;
  }
  .musicListTools {
    flex: 1.3 !important;
  }
  .operate {
    flex: 1.5 !important;
  }
}
</style>
