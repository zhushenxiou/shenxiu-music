<template>
  <!-- 封装分页 -->
  <div class="pagination">
    <el-pagination background v-model:currentPage="pageInfo.curPage as number" layout="prev, pager, next"
      :total="pageInfo.total" :page-size="pageInfo.pageSize" @current-change="handleChange" />
  </div>
</template>

<script setup lang="ts">
const { pageInfo, handleChange } = defineProps(['pageInfo', 'handleChange'])
</script>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}
</style>
