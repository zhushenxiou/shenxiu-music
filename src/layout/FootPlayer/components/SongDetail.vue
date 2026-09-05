<template>
  <!-- 歌曲详情页 -->
  <div class="w-full min-h-full" :style="{ background: pageBg }">
    <div class="flex w-full h-[600px]">
      <!-- 收起抽屉 -->
      <el-icon
        class="absolute top-4 left-8 z-[1] cursor-pointer text-2xl text-gray-800"
        @click="store.showSongDetails = false"
      >
        <ArrowDownBold />
      </el-icon>
      <!-- 歌曲信息和图片 -->
      <div class="flex w-[40%] h-[500px] flex-col items-center gap-4 pt-12">
        <!-- 歌曲图片 -->
        <div class="h-[280px] w-[280px] overflow-hidden rounded-[56px]">
          <img
            :src="store.curSongInfo.al?.picUrl || ''"
            alt="歌曲封面"
            crossorigin="anonymous"
            class="h-full w-full object-cover"
            @load="onCoverLoad"
          />
        </div>
        <!-- 歌曲信息 -->
        <div class="w-full px-8 text-center">
          <p class="mb-[0.8rem] truncate text-2xl font-semibold text-black">
            {{ store.curSongInfo.name }}
          </p>
          <div class="mb-[0.8rem] flex flex-wrap justify-center gap-2.5">
            <p v-for="ar in store.curSongInfo.ar" :key="ar.id" class="text-base text-[#666]">
              {{ ar.name }}
            </p>
          </div>
          <p class="text-sm text-[#999]">{{ store.curSongInfo.al?.name || '' }}</p>
        </div>
      </div>
      <!-- 歌词部分 -->
      <div class="w-[60%] h-[500px] pt-12 pr-8">
        <div ref="lyric" class="w-full h-[450px] overflow-y-auto py-4 text-center">
          <p
            v-for="(item, index) in store.lyric"
            :key="index"
            :class="[
              'mb-6 text-base leading-[1.6] transition-all duration-300',
              isActiveLyric(item) ? 'active text-lg font-medium text-[#ec4141]' : '',
            ]"
          >
            {{ item.lrc }}
          </p>
        </div>
      </div>
    </div>
    <!-- 歌曲评论 -->
    <div v-show="store.curSongInfo.id" class="px-6">
      <CComments :type="'song'" :id="store.curSongInfo.id" :key="store.curSongInfo.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import CComments from '@/components/common/CComments.vue'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { extractColorFromImage } from '@/utils/color'

const store = usePlayerStore()

// 歌词
const lyric = ref()

/** 从当前歌曲封面提取的主题色（空串表示尚未提取成功，用默认浅色渐变兜底） */
const themeColor = ref('')
/** 封面加载中/无封面时的默认浅色渐变 */
const defaultBg = 'linear-gradient(180deg, #eef2f6 0%, #ffffff 100%)'

/** 将 rgb 字符串按 mix 比例混入白色，返回偏浅的 rgb 字符串（mix 越大越接近纯白） */
function mixWhite(rgb: string, mix: number) {
  const [r, g, b] = (rgb.match(/\d+/g) ?? []).map(Number)
  if (r == null || g == null || b == null) return ''
  const m = (v: number) => Math.round(v * (1 - mix) + 255 * mix)
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`
}

/** 整页背景：封面主题色浅化后向下渐变为白，保证黑色文字可读 */
const pageBg = computed(() =>
  themeColor.value
    ? `linear-gradient(180deg, ${mixWhite(themeColor.value, 0.85)} 0%, ${mixWhite(
        themeColor.value,
        0.93,
      )} 35%, #ffffff 70%)`
    : defaultBg,
)

// 切换歌曲时清空旧主题色，等待新封面加载完成后再提取
watch(
  () => store.curSongInfo.id,
  () => {
    themeColor.value = ''
  },
)

// 封面加载完成后提取主题色作为整页背景渐变（复用已显示的图片，不二次下载）
async function onCoverLoad(e: Event) {
  themeColor.value = await extractColorFromImage(e.target as HTMLImageElement)
}

// 判断某句歌词是否为当前播放行（同步模板里的高亮/滚动逻辑）
function isActiveLyric(item: { time: number; next: number }) {
  return store.curDuration >= item.time && store.curDuration <= item.next
}

let timer: number | undefined = undefined

// 歌词滚动逻辑
onMounted(() => {
  // 歌词滚动1s刷新一次
  timer = setInterval(() => {
    // 获取播放到的歌词元素（泛型定元素类型，返回值仍含 null，交给下方守卫）
    const p = document.querySelector<HTMLParagraphElement>('p.active')
    if (p && p.offsetTop > 300) {
      // 改变父元素的顶部位置
      lyric.value.scrollTop = p.offsetTop - 300
    }
  }, 1000)
})

// 销毁前破坏定时器
onUnmounted(() => {
  clearInterval(timer)
})
</script>
