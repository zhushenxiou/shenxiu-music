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
            <span v-if="item.name" class="ml-1 font-medium text-[#444]">《{{ item.name }}》</span>
          </p>
          <!-- 附言 -->
          <p v-if="item.msg" class="mt-1 text-sm leading-6 text-[#666]">{{ item.msg }}</p>
          <!-- 时间与互动计数 -->
          <div class="mt-1.5 flex items-center gap-5 text-xs text-[#999]">
            <span>{{ item.time }}</span>
            <span v-if="item.forwardCount > 0" class="flex items-center gap-1">
              <el-icon><Share /></el-icon>
              {{ formatPlayCount(item.forwardCount) }}
            </span>
            <span v-if="item.commentCount > 0" class="flex items-center gap-1">
              <el-icon><ChatDotRound /></el-icon>
              {{ formatPlayCount(item.commentCount) }}
            </span>
            <span v-if="item.likedCount > 0" class="flex items-center gap-1">
              <el-icon><Star /></el-icon>
              {{ formatPlayCount(item.likedCount) }}
            </span>
          </div>
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
import { ElMessage } from 'element-plus'
import { ChatDotRound, Share, Star } from '@element-plus/icons-vue'
import { userEventApi } from '@/api/user'
import { formatPlayCount, optimizeImageUrl } from '@/utils/format'
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

/** 从动态 json 中解析出对象名与附言 */
function parseEventInfo(raw?: string): { name: string; msg: string } {
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
    if (obj && typeof obj === 'object') {
      const rec = obj as Record<string, unknown>
      const name = typeof rec.name === 'string' ? rec.name : typeof rec.title === 'string' ? rec.title : ''
      if (name) return { name, msg }
    }
  }
  return { name: '', msg }
}

/** 统一时间戳为毫秒（兼容秒 / 毫秒两种返回） */
function toMs(timestamp: number): number {
  return timestamp > 1e12 ? timestamp : timestamp * 1000
}

/** 时间戳 -> 相对时间/日期 */
function formatTime(timestamp?: number): string {
  if (!timestamp) return ''
  const diff = Date.now() - toMs(timestamp)
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`
  if (diff < 86_400_000 * 30) return `${Math.floor(diff / 86_400_000)}天前`
  const date = new Date(toMs(timestamp))
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

interface FeedItem {
  key: string
  action: string
  name: string
  msg: string
  time: string
  forwardCount: number
  commentCount: number
  likedCount: number
}

/** 渲染用条目 */
const items = computed<FeedItem[]>(() => {
  return events.value.map((event) => {
    const { name, msg } = parseEventInfo(event.json)
    return {
      key: String(event.id),
      action: TYPE_TEXT[event.type] || event.actName || '发布了动态',
      name,
      msg,
      time: formatTime(event.showTime),
      forwardCount: event.forwardCount ?? 0,
      commentCount: event.commentCount ?? 0,
      likedCount: event.likedCount ?? 0,
    }
  })
})

/** 首次进入拉取第一页 */
async function fetchFirstPage() {
  loading.value = true
  try {
    const res = await userEventApi(props.userId)
    events.value = res.events ?? []
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
