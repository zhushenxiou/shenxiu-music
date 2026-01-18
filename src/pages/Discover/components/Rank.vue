<template>
  <div class="rank relative" v-loading="loading">
    <!-- 官方榜 -->
    <div class="official mb-4">
      <div class="title flex justify-center mb-4 leading-[22px] text-[22px] font-bold cursor-default">官 方 榜</div>
      <div class="content grid grid-cols-2">
        <div
          class="item h-[150px] border border-gray-200 rounded-2xl m-4 flex cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
          v-for="item in officialToplist"
          :key="item.id"
          @click="toPlaylistDetails(item.id)"
        >
          <!-- 图片 -->
          <el-image :src="item.coverImgUrl" alt="" class="h-full rounded-2xl" />
          <!-- 展示前三首歌 -->
          <div class="songs h-full w-[70%] ml-2">
            <div class="song h-[33.3%] w-full no-ellipsis" v-for="(song, index) in item.tracks" :key="song.first">
              <span class="text-xs text-gray-700 ml-2 leading-[3rem]">{{ Number(index) + 1 }}</span>
              <!-- 歌名 -->
              <span class="text-sm ml-2 leading-[3rem] hover:text-red-500 hover:border-b hover:border-red-500 no-ellipsis">{{ song.first }}</span>
              <!-- 歌手 -->
              <span class="text-xs text-gray-700 mr-2 leading-[3rem] float-right hidden lg:inline-block">{{ song.second.slice(0, 10) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 全球榜 -->
    <div class="global">
      <div class="title flex justify-center mb-4 leading-[22px] text-[22px] font-bold cursor-default">全 球 榜</div>
      <div class="content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <div
          class="item text-center m-4 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
          v-for="item in globalToplist"
          :key="item.id"
          @click="toPlaylistDetails(item.id)"
        >
          <el-image :src="item.coverImgUrl" alt="" class="w-full rounded-2xl">
            <template #placeholder>
              <div class="image-slot flex justify-center items-center">加载中<span class="dot">...</span></div>
            </template>
          </el-image>
          <span class="text-[13px] hover:text-red-500 hover:border-b hover:border-red-500">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { toplistApi } from '@/api/discovery'

const router = useRouter()

const loading = ref(true)
const officialToplist = ref()
const globalToplist = ref()

async function getToplist() {
  loading.value = true
  const res: any = await toplistApi()
  // 前4个是官方榜,后面是全球榜
  officialToplist.value = res.list.slice(0, 4)
  globalToplist.value = res.list.slice(4)
  loading.value = false
}

function toPlaylistDetails(id: number) {
  console.log(id)
  router.push({
    name: 'playlistDetails',
    params: {
      id,
    },
  })
}

getToplist()
</script>
