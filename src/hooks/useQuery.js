import { useQuery } from '@tanstack/react-query'
import api from '../api/api'

// Helper to fill missing dates in the range with 0 clicks
const formatTelemetryTimeline = (startDateStr, endDateStr, rawClickMap = {}) => {
  const timeline = []
  const current = new Date(`${startDateStr}T00:00:00`)
  const end = new Date(`${endDateStr}T00:00:00`)

  while (current <= end) {
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`

    timeline.push({
      date: dateKey,
      clickCount: rawClickMap[dateKey] ?? 0,
    })

    current.setDate(current.getDate() + 1)
  }
  return timeline
}

export const useTotalClicks = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['url-totalClicks', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/api/urls/totalClicks', {
        params: { startDate, endDate },
      })
      return response.data
    },
    select: (data) => formatTelemetryTimeline(startDate, endDate, data),
    enabled: Boolean(startDate && endDate && enabled),
    staleTime: 1000 * 60 * 2,
  })
}

export const useMyUrls = (enabled = true) => {
  return useQuery({
    queryKey: ['my-urls'],
    queryFn: async () => {
      const response = await api.get('/api/urls/myurls')
      return response.data
    },
    enabled: Boolean(enabled),
    staleTime: 1000 * 60 * 2,
  })
}

// GET /api/urls/analytics/{shortUrl}?startDate=...&endDate=...
export const useUrlAnalytics = (shortUrl, startDateStr, endDateStr, enabled = true) => {
  return useQuery({
    queryKey: ['url-analytics', shortUrl, startDateStr, endDateStr],
    queryFn: async () => {
      const response = await api.get(`/api/urls/analytics/${shortUrl}`, {
        params: {
          startDate: `${startDateStr}T00:00:00`,
          endDate: `${endDateStr}T23:59:59`,
        },
      })
      return response.data
    },
    select: (clickEvents = []) => {
      // Group raw click events by YYYY-MM-DD
      const dateCountMap = {}
      clickEvents.forEach((event) => {
        const rawDate = event.clickDate || event.timestamp || event.createdDate
        if (rawDate) {
          const day = rawDate.split('T')[0]
          dateCountMap[day] = (dateCountMap[day] || 0) + 1
        }
      })
      return {
        events: clickEvents,
        timeline: formatTelemetryTimeline(startDateStr, endDateStr, dateCountMap),
        periodClicks: clickEvents.length,
      }
    },
    enabled: Boolean(shortUrl && startDateStr && endDateStr && enabled),
    staleTime: 1000 * 60 * 2,
  })
}