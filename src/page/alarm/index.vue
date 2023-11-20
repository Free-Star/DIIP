<script src="../../utils/page/meeting.js"></script>
<template>
  <div>
    <left-phone :select-phone="selectPhone" @reset="reset"></left-phone>
    <div ref="conf" class="middleCon">
      <video height="700" id="webcam" autoplay="autoplay" class="video"></video>
    </div>
    <right-phone></right-phone>
    <device-list></device-list>
    <switchs></switchs>
  </div>
</template>

<script>
import parseXML from "utils/xml_parser";
import { mapGetters, mapActions } from "vuex";
import { getHeight } from "utils/height";
import { getHeights, itemClick } from "utils/page/voiceCall";
import { GET_USER_INFO } from "store/getters/type";
import { leftPhone, rightPhone, deviceList, switchs } from "components";

export default {
  components: {
    leftPhone,
    rightPhone,
    deviceList,
    switchs,
  },
  data() {
    return {
      selectPhone: [],
      verto: "",
    };
  },
  created() {
    this.$nextTick(function () {
      getHeight();
      getHeights();
      this.height = this.$refs.conf.offsetHeight;
      this.verto = this.get_user_info.freeswitchData.VertoID;
      this.refresh();
    });
  },
  computed: {
    ...mapGetters({
      dialogShow: "dialogShow",
      callQueue: "callQueue",
      vertoHandle: "vertoHandle",
      group_users: "group_users",
      users: "users",
      deviceList: "deviceList",
      currentLoginUser: "currentLoginUser",
      userGroup: "userGroup",
      get_user_info: GET_USER_INFO,
      alarm_address: "alarmAddress",
      selectPhonex: "selectPhonex",
    }),
  },
  methods: {
    refresh() {
      this.$store.dispatch("setSelectPhonex", null);
    },
    // 获取设备分组数据
    reset() {},
    clear() {
      let apiKey = this.alarm_address.split("/")[3];
      let groupKey = this.alarm_address.split("/")[5];
      let groupName = this.alarm_address.split("/")[6];
      let startUrl =
        "https://nvr.yuqi.com:8432/" + apiKey + "/monitor/" + groupKey;
      this.$ajax.get(startUrl).then((res) => {
        if (res.status == 200) {
          let axios = [];
          res.data.forEach((re) => {
            let parsed = JSON.parse(re.details).groups_name;
            if (
              re.mode == "start" &&
              parsed
                .slice(1, parsed.length - 1)
                .split(",")
                .some((item) => {
                  return item == '"' + groupName + '"';
                })
            )
              axios.push(
                this.$ajax.get(
                  "https://nvr.yuqi.com:8432/" +
                    apiKey +
                    "/monitor/" +
                    groupKey +
                    "/" +
                    re.mid +
                    "/stop"
                )
              );
          });
          this.$ajax.all(axios).then((res) => {
            res.forEach((element) => {});
          });
        }
      });
      this.$store.dispatch("setAlarmAddress", "");
    },
  },
  beforeRouteLeave(to, form, next) {
    next()
  }
};
</script>

<style scoped>
iframe {
  background-color: transparent;
  border: none;
}
.video{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height:100%;
}
</style>
