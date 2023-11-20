<template>
  <div class="routeContent">
    <div id="routeM">
      <!-- 导航栏 -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" id="nav">
        <el-tab-pane label="全部路由" name="first"></el-tab-pane>
        <el-tab-pane label="普通路由" name="second"></el-tab-pane>
        <el-tab-pane label="系统路由" name="third"></el-tab-pane>
      </el-tabs>

      <div class="tableTool">
        <button type="button" class="btn btn-info" @click="showRouteAdd">
              <i class="fa fa-deviantart" aria-hidden="true"></i> 新建路由
            </button>
        <div class="operate">
          <form class="form-inline">
            <!-- 搜索栏 -->
            <div class="form-group">
              <input type="text" placeholder="被叫字冠" class="form-control" style="width: 200px" v-model="queryPrefix" />
              <el-select v-model="context" placeholder="呼叫源" class="form-control">
                <el-option v-for="item in contextOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="destType" placeholder="目的地类型" class="form-control">
                <el-option v-for="item in destTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <input type="text" placeholder="目的地" class="form-control" style="width: 200px" v-model="queryDes" />
            </div>

            <button type="button" class="btn btn-info" @click="search">
              <i class="fa fa-search" aria-hidden="true"></i> 查询
            </button>
            
            <button type="button" class="btn btn-info" @click="clearAll">
              <i class="fa fa-share" aria-hidden="true"></i> 清空搜索栏
            </button>
            
          </form>
        </div>
      </div>

      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>设备编号</td>
              <td>名称</td>
              <td>描述</td>
              <td>呼叫源</td>
              <td>被叫字冠</td>
              <td>最大长度</td>
              <td>dnc</td>
              <td>sdnc</td>
              <td>目的地类型</td>
              <td style="width:595px">body</td>
              <td>删除</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in showData" :key="item.id">
              <td>{{ item.id }}</td>
              <td><a @click="showRouteInfo(item)" style="cursor: pointer">{{ item.name }}</a></td>
              <td>{{ returnType(item.description) }}</td>
              <td>{{ item.context }}</td>
              <td>{{ item.prefix }}</td>
              <td>{{ item.max_length }}</td>
              <td>{{ item.dnc }}</td>
              <td>{{ item.sdnc }}</td>
              <td>{{ returnType(item.dest_type) }}</td>
              <td style="width:595px">{{ item.body }}</td>
              <td>
                <button type="submit" class="btn btn-sm btn-default" @click="deleteItem(item.id)">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <routeInfo v-if="routeInfoShow" @close="showRouteInfo" @closeAndRefresh="closeAndRefresh"
      :routeInformation="routeInformation"></routeInfo>

    <routeAdd v-if="routeAddShow" @close="showRouteAdd" @refresh="refresh">
    </routeAdd>
  </div>
</template>

