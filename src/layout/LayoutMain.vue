<template>
  <el-container class="layout">
    <!-- 固定头部 -->
    <el-header class="fixed-header">
      <Header />
    </el-header>

    <!-- 主体容器 -->
    <el-container class="main-container">
      <!-- 固定侧边栏 -->
      <el-aside class="fixed-aside">
        <Aside />
      </el-aside>

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
  // 固定头部样式
  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1000; // 确保在最上层
    padding: 0;
  }

  // 主体容器（避开头部和底部）
  .main-container {
    margin-top: 60px; // 避开头部
    margin-bottom: 60px; // 避开底部播放器
    width: 100%;
    height: calc(100vh - 120px); // 总高度减去头尾
  }

  // 固定侧边栏
  .fixed-aside {
    position: fixed;
    top: 60px; // 位于头部下方
    left: 0;
    width: 10rem;
    height: calc(100vh - 120px); // 高度减去头尾
    overflow-y: auto;
    z-index: 999;
  }

  // 可滚动主内容
  .scrollable-main {
    margin-left: 10rem; // 避开侧边栏
    width: calc(100% - 10rem);
    height: 100%;
    overflow-y: auto;
    padding: 16px;
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
