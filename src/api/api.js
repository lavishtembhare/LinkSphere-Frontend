// src/api/api.js
import axios from 'axios'

const baseURL = import.meta.env.DEV ? '' : (import.meta.env.VITE_BACKEND_URL || '')

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Attach latest access token to outgoing requests
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

// Concurrency queue to prevent duplicate /refresh calls
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// Intercept 401 Unauthorized responses to silently refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    const is401 = error.response.status === 401
    const isPublicAuthUrl = originalRequest.url?.includes('/api/auth/public/')

    if (is401 && !originalRequest._retry && !isPublicAuthUrl) {
      const refreshToken = localStorage.getItem('refreshToken')

      // No refresh token available -> session cannot be renewed
      if (!refreshToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // If a refresh is already in progress, enqueue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Use bare axios instance to prevent interceptor loops
        const { data } = await axios.post(
          `${baseURL}/api/auth/public/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken.trim()}`,
            },
          }
        )

        const newAccessToken = (data?.token || data?.accessToken || '').trim()

        if (!newAccessToken) {
          throw new Error('No access token returned by refresh endpoint')
        }

        // Store new access token
        localStorage.setItem('token', newAccessToken)
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Resolve queued requests with the new token
        processQueue(null, newAccessToken)

        // Retry the original failed request
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api