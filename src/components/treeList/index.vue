<template>
  <div class="orgTreeList">
    <div class="listTitle">组织机构列表</div>
    <tree @click="click"></tree>
    <i class="fa fa-chevron-left" aria-hidden="true" @click="close"></i>
  </div>
</template>

<script>
import tree from "./tree.vue";
import { getHeights } from "utils/page/ipBroad";
export default {
  components: { tree },
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
      $(".orgTreeList").removeClass("treeListShow").addClass("treeListHide");
    },
    removeAll() {
      $("#end").html("");
    },
    click() {
      this.$emit("refresh");
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
