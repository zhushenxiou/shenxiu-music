// element-plus 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//element-plus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// element-plus ElMessage
import 'element-plus/theme-chalk/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

//所有图标组件注册到 Vue 应用实例
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
