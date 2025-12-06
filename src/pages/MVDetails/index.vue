<template>
  <!-- 视频详情页 -->
  <div class="flex w-full" v-loading="isLoading">
    <!-- 主体内容 -->
    <div class="w-[65vw] pr-6 border-r-2 border-gray-300">
      <div class="text-lg font-semibold mb-2.5">视频详情</div>

      <!-- 视频播放组件 -->
      <VideoPlayer width="100%" :poster="videoDetails.cover" :sources="sources"
        :autoplay="false" />

      <!-- 作者 -->
      <div class="flex w-full my-4">
        <div class="flex items-center mx-2 cursor-pointer" v-for="ar in videoDetails.artists" :key="ar.id"
          @click="toSingerDetails(ar.id)">
          <div class="img">
            <img :src="ar.img1v1Url" alt="" class="w-12 h-12 rounded-full" />
          </div>
          <div class="ml-2 text-gray-600 text-sm">{{ ar.name }}</div>
        </div>
      </div>

      <!-- 标题/发布日期/播放量/操作 -->
      <div class="text-xl font-semibold mb-2.5">{{ videoDetails.name }}</div>
      <span class="mr-12 text-sm text-gray-500">发布：{{ videoDetails.publishTime }}</span>
      <span class="mr-12 text-sm text-gray-500">播放量：{{ (videoDetails.playCount / 10000).toFixed(1) }}万</span>

      <div class="flex mt-4">
        <div
          class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
          <i class="iconfont mr-1">&#xe608;</i>赞
        </div>
        <div
          class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
          <i class="iconfont mr-1">&#xe60c;</i>收藏
        </div>
        <div
          class="border border-gray-200 px-4 py-1.5 rounded-full text-sm mr-4 cursor-pointer hover:bg-red-400 hover:text-white transition-colors">
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mvDetailsApi, mvUrlApi, reletedMvApi } from '@/api/mv'
import CComments from '@/components/common/CComments.vue'
import CReletedMV from './components/ReletedMV.vue'
// 引入封装的video.js组件
import VideoPlayer from '@/components/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id)
const isLoading = ref(true)

// 视频详细信息
const videoDetails = ref<any>({
  name: '',
  cover: '',
  artists: [],
  publishTime: '',
  playCount: 0
})

// 视频清晰度资源url列表
const sources = ref<Array<{ definition: string; url: string }>>([
  { definition: '1080P', url: '' },
  { definition: '720P', url: '' },
  { definition: '480P', url: '' }
])

// 相关推荐mv
const reletedMV = ref<any>([])

async function getData() {
  isLoading.value = true
  const [details, reletedRes, urlRes1080, urlRes720, urlRes480]: any = await Promise.all([
    mvDetailsApi(id.value),
    reletedMvApi(id.value),
    mvUrlApi(id.value, 1080),
    mvUrlApi(id.value, 720),
    mvUrlApi(id.value, 480),
  ])
  // 视频详情数据
  videoDetails.value = details.data
  // 相关推荐mv数据
  reletedMV.value = reletedRes.mvs
  // 更新清晰度列表地址
  sources.value = [
    { definition: '1080P', url: urlRes1080.data.url },
    { definition: '720P', url: urlRes720.data.url },
    { definition: '480P', url: urlRes480.data.url }
  ]
  console.log(sources.value)
  isLoading.value = false
}

function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id }
  })
}

getData()
</script>
