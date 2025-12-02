import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userDetailsApi, userPlaylistApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 用户ID
  const uid = ref(0)
  // 用户信息
  const userInfo = ref({ level: '', userId: 0 })
  // 创建的歌单
  const createdPlaylist = ref<any>([])
  // 收藏/订阅(subscrib)的歌单
  const subscribedPlaylist = ref<any>([])

  // 获取用户数据
  const getUserData = async () => {
    // 获取用户信息
    const info: any = await userDetailsApi(uid.value)
    userInfo.value = info.profile
    userInfo.value.level = info.level

    // 获取用户歌单
    const res: any = await userPlaylistApi(uid.value)

    // 清空历史歌单数据
    createdPlaylist.value = []
    subscribedPlaylist.value = []

    // 区分创建的歌单和订阅的歌单
    res.playlist.forEach((item: any) => {
      // 适配CPlaylist组件的picUrl字段
      item.picUrl = item.coverImgUrl

      if (!item.subscribed) {
        createdPlaylist.value.push(item)
      } else {
        subscribedPlaylist.value.push(item)
      }
    })
  }

  return {
    uid,
    userInfo,
    createdPlaylist,
    subscribedPlaylist,
    getUserData
  }
})
