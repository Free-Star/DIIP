<template>
  <div class="block">
    <el-pagination
      @size-change="handleSize"
      @current-change="handleCurrent"
      :current-page.sync="pageData.pageIndex"
      :page-size="pageData.pageSize"
      layout="total, prev, pager, next"
      :total="pageData.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["pageData"]),
  },
  
  methods: {
    ...mapActions(["handleCurrent", "handleSize"]),
  },
};
</script>

<style lang="scss">
.block {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
