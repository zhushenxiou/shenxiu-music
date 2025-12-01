<template>
  <el-container class="layout">
    <!-- 固定侧边栏 -->
    <el-aside class="fixed-aside">
      <Aside />
    </el-aside>

    <!-- 右侧内容区域 -->
    <el-container class="right-container">
      <!-- 固定头部 -->
      <el-header class="fixed-header">
        <Header />
      </el-header>

      <!-- 可滚动主内容 -->
      <el-main class="scrollable-main">
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </RouterView>
      </el-main>
    </el-container>

    <!-- 固定底部播放器 -->
    <el-footer class="fixed-footer">
      <FootPlayer />
    </el-footer>

    <!-- 回到顶部按钮 -->
    <el-backtop target=".scrollable-main" :bottom="120"></el-backtop>
  </el-container>
</template>


<script setup lang="ts">
import Header from "./Header/index.vue";
import Aside from './Aside/index.vue'
import FootPlayer from './FootPlayer/index.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style lang="less">
.layout {
  // 固定侧边栏
  .fixed-aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 12rem;
    height: 100vh;
    overflow-y: auto;
    z-index: 1000;
  }

  // 右侧内容区域
  .right-container {
    margin-left: 12rem; // 避开侧边栏
    width: calc(100% - 12rem);
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  // 固定头部样式
  .fixed-header {
    position: static;
    height: 60px;
    z-index: 1000;
    padding: 0;
  }

  // 可滚动主内容
  .scrollable-main {
    height: calc(100vh - 120px); // 总高度减去头部和底部
    overflow-y: auto;
    padding: 16px;
    margin: 0;
    width: 100%;
    background: #f7f9fc;
  }

  // 固定底部
  .fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1000;
    padding: 0;
  }
}
</style>
