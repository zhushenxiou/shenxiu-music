<template>
  <!-- 相关推荐MV组件 -->
  <div class="px-6 pr-4 w-full">
    <!-- 标题 -->
    <div class="text-lg font-semibold mb-4">相关推荐</div>
    <div
      class="cursor-pointer relative mb-4"
      v-for="mv in mvData"
      :key="mv.id"
      @click="toVideoDetails(mv.id)"
    >
      <div class="absolute flex right-4 top-2 z-10 text-gray-200">
        <i class="iconfont mr-1">&#xe606;</i>
        <span>{{ (mv.playCount / 10000).toFixed(1) }}万</span>
      </div>
      <el-image :src="mv.cover" class="w-full rounded-xl">
        <template #placeholder>
          <div class="image-slot">加载中<span class="dot">...</span></div>
        </template>
      </el-image>
      <div class="name">
        <span class="block text-center text-sm pb-2">{{ mv.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { PropType } from 'vue'

const router = useRouter()
const { mvData } = defineProps({
  mvData: {
    type: Array as PropType<
      {
        id: number // MV ID
        name: string // MV 名称
        cover: string // MV 封面
        playCount: number // MV 播放量
      }[]
    >,
    default: () => [],
  },
})

function toVideoDetails(id: number) {
  router.push({
    name: 'videoDetails',
    params: { id },
  })
}
</script>
