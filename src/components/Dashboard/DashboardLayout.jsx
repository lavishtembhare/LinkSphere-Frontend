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
} from 'react-icons/fi'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useTotalClicks, useMyUrls } from '../../hooks/useQuery'
import Graph from './Graph'
import ShortenPopUp from './ShortenPopUp'
import ShortenUrlList from './ShortenUrlList'
import Loader from '../Loader'

const DashboardLayout = () => {
  const { token } = useStoreContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [shortenPopUp, setShortenPopUp] = useState(false)
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

  // 1. Daily Click Telemetry
  const {
    data: totalClicksData = [],
    isLoading: isClicksLoading,
    isFetching: isClicksFetching,
    refetch: refetchClicks,
  } = useTotalClicks(startDateStr, endDateStr, Boolean(token))

  // 2. User's Managed Links
  const {
    data: myUrlsData = [],
    isLoading: isUrlsLoading,
    refetch: refetchMyUrls,
  } = useMyUrls(Boolean(token))

  const calculatedTotalClicks = useMemo(() => {
    return totalClicksData.reduce((acc, curr) => acc + curr.clickCount, 0)
  }, [totalClicksData])

  const handleRefetch = async () => {
    await Promise.all([
      refetchClicks(),
      refetchMyUrls(),
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] }),
      queryClient.invalidateQueries({ queryKey: ['my-urls'] }),
    ])
  }

  // Display orbital loader on initial page load
  if (isClicksLoading && isUrlsLoading) {
    return <Loader label="Bootstrapping Command Center Telemetry..." />
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
              onClick={() => setShortenPopUp(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-cyan px-5 py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.03]"
            >
              <FiPlus size={16} />
              <span>Create Short Link</span>
            </button>

            {/* Total Clicks */}
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

            {/* Total Managed Links */}
            <div className="flex items-center gap-3 rounded-2xl border border-edge-subtle bg-surface-card px-4 py-2.5 shadow-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-cyan">
                <FiLayers size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Active Links</p>
                <p className="font-mono text-lg font-bold text-white">
                  {isUrlsLoading ? '...' : myUrlsData.length}
                </p>
              </div>
            </div>
          </div>
        </div>

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
              onClick={handleRefetch}
              className="flex items-center gap-1.5 rounded-lg border border-edge-subtle bg-ink-950 px-3 py-1 text-xs text-slate-400 transition-colors hover:text-white"
            >
              <FiRefreshCw size={12} className={isClicksFetching ? 'animate-spin text-accent-cyan' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Telemetry Chart */}
        <Graph
          graphData={totalClicksData}
          isLoading={isClicksLoading || isClicksFetching}
        />

        {/* Action Trigger Card */}
        <div className="relative overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/85 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                Ready to generate another vanity slug?
              </h3>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Shorten target links and monitor traffic telemetry in real time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShortenPopUp(true)}
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.03]"
            >
              <FiZap size={15} />
              <span>Create a New Short URL</span>
            </button>
          </div>
        </div>

        {/* Managed Short URLs List */}
        <ShortenUrlList data={myUrlsData} isLoading={isUrlsLoading} />
      </div>

      {/* Modal Popup */}
      <ShortenPopUp
        open={shortenPopUp}
        setOpen={setShortenPopUp}
        refetch={handleRefetch}
      />
    </div>
  )
}

export default DashboardLayout