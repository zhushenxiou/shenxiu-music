/**
 *
 */
import axios from 'axios'

let url = ''

// 判断环境变量，避免直接使用 process.env 导致问题
const isDevelopment = import.meta.env.MODE === 'development'

if (isDevelopment) {
  url = '/api'
} else {
  // 生产环境
  url = 'http://8.137.110.245:3000/'
}

const requests = axios.create({
  baseURL: url,
  timeout: 8000, // 设置请求超时时间
  withCredentials: true, // 允许跨域并携带 Cookie
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // 添加 Bearer 前缀更规范
  }
  return config
})

// 响应拦截器
requests.interceptors.response.use(
  (res) => {
    return res.data // 返回响应数据
  },
  (error) => {
    console.error('请求错误:', error.message) // 更详细的错误日志
    return Promise.reject(error)
  },
)

export default requests
