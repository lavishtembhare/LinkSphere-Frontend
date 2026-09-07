import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  FiMousePointer,
  FiCalendar,
  FiRefreshCw,
  FiPlus,
  FiZap,
  FiLayers,
  FiTrendingUp,
  FiSettings,
} from 'react-icons/fi'
import { useStoreContext } from '../../contextApi/contextApi'
import { useTotalClicks, useMyUrls, useTotalClicksSummary } from '../../hooks/useQuery'
import Graph from './Graph'
import ShortenPopUp from './ShortenPopUp'
import ShortenUrlList from './ShortenUrlList'
import AccountSettingsModal from './AccountSettingsModal'
import Loader from '../Loader'

const DashboardLayout = () => {
  const { token } = useStoreContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [shortenPopUp, setShortenPopUp] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [dayRange, setDayRange] = useState(25)

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

  const {
    data: totalClicksData = [],
    isLoading: isClicksLoading,
    isFetching: isClicksFetching,
    refetch: refetchClicks,
  } = useTotalClicks(startDateStr, endDateStr, Boolean(token))

  const {
    data: myUrlsData = [],
    isLoading: isUrlsLoading,
    refetch: refetchMyUrls,
  } = useMyUrls(Boolean(token))

  const {
    data: aiClickSummary = '',
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useTotalClicksSummary(startDateStr, endDateStr, Boolean(token))

  const calculatedTotalClicks = useMemo(() => {
    return totalClicksData.reduce((acc, curr) => acc + curr.clickCount, 0)
  }, [totalClicksData])

  const handleRefetch = async () => {
    await Promise.all([
      refetchClicks(),
      refetchMyUrls(),
      refetchSummary(),
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] }),
      queryClient.invalidateQueries({ queryKey: ['my-urls'] }),
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks-summary'] }),
    ])
  }

  if (isClicksLoading && isUrlsLoading) {
    return <Loader label="Bootstrapping Command Center Telemetry..." />
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-ink bg-grid-pattern px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-accent-blue/10 blur-[120px] sm:h-[450px] sm:w-[650px] sm:blur-[140px]" />

      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header & Metric Cards */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-xs">
              Command Center
            </span>
            <h1 className="mt-0.5 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
              Welcome back, <span className="capitalize text-accent-cyan">{username}</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {/* Create Short Link Button */}
            <button
              type="button"
              onClick={() => setShortenPopUp(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] sm:px-5 sm:py-3"
            >
              <FiPlus size={15} />
              <span>Create Short Link</span>
            </button>

            {/* Account Settings Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-edge-subtle bg-surface-card px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white sm:px-4 sm:py-3"
            >
              <FiSettings size={15} className="text-accent-cyan" />
              <span>Settings</span>
            </button>

            {/* Total Clicks Card */}
            <div className="flex items-center gap-2.5 rounded-xl border border-edge-subtle bg-surface-card px-3 py-2 shadow-md sm:rounded-2xl sm:px-4 sm:py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-cyan sm:h-9 sm:w-9 sm:rounded-xl">
                <FiMousePointer size={15} className="sm:text-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[9px] uppercase tracking-wider text-slate-400 sm:text-[10px]">
                  Total Clicks
                </p>
                <p className="font-mono text-base font-bold text-white sm:text-lg">
                  {isClicksLoading ? '...' : calculatedTotalClicks}
                </p>
              </div>
            </div>

            {/* Active Links Card */}
            <div className="flex items-center gap-2.5 rounded-xl border border-edge-subtle bg-surface-card px-3 py-2 shadow-md sm:rounded-2xl sm:px-4 sm:py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-cyan sm:h-9 sm:w-9 sm:rounded-xl">
                <FiLayers size={15} className="sm:text-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[9px] uppercase tracking-wider text-slate-400 sm:text-[10px]">
                  Active Links
                </p>
                <p className="font-mono text-base font-bold text-white sm:text-lg">
                  {isUrlsLoading ? '...' : myUrlsData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Plain-English Click Intelligence Summary Banner */}
        {aiClickSummary && (
          <div className="relative overflow-hidden rounded-2xl border border-accent-cyan/30 bg-gradient-to-r from-accent-blue/10 via-surface-card to-accent-cyan/10 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-cyan/20 text-accent-cyan shadow-glow-cyan">
                <FiTrendingUp size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
                    AI Traffic Intelligence
                  </span>
                  <span className="rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[9px] font-bold text-accent-cyan">
                    Groq Accelerated
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {aiClickSummary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-edge-subtle bg-ink-950/60 p-2.5 backdrop-blur-md sm:p-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300 sm:text-xs">
            <FiCalendar className="text-accent-cyan" size={13} />
            <span>
              {startDateStr} &rarr; {endDateStr}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {[7, 14, 25, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDayRange(days)}
                className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition-all sm:px-2.5 sm:py-1 sm:text-xs ${
                  dayRange === days
                    ? 'border border-accent-blue/40 bg-accent-blue/20 text-accent-cyan'
                    : 'border border-edge-subtle bg-ink-900 text-slate-400 hover:text-white'
                }`}
              >
                {days}D
              </button>
            ))}

            <button
              type="button"
              onClick={handleRefetch}
              className="flex items-center gap-1 rounded-lg border border-edge-subtle bg-ink-900 px-2.5 py-0.5 text-[11px] text-slate-400 transition-colors hover:text-white sm:px-3 sm:py-1 sm:text-xs"
            >
              <FiRefreshCw
                size={11}
                className={isClicksFetching ? 'animate-spin text-accent-cyan' : ''}
              />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Telemetry Chart */}
        <Graph
          graphData={totalClicksData}
          isLoading={isClicksLoading || isClicksFetching}
        />

        {/* Action Trigger Card */}
        <div className="relative overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/85 p-4 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:p-7">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <h3 className="font-display text-base font-bold text-white sm:text-lg lg:text-xl">
                Ready to generate another smart vanity slug?
              </h3>
              <p className="text-xs text-slate-400">
                Automated AI slug synthesis, phishing screening, and background metadata extraction.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShortenPopUp(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] sm:px-5 sm:py-3"
            >
              <FiZap size={14} />
              <span>Create New URL</span>
            </button>
          </div>
        </div>

        {/* Managed URLs List with AI Natural Search */}
        <ShortenUrlList data={myUrlsData} isLoading={isUrlsLoading} />
      </div>

      {/* Shorten Link Modal Popup */}
      <ShortenPopUp
        open={shortenPopUp}
        setOpen={setShortenPopUp}
        refetch={handleRefetch}
      />

      {/* Account Settings & Security Modal */}
      <AccountSettingsModal
        open={settingsOpen}
        setOpen={setSettingsOpen}
        currentUsername={username}
      />
    </div>
  )
}

export default DashboardLayout