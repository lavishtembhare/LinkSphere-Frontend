import React, { useState, useMemo } from 'react'
import Modal from '@mui/material/Modal'
import { Tooltip as MuiTooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import {
  FiMousePointer,
  FiLink,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiClock,
} from 'react-icons/fi'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'
import { useUrlAnalytics } from '../../hooks/useQuery'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
)

const UrlDetailsPopUp = ({ open, setOpen, item }) => {
  const [chartType, setChartType] = useState('line')
  const [copied, setCopied] = useState(false)

  // 14-day date range for the mini velocity graph
  const { startDateStr, endDateStr } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 14)

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
  }, [])

  // Fetch telemetry events for this link
  const { data: analyticsData, isLoading } = useUrlAnalytics(
    item?.shortUrl,
    startDateStr,
    endDateStr,
    Boolean(open && item?.shortUrl)
  )

  const timelineData = analyticsData?.timeline || []

  // Construct full shortened URL
  const subdomain = import.meta.env.VITE_REACT_SUBDOMAIN || window.location.origin
  const baseUrl = subdomain.endsWith('/') ? subdomain.slice(0, -1) : subdomain
  const fullShortUrl = `${baseUrl}/${item?.shortUrl || ''}`

  const formattedCreatedDate = item?.createdDate
    ? new Date(item.createdDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      setCopied(true)
      toast.success('Short link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  // Mini Chart Configuration
  const labels = timelineData.map((d) => {
    const parts = d.date.split('-')
    return parts.length === 3 ? `${parts[1]}/${parts[2]}` : d.date
  })
  const clickValues = timelineData.map((d) => d.clickCount)

  const chartConfigData = {
    labels: labels.length ? labels : ['No Data'],
    datasets: [
      {
        label: 'Clicks',
        data: clickValues.length ? clickValues : [0],
        borderColor: '#38BDF8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          if (chartType === 'line') {
            const gradient = ctx.createLinearGradient(0, 0, 0, 160)
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)')
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)')
            return gradient
          }
          return 'rgba(56, 189, 248, 0.75)'
        },
        borderRadius: chartType === 'bar' ? 4 : 0,
        fill: chartType === 'line',
        tension: 0.35,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#38BDF8',
        pointRadius: chartType === 'line' ? 3 : 0,
        pointHoverRadius: 5,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#080E21',
        titleColor: '#F8FAFC',
        bodyColor: '#38BDF8',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Clicks: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#94A3B8', font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#94A3B8', font: { size: 10 }, precision: 0, stepSize: 1 },
      },
    },
  }

  if (!item) return null

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="url-details-title"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <div className="flex h-full w-full items-center justify-center p-4 outline-none">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/95 p-6 shadow-2xl shadow-accent-blue/10 sm:p-7 backdrop-blur-2xl">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent-blue/20 blur-[80px]" />

          {/* Close Button */}
          <MuiTooltip title="Close" arrow>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 rounded-xl border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <RxCross2 className="text-xl" />
            </button>
          </MuiTooltip>

          {/* Header */}
          <div className="mb-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
              Telemetry Inspector
            </span>
            <h2 className="mt-0.5 font-display text-xl font-bold text-white">
              Link Insights & Analytics
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* 1. GRAPH */}
            <div className="rounded-2xl border border-edge-subtle bg-ink-950/70 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <FiCalendar size={12} className="text-accent-cyan" />
                  <span>Velocity (Last 14 Days)</span>
                </div>

                <div className="flex rounded-lg border border-edge-subtle bg-ink-900 p-0.5">
                  <button
                    type="button"
                    onClick={() => setChartType('line')}
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
                      chartType === 'line'
                        ? 'bg-accent-blue/20 text-accent-cyan'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartType('bar')}
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
                      chartType === 'bar'
                        ? 'bg-accent-blue/20 text-accent-cyan'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bar
                  </button>
                </div>
              </div>

              <div className="flex h-32 w-full items-center justify-center">
                {isLoading ? (
                  /* Mini Mutating Dots Loader */
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_10px_#38BDF8] [animation-delay:-0.32s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-blue shadow-[0_0_10px_#3B82F6] [animation-delay:-0.16s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      Loading Velocity...
                    </span>
                  </div>
                ) : chartType === 'line' ? (
                  <Line data={chartConfigData} options={chartOptions} />
                ) : (
                  <Bar data={chartConfigData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* 2. TOTAL CLICKS & CREATED DATE */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-accent-blue/20 bg-accent-blue/10 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-blue/20 text-accent-cyan shadow-glow-blue">
                  <FiMousePointer size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                    Total Clicks
                  </p>
                  <p className="font-mono text-xl font-extrabold text-white">
                    {item.clickCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-edge-subtle bg-ink-950/70 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-card text-slate-400">
                  <FiClock size={16} className="text-accent-blue" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Created On
                  </p>
                  <p className="truncate font-mono text-xs font-bold text-slate-200" title={formattedCreatedDate}>
                    {formattedCreatedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. ORIGINAL URL */}
            <div className="rounded-2xl border border-edge-subtle bg-ink-950/60 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Original Destination Target
              </span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs text-slate-300" title={item.originalUrl}>
                  {item.originalUrl}
                </span>
                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-edge-subtle px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
                >
                  <span>Visit</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* 4. SHORTEN URL (WITH COPY BUTTON) */}
            <div className="rounded-2xl border border-accent-cyan/30 bg-accent-cyan/5 p-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                Short URL Alias
              </span>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden font-mono text-sm font-bold text-white">
                  <FiLink className="shrink-0 text-accent-cyan" size={15} />
                  <span className="truncate text-accent-cyan">{fullShortUrl}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    copied
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'bg-accent-blue text-ink hover:bg-accent-cyan shadow-glow-blue'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UrlDetailsPopUp