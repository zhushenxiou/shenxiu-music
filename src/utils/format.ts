// 优化图片 URL，添加尺寸参数
export const optimizeImageUrl = (url: string | undefined, width = 200, height = 200): string => {
  if (!url) return ""
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}param=${width}y${height}`
}
// 播放量格式化,千，万，亿，单位
export const formatPlayCount = (count: number) => {
  if (typeof count !== 'number' || count < 0) {
    return '加载中...'
  }

  const units = [
    { value: 100000000, suffix: '亿' },
    { value: 10000, suffix: '万' },
    { value: 1000, suffix: '千' },
  ]

  // 查找适用的最大单位
  const matchedUnit = units.find((unit) => count >= unit.value)

  if (matchedUnit) {
    const formattedValue = (count / matchedUnit.value).toFixed(1).replace(/\.0$/, '') // 移除无用的零
    return `${formattedValue}${matchedUnit.suffix}`
  }

  // 处理小于 1000 的情况
  return `${Math.floor(count)}`
}
/**
 * 将时间戳格式化为相对时间：1分钟内「刚刚」，1小时内「x分钟前」，
 * 24小时内「x小时前」，30天内「x天前」，超过 30 天返回 yyyy-M-d 日期。
 * 自动兼容秒级与毫秒级时间戳。
 * @param timestamp 事件时间戳（秒或毫秒），为空时返回空字符串
 */
export const formatTime = (timestamp?: number): string => {
  if (!timestamp) return ''
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000 // 统一为毫秒
  const diff = Date.now() - ms
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`
  if (diff < 86_400_000 * 30) return `${Math.floor(diff / 86_400_000)}天前`
  const date = new Date(ms)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
