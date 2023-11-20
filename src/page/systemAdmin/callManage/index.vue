<template>
  <div>
    <!--tab03呼叫记录-->
    <div class="tableTool">
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <label>呼叫时间</label>
            <el-date-picker
              v-model="formData.startStamp"
              type="datetime"
              placeholder="开始时间"
            >
            </el-date-picker>
            —
            <el-date-picker
              v-model="formData.endStamp"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>
          <div class="form-group">
            <label>主叫号码</label>
            <input
              type="text"
              v-model.number="formData.callerNumber"
              class="form-control"
              style="width: 70px"
            />
          </div>
          <div class="form-group">
            <label>被叫号码</label>
            <input
              type="text"
              v-model.number="formData.calleeNumber"
              class="form-control"
              style="width: 70px"
            />
          </div>
          <button type="button" class="btn btn-info" @click="refresh">
            <i class="fa fa-search" aria-hidden="true"></i>查询
          </button>
        </form>
      </div>
    </div>
    <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>呼叫时间</td>
            <td>主叫号码</td>
            <td>被叫号码</td>
            <td>通话时长（秒）</td>
            <td>应答状态</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataAll">
            <td>{{ item.startStamp }}</td>
            <td>{{ item.callerNumber }}</td>
            <td>{{ item.calleeNumber }}</td>
            <td>{{ item.duration }}</td>
            <td>应答</td>
          </tr>
        </tbody>
      </table>
    </div>
    <page></page>
  </div>
</template>

<script>
import { page } from "components";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      formData: {
        startStamp: null,
        endStamp: null,
        calleeNumber: "",
        callerNumber: "",
      },
      dataAll: [],
    };
  },

  created() {
    this.refresh();
  },
  computed: {
    ...mapGetters({
      pageData: "pageData", //  当前页面分页数据
    }),
  },
  components: {
    page,
  },
  watch: {
    "pageData.pageSize": function () {
      //  监听分页所显示数据量的变化
      this.refresh();
    },
    "pageData.pageIndex": function () {
      //  监听分页所点击页码的变化
      this.refresh();
    },
  },
  methods: {
    refresh() {
      this.formData = Object.assign(this.formData, this.pageData);
      this.$ajax.post("CallRecord/List", this.formData).then(
        function (res) {
          if (res.data.code == 1) {
            this.dataAll = res.data.result;
            console.log(this.dataAll[0]);
            this.pageData.total = res.data.total;
          }
        }.bind(this)
      );
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
    padding-left: 10px;
  }
}
</style>
