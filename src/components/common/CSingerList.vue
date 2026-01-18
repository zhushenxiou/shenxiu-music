<template>
  <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
    <div v-for="item in singerlist" :key="item.id"
      class="relative cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105"
      @click="toSingerDetails(item.id)">
      <div class="w-full aspect-square overflow-hidden">
        <el-image :src="optimizeImageUrl(item.picUrl, 250, 250)" fit="cover" class="w-full h-full" lazy>
          <template #placeholder>
            <div class="image-slot">加载中<span class="dot">...</span></div>
          </template>
        </el-image>
      </div>
      <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2">
        <span class="block h-[1.5rem] text-center text-sm">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { optimizeImageUrl } from '@/utils/img'

const { singerlist } = defineProps(['singerlist'])

const router = useRouter()

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id },
  })
}
</script>
