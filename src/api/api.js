import axios from 'axios'

const api = axios.create({
  baseURL: '', // Empty base URL routes through Vite dev server proxy
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach Bearer token to proxied requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api