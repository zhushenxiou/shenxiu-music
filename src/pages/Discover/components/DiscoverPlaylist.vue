<template>
  <div class="discoveryPlaylist" ref="playlistContainer" @scroll="handleScroll">
    <!-- 歌单分类 -->
    <div class="category">
      <!-- 所有类型选择菜单（可下拉选择） -->
      <el-popover placement="bottom-start" :width="500" trigger="hover">
        <template #reference>
          <el-button class="currentSelect">
            <span>{{ currentSelectedName }}</span>
            <el-icon>
              <ArrowRight />
            </el-icon>
          </el-button>
        </template>
        <el-button v-for="(tag, index) in playlistTag" :key="index" @click="changeCategory(index)"
          style="margin: 0.2rem;" color='#ed5736' plain>
          <span>{{ tag.name }}</span>
        </el-button>
      </el-popover>
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
      <!-- 加载更多提示 -->
      <div v-if="!loading && hasMore" class="loading-more">
        滚动到底部加载更多
      </div>
    </div>

    <!-- 组件内回到顶部按钮 -->
    <el-backtop target=".discoveryPlaylist" :bottom="120"></el-backtop>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { playlistTagApi, hotTagApi, handpickApi } from '@/api/discovery'
import Playlist from '@/components/common/CPlaylist.vue'
import { debounce } from 'lodash-es'

const loading = ref(true)
const loadingMore = ref(false)
const playlistTag = ref()
const hotTag = ref()
const currentSelectedName = ref('华语')
const playlists = ref([] as any[])
const pageInfo = ref({
  currentPage: 0,
  pageSize: 25,
})
const hasMore = ref(true)
const playlistContainer = ref(null)

async function getPlaylistTag() {
  const res: any = await playlistTagApi()
  playlistTag.value = res.sub
}

async function getHotTag() {
  const res: any = await hotTagApi()
  hotTag.value = res.tags
}

// 切换标签时重置并重新加载
function changeCategory(index: number) {
  currentSelectedName.value = playlistTag.value[index].name
  resetAndLoad()
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

// 获取歌单，isReset标识是否为重置加载
async function getHandpick(isReset = false) {
  if (loadingMore.value || (!hasMore.value && !isReset)) return

  if (isReset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const res: any = await handpickApi(currentSelectedName.value, pageInfo.value.currentPage)

    // 处理数据
    res.playlists.forEach((item: any) => {
      item.picUrl = item.coverImgUrl
    })

    // 重置加载或追加加载
    if (isReset) {
      playlists.value = res.playlists
    } else {
      playlists.value = [...playlists.value, ...res.playlists]
    }

    // 检查是否还有更多数据
    hasMore.value = res.playlists.length === pageInfo.value.pageSize

    // 增加页码
    pageInfo.value.currentPage++
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 滚动到底部检测,防抖处理
const handleScroll = debounce(() => {
  const container = playlistContainer.value
  if (!container || loadingMore.value) return

  const { scrollTop, scrollHeight, clientHeight } = container
  // 当滚动到距离底部120px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 120 && hasMore.value) {
    getHandpick()
  }
},500)

// 初始化
onMounted(async () => {
  await Promise.all([getPlaylistTag(), getHotTag()])
  await getHandpick(true)
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
