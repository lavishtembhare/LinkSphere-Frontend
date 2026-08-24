import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://linksphere-backend-54oe.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach JWT token from LocalStorage to all outgoing requests
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