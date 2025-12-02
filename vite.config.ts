import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import compression from 'vite-plugin-compression'

export default defineConfig({
  css: {
    // 关闭css sourcemap，减少文件大小
    devSourcemap: false,
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Icons({
      // 自动安装图标组件
      autoInstall: true,
    }),
    // 压缩插件：为所有静态资源添加压缩
    compression({
      verbose: true, // 显示压缩信息
      disable: false, // 开发环境不压缩
      threshold: 10240, // 10KB以上压缩
      algorithm: 'gzip', // 使用gzip压缩
      ext: '.gz', // 压缩文件扩展名
    }),
    // 自定义插件：为所有script标签添加defer属性
    {
      name: 'add-script-defer',
      transformIndexHtml(html) {
        // 正则匹配：为没有defer的script标签添加defer（避免重复）
        return html.replace(/<script(?!.*\bdefer\b)(.*?)>/g, '<script$1 defer>')
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 优化FCP速度的构建配置
  build: {
    chunkSizeWarningLimit: 1024, // 1024KB警告阈值
    // 使用默认的esbuild作为压缩工具
    minify: 'esbuild',
    // 简化代码分割配置，避免初始化顺序问题
    rollupOptions: {
      output: {
        // 只对大型第三方库进行分割
        manualChunks(id) {
          // 只分割明显的外部依赖
          if (id.includes('node_modules')) {
            // 只分割大型库
            if (id.includes('element-plus')) {
              return 'element-plus'
            }
            // 对于其他依赖，让rollup自动处理以避免初始化问题
          }
        }
      },
    },
  },
  // 配置服务器优化
  server: {
    fs: {
      // 启用更快的文件系统
      strict: false,
    },
    // 配置代理
    proxy: {
      '/api': {
        target: 'http://117.72.189.56:3001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
