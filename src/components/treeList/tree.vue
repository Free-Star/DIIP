<template>
  <div class="dept">
    <el-tree
      ref="tree"
      :data="data"
      highlight-current
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      node-key="organizationid"
      @node-click="handleNodeClick"
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GET_USER_INFO } from "store/getters/type";

export default {
  data() {
    return {
      data: [],
      defaultExpanded: [],
      defaultProps: {
        children: "Children",
        label: "orgname",
      },
    };
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO,
    }),
  },
  created() {
    this.$nextTick(function () {
      this.refresh();
    });
  },
  methods: {
    ...mapActions(["TreeChange", "setInitData"]),
    refresh() {
      this.$ajax
        .get(
          "https://scc.yuqi.com:8001/" +
            "Organization/Data/" +
            this.get_user_info.user.organizationid
        )
        .then((res) => {
          let data = res.data.result;
          this.data = data;
          // 初始化树对象
          this.TreeChange({ data: data[0], node: {} });
          //  循环出默认展开项的ID
          for (let i in data) {
            this.defaultExpanded.push(data[i]["organizationid"]);
          }
          this.$nextTick(() => {
            this.$refs.tree.$children[0].$el.className =
              this.$refs.tree.$children[0].$el.className + " " + "is-current";
          });
        });
    },
    handleNodeClick(data, node, event) {
      console.log(node.label, data.orgname);
      if (event) {
        // 判断点击的是否为默认选中的树节点，如果不是，取消默认选中
        if (node.id != this.$refs.tree.$children[0].node.id) {
          this.$refs.tree.$children[0].$el.className = "el-tree-node";
        }
      }
      // 提交树对象，以及当前点击树菜单的数据至仓库
      this.$emit("click");
      this.TreeChange({ data, node });
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>
      );
    },
  },
};
</script>
<style scoped>
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: #313439;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-left: 5px;
}
.operation {
  float: right;
}
i {
  margin: 0px 5px;
}
</style>
