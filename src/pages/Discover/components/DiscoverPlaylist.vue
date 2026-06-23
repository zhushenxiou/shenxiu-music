<template>
  <div class="discoveryPlaylist">
    <!-- 歌单分类 -->
    <div class="category">
      <!-- 热门标签 -->
      <div class="hotCategory">
        <el-button color="#ed5736" plain v-for="(h, index) in hotTag" :key="index" @click="changeHotCategory(index)">
          <span>{{ h.name }}</span>
        </el-button>
      </div>
    </div>
    <div class="w-full" v-loading="loading">
      <!-- 歌单列表 -->
      <Playlist :playlists="playlists" :type="'playlist'" />
      <!-- 哨兵元素：进入视口时触发加载更多 -->
      <div v-if="hasMore" ref="sentinelRef" class="loading-more">
        {{ loadingMore ? '加载中...' : '滚动到底部加载更多' }}
      </div>
    </div>

    <!-- 组件内回到顶部按钮 -->
    <el-backtop target=".discoveryPlaylist" :bottom="120"></el-backtop>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { hotTagApi, handpickApi } from '@/api/discovery'
import Playlist from '@/components/common/CPlaylist.vue'
import type { TagType, PlaylistType } from '@/api/types'

const loading = ref(true)
const loadingMore = ref(false)
const hotTag = ref<TagType[]>([])
const currentSelectedName = ref('华语')
const playlists = ref<PlaylistType[]>([])
const pageInfo = ref({
  currentPage: 0,
  pageSize: 20,
})
const hasMore = ref(true)
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function getHotTag() {
  const res = await hotTagApi()
  hotTag.value = res.tags
}

function changeHotCategory(index: number) {
  currentSelectedName.value = hotTag.value[index].name
  resetAndLoad()
}

function resetAndLoad() {
  pageInfo.value.currentPage = 0
  playlists.value = []
  hasMore.value = true
  getHandpick(true)
}

/** 获取歌单，isReset 标识是否为重置加载 */
async function getHandpick(isReset = false) {
  if (loadingMore.value || (!hasMore.value && !isReset)) return

  if (isReset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const res = await handpickApi(currentSelectedName.value, pageInfo.value.currentPage)

    res.playlists.forEach((item) => {
      item.picUrl = item.coverImgUrl
    })

    if (isReset) {
      playlists.value = res.playlists
    } else {
      playlists.value = [...playlists.value, ...res.playlists]
    }

    hasMore.value = res.playlists.length === pageInfo.value.pageSize
    pageInfo.value.currentPage++
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// IntersectionObserver：监听哨兵元素进入视口
function setupObserver() {
  observer?.disconnect()
  if (!sentinelRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        getHandpick()
      }
    },
    { rootMargin: '120px' },
  )
  observer.observe(sentinelRef.value)
}

// 当 hasMore 变为 true 时（切换分类 / 初始加载），哨兵重新挂载，重新观察
watch(hasMore, (val) => {
  if (val) {
    nextTick(() => setupObserver())
  }
})

// 初始化
onMounted(async () => {
  await Promise.all([getHotTag(), getHandpick(true)])
  setupObserver()
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style lang="less">
.discoveryPlaylist {
  height: calc(100vh - 120px); // 设置合适的高度以允许滚动
  width: 100%;
  overflow-y: auto;

  // 关闭滚动条样式
  &::-webkit-scrollbar {
    display: none;
  }

  .category {
    display: flex;
    height: 2rem;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    margin-bottom: 1rem;

    .currentSelect {
      height: 2rem;
      border-radius: 1rem;
      border: 1px solid #ddd;
      color: black;
      font-weight: 600;
    }
  }

  .loading-more {
    text-align: center;
    padding: 1rem;
    color: #999;
    font-size: 0.9rem;
  }
}
</style>
