import { defineStore } from 'pinia'
import { ref } from 'vue'
import { songUrlApi, lyricApi } from '@/api/song'
import type { SongType } from '@/api/types'

export const usePlayerStore = defineStore('player', () => {
  /** 播放列表 */
  const playlist = ref<SongType[]>([])
  // 当前播放下标
  const index = ref(0)
  /** 当前播放歌曲信息 */
  const curSongInfo = ref<SongType>({
    id: 0,
    name: '暂无歌曲',
    // 专辑
    al: {
      id: 0,
      name: '',
      picUrl:
        'https://ts1.cn.mm.bing.net/th/id/R-C.d2f9f4128e684ba537fe9efaf92f1bfd?rik=makKOA%2fy5qn6fA&riu=http%3a%2f%2fwww.kuaipng.com%2fUploads%2fpic%2fw%2f2021%2f04-21%2f99518%2fwater_99518_698_698_.png&ehk=c%2bb01RyizJwmfF4speWlE1bpkSRCtyxWZlU%2f6TPecHk%3d&risl=&pid=ImgRaw&r=0',
    },
    // 艺术家/作者
    ar: [
      {
        id: 0,
        name: '暂无作者',
      },
    ],
    // 日期
    dt: 0,
  })
  // 当前歌曲的URL
  const curSongUrl = ref('')
  // 歌词 格式：[{ time: 时间戳, lrc: '歌词内容', next: 下一句出现时间戳 }]
  const lyric = ref([{ time: 0, lrc: '暂无歌词', next: 100000 }])
  const isPlaying = ref(false)
  const curDuration = ref(0)
  const showPlaylist = ref(false)
  const showSongDetails = ref(false)

  // 格式化歌词方法
  const formatLyric = (lyricStr: string) => {
    const lyricArr = lyricStr.split(/[(\r\n)\r\n]+/).map((item: string) => {
      const min = item.slice(1, 3) // 分
      const sec = item.slice(4, 6) // 秒
      let mill: number | string = Number(item.slice(7, 10))
      let lrc = item.slice(11, item.length)

      // 处理两位毫秒的情况
      if (isNaN(Number(mill))) {
        mill = Number(item.slice(7, 9)) * 10
        lrc = item.slice(10, item.length)
      }

      // 计算歌词时间戳（毫秒）
      const time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + Number(mill)
      return { time, lrc, next: 0 }
    })

    // 为每个歌词项设置下一句出现时间
    lyricArr.forEach((item, i) => {
      if (i === lyricArr.length - 1 || isNaN(lyricArr[i + 1].time)) {
        item.next = lyricArr[i + 2] ? lyricArr[i + 2].time : item.time + 1500
      } else {
        item.next = lyricArr[i + 1].time
      }
    })

    return lyricArr
  }

  // 更新当前播放歌曲信息
  const updateCurSong = async () => {
    curSongInfo.value = playlist.value[index.value]

    // 获取歌曲播放URL
    const [songUrlRes, lyricRes] = await Promise.all([
      songUrlApi(curSongInfo.value.id),
      lyricApi(curSongInfo.value.id),
    ])

    // 设置当前歌曲URL
    curSongUrl.value = songUrlRes.data[0].url

    // // 获取并格式化歌词
    const lyricStr = lyricRes.lrc.lyric
    lyric.value = formatLyric(lyricStr)
  }

  // 3. 暴露状态和方法（组件中可访问）
  return {
    playlist,
    index,
    curSongInfo,
    curSongUrl,
    lyric,
    isPlaying,
    curDuration,
    showPlaylist,
    showSongDetails,
    updateCurSong,
  }
})
