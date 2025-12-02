<template>
  <!-- 封装歌手列表 -->
  <div
    class="singerlist mt-4 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
  >
    <el-card
      shadow="hover"
      :body-style="{ padding: '0rem' }"
      class="item m-[0.7rem] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 rounded-2xl"
      v-for="item in singerlist"
      :key="item.id"
      @click="toSingerDetails(item.id)"
    >
      <!-- 歌手头像 -->
      <el-image :src="item.img1v1Url" class="h-full min-h-[10rem] w-full">
        <template #placeholder>
          <div class="image-slot">加载中<span class="dot">...</span></div>
        </template>
      </el-image>
      <!-- 歌手名字 -->
      <div class="name">
        <span class="block h-[1.5rem] text-center text-sm">{{ item.name }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const { singerlist } = defineProps(['singerlist'])

const router = useRouter()

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id },
  })
}
</script>
