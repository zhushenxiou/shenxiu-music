import request from '../utils/request'

/**
 * 获取音乐 url - 新版
 * @param id - 音乐 id，支持多个 id 用逗号分隔，如 '1969519579,33894312'
 * @param level - 播放音质等级: standard => 标准, higher => 较高, exhigh => 极高,
 *                lossless => 无损, hires => Hi-Res, jyeffect => 高清环绕声,
 *                sky => 沉浸环绕声, dolby => 杜比全景声, jymaster => 超清母带
 *                注意：杜比全景声需要设备支持，cookie 需传入 os=pc 保证返回正常码率
 * @param unblock - 是否使用歌曲解锁
 */
export const songUrlApi = (
  id: number | string,
  level: string = 'higher',
  unblock: boolean = true,
) => {
  return request({
    url: `/song/url/v1?id=${id}&level=${level}&unblock=${unblock}`,
    method: 'GET',
  })
}

// 获取歌曲歌词
export const lyricApi = (id: number) => {
  return request({
    url: `/lyric?id=${id}`,
    method: 'GET',
  })
}

//下载歌曲
export const songDownLoadApi = (id: number) => {
  return request({
    url: `/song/download/url?id=${id}&br=320000`,
    method: 'GET',
  })
}
