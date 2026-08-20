<template>
  <!-- 底部栏播放器 -->
  <div
    class="player"
    :style="{ background: bgColorStore.bgColor }"
  >
    <!-- 歌曲信息 -->
    <div class="left" @click="store.showSongDetails = !store.showSongDetails">
      <div class="img">
        <el-image :src="store.curSongInfo.al.picUrl">
          <template #placeholder>
            <div class="image-slot">加载中<span class="dot">...</span></div>
          </template>
        </el-image>
      </div>
      <div class="name">
        {{ store.curSongInfo.name }}
      </div>
      <!-- 歌曲详情页 -->
      <el-drawer
        v-model="store.showSongDetails"
        :with-header="false"
        direction="btt"
        :append-to-body="true"
        :size="'100%'"
      >
        <PlayDetails />
      </el-drawer>
    </div>
    <!-- 歌曲控制 -->
    <div class="center">
      <PlayerControl />
    </div>
    <!-- 播放列表 -->
    <div class="right">
      <div class="playlist" @click="store.showPlaylist = !store.showPlaylist">
        <el-badge :value="store.playlist.length">
          <IconPlaylist />
        </el-badge>
        <!-- 抽屉 -->
        <el-drawer
          v-model="store.showPlaylist"
          :with-header="false"
          :append-to-body="true"
          :size="320"
        >
          <Playlist />
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player.ts'
import Playlist from './components/SongList.vue'
import PlayDetails from './components/SongDetail.vue'
import PlayerControl from './components/PlayerControl.vue'
import { ElDrawer } from 'element-plus'
import IconPlaylist from '@/assets/icon/IconPlaylist.vue'
import { useBgColorStore } from '@/stores/bgColor.ts'

const store = usePlayerStore()
const bgColorStore = useBgColorStore()
</script>

<style lang="less">
.player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 70px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #ccc;
  z-index: 9999 !important;
  padding: 0.5rem 1rem;
  cursor: default;

  .left {
    width: 25%;
    display: flex;
    align-items: center;
    cursor: pointer;

    .el-image {
      height: 3rem;
      width: 3rem;
      border-radius: 0.5rem;
      margin-right: 1rem;
    }

    .name {
      font-size: 14px;
    }
  }

  .center {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .right {
    width: 25%;
    display: flex;
    align-items: center;
    padding-left: 6rem;

    .playlist {
      cursor: pointer;
      position: absolute;
      right: 2.5rem;

      .el-badge svg {
        font-size: 20px;
      }
    }
  }
}
</style>
