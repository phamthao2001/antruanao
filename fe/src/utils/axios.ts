import axios from 'axios'

import { useLoading } from './loading'

const { loading } = useLoading()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Đổi thành URL BE của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Bắt đầu loading trước khi gửi request
    loading.value = true
    return config
  },
  (error) => {
    // Kết thúc loading nếu có lỗi
    loading.value = false
    return Promise.reject(error)
  },
)

// Optional: interceptor cho request/response
api.interceptors.response.use(
  (response) => {
    loading.value = false
    return response.data
  },
  (error) => {
    // Xử lý lỗi chung
    return Promise.reject(error)
  },
)

export default api
