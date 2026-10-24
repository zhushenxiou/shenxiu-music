<template>
  <!-- 封装评论组件 -->
  <div class="mt-4 h-auto w-full">
    <!-- 热门评论 -->
    <div class="w-full">
      <div v-if="hotComments.length" class="mt-4 text-[18px] font-semibold">最热评论</div>
      <div
        v-for="comment in hotComments"
        :key="comment.commentId"
        class="relative my-4 flex h-16 w-full items-center border-b border-[#ccc]"
      >
        <!-- 评论人 -->
        <div
          class="z-[1] mr-8 flex w-40 cursor-pointer items-center"
          @click="toUserDetails(comment.user.userId)"
        >
          <div class="m-2 h-12 w-12">
            <img
              class="h-full w-full rounded-full"
              :src="optimizeImageUrl(comment.user.avatarUrl, 50, 50)"
              alt="加载中..."
            />
          </div>
          <div>
            <div class="w-24 truncate text-sm" :title="comment.user.nickname">
              {{ comment.user.nickname }}
            </div>
            <div class="text-[13px] text-[#666]">{{ comment.timeStr }}</div>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="min-w-0 flex-1 break-words text-xs">{{ comment.content }}</div>
      </div>
    </div>
    <!-- 最新评论 -->
    <div class="w-full">
      <div v-if="newComments.length" class="mt-4 text-[18px] font-semibold">最新评论</div>
      <div v-else class="mt-4 text-[18px] font-semibold">暂无评论</div>
      <div
        v-for="comment in newComments"
        :key="comment.commentId"
        class="relative my-4 flex h-16 w-full items-center border-b border-[#ccc]"
      >
        <!-- 评论人 -->
        <div
          class="z-[1] mr-8 flex w-40 cursor-pointer items-center"
          @click="toUserDetails(comment.user.userId)"
        >
          <div class="m-2 h-12 w-12">
            <img
              class="h-full w-full rounded-full"
              :src="optimizeImageUrl(comment.user.avatarUrl, 50, 50)"
              alt="加载中..."
            />
          </div>
          <div>
            <div class="w-20 truncate text-sm" :title="comment.user.nickname">
              {{ comment.user.nickname }}
            </div>
            <div class="text-[13px] text-[#666]">{{ comment.timeStr }}</div>
          </div>
        </div>
        <!-- 评论内容 -->
        <div class="min-w-0 flex-1 break-words text-xs">{{ comment.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { songCommentApi, playlistCommentApi, albumCommentApi, mvCommentApi } from '@/api/comment'
import { usePlayerStore } from '@/stores/player'
import { optimizeImageUrl } from '@/utils/format'
import type { CommentType } from '@/api/types'

const router = useRouter()
const playerStore = usePlayerStore()

const props = defineProps<{ type: string; id: string | string[] | number }>()

/** 热门评论 */
const hotComments = ref<CommentType[]>([])
/** 最新评论 */
const newComments = ref<CommentType[]>([])

/** 根据类型获取评论 */
async function getComments() {
  let res: { hotComments: CommentType[]; comments: CommentType[] }
  if (props.type === 'song') {
    res = await songCommentApi(props.id)
  } else if (props.type === 'playlist') {
    res = await playlistCommentApi(props.id)
  } else if (props.type === 'album') {
    res = await albumCommentApi(props.id)
  } else {
    res = await mvCommentApi(props.id)
  }
  hotComments.value = res.hotComments
  newComments.value = res.comments
}

function toUserDetails(id: number) {
  // 如果歌单详情页抽屉打开，需要关闭
  playerStore.showSongDetails = false
  router.push({
    name: 'userDetails',
    params: { id },
  })
}

onMounted(() => {
  getComments()
})
</script>
