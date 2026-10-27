# 神秀云音乐（shenxiu-music-ui）

## 技术栈

本项目是对以前自己的项目 https://gitee.com/zhu-liang/cloud-music-pc 的重构，是一个高仿网易云音乐的 PC 端 Web 应用。

- **核心**：Vite + Vue 3 + TypeScript + Pinia + Vue Router（hash 模式）
- **UI**：Element Plus + Tailwind CSS + Less
- **音视频**：原生 `<audio>`（歌曲播放）、xgplayer（MV 播放，支持清晰度切换）
- **其它**：axios（统一请求封装）、colorthief（封面主题色提取）、lodash-es
- **工程化**：unplugin-auto-import / unplugin-vue-components 自动引入、vite-plugin-compression 生成 gzip

## 后端

本项目后端来自:https://binaryify.github.io/NeteaseCloudMusicApi/
该项目已经被网易云律师函警告版权，源码下架，但是接口没有失效，可以在 GitHub 上找到其他用户备份的曾经的开源代码。

## 配置

### 开发环境

`vite.config.ts` 中配置代理，开发环境请求 `/api` 会转发到后端服务器：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://110.42.251.70:4000/', // 后端服务器地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

### 生产环境

`src/utils/request.ts` 会按环境选择请求地址：

- 开发环境：`/api`（走 Vite 代理）
- 生产环境：读取 `.env` 中的 `VITE_API_BASE_URL`（需以 `/` 结尾，构建时注入）

当后端服务器不可用时，需要自行部署 NeteaseCloudMusicApi，并同步修改上述两处地址。

## 本地运行

需要 Node 22。

```sh
pnpm i      # 或 npm i / yarn
pnpm dev    # 启动开发服务器
pnpm build  # 类型检查 + 打包
pnpm preview # 预览打包结果
```

## 部署

项目提供 Docker + Nginx 部署脚本 `scripts/deploy.js`。在 `.env` 中配置服务器信息后执行：

```sh
pnpm deploy
```

脚本会先打包，再通过 SSH 上传 `dist`、`Dockerfile` 和 `default.conf`，在远端重新构建并启动容器（映射 81 端口）。

`.env` 配置项见 `.env.example`：

```sh
SSH_HOST='云服务器 IP'
SSH_PORT='SSH 端口'
SSH_USERNAME='用户名'
SSH_PASSWORD='密码'
VITE_API_BASE_URL='http://后端地址:端口/' # 需以 / 结尾
```

## 功能介绍

### 菜单

#### 发现音乐（主页）

- 个性推荐（Banner 轮播、推荐歌单）
- 歌单（热门标签切换、滚动到底部加载更多）
- 排行榜（官方榜 / 全球榜）
- 歌手（地区、类型、首字母筛选，分页加载）

#### MV 视频

- 地区 / 类型 / 排序分类
- MV 列表与分页加载
- 二次封装 xgplayer 视频播放器（1080P / 720P / 480P 清晰度切换）

#### 个人信息

- 创建的歌单
- 收藏的歌单
- 关注列表、粉丝列表
- 动态（分享的单曲/歌单/专辑/视频等，分页加载，可点击跳转对应详情页）

#### 登录模块

- 自动生成二维码扫码登录（定时轮询状态，过期可刷新）
- cookie 保存在 localStorage，下次打开不用重新登录

#### 搜索模块

- 搜索歌曲、歌手、歌单、专辑、MV，均支持分页
- 搜索框防抖、热搜榜

#### 播放模块

- 播放/暂停、上一首/下一首、进度条拖拽
- 音量控制与静音
- 播放模式（顺序播放、随机播放、单曲循环）
- 播放列表抽屉、歌曲详情抽屉
- 快速切歌时丢弃过期请求，只让最后一次加载生效
- VIP/试听歌曲播放结束后提示并停止

#### 歌曲下载

- 先弹「另存为」对话框，确认后把响应体流式写入磁盘（File System Access API），不整块占用内存
- 不支持该 API 的浏览器回退为 blob 下载

### 分页

#### 歌曲详情页

- 歌词滚动
- 封面主题色背景
- 最新热评

#### 歌单 / 专辑 / 排行榜详情页

- 播放全部、收藏/取消收藏
- 歌单评论
- 歌曲列表
- 歌单/专辑介绍

#### 歌手详情页

- 热门歌曲
- 歌手自己的 MV
- 专辑
- 歌手介绍
- 关注/取消关注

#### MV 详情页

- MV 播放
- 评论

#### 用户详情页

- 关注、粉丝列表
- 创建/收藏的歌单
- 用户动态

#### 评论模块

- 热门评论
- 最新评论
- 评论人用户详情页链接

### 其它细节

- 主内容区背景色随详情页封面主题色变化（封面加载后提取主色并浅化，保证文字可读）
- 歌单/歌手/视频卡片使用封面主题色渐变
- 列表图片统一通过 `optimizeImageUrl` 添加尺寸参数，减少流量
