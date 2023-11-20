<template>
  <div class="dept">
    <el-tree
      ref="tree"
      :data="data"
      highlight-current
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      @node-click="handleNodeClick"
      node-key="organizationid"
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
  props: {
    Api: {
      type: String,
      default: "",
    },
    status: {
      type: String,
    },
    targetUserGroupId: {
      type: String,
    },
    users: {
      type: Array,
    },
    deviceGroupsDelete: {
      type: Array,
    },
  },
  watch: {
    targetUserGroupId: (targetUserGroupId) => {
      console.log("targetUserGroupId: "+ targetUserGroupId);
    },
  },
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
          //this.$emit('setInitData', data[0])
          //  循环出默认展开项的ID
          for (let i in data) {
            this.defaultExpanded.push(data[i]["organizationid"]);
          }
          this.TreeChange({
            data: data[0],
            node: this.$refs.tree.$children[0],
          });
          this.$nextTick(() => {
            this.$refs.tree.$children[0].$el.className =
              this.$refs.tree.$children[0].$el.className + " " + "is-current";
          });
        });
    },
    handleNodeClick(data, node, event) {
      if (event) {
        // 判断点击的是否为默认选中的树节点，如果不是，取消默认选中
        if (node.id != this.$refs.tree.$children[0].node.id) {
          this.$refs.tree.$children[0].$el.className = "el-tree-node";
        }
      }
      // 提交树对象，以及当前点击树菜单的数据至仓库
      console.log("handleNodeClick");
      console.log(data);
      this.TreeChange({ data, node });
    },
    append(data, node) {
      const newChild = {
        organizationid: data.organizationid,
        childnum: 0,
        orgname: "新建组织机构",
        Children: [],
      };
      if (!data.Children) {
        this.$set(data, "Children", []);
      }
      data.Children.push(newChild);
      console.log("asfasdf");
      console.log(data);
      this.TreeChange({ data, node });
    },
    remove(node, data) {
      this.$confirm("确认删除此组织？", "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        customClass: 'del-model',
        type: "warning",
      }).then(() => {
        let deleteFlag = true;
        // 判断该机构下是否有设备
        this.$ajax
        .get(`https://scc.yuqi.com:8001/Feature/getFeatureByOrg/${data.organizationid}`)
        .then((res) => {
          if (res.data.code == 1) {
            if(res.data.result.length > 0)
              deleteFlag = false;
          } else {
            deleteFlag = false;
          };

          if (!deleteFlag) 
          {
            this.showTip("该机构下存在设备，不允许删除！", false);
            return;
          }

          let parent = node.parent;
          // parent.data.Children.pop();
          for (let i in parent.data.Children) {
            // console.log(parent.data.Children[i])
            // console.log(parent.data.Children[i]===data)
            if (parent.data.Children[i] === data) {
              parent.data.Children.splice(i);
            }
          }
          // console.log(parent.data.Children)
          let request = [];
          this.users.forEach((element) => {
            console.log(element);
            request.push(element.userid);
          });
          if (request.length > 0) {
            this.$ajax.post(`User/RemoveList`, request).then((res) => {
              if (res.data.code == 1) {
                this.$ajax
                  .delete(`Organization/Remove/${data.organizationid}`)
                  .then((res) => {
                    console.log(res);
                    if (res.data.code == 1) {
                      console.log("组织机构删除成功");
                      if (this.targetUserGroupId != "") {
                        this.$ajax.delete(`Role/Remove/${this.targetUserGroupId}`);
                        this.$ajax.post(
                          `DeviceGroup/RemoveList/${this.deviceGroupsDelete}`
                        );
                        console.log("用户组,设备组删除成功");
                        //window.location.reload()
                        this.$router.go(0);
                      } else console.log("用户组删除失败");
                    }
                  });
              }
            });
          } else {
            //这个地方不可以删除有子机构的机构，重构代码需要调整
            console.log(data);
            this.$ajax
              .delete(`Organization/Remove/${data.organizationid}`)
              .then((res) => {
                console.log(res);
                if (res.data.code == 1) {
                  console.log("组织机构删除成功");
                  if (this.targetUserGroupId != "") {
                    this.$ajax.delete(`Role/Remove/${this.targetUserGroupId}`);
                    console.log("用户组删除成功");
                    this.$router.go(0);
                    //window.location.reload()
                  } else console.log("用户组删除失败");
                }
              });
          }
        });
      }).catch(() => { });
    },

    showTip(tipContent, tipType) {
      tipType? this.$message.success(tipContent) : this.$message.error(tipContent)
    },

    renameDeviceGroupList(event, data, node) {
      console.log("焦点转移绑定成功");
      let text = event.target.textContent;
      let children = node.parent.data.Children;
      children[children.length - 1].orgname = text;
      //if (text !== '新建设备分组') {
      this.$ajax
        .post("Organization/List", { pageIndex: 1, pageSize: 1000 })
        .then((res) => {
          if (res.data.code == 1) {
            console.log(res);
            let total = res.data.result.length;
            let vertos = [];
            let axios = [];
            res.data.result.forEach((org) => {
              axios.push(
                this.$ajax.get(`Organization/Detail/${org.organizationid}`)
              );
            });
            this.$ajax.all(axios).then((res) => {
              res.forEach((re) => {
                if (re != null && re.data.result != null)
                  vertos.push(Number(re.data.result.vertoid.slice(2)));
              });
              let id = "02";
              console.log(vertos, id);
              if (vertos.length != 0) {
                if (vertos.length == 1) {
                  id =
                    String(Math.max(...vertos) + 2).length > 1
                      ? String(Math.max(...vertos) + 2)
                      : "0" + String(Math.max(...vertos) + 2);
                } else {
                  id =
                    String(Math.max(...vertos) + 1).length > 1
                      ? String(Math.max(...vertos) + 1)
                      : "0" + String(Math.max(...vertos) + 1);
                }
              }
              let vertoNum = "99" + id;
              let alarmNum = "91" + id;
              let voiceNum = "92" + id;
              let broadNum = "93" + id;
              let meetingNum = "94" + id;
              let rollcallNum = "95" + id;
              console.log(vertoNum, meetingNum);
              this.$ajax
                .post("Organization/Create", {
                  orgcode: "00000" + String(Number(total) + 1),
                  orgname: text,
                  parentid: data.organizationid,
                  vertoid: vertoNum,
                  voicecallid: voiceNum,
                  meetingid: meetingNum,
                  broadid: broadNum,
                  alarmid: alarmNum,
                  rollcallid: rollcallNum
                })
                .then((res) => {
                  console.log(res);
                  if (res.data.code == 1) {
                    let organizationID = res.data.result;
                    data.organizationid = organizationID;
                    let request = {
                      rolename: text,
                      childdata: false,
                    };
                    this.$ajax.post("Role/Create", request).then((res) => {
                      console.log(res);
                      if (res.data.code === 1) {
                        let result = res.data.result;
                        console.log(result);
                        this.$emit("refresh");
                      }
                    });
                  }
                });
            });
          }
        });
      event.target.contentEditable = "false";
    },
    renderContent(h, { node, data, store }) {
      if (this.status == "change")
        return (
          <span class="custom-tree-node">
            <span
              contenteditable={node.label == "新建组织机构" ? true : false}
              onkeydown={() => this.enter($event, data, node)}
              onblur={() => this.renameDeviceGroupList(event, data, node)}
            >
              {node.label}
            </span>
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.append(data)}
              >
                <i class="fa fa-plus"></i>
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.remove(node, data)}
              >
                <i class="fa fa-minus"></i>
              </el-button>
            </span>
          </span>
        );
      else
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
    },
    enter(event, data, node) {
      if (event.keyCode == 13) {
        console.log(event, data, node);
        this.renameDeviceGroupList(event, data, node);
      }
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
