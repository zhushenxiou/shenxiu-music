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
