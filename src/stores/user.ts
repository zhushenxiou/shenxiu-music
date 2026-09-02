import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  /** 当前登录用户的ID */
  const uid = ref(0)

  return { uid }
})
