<template>
  <div class="openTreeList" @click="open">
    <i class="fa fa-chevron-right" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  methods: {
    open() {
      $(".orgTreeList").removeClass("treeListHide").addClass("treeListShow");
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
