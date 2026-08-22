import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  FiLink,
  FiZap,
  FiMousePointer,
  FiCalendar,
  FiRefreshCw,
  FiPlus,
  FiX,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useStoreContext } from '../contextApi/ContextApi'
import { useTotalClicks } from '../hooks/useQuery'
import Graph from './Graph'

const DashboardLayout = () => {
  
  const { token } = useStoreContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [originalUrl, setOriginalUrl] = useState('')
  const [isShortening, setIsShortening] = useState(false)
  const [dayRange, setDayRange] = useState(25) // Default 25-day view

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const username = useMemo(() => {
    if (!token) return 'User'
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const parsed = JSON.parse(jsonPayload)
      return parsed.sub || parsed.username || 'User'
    } catch {
      return 'User'
    }
  }, [token])

  // Compute dynamic start and end dates (YYYY-MM-DD)
  const { startDateStr, endDateStr } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - dayRange)

    const format = (d) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    return {
      startDateStr: format(start),
      endDateStr: format(end),
    }
  }, [dayRange])

  // Fetch telemetry click data using Bearer token from api.js interceptor
  const {
    data: totalClicksData = [],
    isLoading: isClicksLoading,
    refetch: refetchClicks,
  } = useTotalClicks(startDateStr, endDateStr, Boolean(token))

  // Aggregate total clicks
  const calculatedTotalClicks = useMemo(() => {
    return totalClicksData.reduce((acc, curr) => acc + curr.clickCount, 0)
  }, [totalClicksData])

  const handleShorten = async (e) => {
    e.preventDefault()
    if (!originalUrl.trim()) return

    setIsShortening(true)
    try {
      await api.post('/api/urls/shorten', { originalUrl: originalUrl.trim() })
      toast.success('Short link generated!')
      setOriginalUrl('')
      setIsModalOpen(false)

      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate link')
    } finally {
      setIsShortening(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-ink bg-grid-pattern px-5 py-10 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-accent-blue/10 blur-[140px]" />

      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Summary Cards */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Command Center
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Welcome back, <span className="capitalize text-accent-cyan">{username}</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-cyan px-5 py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.03]"
            >
              <FiPlus size={16} />
              <span>Create Short Link</span>
            </button>

            <div className="flex items-center gap-3 rounded-2xl border border-edge-subtle bg-surface-card px-4 py-2.5 shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-cyan">
                <FiMousePointer size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Clicks</p>
                <p className="font-mono text-lg font-bold text-white">
                  {isClicksLoading ? '...' : calculatedTotalClicks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inline URL Generator */}
        <form onSubmit={handleShorten} className="rounded-2xl border border-edge-subtle bg-surface-card/90 p-3 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-edge-subtle bg-ink-950 px-4 py-2.5">
              <FiLink className="shrink-0 text-accent-blue" size={18} />
              <input
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="Paste long destination URL here (e.g., https://example.com/docs)..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isShortening}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              {isShortening ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              ) : (
                <>
                  <span>Shorten URL</span>
                  <FiZap size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Telemetry Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-accent-cyan" size={14} />
            <span className="font-mono text-xs text-slate-300">
              {startDateStr} &rarr; {endDateStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[7, 14, 25, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDayRange(days)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  dayRange === days
                    ? 'border border-accent-blue/40 bg-accent-blue/20 text-accent-cyan'
                    : 'border border-edge-subtle bg-ink-950 text-slate-400 hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}

            <button
              type="button"
              onClick={() => refetchClicks()}
              className="flex items-center gap-1.5 rounded-lg border border-edge-subtle bg-ink-950 px-3 py-1 text-xs text-slate-400 transition-colors hover:text-white"
            >
              <FiRefreshCw size={12} /> Refresh
            </button>
          </div>
        </div>

        {/* Graph Component */}
        <Graph graphData={totalClicksData} isLoading={isClicksLoading} />

      </div>

      {/* Modal Popup for Shortening */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-edge-subtle bg-surface-card p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <FiX size={18} />
            </button>

            <div className="mb-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
                New Link Generation
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                Create a Short URL
              </h2>
            </div>

            <form onSubmit={handleShorten} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Target Destination URL
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-edge-subtle bg-ink-950 px-4 py-3 focus-within:border-accent-blue">
                  <FiLink className="shrink-0 text-accent-blue" size={16} />
                  <input
                    type="url"
                    required
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://example.com/very-long-path"
                    className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-edge-subtle bg-ink-950 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isShortening}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isShortening ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  ) : (
                    <>
                      <span>Generate Link</span>
                      <FiZap size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout