<template>
  <div>
    <div class="tableTool">
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <label>播放时间</label>
            <el-date-picker
              v-model="formData.time1"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            —
            <el-date-picker
              v-model="formData.time2"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>

          <button type="submit" class="btn btn-info">
            <i class="fa fa-search" aria-hidden="true"></i>查询
          </button>
        </form>
      </div>
    </div>
    <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>文件名称</td>
            <td>预约模式</td>
            <td>预约时间</td>
            <td>播放模式</td>
            <td>播放次数</td>
            <td>播放终端</td>
          </tr>
        </thead>
        <tbody>
          <tr @click="TrClick(0)">
            <td>fdafewr.mp3</td>
            <td>定时</td>
            <td>2017-11-05 13:00:00</td>
            <td>循环播放</td>
            <td>1</td>
            <td>701</td>
          </tr>
          <tr>
            <td>fdafewr.mp3</td>
            <td>定时</td>
            <td>2017-11-05 13:00:00</td>
            <td>循环播放</td>
            <td>1</td>
            <td>701</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        time1: new Date(),
        time2: new Date(),
      },
    };
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
</style>
