<template>
  <aside class="w-full h-full bg-[--aside-bg-color]">
    <!-- logo -->
     <div class="flex items-center justify-center h-[60px]">
       <span class="text-lg text-center font-bold">神秀云音乐</span>
     </div>
    <!-- 菜单组件 -->
    <el-menu :default-active="activeMenu">
      <el-menu-item
        v-for="menu of menus"
        :key="menu.name"
        :index="menu.path"
        @click="selectMenu(menu)"
      >
        <!-- 图标 -->
        <i class="iconfont" v-html="menu.icon"></i>
        <!-- 菜单文字 -->
        <span>{{ menu.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
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

function selectMenu(menu: { path: string; name: string }) {
  if (
    (menu.name == 'myMusic' || menu.name == 'dailyRecommend') &&
    !localStorage.getItem('cookie')
  ) {
    ElMessage.warning('该页面需要登录才能访问')
    return
  }
  // 登录用户的个人用户详情页
  if (menu.name == 'myMusic' && localStorage.getItem('cookie')) {
    router.push(menu.path + '/' + userStore.userInfo.userId)
    return
  }
  // 其他跳转
  router.push(menu.path)
}

</script>

<style lang="less">
.el-menu {
  width: 100%;
  background: var(--aside-bg-color);
  border-right: none !important;

  .el-menu-item {
    height: 48px;
    line-height: 48px;
    color: #333;
    transition: background 0.2s ease;

    i {
      margin-right: 12px;
      font-size: 18px;
    }

    span {
      font-size: 14px;
    }

    &:hover {
      background: #f5f5f5;
    }

    &.is-active {
      color: #e13e3e !important;
      background: #fde2e2;
      font-weight: 500;
      position: relative;
    }
  }

  .el-menu-item-group {
    margin: 16px 0;

    &__title {
      padding: 0 20px;
      color: #666;
      font-size: 12px;
      font-weight: 500;
    }

    .el-menu-item {
      height: 40px;
      line-height: 40px;
      font-size: 13px;
      color: #666;

      span:first-child {
        display: inline-block;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

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
