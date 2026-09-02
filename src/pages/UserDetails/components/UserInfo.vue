<template>
  <!-- 用户信息 -->
  <div class="flex px-4 w-full mb-8" v-loading="loading">
    <div class="h-48 w-48 rounded-full overflow-hidden shrink-0">
      <el-image :src="userInfo.avatarUrl" fit="cover" class="w-full h-full" />
    </div>
    <div class="ml-8 flex-1 min-w-0">
      <!-- 基本信息 -->
      <div class="flex items-center pl-4">
        <div class="text-2xl font-semibold mr-4">{{ userInfo.nickname }}</div>
        <div
          class="text-[13px] w-[2.2rem] h-[1.2rem] leading-[1.2rem] rounded-[10px] text-center bg-[#ccc]"
        >
          Lv.{{ userInfo.level }}
        </div>
      </div>
      <el-divider />
      <!-- 用户数据 -->
      <div class="flex mb-4">
        <div
          class="border-r border-[#ddd] text-center px-3 cursor-pointer hover:text-[#ec4141] transition-transform"
          @click="emit('relation', 'follows')"
        >
          <div class="text-md font-bold">关注 {{ userInfo.follows }}</div>
        </div>
        <div
          class="text-center px-3 cursor-pointer hover:text-[#ec4141] transition-transform"
          @click="emit('relation', 'followeds')"
        >
          <div class="text-md font-bold">粉丝 {{ userInfo.followeds }}</div>
        </div>
      </div>
      <!-- 简介 -->
      <div class="pl-2 text-md mb-2">
        简介：<span class="text-[#444]">{{ userInfo.signature }} </span>
        <span v-if="!userInfo.signature" class="text-[#444]">暂无个人介绍</span>
      </div>
      <!-- 用户 id -->
      <div class="pl-2 text-xs mb-2">
        用户ID：<span class="text-[#444]">{{ userInfo.userId }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfileType } from '@/api/types'

defineProps<{
  userInfo: UserProfileType
  loading?: boolean
}>()

// 点击关注/粉丝，交由父组件处理（打开对应弹窗）
const emit = defineEmits<{
  (e: 'relation', type: 'follows' | 'followeds'): void
}>()
</script>
