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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}

img {
  vertical-align: top;
  border: none;
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
}

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

// 清除浮动
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

// 图片加载失败
.el-image {
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
  }
}

// 美化进度条
.el-slider {
  width: 100%;
  --el-slider-main-bg-color: #ff4040;
  --el-slider-button-size: 0.8rem;
}

// 美化 回到顶部
.el-backtop i {
  color: #ec4141;
}

.el-backtop:hover {
  background-color: #fdf5f5;
}

// 美化抽屉
.el-drawer.rtl {
  height: calc(100vh - 60px);
}

.el-drawer.rtl .el-drawer__body,
.el-drawer.btt .el-drawer__body {
  padding: 0;
}

.el-drawer.rtl .el-drawer__body::-webkit-scrollbar {
  width: 5px;
}


// 美化滚动条
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  width: 4px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  // background-color: rgba(217, 221, 230, 0.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
  transition: background-color .3s;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, .3);
}

// 美化tab标签
.el-tabs {
  .el-tabs__nav-wrap {

    .el-tabs__item {
      font-size: 14px;

      &:hover {
        color: black;
      }
    }

    .el-tabs__active-bar {
      background-color: #e13e3e;
      height: 0.2rem;
    }

    .is-active {
      font-size: 16px;
      font-weight: bolder;
      color: black;
    }

    &::after {
      background-color: white;
    }
  }
}
</style>
