<template>
  <div class='content'>
    <el-breadcrumb separator="/" id="nav">
      <el-breadcrumb-item @click.native="close(change)">> 返回上一页：路由管理</el-breadcrumb-item>
      <el-breadcrumb-item>当前正在查看的路由编号：{{ showRoute.id }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="contentM">
      <div class="tableTool" v-show="!edit">
        <div class="operate">
          <form class="form-inline">
            <button type="button" class="btn btn-info" @click="holdEdit">
              编辑路由
            </button>
            <button type="button warning" class="btn btn-info" @click="deleteItem">
              删除路由
            </button>
          </form>
        </div>
      </div>

      <div class="tableTool" v-show="edit">
        <div class="operate">
          <form class="form-inline">
            <button type="button" class="btn btn-info" @click="saveEdit">
              保存路由
            </button>
            <button type="button" class="btn btn-info" @click="cancelEdit">
              取消编辑
            </button>
          </form>
        </div>
      </div>


      <h3> 基本信息 </h3>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>名称</td>
              <td>描述</td>
              <td>呼叫源头</td>
              <td>被叫字冠</td>
              <td>最大长度</td>
              <td>最近更新时间</td>
              <td>创建时间</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!edit">
              <td>{{ showRoute.name }}</td>
              <td>{{ showRoute.description }}</td>
              <td>呼叫源头</td>
              <td>{{ showRoute.prefix }}</td>
              <td>{{ showRoute.max_length }}</td>
              <td>{{ showRoute.updated_at.substring(0, 10) }}</td>
              <td>{{ showRoute.created_at.substring(0, 10) }}</td>
            </tr>
            <tr v-show="edit">
              <td><el-input v-model="showRoute.name"></el-input></td>
              <td><el-input v-model="showRoute.description"></el-input></td>
              <td>呼叫源头</td>
              <td><el-input v-model="showRoute.prefix"></el-input></td>
              <td><el-input v-model="showRoute.max_length"></el-input></td>
              <td>{{ showRoute.updated_at.substring(0, 10) }}</td>
              <td>{{ showRoute.created_at.substring(0, 10) }}</td>
            </tr>
          </tbody>
        </table>
      </div>


      <h3> 扩展信息 </h3>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>自动录音</td>
              <td>黑白名单</td>
              <td>呼叫类型</td>
              <td>费率</td>
              <td>代理媒体</td>
              <td>媒体编码</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!edit">
              <td>{{ returnType(showRoute.auto_record) }}</td>
              <td> </td>
              <td> </td>
              <td> 0.00 </td>
              <td> </td>
              <td> </td>
            </tr>
            <tr v-show="edit">
              <td>
                <el-select v-model="showRoute.auto_record" class="form-control">
                  <el-option v-for="item in autoRecordOptions" :key="item.value" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td> </td>
              <td> </td>
              <td> 0.00 </td>
              <td> </td>
              <td> </td>
            </tr>

          </tbody>

        </table>
      </div>

      <h3> 号码变换 </h3>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>被叫号码变换</td>
              <td>主叫号码变换</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!edit">
              <td>{{ showRoute.dnc }}</td>
              <td>{{ showRoute.sdnc }}</td>
            </tr>
            <tr v-show="edit">
              <td><el-input v-model="showRoute.dnc"></el-input></td>
              <td><el-input v-model="showRoute.sdnc"></el-input></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3> 目的地控制 </h3>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <td>目的地类型</td>
              <td>文本</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!edit">
              <td>{{ returnType(showRoute.dest_type) }}</td>
              <td>{{ returnType(showRoute.body) }}</td>
            </tr>
            <tr v-show="edit">
              <td>
                <el-select v-model="showRoute.dest_type" class="form-control">
                  <el-option v-for="item in destTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>{{ returnType(showRoute.body) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import { getHeights } from "utils/page/setting";

export default {
  components: {},
  props: ['routeInformation'],
  data() {
    return {
      showRoute: { ...this.routeInformation },
      route: { ...this.routeInformation },
      edit: false,
      change: false,
      instance: this.$ajax.create({
        baseURL: "https://scc.yuqi.com:8001/",
      }),
      autoRecordOptions: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      destTypeOptions: [{
        value: 'FS_DEST_IP',
        label: 'IP 地址'
      }],
    };
  },

  created() {
    this.$nextTick(() => {
      getHeights();
    });
  },

  methods: {
    close(type) {
      if (type === false)
        this.$emit("close");
      else
        this.$emit("closeAndRefresh");
    },

    holdEdit() {
      this.edit = !this.edit;
    },

    cancelEdit() {
      this.$confirm("是否退出编辑模式？（编辑内容不会被保存）", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        // 确认退出
        this.showRoute = { ...this.route };
        this.edit = !this.edit;
      }).catch(() => { });
    },

    saveEdit() {
      this.$confirm("请您确认是否保存更改？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        let flag = true;
        // 先核查所修改的数据是否有空值，同时处理一下数据


        // 数据有问题则保存失败
        if (!flag)
          this.showTip("路由保存失败！", false);
        else {
          // 数据没问题则保存
          this.instance({
            method: "post",
            url: "/RouteInfo/ChangeRouteInfo",
            data: this.showRoute,
          }).then(res => {
            console.log(res);
            if (res.data.result === 1) {
              this.route = { ...this.showRoute };
              this.edit = !this.edit;
              this.change = true;
              this.showTip("路由保存成功！", true);
            } else
              this.showTip("路由保存失败，请重新尝试！", false);
          });
        }
      }).catch(() => { });
    },

    deleteItem() {
      this.$confirm("请您确认是否删除此路由？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        // 确认删除
        this.instance({
          method: "get",
          url: "/RouteInfo/DeleteRoute/" + this.showRoute.id,
        }).then(res => {
          res.data.code === 1 ? this.showTip("路由删除成功！", true) : this.showTip("路由删除失败！", false);
          this.close(true);
        });
      }).catch(() => { });
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
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-input input {
  background-image: none;
  background-color: initial;
  color: #F7BA2A;
  border-color: initial;
}

.content {
  height: 2000px;
  width: 100%;
  position: relative;
}

#contentM {
  flex: 0 0 235px;
  margin-top: 20px;
  margin-left: 15px;
  border-radius: 5px;
  height: 100%;
}

#nav {
  margin-bottom: 20px;
}

/deep/ .el-breadcrumb__item__inner,
.el-breadcrumb__item__inner a {
  font-size: medium;
  color: whitesmoke;
}

.oper {
  margin-right: 1000px;
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
</style>