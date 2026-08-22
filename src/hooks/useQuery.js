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
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })
}