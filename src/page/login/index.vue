<template>
  <div>
    <!-- 背景层 -->
    <div id="container">
      <div id="anitOut" class="anitOut"></div>
    </div>
    <!-- 登录框  -->
    <div class="login">
      <div class="loginLogo">
        <img src="../../assets/img/logo.fw.png" />
      </div>
      <div class="userImg">
        <img src="../../assets/img/user.png" />
      </div>
      <div class="userInfoInput">
        <form class="form-horizontal">
          <div class="form-group" prop="account">
            <div class="col-sm-12">
              <input
                type="text"
                class="form-control"
                v-model="formData.account"
                :autofocus="true"
                placeholder="请输入用户名"
              />
            </div>
          </div>
          <div class="form-group" prop="password">
            <div class="col-sm-12">
              <input
                type="password"
                class="form-control"
                v-model="formData.password"
                placeholder="请输入密码"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-12">
              <div class="checkbox">
                <label>
                  <input
                    type="checkbox"
                    v-model="rememberPassword"
                    @click="
                      () => {
                        rememberPassword = !rememberPassword;
                      }
                    "
                  />
                  记住密码
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-12">
              <button
                type="button"
                class="btn btn-primary btn-block"
                @click="submitFrom"
              >
                登 录
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { SET_USER_INFO } from "store/actions/type";
export default {
  data() {
    return {
      formData: {
        account: "",
        password: "",
      },
      rememberPassword: false,
    };
  },
  created() {
    this.$nextTick(function () {
      if (
        !window.ActiveXObject &&
        !!document.createElement("canvas").getContext
      ) {
        /*开发
          $.getScript("src/assets/js/cav.js",
            function () {
              $.getScript("src/assets/js/getStart.js")
            })
	  */
        /*线上*/ $.getScript("/static/cav.js", function () {
          $.getScript("/static/getStart.js");
        });
      }
    });
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO,
    }),
    submitFrom() {
      if (this.formData.account == "") {
        this.showTip("用户名不能为空", false);
        return;
      }
      if (this.formData.formData == "") {
        this.showTip("密码不能为空", false);
        return;
      }
      this.$ajax.get("User/Login", { params: this.formData }).then((res) => {
        if (res.data.code == 1) {
          let treedata = res.data.result;
          this.$ajax
            .get(`Organization/Detail/${res.data.result.organizationid}`)
            .then((res) => {
              if (res.data.code == 1) {
                let freeswtichdata = {
                  VertoID: res.data.result.vertoid,
                  VoiceCallID: res.data.result.voicecallid,
                  MeetingID: res.data.result.meetingid,
                  BroadID: res.data.result.broadid,
                  AlarmID: res.data.result.alarmid,
                  RollCallID: res.data.result.rollcallid
                };
                this.set_user_info({
                  user: treedata,
                  freeswitchData: freeswtichdata,
                  login: true,
                });
                this.showTip("登录成功", true);
                setTimeout(this.$router.push({ path: "/" }), 2000);
              }
            });
        } else {
          this.showTip("账号或密码错误", false);
        }
      });
    },
    showTip(tipContent, tipType) {
      tipType? this.$message.success(tipContent) : this.$message.error(tipContent)
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
.login {
  width: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  .userInfoInput {
    padding: 0px 20px 20px 20px;
  }
  .userImg {
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-color: #1184b0;
    padding: 2px;
    margin: 20px auto;
    float: none;
    img {
      width: 76px;
      height: 76px;
      border-radius: 100%;
      margin: 0 auto;
    }
  }
  .loginLogo {
    width: 80%;
    margin: 15px auto;
    img {
      width: 100%;
    }
  }
}
</style>