<script>
import routeInfo from "./routeInfo.vue";
import routeAdd from "./routeAdd.vue";
import { getHeights } from "utils/page/setting";
export default {
  components: {
    routeInfo,
    routeAdd
  },

  data() {
    return {
      showData: [],
      routeData: [],
      normalRoute: [],
      systemRoute: [],
      routeInformation: null,
      routeAddShow: false,
      routeInfoShow: false,
      activeName: 'first',
      queryDes: '',
      queryPrefix: '',
      context: '',
      destType: '',
      routeType: '全部路由',
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      destTypeOptions: [{
        value: 'FS_DEST_IP',
        label: 'IP 地址'
      }],
      contextOptions: [{
        value: 'default',
        label: 'default'
      }, {
        value: 'public',
        label: 'public'
      }],
    };
  },

  computed: {},

  watch: {

  },

  created() {
    this.$nextTick(() => {
      this.refresh();
      getHeights();
    });
  },

  methods: {
    search() {
      let datas = [];
      let searchData = [];
      if (this.routeType === '全部路由')
        datas = this.routeData;
      else if (this.routeType === '系统路由')
        datas = this.systemRoute;
      else
        datas = this.normalRoute;

      for (let item of datas) {
        if (this.queryPrefix != '' && item.prefix != this.queryPrefix)
          continue;
        if (this.destType != '' && item.dest_type != this.destType)
          continue;
        if (this.context != '' && item.context != this.context)
          continue;
        searchData.push(item);
      }

      this.showData = searchData;
    },

    clearAll() {
      this.context = '';
      this.destType = '';
      this.queryDes = '';
      this.queryPrefix = '';

      if (this.routeType === '全部路由')
        this.showData = this.routeData;
      else if (this.routeType === '系统路由')
        this.showData = this.systemRoute;
      else
        this.showData = this.normalRoute;
    },

    handleClick(tab, event) {
      this.routeType = tab.$vnode.componentOptions.propsData.label;
      if (this.routeType === '全部路由')
        this.showData = this.routeData;
      else if (this.routeType === '系统路由')
        this.showData = this.systemRoute;
      else
        this.showData = this.normalRoute;
    },

    showRouteInfo(chooseRoute) {
      this.routeInformation = chooseRoute;
      this.routeInfoShow = !this.routeInfoShow;
      $("#routeM").toggle();
    },

    closeAndRefresh() {
      this.refresh();
      this.routeInfoShow = !this.routeInfoShow;
      $("#routeM").toggle();
    },

    showRouteAdd(type) {
      this.routeAddShow = !this.routeAddShow;
      if (type == 1) {
        this.refresh();
      }
    },

    deleteItem(id) {
      this.$confirm("请您确认是否删除此路由？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        // 确认删除
        this.instance({
          method: "get",
          url: "/RouteInfo/DeleteRoute/" + id,
        }).then(res => {
          res.data.code === 1 ? this.showTip("路由删除成功！", true) : this.showTip("路由删除失败！", false);
          this.refresh();
        });
      }).catch(() => {});
    },

    showTip(tipContent, tipType) {
      tipType ? this.$message.success(tipContent) : this.$message.error(tipContent)
    },

    returnType(type) {
      switch (type) {
        case 'FS_DEST_SYSTEM':
          return '系统';
        case 'FS_DEST_USER':
          return '本地分机';
        case 'Local Users':
          return '本地分机';
        case 'Fifo':
          return 'Fifo队列';
        case 'FS_DEST_IP':
          return 'IP 地址';
        case 0:
          return '否';
        case 1:
          return '是';
        case 'null':
          return '无';
        default:
          return type;
      }
    },

    refresh() {
      this.instance({
        method: "get",
        url: "/RouteInfo/GetRouteInfo",
      }).then((res) => {
        let allRoutes = [];
        let systemRoutes = [];
        let normalRoutes = [];

        if (res.data.code === 1 && res.data.result != null)
          res.data.result.rows.forEach(re => {
            allRoutes.push(re);
            if (re.dest_type === 'FS_DEST_SYSTEM')
              systemRoutes.push(re);
            else
              normalRoutes.push(re);
          })

        this.routeData = allRoutes;
        this.normalRoute = normalRoutes;
        this.systemRoute = systemRoutes;
        console.log("_______________refresh");

        if (this.routeType === '全部路由')
          this.showData = this.routeData;
        else if (this.routeType === '系统路由')
          this.showData = this.systemRoute;
        else
          this.showData = this.normalRoute;
      });
    }

  },
}
</script>

<style lang='scss'>

.routeContent {
  width: 100%;
  position: relative;
}

#routeM {
  flex: 0 0 235px;
  margin-top: 20px;
  margin-left: 15px;
  border-radius: 5px;
  height: 100%;
}

#nav {
  margin: 13px;
}

.el-select-dropdown__list {
  background-color: #272D33;
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: rgb(126,176,197);
    color: white;
}

.el-tabs__nav-scroll {
    overflow: hidden;
    background-color: rgb(34,36,40);
    width: fit-content;
}

.el-tabs__nav-wrap {
    overflow: hidden;
    margin-bottom: -1px;
    position: relative;
    margin-left: -10px;
    background: rgb(78,84,90);
}

.el-input, .el-input__inner {
    width: 100%;
    height: 100% !important;
    display: inline-block;
}

.del-model {
  .el-message-box__btns {
    .el-button:nth-child(1) {
      background-color: #2d8cf0;
      border-color: #2d8cf0;
    }

    .el-button:nth-child(2) {
      background-color: #2d8cf0;
      border-color: #2d8cf0;
    }
  }
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #272D33;
}

.el-tabs__item {
  color: white;
}
</style>