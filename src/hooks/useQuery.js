import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/api'

// 1. Daily Click Telemetry
export const useTotalClicks = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['url-totalClicks', startDate, endDate],
    queryFn: async () => {
      const res = await api.get('/api/urls/totalClicks', {
        params: { startDate, endDate },
      })

      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
        return Object.entries(res.data)
          .map(([date, clickCount]) => ({
            date,
            clickCount: Number(clickCount),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      }

      return Array.isArray(res.data) ? res.data : []
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}

// 2. AI-Generated Plain English Click Summary
// AI-Generated Plain English Click Summary
export const useTotalClicksSummary = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['url-totalClicks-summary', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return ''

      const res = await api.get('/api/urls/totalClicks/summary', {
        params: {
          startDate, // Format: YYYY-MM-DD
          endDate,
        },
      })

      if (typeof res.data === 'string') return res.data
      return res.data?.summary || ''
    },
    enabled: Boolean(enabled && startDate && endDate),
    staleTime: 1000 * 60 * 5,
  })
}

// 3. User's Managed Links
export const useMyUrls = (enabled = true) => {
  return useQuery({
    queryKey: ['my-urls'],
    queryFn: async () => {
      const res = await api.get('/api/urls/myurls')
      return Array.isArray(res.data) ? res.data : []
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}

// 4. Natural-Language Link Search (LLM-matched)
export const useSearchUrls = (query, enabled = false) => {
  return useQuery({
    queryKey: ['my-urls-search', query],
    queryFn: async () => {
      if (!query.trim()) return []
      const res = await api.get('/api/urls/search', {
        params: { query },
      })
      return Array.isArray(res.data) ? res.data : []
    },
    enabled: Boolean(enabled && query.trim()),
    staleTime: 1000 * 60 * 1,
  })
}

// 5. Single Link Analytics
export const useUrlAnalytics = (shortUrl, startDateStr, endDateStr, enabled = true) => {
  return useQuery({
    queryKey: ['url-analytics', shortUrl, startDateStr, endDateStr],
    queryFn: async () => {
      if (!shortUrl) return { timeline: [], raw: [] }

      const startDateTime = `${startDateStr}T00:00:00`
      const endDateTime = `${endDateStr}T23:59:59`

      const res = await api.get(`/api/urls/analytics/${shortUrl}`, {
        params: {
          startDate: startDateTime,
          endDate: endDateTime,
        },
      })

      const rawEvents = Array.isArray(res.data) ? res.data : []
      const aggregated = rawEvents.reduce((acc, curr) => {
        const dateKey = curr.clickDate ? curr.clickDate.split('T')[0] : 'Recent'
        acc[dateKey] = (acc[dateKey] || 0) + (curr.count || 1)
        return acc
      }, {})

      const timeline = Object.entries(aggregated).map(([date, clickCount]) => ({
        date,
        clickCount,
      }))

      return { timeline, raw: rawEvents }
    },
    enabled: Boolean(enabled && shortUrl),
    staleTime: 1000 * 60 * 2,
  })
}

// Manual Status Toggle (Active / Disabled)
export const useToggleUrlStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ shortUrl, active }) => {
      const res = await api.patch(`/api/urls/${shortUrl}/status`, { active })
      return res.data
    },
    onSuccess: (updatedUrl) => {
      // Optimistically update the cache without triggering a full refetch
      queryClient.setQueryData(['my-urls'], (oldUrls = []) =>
        oldUrls.map((url) => (url.shortUrl === updatedUrl.shortUrl ? updatedUrl : url))
      )
      // Also invalidate to sync with server state
      queryClient.invalidateQueries({ queryKey: ['my-urls'] })
    },
  })
}

// 7. Delete Link
export const useDeleteUrl = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (shortUrl) => {
      const res = await api.delete(`/api/urls/${shortUrl}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-urls'] })
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] })
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks-summary'] })
    },
  })
}