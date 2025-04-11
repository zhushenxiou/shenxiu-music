<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header>
    <!-- LOGO -->
    <div class="logo">
      <span>神秀云音乐</span>
    </div>
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
import { ArrowLeft, } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import Search from './components/Search.vue';
import ToLogin from './components/ToLogin.vue';

const router = useRouter()

</script>

<style lang="less" scoped>
header {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ec4141 0%, #d33737 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  position: relative;
  z-index: 1000;

  .logo {
    margin-right: 15px;
    transition: all 0.3s ease;

    span {
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 1px;
      color: rgba(243, 234, 234, 0.9);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
      display: inline-block;
      transition: transform 0.3s ease;

      // 渐变文字效果（可选）
      &::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.3) 100%);
        transform-origin: right;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      &:hover {
        transform: translateY(-1px);

        &::after {
          transform-origin: left;
          transform: scaleX(1);
        }
      }
    }
  }

  .pageSkip {
    margin-right: 16px;

    .el-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: scale(0.95);
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
    margin-right: 24px;
  }

  .toLogin {
    margin-left: auto;
  }

  // 分割线效果
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0) 100%);
  }
}
</style>
