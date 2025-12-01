<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header>
    <!-- 页面向前跳转 -->
    <div class="pageSkip">
      <el-button :icon="ArrowLeft" circle @click="router.back()" />
    </div>
    <!-- 搜索模块 -->
    <div class="search">
      <Search />
    </div>
    <!-- 登录模块 -->
    <div class="toLogin">
      <ToLogin />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import Search from './components/Search.vue'
import ToLogin from './components/ToLogin.vue'

const router = useRouter()
</script>

<style lang="less" scoped>
header {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  background: var(--header-bg-color);
  padding: 0 40px;
  position: relative;
  z-index: 1000;

  .pageSkip {
    margin-right: 12px;

    .el-button {
      background: transparent;
      border: 1px solid #e5e7eb;
      color: #333;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      :deep(svg) {
        width: 1.2em;
        height: 1.2em;
      }
    }
  }

  .search {
    flex: 1;
    max-width: 400px;
    margin-right: 20px;
  }

  .toLogin {
    margin-left: auto;
  }
}
</style>
