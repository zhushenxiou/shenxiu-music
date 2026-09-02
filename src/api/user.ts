import request from '../utils/request'
import type { UserProfileType, FollowUserType, PlaylistType, UserEventType } from './types'

// ==================== 响应类型 ====================

export interface UserDetailsResponse {
  profile: UserProfileType
  level: number
}

export interface UserPlaylistResponse {
  playlist: PlaylistType[]
}

export interface UserFollowsResponse {
  follow: FollowUserType[]
}

export interface UserFollowedsResponse {
  followeds: FollowUserType[]
}

export interface UserEventResponse {
  events: UserEventType[]
  /** 是否还有下一页 */
  more: boolean
  /** 下一页游标 */
  lasttime: number
}

// ==================== API 函数 ====================

/** 获取用户详情 */
export const userDetailsApi = (id: number | string | string[]) => {
  return request<UserDetailsResponse>({
    url: `/user/detail?uid=${id}`,
    method: 'GET',
  })
}

/** 获取用户歌单 */
export const userPlaylistApi = (id: number | string | string[]) => {
  return request<UserPlaylistResponse>({
    url: `/user/playlist?uid=${id}`,
    method: 'GET',
  })
}

/** 获取用户关注列表 */
export const userFollowsApi = (id: number | string | string[]) => {
  return request<UserFollowsResponse>({
    url: `/user/follows?uid=${id}&limit=99`,
    method: 'GET',
  })
}

/** 获取用户粉丝列表 */
export const userFollowedsApi = (id: number | string | string[]) => {
  return request<UserFollowedsResponse>({
    url: `/user/followeds?uid=${id}&limit=99`,
    method: 'GET',
  })
}

/** 获取用户动态（分页游标 lasttime，本人与他人统一走此接口） */
export const userEventApi = (id: number | string | string[], lasttime = -1, limit = 10) => {
  return request<UserEventResponse>({
    url: `/user/event?uid=${id}&limit=${limit}&lasttime=${lasttime}`,
    method: 'GET',
  })
}

