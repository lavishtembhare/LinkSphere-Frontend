import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

// 1. Fetch Total Clicks across all links for user
export const useTotalClicks = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['url-totalClicks', startDate, endDate],
    queryFn: async () => {
      const res = await api.get('/api/urls/totalClicks', {
        params: {
          startDate, // Format: YYYY-MM-DD (matches ISO_LOCAL_DATE)
          endDate,
        },
      })

      // Backend returns Map<LocalDate, Long>: { "2026-08-01": 5, "2026-08-02": 12 }
      // Transform into [{ date: '2026-08-01', clickCount: 5 }, ...]
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
    staleTime: 1000 * 60 * 2, // 2 mins cache
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

      // Append T00:00:00 & T23:59:59 to satisfy backend ISO_LOCAL_DATE_TIME parser
      const startDateTime = `${startDateStr}T00:00:00`
      const endDateTime = `${endDateStr}T23:59:59`

      const res = await api.get(`/api/urls/analytics/${shortUrl}`, {
        params: {
          startDate: startDateTime,
          endDate: endDateTime,
        },
      })

      const rawEvents = Array.isArray(res.data) ? res.data : []

      // Group click events by day for graph rendering
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