<template>
  <div>
    <header>
      <div class="user">
        <span @click="returnSystem()">
          <i class="fa fa-reply"></i> 返回系统
        </span>
      </div>
      <div class="sysName">
        <div><i class="fa fa-cogs"></i>系统管理</div>
      </div>
      <ul class="settingMenu">
        <router-link
          v-for="item in routerList"
          :key="item.path"
          tag="li"
          active-class="selected"
          :to="item.path"
        >
          <div>{{ item.name }}</div>
        </router-link>
      </ul>
    </header>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script>
import routes from "router";
export default {
  data() {
    return {
      routerList: [],
    };
  },
  created() {
    this.$nextTick(function () {
      let router = routes.options.routes;
      router.forEach((r, i) => {
        if (r.name === "系统设置") {
          this.routerList = r.children.filter(obj => obj.name !== "路由管理");
        }
      });
    });
  },
  methods: {
    returnSystem() {
      this.$router.push("/");
      //window.location.reload()
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
  background: #4e545a;
}
.content {
  overflow-y: auto;
}
::-webkit-scrollbar-button {
}
::-webkit-scrollbar-track {
}
::-webkit-scrollbar-track-piece {
}
::-webkit-scrollbar-thumb {
  background: #6f7882;
  border-radius: 5px;
}

::-webkit-scrollbar-corner {
}
::-webkit-resizer {
}
</style>
