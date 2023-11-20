<template>
  <!--设备信息新增-->
  <div class="popUp popZin" style="display: block">
    <div class="popContent">
      <el-form class="form-horizontal" :model="newRoute" ref="newRoute" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">名称</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="newRoute.name" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">被叫字冠</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="newRoute.prefix" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">最大长度</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="newRoute.max_length" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">描述</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="newRoute.description" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">被叫号码变换</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="newRoute.dnc" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">主叫号码变换</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="newRoute.sdnc" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">呼叫源</label>
              <div class="col-sm-6">
                <el-select v-model="newRoute.context" placeholder="呼叫源" class="form-control">
                  <el-option v-for="item in contextOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">目的地类型</label>
              <div class="col-sm-6">
                <el-select v-model="newRoute.dest_type" placeholder="目的地类型" class="form-control">
                  <el-option v-for="item in destTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>

          <div class="col-md-6" v-show="newRoute.dest_type === 'FS_DEST_IP'">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP 地址</label>
              <div class="col-sm-6">
                <input type="text" placeholder="IP地址" class="form-control" v-model="newRoute.body" />
              </div>
            </div>
          </div>

        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="commitRoute">
        提交
      </button>
      <button type="button" class="btn btn-sm btn-default" @click="close">
        取消
      </button>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      newRoute: {
        name: "",
        prefix: "",
        max_length: "",
        dest_type: '',
        context: '',
        body: '',
        description: '',
        dnc: '',
        sdnc: ''
      },
      rules: {},
      deviceOptions: [],
      deviceGroupOptions: [],
      deviceId: '',
      deviceGroupId: "",
      self: this,
      range: "",
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      destTypeOptions: [{
        value: 'FS_DEST_IP',
        label: 'IP 地址'
      }],
      deviceOptions: [],
      contextOptions: [{
        value: 'default',
        label: 'default'
      }, {
        value: 'public',
        label: 'public'
      }],
    };
  },
  created() {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight;
      $(".popUp").css("top", documentHeight * 0.3 + "px");
    });
  },
  methods: {
    close() {
      this.$emit("close");
    },

    commitRoute() {
      this.$confirm("确认新建此路由？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        if (this.newRoute.name === '')
          this.showTip("路由名称不允许为空！", false);
        else if (this.newRoute.prefix === '')
          this.showTip("路由被叫字冠不允许为空！", false);
        else if (this.newRoute.max_length === '')
          this.showTip("路由最大长度不允许为空！", false);
        else if (this.newRoute.description === '')
          this.showTip("路由描述不允许为空！", false);
        else if (this.newRoute.context === '')
          this.showTip("路由呼叫源不允许为空！", false);
        else if (this.newRoute.dest_type === '')
          this.showTip("路由目的地类型不允许为空！", false);
        else if (this.newRoute.dest_type === 'FS_DEST_IP' && this.newRoute.body === '')
          this.showTip("IP 值不允许为空！", false);

        else {
          this.instance({
            method: "post",
            url: "/RouteInfo/AddRouteInfo",
            data: this.newRoute
          }).then(res => {
            if (res.data.result === 1) {
              this.showTip("路由创建成功！", true);
              this.$emit("close", 1);
            } else
              this.showTip("路由创建失败，请重新尝试！", false);
          }).catch(() => {
            this.showTip("路由创建失败，请检查您的输入类型是否有误！", false);
          });
        }
      }).catch(() => { });
    },

    showTip(tipContent, tipType) {
      tipType ? this.$message.success(tipContent) : this.$message.error(tipContent)
    },
  },
};
</script>

<style lang="scss">
.popZin {
  position: fixed !important;
  z-index: 2000 !important;
  width: 700px !important;
}
</style>
