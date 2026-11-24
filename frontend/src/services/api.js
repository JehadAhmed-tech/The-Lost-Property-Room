import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('lpr_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lpr_token')
      localStorage.removeItem('lpr_user')
    }
    return Promise.reject(error)
  }
)

export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true'
export default api
