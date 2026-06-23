<template>
  <div class="recommend" v-loading="isLoading">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel :interval="4000" type="card" height="400px" v-if="banners">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <img :src="banner.imageUrl" alt="" @click="handleBanner(banner)" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="personalized">
      <!-- 标题 -->
      <div class="title">
        <span>推荐歌单</span>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <!-- 推荐歌单列表 -->
      <Playlist :playlists="playlists" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { bannerApi, personalizedPlaylistApi } from '@/api/discovery'
import Playlist from '@/components/common/CPlaylist.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { BannerType, PlaylistType } from '@/api/types'

const router = useRouter()

const isLoading = ref(true)
const banners = ref<BannerType[]>([])
/** 推荐歌单列表 */
const playlists = ref<PlaylistType[]>([])

async function getData() {
  isLoading.value = true
  const bannersRes = await bannerApi()
  banners.value = bannersRes.banners
  const playlistRes = await personalizedPlaylistApi()
  playlists.value = playlistRes.result
  isLoading.value = false
}

/** 处理点击 banner */
function handleBanner(banner: BannerType) {
  console.log(banner)
  if (banner.targetType === 1000) {
    router.push({
      name: 'playlistDetails',
      params: { id: banner.targetId },
    })
  } else if (banner.targetType === 10) {
    router.push({
      name: 'albumDetails',
      params: { id: banner.targetId },
    })
  } else {
    ElMessage.info('特殊Banner,暂时无法处理')
  }
}

// 获取数据
getData()
</script>

<style lang="less" scoped>
.recommend {
  padding: 0 1rem;

  .banner {
    width: 100%;

    .el-carousel__item {
      border-radius: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .personalized {
    width: 100%;

    .title {
      margin-bottom: 0.5rem;
      cursor: default;
      line-height: 24px;
      font-size: 24px;
      font-weight: bold;

      .el-icon {
        position: relative;
        top: 0.2rem;
      }
    }
  }
}
</style>
