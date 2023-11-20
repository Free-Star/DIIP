<template>
  <div class="openList" @click="open">
    <i class="fa fa-chevron-left" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  methods: {
    open() {
      $(".playList").removeClass("ListHide").addClass("ListShow");
    },
  },
};
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
</style>
