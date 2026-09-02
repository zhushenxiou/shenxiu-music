<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    append-to-body
  >
    <div v-loading="loading" class="min-h-[200px] max-h-[60vh] overflow-y-auto">
      <!-- 用户卡片网格 -->
      <div v-if="userlist.length" class="grid grid-cols-2 gap-4 mx-4">
        <div
          v-for="user in userlist"
          :key="user.userId"
          class="flex items-center p-2 gap-2 cursor-pointer border border-[#eee]"
          @click="toUserDetails(user.userId)"
        >
          <el-image
            :src="optimizeImageUrl(user.avatarUrl, 50, 50)"
            class="w-[4rem] h-[4rem] rounded-full"
          >
            <template #placeholder>
              <div class="image-slot">加载中...</div>
            </template>
          </el-image>
          <p class="truncate">{{ user.nickname }}</p>
        </div>
      </div>
      <el-empty v-else-if="!loading" :description="'暂无数据'" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { optimizeImageUrl } from '@/utils/format'
import type { FollowUserType } from '@/api/types'

const router = useRouter()

// 弹窗显隐，配合父组件 v-model 使用
const visible = defineModel<boolean>({ default: false })

// type: 'follows' 关注列表 / 'followeds' 粉丝列表（列表数据由父组件获取后传入）
const props = defineProps<{
  type: 'follows' | 'followeds'
  userlist: FollowUserType[]
  loading?: boolean
}>()

const title = computed(() => {
  return `${props.type === 'follows' ? '关注' : '粉丝'}列表(最多显示99位)`
})

/** 点击用户卡片跳转到其详情页 */
function toUserDetails(userId: number) {
  router.push({
    name: 'userDetails',
    params: { id: userId },
  })
}
</script>
