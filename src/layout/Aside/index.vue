<template>
  <!-- 菜单组件 -->
  <el-menu :default-active="activeMenu" bg-color="red">
    <el-menu-item v-for="menu of menus" :key="menu.name" :index="menu.path" @click="selectMenu(menu)">
      <!-- {{}}和v-text都是文本，v-html才是标签 -->
      <i class="iconfont" v-html="menu.icon"></i>
      <span>{{ menu.label }}</span>
    </el-menu-item>
    <el-menu-item-group title="创建的歌单" v-show="userStore.createdPlaylist.length">
      <el-menu-item v-for="(playlist, index) in userStore.createdPlaylist" :index="`/playlistDetails/${playlist.id}`"
        @click=" toPlaylistDetails(playlist.id)" :key="index">
        <i class="iconfont">&#xe80f;</i>
        {{ (index == 0 ? "我喜欢的音乐" : playlist.name.slice(0, 5)) }}
        <span v-if="playlist.name.length >= 5 && index != 0">...</span>
      </el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="收藏的歌单" v-show="userStore.subscribedPlaylist.length">
      <el-menu-item v-for="playlist, index in userStore.subscribedPlaylist" :index="`/playlistDetails/${playlist.id}`"
        @click="toPlaylistDetails(playlist.id)" :key="index">
        <i class="iconfont">&#xe80f;</i>
        {{ playlist.name.slice(0, 5) }}
        <span v-if="playlist.name.length >= 5">...</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menus = [
  { name: 'discover', label: '发现', icon: '&#xe609;', path: '/discover/recommend' },
  { name: 'video', label: '视频', icon: '&#xe9f0;', path: '/video' },
  { name: 'dailyRecommend', label: '每日推荐', icon: '&#xe608;', path: '/dailyRecommend' },
  { name: 'myMusic', label: '我的', icon: '&#xe601;', path: '/userDetails' },
]

// 动态计算当前激活的菜单
const activeMenu = computed(() => {
  if (route.path.startsWith('/discover')) return '/discover/recommend'
  if (route.path.startsWith(`/userDetails/${userStore.userInfo.userId}`)) return '/userDetails'
  return route.path // 直接返回当前路由路径
})

function selectMenu(menu: { path: string, name: string }) {
  if ((menu.name == 'myMusic' || menu.name == 'dailyRecommend')
    && !localStorage.getItem('cookie')) {
    ElMessage.warning('该页面需要登录才能访问')
    return;
  }
  // 登录用户的个人用户详情页
  if (menu.name == 'myMusic' && localStorage.getItem('cookie')) {
    router.push(menu.path + '/' + userStore.userInfo.userId)
    return;
  }
  // 其他跳转
  router.push(menu.path)
}

function toPlaylistDetails(id: number) {
  router.push({
    name: 'playlistDetails',
    params: { id }
  })
}
</script>

<style lang="less">
@menu-primary-color: #e13e3e; // 主色调
@text-primary: #333; // 主要文字颜色
@text-secondary: #666; // 次级文字颜色
@hover-bg: #f5f5f5; // 悬停背景
@transition-duration: 0.3s; // 过渡动画时长

.el-menu {
  width: 100%;
  // height: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  background-color: #fff !important;
  border-right: none !important;

  // 统一菜单项样式
  .el-menu-item {
    height: 48px;
    line-height: 48px;
    color: @text-primary;
    transition: all @transition-duration ease;

    i {
      margin-right: 12px;
      font-size: 18px;
      vertical-align: middle;
    }

    span {
      font-size: 14px;
      vertical-align: middle;
    }

    &:hover {
      background: @hover-bg;
      padding-left: 12px !important;
    }

    // 激活状态样式
    &.is-active {
      color: @menu-primary-color !important;
      background: lighten(@menu-primary-color, 40%);
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: @menu-primary-color;
      }
    }
  }

  // 歌单分组样式
  .el-menu-item-group {
    margin: 16px 0;

    &__title {
      padding: 0 20px;
      color: @text-secondary;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .el-menu-item {
      height: 40px;
      line-height: 40px;
      font-size: 13px;
      color: @text-secondary;

      // 歌单名称截断
      span:first-child {
        display: inline-block;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
      }

      // 移除默认激活样式
      &.is-active {
        background: transparent;

        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
