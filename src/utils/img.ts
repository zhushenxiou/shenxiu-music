// 优化图片 URL，添加尺寸参数
export const optimizeImageUrl = (url: string | undefined, width = 200, height = 200): string => {
  if (!url) return ""
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}param=${width}y${height}`
}
