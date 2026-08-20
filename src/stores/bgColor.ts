import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 主内容区默认背景色 */
export const MAIN_BG_DEFAULT = '#f7f9fc'

export const useBgColorStore = defineStore('bgColor', () => {
  /** 主内容区背景色，由详情页根据封面主题色动态设置 */
  const bgColor = ref(MAIN_BG_DEFAULT)

  /** 设置全局主内容背景色 */
  const setBgColor = (color: string) => {
    bgColor.value = color
  }

  /** 恢复默认背景色 */
  const resetBgColor = () => {
    bgColor.value = MAIN_BG_DEFAULT
  }

  return {
    bgColor,
    setBgColor,
    resetBgColor,
  }
})
