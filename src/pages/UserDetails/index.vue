<template>
  <!-- 用户详情页 -->
  <div>
    <!-- 用户信息 -->
    <UserInfo :user-info="userInfo" :loading="isLoading" @relation="openRelation" />
    <!-- 歌单/动态 -->
    <el-tabs v-model="activeTab" class="mt-2">
      <el-tab-pane :label="`${pronoun}创建的歌单`" name="created">
        <CPlaylist v-if="createdPlaylist.length" :playlists="createdPlaylist" />
        <div v-else-if="!isLoading" class="text-center text-[#999] py-10">暂无创建的歌单</div>
      </el-tab-pane>
      <el-tab-pane :label="`${pronoun}收藏的歌单`" name="subscribed">
        <CPlaylist v-if="subscribedPlaylist.length" :playlists="subscribedPlaylist" />
        <div v-else-if="!isLoading" class="text-center text-[#999] py-10">暂无收藏的歌单</div>
      </el-tab-pane>
      <el-tab-pane :label="`${pronoun}的动态`" name="events">
        <!-- 首次切到该 tab 才挂载并拉取，切走再切回会重新拉取保证新鲜 -->
        <UserEvent v-if="activeTab === 'events'" :user-id="id" :user="userInfo" />
      </el-tab-pane>
    </el-tabs>
    <!-- 关注/粉丝弹窗 -->
    <UserRelationDialog
      v-model="relationVisible"
      :type="relationType"
      :userlist="relationList"
      :loading="relationLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { userDetailsApi, userPlaylistApi, userFollowsApi, userFollowedsApi } from '@/api/user'
import CPlaylist from '@/components/common/CPlaylist.vue'
import UserInfo from './components/UserInfo.vue'
import UserRelationDialog from './components/UserRelationDialog.vue'
import UserEvent from './components/UserEvent.vue'
import { useUserStore } from '@/stores/user'
import type { UserProfileType, PlaylistType, FollowUserType } from '@/api/types'

const route = useRoute()

const userStore = useUserStore()

const id = computed(() => {
  return route.params.id || userStore.uid
})

const pronoun = computed(() => {
  return userStore.uid !== 0 && String(id.value) === String(userStore.uid) ? '我' : 'TA'
})

const isLoading = ref(true)
/** 选中的歌单页签 */
const activeTab = ref('created')
/** 关注/粉丝弹窗显隐 */
const relationVisible = ref(false)
/** 关注/粉丝弹窗类型 */
const relationType = ref<'follows' | 'followeds'>('follows')

/** 用户信息 */
const userInfo = ref<UserProfileType>({
  userId: 0,
  nickname: '',
  avatarUrl: '',
})
/** 用户创建的歌单 */
const createdPlaylist = ref<PlaylistType[]>([])
/** 用户收藏的歌单 */
const subscribedPlaylist = ref<PlaylistType[]>([])
/** 关注/粉丝列表数据 */
const relationList = ref<FollowUserType[]>([])
/** 关注/粉丝列表加载状态 */
const relationLoading = ref(false)

async function getUserDetails() {
  isLoading.value = true
  try {
    const [info, res] = await Promise.all([
      userDetailsApi(id.value),
      userPlaylistApi(id.value),
    ])
    userInfo.value = { ...info.profile, level: info.level }
    res.playlist.forEach((item) => {
      // 适配 CPlaylist 组件的 picUrl 字段
      item.picUrl = item.coverImgUrl
      if (!item.subscribed) {
        createdPlaylist.value.push(item)
      } else {
        subscribedPlaylist.value.push(item)
      }
    })
    // 创建的为空时默认展示收藏的歌单
    if (!createdPlaylist.value.length && subscribedPlaylist.value.length) {
      activeTab.value = 'subscribed'
    }
  } catch {
    ElMessage.error('获取用户信息失败')
  } finally {
    isLoading.value = false
  }
}

/** 打开关注/粉丝弹窗并拉取列表数据 */
async function openRelation(type: 'follows' | 'followeds') {
  relationType.value = type
  relationVisible.value = true
  relationLoading.value = true
  relationList.value = []
  try {
    relationList.value =
      type === 'follows'
        ? (await userFollowsApi(id.value)).follow
        : (await userFollowedsApi(id.value)).followeds
  } catch {
    ElMessage.error('获取列表失败')
  } finally {
    relationLoading.value = false
  }
}

onMounted(() => {
  getUserDetails()
})
</script>
