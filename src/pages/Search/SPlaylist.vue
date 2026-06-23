<template>
  <!-- 搜索歌单页 -->
  <div class="searchPlaylist">
    <!-- 歌单总数 -->
    <div class="count">找到 {{pageInfo.total}} 张歌单</div>
    <!-- 歌单列表 -->
    <div class="playlists" v-loading="isLoading">
      <CPlaylist :playlists="playlists" :type="'playlist'" />
      <CPagination :page-info="pageInfo" :handle-change="getSearchPlaylist" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { searchApi } from '@/api/search'
import CPlaylist from '@/components/common/CPlaylist.vue'
import CPagination from '@/components/common/CPagination.vue'
import type { PlaylistType } from '@/api/types'

const route = useRoute()

const keywords = computed(() => route.params.keywords as string)

const pageInfo = reactive({
  pageSize: 30,
  curPage: 1,
  total: 0,
})

const isLoading = ref(true)

/** 歌单列表 */
const playlists = ref<PlaylistType[]>([])

async function getSearchPlaylist() {
  isLoading.value = true
  const res = await searchApi(keywords.value, 1000, (pageInfo.curPage - 1) * 30)
  const data = res as { result: { playlistCount: number; playlists: PlaylistType[] } }
  pageInfo.total = data.result.playlistCount
  data.result.playlists.forEach((item) => {
    item.picUrl = item.coverImgUrl
  })
  playlists.value = data.result.playlists
  isLoading.value = false
}

getSearchPlaylist()
</script>

<style lang="less">
.searchPlaylist {
  width: 100%;

  .count {
    margin-left: 1rem;
    font-weight: 600;
  }
}
</style>
