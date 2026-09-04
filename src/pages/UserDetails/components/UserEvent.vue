<template>
  <div v-loading="loading" class="relative min-h-[200px]">
    <!-- 动态列表 -->
    <template v-if="items.length">
      <div
        v-for="item in items"
        :key="item.key"
        class="flex gap-3 rounded-lg py-4 px-2 transition-colors hover:bg-[#fafafa]"
      >
        <!-- 头像 -->
        <el-image
          :src="optimizeImageUrl(avatarUrl, 50, 50)"
          fit="cover"
          class="h-11 w-11 shrink-0 rounded-full"
        >
          <template #placeholder>
            <div class="image-slot">加载中...</div>
          </template>
        </el-image>
        <!-- 动态内容 -->
        <div class="min-w-0 flex-1">
          <!-- 动作与对象名 -->
          <p class="text-sm leading-6">
            <span class="mr-1 font-semibold text-[#333]">{{ nickname }}</span>
            <span class="text-[#999]">{{ item.action }}</span>
            <span
              v-if="item.name"
              class="ml-1 font-medium text-[#444]"
              :class="{ 'cursor-pointer hover:text-[#ec4141]': item.ref }"
              @click="onRefClick(item)"
              >《{{ item.name }}》</span
            >
          </p>
          <!-- 附言 -->
          <p v-if="item.msg" class="mt-1 text-sm leading-6 text-[#666]">{{ item.msg }}</p>
          <!-- 时间 -->
          <div class="mt-1.5 flex items-center text-xs text-[#999]">{{ item.time }}</div>
        </div>
      </div>
    </template>
    <div v-else-if="!loading" class="text-center text-[#999] py-10">暂无动态</div>
    <!-- 分页加载 -->
    <div
      v-if="hasMore"
      class="cursor-pointer py-3 text-center text-sm text-[#999] transition-colors hover:text-[#ec4141]"
      @click="loadMore"
    >
      {{ loadingMore ? '加载中...' : '加载更多' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import { songDetailApi } from '@/api/song'
import { userEventApi } from '@/api/user'
import { formatTime, optimizeImageUrl } from '@/utils/format'
import type { UserEventType } from '@/api/types'

// userId: 被查看的用户 id；user: 该用户资料（用于头像/昵称展示），本人与他人统一走 /user/event 分页
const props = defineProps<{
  userId: number | string | string[]
  user?: {
    nickname?: string
    avatarUrl?: string
  }
}>()

/** 头像兜底 */
const nickname = computed(() => props.user?.nickname || '用户')
const avatarUrl = computed(() => props.user?.avatarUrl || '')

/** 动态列表 */
const events = ref<UserEventType[]>([])
/** 首次加载状态 */
const loading = ref(true)
/** 分页加载更多状态 */
const loadingMore = ref(false)
/** 是否还有下一页 */
const hasMore = ref(false)
/** 下一页游标 */
const nextLasttime = ref(-1)

/** type -> 动作文案（见 /user/event 文档） */
const TYPE_TEXT: Record<number, string> = {
  18: '分享了单曲',
  19: '分享了专辑',
  17: '分享了电台节目',
  28: '分享了电台节目',
  22: '转发了动态',
  39: '发布了视频',
  35: '分享了歌单',
  13: '分享了歌单',
  24: '分享了专栏文章',
  41: '分享了视频',
  21: '分享了视频',
}

/** json 内实体的可点击类型 */
type EventRefKind = 'song' | 'album' | 'playlist' | 'video'

/** json 中可点击实体 key -> 类型；radio/电台、article/专栏等仅展示不可点 */
const REF_KEY_KIND: Record<string, EventRefKind> = {
  song: 'song',
  album: 'album',
  playlist: 'playlist',
  video: 'video',
  mv: 'video',
}

/** 解析结果：展示文案 + 可点击目标 */
interface EventParse {
  name: string
  msg: string
  ref?: { kind: EventRefKind; id: number | string }
}

/** 取实体 id；网易云视频对象字段可能是 vid / mvId */
function pickRefId(rec: Record<string, unknown>): number | string | undefined {
  const id = rec.id ?? rec.mvId ?? rec.vid
  if (typeof id === 'number') return id
  return typeof id === 'string' && id ? id : undefined
}

/** 从动态 json 中解析出对象名、附言与可点击目标 */
function parseEventInfo(raw?: string): EventParse {
  let data: Record<string, unknown> = {}
  if (raw) {
    try {
      const obj = JSON.parse(raw)
      if (obj && typeof obj === 'object') data = obj
    } catch {
      // json 解析失败则按无内容处理
    }
  }
  const msg = typeof data.msg === 'string' ? data.msg : ''
  const nameKeys = ['song', 'album', 'playlist', 'video', 'mv', 'program', 'article', 'radio']
  for (const key of nameKeys) {
    const obj = data[key]
    if (!obj || typeof obj !== 'object') continue
    const rec = obj as Record<string, unknown>
    const name =
      typeof rec.name === 'string' ? rec.name : typeof rec.title === 'string' ? rec.title : ''
    if (!name) continue
    // 命中对象：可点击类型带上 id，取不到 id 则仅展示
    const kind = REF_KEY_KIND[key]
    const id = kind ? pickRefId(rec) : undefined
    return kind && id !== undefined ? { name, msg, ref: { kind, id } } : { name, msg }
  }
  return { name: '', msg: '' }
}

interface FeedItem {
  key: string
  action: string
  name: string
  msg: string
  /** 可点击目标（歌曲/歌单/专辑/视频）；无则本条对象仅展示 */
  ref?: { kind: EventRefKind; id: number | string }
  time: string
}

/** 渲染用条目 */
const items = computed<FeedItem[]>(() => {
  return events.value.map((event) => {
    const { name, msg, ref } = parseEventInfo(event.json)
    return {
      key: String(event.id),
      action: TYPE_TEXT[event.type] || event.actName || '发布了动态',
      name,
      msg,
      ...(ref ? { ref } : {}),
      time: formatTime(event.showTime),
    }
  })
})

const router = useRouter()
const store = usePlayerStore()

/** 正在请求歌曲详情时置位，防止连点重复请求 */
const loadingSongId = ref<number | string | null>(null)

/** 点击《歌曲名》：取完整信息后作为独立播放列表加入并立即播放 */
async function playEventSong(id: number | string) {
  if (loadingSongId.value !== null) return
  loadingSongId.value = id
  try {
    const res = await songDetailApi(id)
    const song = res.songs?.[0]
    if (!song) {
      ElMessage.warning('获取歌曲信息失败')
      return
    }
    // 与 CSonglist 播放逻辑一致：设为播放列表第一首并播放
    store.playlist = [song]
    store.isPlaying = false
    store.index = 0
    store.updateCurSong()
  } catch {
    ElMessage.error('播放失败')
  } finally {
    loadingSongId.value = null
  }
}

/** 点击《对象名》：歌曲去播放，其余跳对应详情页 */
function onRefClick(item: FeedItem) {
  const { kind, id } = item.ref ?? {}
  if (!kind || id === undefined) return
  if (kind === 'song') {
    playEventSong(id)
    return
  }
  let routeName: string
  if (kind === 'album') {
    routeName = 'albumDetails'
  } else if (kind === 'video') {
    routeName = 'videoDetails'
  } else {
    routeName = 'playlistDetails'
  }
  router.push({ name: routeName, params: { id } })
}

/** 首次进入拉取第一页 */
async function fetchFirstPage() {
  loading.value = true
  try {
    const res = await userEventApi(props.userId)
    events.value = res.events ?? []
    console.log(events.value)
    nextLasttime.value = res.lasttime
    hasMore.value = res.more
  } catch {
    ElMessage.error('获取动态失败')
  } finally {
    loading.value = false
  }
}

/** 加载下一页动态 */
async function loadMore() {
  loadingMore.value = true
  try {
    const res = await userEventApi(props.userId, nextLasttime.value)
    events.value = [...events.value, ...(res.events ?? [])]
    nextLasttime.value = res.lasttime
    hasMore.value = res.more
  } catch {
    ElMessage.error('加载更多失败')
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchFirstPage()
})
</script>
