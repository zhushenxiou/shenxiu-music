<template>
  <!-- 视频详情页 -->
  <div class="flex w-full" v-loading="isLoading">
    <!-- 主体内容 -->
    <div class="w-[65vw] pr-6 border-r-2 border-gray-300">
      <div class="text-lg font-semibold mb-2.5">视频详情</div>
      <!-- 视频 -->
      <video :src="videoUrl" controls :poster="videoDetails.cover" class="w-full mb-4"></video>
      <!-- 作者 -->
      <div class="flex w-full mb-4">
        <div class="flex items-center mx-2 cursor-pointer" v-for="ar in videoDetails.artists" :key="ar.id" @click="toSingerDetails(ar.id)">
          <div class="img">
            <img :src="ar.img1v1Url" alt="" class="w-12 h-12 rounded-full" />
          </div>
          <div class="ml-2 text-gray-600 text-sm">{{ ar.name }}</div>
        </div>
      </div>
      <!-- 标题 -->
      <div class="text-xl font-semibold mb-2.5">{{ videoDetails.name }}</div>
      <!-- 发布日期 -->
      <span class="mr-12 text-sm text-gray-500">发布：{{ videoDetails.publishTime }}</span>
      <!-- 播放量 -->
      <span class="mr-12 text-sm text-gray-500">播放：{{ (videoDetails.playCount / 10000).toFixed(1) }}万</span>
      <!-- 操作 -->
      <div class="flex mt-4">
        <!-- 赞 -->
        <div class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500">
          <i class="iconfont mr-1">&#xe608;</i>赞
        </div>
        <!-- 收藏 -->
        <div class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500">
          <i class="iconfont mr-1">&#xe60c;</i>收藏
        </div>
        <!-- 分享 -->
        <div class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-400">
          <i class="iconfont mr-1">&#xe624;</i>分享
        </div>
      </div>
      <!-- MV评论 -->
      <CComments :type="'mv'" :id="id" />
    </div>
    <!-- 相关推荐 -->
    <CReletedMV :mv-data="reletedMV" class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { mvDetailsApi, mvUrlApi, reletedMvApi } from '@/api/mv'
import CComments from '@/components/common/CComments.vue'
import CReletedMV from './components/ReletedMV.vue'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id)

const isLoading = ref(true)

// 视频详细信息
const videoDetails = ref<any>({
  name: '',
  cover: ''
})
// 视频URL
const videoUrl = ref()
// 相关推荐mv
const reletedMV = ref()

async function getData() {
  isLoading.value = true
  // 获取视频详情
  const details: any = await mvDetailsApi(id.value)
  videoDetails.value = details.data
  // 获取视频URL
  const urlRes: any = await mvUrlApi(id.value)
  videoUrl.value = urlRes.data.url
  // 获取相关MV推荐
  const reletedRes: any = await reletedMvApi(id.value)
  reletedMV.value = reletedRes.mvs
  isLoading.value = false
}

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: {
      id,
    },
  })
}
getData()
</script>


