<template>
  <div class="discover">
    <!-- 选择标签 -->
    <Tabs :tabs="tabs" />
    <!-- Vue3中的 keep-alive让路由组件不被销毁使用方式的变化 -->
    <!-- 1. 缓存按路由区分：同一个组件被多个路由复用（如不同 id 的详情页）时，每条路径单独缓存一份 -->
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@/components/Tabs/index.vue'

const tabs = [
  {
    label: '个性推荐',
    name: 'recommend',
    path: '/discover/recommend',
  },
  {
    label: '发现歌单',
    name: 'discoverPlaylist',
    path: '/discover/discoverPlaylist',
  },
  {
    label: '排行榜',
    name: 'rank',
    path: '/discover/rank',
  },
  {
    label: '发现歌手',
    name: 'discoverSinger',
    path: '/discover/discoverSinger',
  },
]
</script>
