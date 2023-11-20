<template>
  <!--弹窗们-->
  <div class="popUp" id="hasNum">
    <p>确定将呼叫转移到{{ phoneNum }}上吗？</p>
    <div class="btn">
      <button type="button" class="btn btn-info">确定</button>
      <button type="button" class="btn btn-default" @click="hide">取消</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      phoneNum: "phoneNum",
    }),
  },
  methods: {
    hide() {
      this.$store.dispatch("CallDivert", false);
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
