<template>
  <!--新增用户-->
  <div class="popUp">
    <div class="popContent">
      <el-form
        class="form-horizontal"
        :model="formData"
        ref="formData"
        :rules="rules"
      >
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">用户名</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.username"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-4 control-label">密码</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.password"
                />
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button
        type="button"
        class="btn btn-sm btn-info"
        @click="
          submitFrom(self, modolType, 'User/Create', 'User/Edit', formData, 1) &
            refresh
        "
      >
        确定
      </button>
      <button type="button" class="btn btn-sm btn-default" @click="close">
        取消
      </button>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    targetMenu: {
      type: Object,
      required: true,
    },
    modolType: {
      type: Number,
      required: true,
    },
    targetUserGroupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      self: this,
      formData: {
        userName: "",
        password: "",
        organizationID: "",
        userRoles: [],
      },
      groupList: [],
      rules: {
        userName: [
          { required: true, message: "用户名不能为空" },
          { validator: this.defenseSQL },
        ],
        userPassword: [
          { required: true, message: "密码不能为空" },
          { validator: this.defenseSQL },
        ],
      },
    };
  },
  created() {
    let documentHeight = document.documentElement.clientHeight;
    $(".popUp").css("top", documentHeight * 0.3 + "px");
    let userroleid = this.targetUserGroupId;
    this.formData.userRoles = [{ roleID: userroleid }];
    if (this.modolType === 0) {
      // 如果为新增，拿到当前的组织机构ID
      this.formData.OrganizationID = this.targetMenu.organizationid;
    } else {
      // 如果为编辑，拿到当前的用户的userId
      this.$ajax.get(`User/Detail/${this.targetMenu.userid}`).then((res) => {
        if (res.data.code === 1) {
          let result = res.data.result;
          this.formData = result;
        }
      });
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    refresh() {
      this.$emit("refresh");
    },
  },
};
</script>
