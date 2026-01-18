<template>
  <!-- 封装歌单/专辑列表显示 -->
  <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
    <div
      v-for="item in playlists"
      :key="item.id"
      class="relative cursor-pointer font-black overflow-hidden transition-transform duration-300 hover:scale-105"
      @click="toDetailsPage(item.id)"
    >
      <!-- 图片部分 -->
      <div class="w-full aspect-square overflow-hidden">
        <el-image :src="optimizeImageUrl(item.picUrl, 250, 250)" class="w-full h-full object-cover" lazy>
          <template #placeholder>
            <div class="w-full h-full flex items-center justify-center bg-gray-100">
              加载中<span class="dot">...</span>
            </div>
          </template>
        </el-image>
      </div>

      <!-- 歌单介绍 -->
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2">
        <span class="text-sm font-medium line-clamp-2 block h-[2.5rem]">{{ item.name }}</span>
      </div>

      <!-- 播放量 -->
      <div v-if="item.playCount" class="absolute top-2 right-2 text-white text-md font-black">
        {{ formatPlayCount(item.playCount) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatPlayCount } from '@/utils/format'
import { optimizeImageUrl } from '@/utils/img'

const router = useRouter()
const { playlists, type } = defineProps(['playlists', 'type'])

function toDetailsPage(id: number) {
  // 传入album跳转albumDetails，否则都跳转playlistDetails
  router.push({
    name: type == 'album' ? 'albumDetails' : 'playlistDetails',
    params: { id },
  })
}
</script>
