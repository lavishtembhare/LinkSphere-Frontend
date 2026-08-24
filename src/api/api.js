import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://linksphere-backend-bn1u.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Sanitize and inject Bearer token into all requests
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem('token')
    if (rawToken) {
      const cleanToken = rawToken.replace(/^Bearer\s+/i, '').replace(/["']/g, '').trim()
      config.headers.Authorization = `Bearer ${cleanToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api