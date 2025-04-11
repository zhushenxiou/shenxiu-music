import { createRouter, createWebHistory } from 'vue-router'
import Discover from '@/pages/Discover/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //重定向：在项目运行的时候，立马定向到发现音乐页面，否则页面可能不展示内容或者展示非路由组件的内容
    {
      //Vue3需要使用正则的形式配置指定未识别的路径 :pathMatch(.*)*
      path: '/:pathMatch(.*)*',
      redirect: '/discover/recommend',
    },
    // 发现页
    {
      path: '/discover',
      name: 'discovery',
      component: Discover,
      redirect: '/discover/recommend',
      children: [
        {
          path: '/discover/recommend',
          component: () => import('@/pages/Discover/components/Recommend.vue'),
          name: 'recommend',
        },
        {
          path: '/discover/discoverPlaylist',
          component: () => import('@/pages/Discover/components/DiscoverPlaylist.vue'),
          name: 'discoverPlaylist',
        },
        {
          path: '/discover/rank',
          component: () => import('@/pages/Discover/components/Rank.vue'),
          name: 'rank',
        },
        {
          path: '/discover/discoverSinger',
          component: () => import('@/pages/Discover/components/DiscoverSinger.vue'),
          name: 'discoverSinger',
        },
      ],
    },
    // 歌单详情页
    {
      path: '/playlistDetails/:id',
      component: () => import('@/pages/PlaylistDetails/index.vue'),
      name: 'playlistDetails',
      // 参数携带id
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 专辑详情页
    {
      path: '/albumDetails/:id',
      component: () => import('@/pages/AlbumDetails/index.vue'),
      name: 'albumDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 歌手详情页
    {
      path: '/singerDetails/:id',
      component: () => import('@/pages/SingerDetails/index.vue'),
      name: 'singerDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 搜索模块
    {
      path: '/search',
      component: () => import('@/pages/Search/index.vue'),
      redirect: '/search/songs',
      children: [
        // 搜索单曲
        {
          path: '/search/songs/:keywords',
          component: () => import('@/pages/Search/SSongs.vue'),
          name: 'searchSongs',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        // 搜索歌手
        {
          path: '/search/singer/:keywords',
          component: () => import('@/pages/Search/SSinger.vue'),
          name: 'searchSinger',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        // 搜索歌单
        {
          path: '/search/playlist/:keywords',
          component: () => import('@/pages/Search/SPlaylist.vue'),
          name: 'searchPlaylist',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        // 搜索专辑
        {
          path: '/search/album/:keywords',
          component: () => import('@/pages/Search/SAlbum.vue'),
          name: 'searchAlbum',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
        // 搜索MV
        {
          path: '/search/mv/:keywords',
          component: () => import('@/pages/Search/SMV.vue'),
          name: 'searchMV',
          props($route) {
            return {
              keywords: $route.params.keywords,
            }
          },
        },
      ],
    },
    // MV视频
    {
      path: '/video',
      component: () => import('@/pages/MV/index.vue'),
      name: 'video',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 视频详情页
    {
      path: '/videoDtails/:id',
      component: () => import('@/pages/MV/components/MVDetails.vue'),
      name: 'videoDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    //每日推荐
    {
      path: '/dailyRecommend',
      component: () => import('@/pages/DailyRecommend/index.vue'),
      name: 'dailyRecommend',
    },
    // 用户详情页
    {
      path: '/userDetails/:id',
      component: () => import('@/pages/UserDetails/index.vue'),
      name: 'userDetails',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 关注列表
    {
      path: '/userDetails/follows/:id',
      component: () => import('@/pages/UserDetails/Follows.vue'),
      name: 'follows',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
    // 粉丝列表
    {
      path: '/userDetails/followeds/:id',
      component: () => import('@/pages/UserDetails/Followeds.vue'),
      name: 'followeds',
      props($route) {
        return {
          id: $route.params.id,
        }
      },
    },
  ],
})

export default router
