<template>
  <div class="playList">
    <i class="fa fa-chevron-right" aria-hidden="true" @click="close"></i>
    <div class="listTitle">播放设备列表</div>
    <div class="musicList" id="end">
      <div v-for="item in selectPhone" class="singleFlies selectDelate">
        {{ item }}
      </div>
    </div>
    <div class="selectAll" @click="removeAll">全部移除</div>
  </div>
</template>

<script>
import { getHeights } from "utils/page/ipBroad";
export default {
  props: ["selectPhone"],
  created() {
    this.$nextTick(function () {
      getHeights();
    });
  },
  watch: {
    selectPhone: function () {
      this.selectPhone;
      debugger;
    },
  },
  methods: {
    close() {
      $(".playList").removeClass("ListShow").addClass("ListHide");
    },
    removeAll() {
      $("#end").html("");
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
