<template>
  <div>

    <el-dialog title="签到人员" :visible.sync="rollcallInfoVisible">
      <el-table :data="rollcallData">
        <el-table-column property="rollcalllist_id" label="签到会议号" width="150"></el-table-column>
        <el-table-column property="devicenumber" label="设备号" width="150"></el-table-column>
        <el-table-column property="status" label="签到状态" width="250"></el-table-column>
        <el-table-column property="created_at" label="创建时间" width="200"></el-table-column>
      </el-table>
    </el-dialog>
    <!--tab02录音管理-->
    <div class="tableTool">
      <button
        type="button"
        @click="prePlay"
        class="btn btn-sm btn-info"
        id="play"
      >
        <i :class="recordPlay(recordState)" aria-hidden="true"></i
        >{{ recordState }}
      </button>
      <a download @click="downLoad()" class="btn btn-sm btn-info"
        ><i class="fa fa-cloud-download" aria-hidden="true"></i>下载</a
      >
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <label>呼叫时间</label>
            <el-date-picker
              v-model="value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="color: #333"
            >
            </el-date-picker>
          </div>
          <div class="form-group">
            <label>主叫号码</label>
            <input
              type="text"
              v-model.number="formData.callernumber"
              class="form-control"
              style="width: 70px"
            />
          </div>
          <div class="form-group">
            <label>被叫号码</label>
            <input
              type="text"
              v-model.number="formData.calleenumber"
              class="form-control"
              style="width: 70px"
            />
          </div>
          <div class="form-group">
            <span
              :class="fileType == 1 ? 'selected' : ''"
              @click="changeType(1)"
              >通话记录</span
            >
            <span
              :class="fileType == 2 ? 'selected' : ''"
              @click="changeType(2)"
              >会议记录</span
            >
            <span
              :class="fileType == 3 ? 'selected' : ''"
              @click="changeType(3)"
              >报警记录</span
            >
            <span
              :class="fileType == 4 ? 'selected' : ''"
              @click="changeType(4)"
              >点名记录</span
            >
          </div>
          <button type="button" @click="queryRecord()" class="btn btn-info">
            <i class="fa fa-search" aria-hidden="true"></i>查询
          </button>
        </form>
      </div>
    </div>
    <div class="table">
      <table class="table" ref="myTable">
        <thead>
          <tr>
            <td v-if="fileType != 4">呼叫开始时间</td>
            <td v-if="fileType != 4">呼叫结束时间</td>
            <td v-if="fileType == 1 ? true : false">主叫名字</td>
            <td v-if="fileType != 4">{{ fileType == 1 ? "主叫号码" : "会议号码" }}</td>
            <td v-if="fileType == 1 ? true : false">被叫名字</td>
            <td v-if="fileType != 4">{{ fileType == 1 ? "被叫号码" : "会议成员号码" }}</td>
            <td v-if="fileType != 4">通话时长（秒）</td>
            <td v-if="fileType != 1 ? false : true">应答状态</td>
            <td v-if="fileType == 3 ? true : false">报警信息说明</td>

            <td v-if="fileType == 4">人员信息</td>
            <td v-if="fileType == 4">点名开始时间</td>
            <td v-if="fileType == 4">点名结束时间</td>
            <td v-if="fileType == 4">点名完成状态</td>
            <td v-if="fileType == 4">会议号</td>
            <td v-if="fileType == 4">出勤数</td>
            <td v-if="fileType == 4">总数</td>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="selectClick(item, index)"
            v-for="(item, index) in dataAll"
          >
            <td v-if="fileType != 4">{{ item.startstamp }}</td>
            <td v-if="fileType != 4">{{ item.endstamp }}</td>
            <td v-if="fileType == 1 ? true : false">
              {{ session(item.caller_id_number) }}
            </td>
            <td v-if="fileType != 4">
              {{ fileType == 1 ? item.caller_id_number : item.callernumber }}
            </td>
            <td v-if="fileType == 1 ? true : false">
              {{ session(item.destination_number) }}
            </td>
            <td v-if="fileType != 4">
              {{ fileType == 1 ? item.destination_number : item.calleenumber }}
            </td>
            <td v-if="fileType != 4">{{ item.duration }}</td>
            <td v-if="fileType != 1 ? false : true">
              {{ returnState(item.hangup_cause) }}
            </td>
            <td
              v-if="fileType == 3 ? true : false"
              :title="item.description"
              @click="watchAlert(item.description)"
            >
              {{
                item.description == null || item.description.length == 0
                  ? ""
                  : "查看"
              }}
            </td>

            <!-- <td v-if="fileType == 4"><el-button type="text" @click="rollcallInfo(item)">查看</el-button></td> -->
          
            <td v-if="fileType == 4"><a @click="rollcallInfo(item)" style="cursor: pointer; color: white">查看人员</a></td>
            <td v-if="fileType == 4">{{ item.created_at | formatTimeDate}}</td>
            <td v-if="fileType == 4">{{ item.finished_at | formatTimeDate }}</td>
            <td v-if="fileType == 4">{{ item.status == 0 ? "正在点名" : "完成点名" }}</td>
            <td v-if="fileType == 4">{{ item.roomname }}</td>
            <td v-if="fileType == 4">{{ item.present_number }}</td>
            <td v-if="fileType == 4">{{ item.total_number }}</td>
            
          </tr>
        </tbody>
      </table>
    </div>
    <page></page>
    <audio id="music"></audio>
  </div>
