<template>
  <!-- 封装歌曲列表 -->
  <div class="songlist">
    <el-table :data="props.songlist" stripe style="width: 100%" @row-dblclick="playSong" :row-class-name="addIndex">
      <el-table-column type="index" width="50" />
      <!-- 下载标签 -->
      <el-table-column prop="id" label="下载" width="80">
        <template #default="scope">
          <el-icon :size="18" class="download" @click="downloadSong(scope.row.id, scope.row.name)">
            <Download />
          </el-icon>
        </template>
      </el-table-column>
      <!-- 歌曲标题 -->
      <el-table-column prop="name" label="音乐标题" min-width="140">
        <template #default="scope">
          <span class="clikable" @click="playSong(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- 歌曲歌手 -->
      <el-table-column prop="ar[0].name" label="歌手" min-width="120">
        <template #default="scope">
          <span v-for="(author, index) in scope.row.ar" :key="author.id">
            <span class="clikable" @click="toSingerDetails(author.id)">
              {{ author.name }}
            </span>
            <!-- 最后一个歌手后面不加分隔符 -->
            <span v-if="index != scope.row.ar.length - 1">/</span>
          </span>
        </template>
      </el-table-column>
      <!-- 对应专辑 -->
      <el-table-column prop="al.name" label="专辑" min-width="120">
        <template #default="scope">
          <span class="clikable" @click="toAlbumDetails(scope.row.al.id)">{{ scope.row.al.name }}</span>
        </template>
      </el-table-column>
      <!-- 歌曲时长 -->
      <el-table-column prop="dt" label="时长" min-width="60" align="center">
        <template #default="scope">
          <span>{{ msToMinSeconed(scope.row.dt) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { msToMinSeconed } from '@/utils/time'
import { useRouter } from 'vue-router'
import { songDownLoadApi } from '@/api/song'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { SongType } from '@/api/types'

const router = useRouter()
const store = usePlayerStore()
const props = defineProps<{ songlist: SongType[] }>()

/** 为 Element Plus 表格行注入索引 */
function addIndex({ row, rowIndex }: { row: SongType; rowIndex: number }) {
  row.index = rowIndex
}

/** 播放音乐 */
async function playSong(row: SongType) {
  // 如果歌单已经变了，就改变歌单
  if (props.songlist != store.playlist) {
    store.playlist = props.songlist
  }
  // 如果之前有正在播放的歌曲，则先将其执行暂停操作再进行后续步骤
  store.isPlaying = false
  store.index = row.index ?? 0
  store.updateCurSong()
}

// 跳转歌手详情
function toSingerDetails(id: number) {
  router.push({
    name: 'singerDetails',
    params: { id },
  })
}

// 跳转专辑详情
function toAlbumDetails(id: number) {
  router.push({
    name: 'albumDetails',
    params: { id },
  })
}

//下载歌曲
async function downloadSong(id: number, name: string) {
  try {
    // 调用 API 并提取 data 中的 url
    const res = await songDownLoadApi(id)
    if (res.data && typeof res.data.url === 'string') {
      const url = res.data.url;

      // 根据url获取文件内容
      const response = await fetch(url);
      // 将文件内容转成二进制
      const blob = await response.blob();
      // 将二进制转成url
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `${name}.mp3`; // 设置文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放内存
      window.URL.revokeObjectURL(urlBlob);
      ElMessage.success('下载成功,320kpbs超高清')

    } else {
      ElMessage.error('你没有登录或者你不是VIP')
    }
  } catch (error) {
    ElMessage.error(`下载歌曲时发生错误:${error}`);
  }
}
</script>

<style lang="less">
.songlist {
  cursor: pointer;

  .el-table {
    font-size: 13px;
  }

  .download {
    &:hover {
      color: #ec4141;
      transform: scale(1.1);
    }
  }

  .clikable {

    &:hover {
      color: #ec4141;
      border-bottom: 1px solid #ec4141;
    }
  }
}
</style>
