import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_BACKEND_URL || ''),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach the clean Access Token to every request
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem('token')
    if (rawToken) {
      const cleanToken = rawToken
        .replace(/^Bearer\s+/i, '')
        .replace(/["']/g, '')
        .trim()

      config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api