</template>

<script>
import { page } from "components";
import { mapGetters, mapActions } from "vuex";
import { Button, Select } from "element-ui";
import { GET_USER_INFO } from "store/getters/type";
export default {
  data() {
    return {
      rollcallData: [],
      rollcallInfoVisible: false,
      recordState: "播放",
      fileType: 1,
      formData: {
        calleenumber: "",
        callernumber: "",
        BeginTime: "",
        EndTime: "",
      },
      dataAll: [],
      downloadfile: null,
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      mediaPath: "",
      value: "",
    };
  },
  async created() {
    this.organizationid = this.get_user_info.user.organizationid;
    this.refresh();
  },

  filters: {
    formatTimeDate(value) {
      if (value == null) return "";
      const dateObj = new Date(value);
      return dateObj.toLocaleString();
    }
  },

  computed: {
    ...mapGetters({
      deviceList: "deviceList",
      nameNumberMap: "nameNumberMap",
      pageData: "pageData",
      whetherPlayAnotherRecord: "whetherPlayAnotherRecord",
      get_user_info: GET_USER_INFO,
      deviceStatus: "deviceStatus",
    }),
  },
  components: {
    page,
  },

  watch: {
    "pageData.pageSize": function () {
      this.refresh();
    },
    "pageData.pageIndex": function () {
      this.refresh();
    },
    mediaPath: function (newval, oldval) {
      if (oldval != "") {
        this.$store.dispatch("setWhetherPlayAnotherRecord", "yes");
      }
    },

    dataAll(newvalue) {
      this.$nextTick(() => {
        const table = this.$refs.myTable;
        const rowHeight = table.offsetHeight / table.rows.length;
        const pageHeight = window.innerHeight * 0.43;
        const rowsPerPage = Math.floor(pageHeight / rowHeight);
        this.pageData.pageSize = rowsPerPage;
      });
    }
  },
  methods: {
    returnState(cause) {
      switch (cause) {
        case "ORIGINATOR_CANCAL":
          return "主叫挂断";
          break;
        case "NORMAL_CLEARING":
          return "呼叫正常结束";
          break;

        case "SUBSCRIBER_ABSENT":
          return "被叫号码不存在";
          break;
        case "CALL_REJECTED":
          return "被叫拒绝通话";
          break;
        case "MEDIA_TIMEOUT":
          return "等待超时";
          break;
        case "USER_BUSY":
          return "用户忙";
          break;
        case "INCOMPATIBLE_DESTINATION":
          return "硬件设备不匹配";
          break;
      }
    },
    changeType(type) {
      this.fileType = type;
      this.refresh();
      this.mediaPath = "";
      this.downloadfile = "";
      $(".selected").removeClass("selected");
    },

    rollcallInfo(rollcall) {
      this.instance({
        method: "get",
        url: "/Rollcall/GetById/" + rollcall.id,
      }).then((res) => {
        this.rollcallData = res.data.result;
        this.rollcallData.forEach(item => {
          item.rollcalllist_id = rollcall.roomname;
          item.status = this.returnCalllistType(item.status);
          item.created_at = new Date(item.created_at).toLocaleString();
        });
        this.rollcallInfoVisible = true;
      });
    },

    returnCalllistType(type) {
      if (type == 0) return "缺席点名";
      if (type == 1) return "点名时正在通话";
      return "成功点名";
    },

    async refresh() {
      /* setTimeout(() => {
          var map = new Map();
          for (var device of this.deviceList) {
            map.set(device.userID, device.name)
          }
          this.$store.dispatch('setNameNumber', map) 
        }, 1000) */

      this.formData = Object.assign(this.formData, this.pageData);
      let result = await this.instance({
        method: "post",
        url: "/Callrecord/List/" + this.organizationid + "/" + this.fileType,
        data: this.formData,
      });
      this.pageData.total = result.data.result.total;
      this.dataAll = result.data.result.resultlist;
      this.formData.BeginTime = "";
      this.formData.EndTime = "";
    },
    selectClick(item, index) {
      if (this.fileType == 4) return;
      let target = $(".table>tbody>tr").eq(index);
      this.downloadfile = item;
      let s6 = "";
      let s7 = "";
      if (target.hasClass("selected")) {
        this.mediaPath = "";
      } else {
        var arr1 = item.startstamp.split("-");
        var s1 = arr1[0] + arr1[1] + arr1[2];
        var arr2 = s1.split(":");
        var s2 = arr2[0] + arr2[1] + arr2[2];
        var s3 = s2.replace(" ", "");
        var s5 = "_" + item.bridge_uuid;
        
        if (item.type == 2 || item.type == 3)
          s6 =
            item.uuid.slice(2) + "_" + item.callernumber + "-scc.yuqi.com";

        if (item.type == 2 || item.type == 3)
          s7 =
            "https://scc.yuqi.com:8001/IpBcFiles/conference/" + item.callid + "_" + item.context +".wav";
        else
          s7 =
            "https://scc.yuqi.com:8001/IpBcFiles/recording/" + s3 +"_"+ item.bridge_uuid+ ".mp3";
        for (var i = 0; i < 10; i++) {
          if (i != index) {
            let aaa = $(".table>tbody>tr").eq(i);
            if (aaa.hasClass("selected")) {
              aaa.toggleClass("selected");
            } else {
            }
          } else {
          }
        }
      }
      target.toggleClass("selected");
      this.mediaPath = s7;
      this.$store.dispatch("setMediaPath", s7);
    },
    prePlay() {
      if (this.mediaPath == "") return;
      if (this.whetherPlayAnotherRecord == "no") {
        console.log("The same record");
        if (this.recordState == "暂停") {
          this.recordState = "播放";
          var audio = document.getElementById("music");
          audio.src = this.mediaPath;
          audio.pause();
        } else {
          this.recordState = "暂停";
          var audio = document.getElementById("music");
          audio.src = this.mediaPath;
          audio.play();
        }
      } else {
        if (this.recordState == "播放") {
          console.log("Another song");
          this.recordState = "暂停";
          var audio = document.getElementById("music");
          audio.src = this.mediaPath;
          audio.play();
          this.$store.dispatch("setWhetherPlayAnotherRecord", "no");
        } else {
          this.recordState = "播放";
          var audio = document.getElementById("music");
          audio.pause();
        }
      }
    },
    session(number) {
      return window.sessionStorage.getItem(number);
    },
    downLoad() {
      if (this.downloadfile == null || this.downloadfile == "") {
        return;
      } else {
      let date = new Date(this.downloadfile.startstamp);
      let year = date.getUTCFullYear();
      let month = date.getUTCMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let seconds = date.getSeconds();
      let time =
        year +
        String(month > 9 ? month : "0" + month) +
        String(day > 9 ? day : "0" + day) +
        String(hour > 9 ? hour : "0" + hour) +
        String(minute > 9 ? minute : "0" + minute)+
        String(seconds > 9 ? seconds : "0" + seconds);
 
        if (this.fileType == 1) {
          window.open(
            `https://scc.yuqi.com:8001/file/download/calling/${
              time +
              "_" +
              this.downloadfile.bridge_uuid +
              ".mp3"
            }`
          );
        } else {
          window.open(
            `https://scc.yuqi.com:8001/file/download/conference/${
              this.downloadfile.callid +
              "_" +
              this.downloadfile.context +
              ".wav"
            }`
          );
        }
      }
    },
    watchAlert(item) {
      this.$alert(item, "报警信息", {
        confirmButtonText: "确定",
        /* callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          } */
      });
    },
    queryRecord() {
      console.log(this.fileType);
      Date.prototype.format = function (format) {
        var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          S: this.getMilliseconds(), //millisecond
        };
        if (/(y+)/.test(format))
          format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return format;
      };
      if (typeof this.value[0] != "undefined" && this.value[0] != null) {
        this.formData.BeginTime = this.value[0].format("yyyy-MM-dd hh:mm:ss");
      }
      if (typeof this.value[1] != "undefined" && this.value[1] != null) {
        this.formData.EndTime = this.value[1].format("yyyy-MM-dd hh:mm:ss");
      }
      this.refresh();
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
.form-group {
  .el-input__icon {
    color: #555;
  }
  .el-input__inner {
    background-color: #272d33;
    color: #555;
    border: none;
  }
}
.el-time-spinner__item {
  color: #555 !important;
}
.el-picker-panel .el-date-range-picker .has-time,
.el-picker-panel__body-wrapper,
.el-picker-panel__body,
.el-date-range-picker__time-header,
.el-date-range-picker__editors-wrap,
.el-date-range-picker__time-picker-wrap {
  color: #333;
}
</style>
