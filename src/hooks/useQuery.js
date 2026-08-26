import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/api'

// 1. Fetch Total Clicks across all links for user
export const useTotalClicks = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['url-totalClicks', startDate, endDate],
    queryFn: async () => {
      const res = await api.get('/api/urls/totalClicks', {
        params: {
          startDate,
          endDate,
        },
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

// 2. Fetch User's Managed Short URLs
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

// 3. Fetch Single Link Analytics
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

      return {
        timeline,
        raw: rawEvents,
      }
    },
    enabled: Boolean(enabled && shortUrl),
    staleTime: 1000 * 60 * 2,
  })
}

// 4. Delete Short URL Mutation
export const useDeleteUrl = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (shortUrl) => {
      const res = await api.delete('/api/urls/', {
        params: {
          shortUrl,
        },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-urls'] })
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] })
    },
  })
}