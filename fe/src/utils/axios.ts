import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Đổi thành URL BE của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: interceptor cho request/response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi chung
    return Promise.reject(error)
  },
)

export default api
