<template>
  <div>
    <div id="media">
      <!-- <video width="800" id="webcam" autoplay="autoplay" hidden="true"></video> -->
    </div>
    <div class="content padding">
      <ul class="nav nav-justified choose">
        <router-link
          v-for="item in routerList"
          :key="item.path"
          tag="li"
          active-class="on"
          :to="item.path"
        >
          {{ item.name }}
        </router-link>
      </ul>
      <div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import routes from "router";
import { getHeight } from "utils/height";
import { getHeights } from "utils/page/systemAdmin";
export default {
  data() {
    return {
      routerList: [],
    };
  },
  created() {
    this.$nextTick(function () {
      let routerList = routes.options.routes[2].children;
      routerList.forEach((r, i) => {
        if (r.name === "系统管理") {
          this.routerList = r.children;
        }
      });
      getHeight();
      getHeights();
      $(".orgTreeList").removeClass("treeListShow").addClass("treeListHide");
    });
  },
  watch: {
    /*   'currentView': function() {
          this.$nextTick(function() {
            getHeight()
            getHeights()
          })
        } */
  },
  methods: {
    toggle(i, v) {
      this.active = i;
      this.currentView = v;
    },
    tabClick(e) {
      this.tabName = e.target.innerText;
    },
  },
};
</script>

<style scoped>
</style>
