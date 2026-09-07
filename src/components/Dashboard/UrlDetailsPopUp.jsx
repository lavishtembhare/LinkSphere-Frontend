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
  FiTrash2,
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
import { useUrlAnalytics, useDeleteUrl } from '../../hooks/useQuery'

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
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteUrlMutation = useDeleteUrl()

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

  const { data: analyticsData, isLoading } = useUrlAnalytics(
    item?.shortUrl,
    startDateStr,
    endDateStr,
    Boolean(open && item?.shortUrl)
  )

  const timelineData = analyticsData?.timeline || []

  // Safe fallback to prevent undefined.endsWith() exceptions
  const subdomain =
    // import.meta.env.VITE_REACT_SUBDOMAIN 
    import.meta.env.VITE_BACKEND_URL 

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete short URL /${item?.shortUrl}?`)
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      await deleteUrlMutation.mutateAsync(item.shortUrl)
      toast.success('Short link deleted successfully')
      setOpen(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete link')
    } finally {
      setIsDeleting(false)
    }
  }

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
            const gradient = ctx.createLinearGradient(0, 0, 0, 140)
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
        pointRadius: chartType === 'line' ? 2.5 : 0,
        pointHoverRadius: 4,
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
        padding: 6,
        displayColors: false,
        callbacks: {
          label: (context) => `Clicks: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#94A3B8', font: { size: 9 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#94A3B8', font: { size: 9 }, precision: 0, stepSize: 1 },
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
      <div className="flex h-full w-full items-center justify-center p-3 outline-none sm:p-4">
        <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-edge-subtle bg-surface-card/95 p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent-blue/20 blur-[70px] sm:h-48 sm:w-48 sm:blur-[80px]" />

          <MuiTooltip title="Close" arrow>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3.5 top-3.5 rounded-lg border border-edge-subtle bg-ink-950/60 p-1 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white sm:right-5 sm:top-5 sm:rounded-xl sm:p-1.5"
            >
              <RxCross2 className="text-lg sm:text-xl" />
            </button>
          </MuiTooltip>

          <div className="mb-3 pr-6 sm:mb-4">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
              Telemetry Inspector
            </span>
            <h2 className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
              Link Insights & Analytics
            </h2>
          </div>

          <div className="space-y-3">
            {/* Velocity Graph */}
            <div className="rounded-xl border border-edge-subtle bg-ink-950/70 p-3 sm:rounded-2xl sm:p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 sm:text-xs">
                  <FiCalendar size={11} className="text-accent-cyan" />
                  <span>Velocity (14D)</span>
                </div>

                <div className="flex rounded-lg border border-edge-subtle bg-ink-900 p-0.5">
                  <button
                    type="button"
                    onClick={() => setChartType('line')}
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold transition-all sm:px-2 sm:text-[10px] ${
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
                    className={`rounded px-1.5 py-0.5 text-[9px] font-semibold transition-all sm:px-2 sm:text-[10px] ${
                      chartType === 'bar'
                        ? 'bg-accent-blue/20 text-accent-cyan'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bar
                  </button>
                </div>
              </div>

              <div className="flex h-28 w-full items-center justify-center sm:h-32">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_8px_#38BDF8] [animation-delay:-0.32s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-accent-blue shadow-[0_0_8px_#3B82F6] [animation-delay:-0.16s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-white shadow-[0_0_8px_#FFFFFF]" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      Loading...
                    </span>
                  </div>
                ) : chartType === 'line' ? (
                  <Line data={chartConfigData} options={chartOptions} />
                ) : (
                  <Bar data={chartConfigData} options={chartOptions} />
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-accent-blue/20 bg-accent-blue/10 p-2.5 sm:rounded-2xl sm:gap-3 sm:p-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-blue/20 text-accent-cyan sm:h-9 sm:w-9 sm:rounded-xl">
                  <FiMousePointer size={14} className="sm:text-[16px]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-bold uppercase tracking-wider text-accent-cyan sm:text-[10px]">
                    Total Clicks
                  </p>
                  <p className="font-mono text-base font-extrabold text-white sm:text-xl">
                    {item.clickCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-edge-subtle bg-ink-950/70 p-2.5 sm:rounded-2xl sm:gap-3 sm:p-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-card text-slate-400 sm:h-9 sm:w-9 sm:rounded-xl">
                  <FiClock size={14} className="text-accent-blue sm:text-[16px]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                    Created On
                  </p>
                  <p className="truncate font-mono text-[11px] font-bold text-slate-200 sm:text-xs" title={formattedCreatedDate}>
                    {formattedCreatedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Destination Target */}
            <div className="rounded-xl border border-edge-subtle bg-ink-950/60 p-2.5 sm:rounded-2xl sm:p-3.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                Destination Target
              </span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[11px] text-slate-300 sm:text-xs" title={item.originalUrl}>
                  {item.originalUrl}
                </span>
                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-edge-subtle px-2 py-0.5 text-[10px] font-semibold text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white sm:text-[11px]"
                >
                  <span>Visit</span>
                  <FiExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Short URL Box */}
            <div className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-2.5 sm:rounded-2xl sm:p-3.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-accent-cyan sm:text-[10px]">
                Short URL Alias
              </span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-hidden font-mono text-xs font-bold text-white sm:text-sm">
                  <FiLink className="shrink-0 text-accent-cyan" size={14} />
                  <span className="truncate text-accent-cyan">{fullShortUrl}</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${
                    copied
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'bg-accent-blue text-ink hover:bg-accent-cyan shadow-glow-blue'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={12} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={12} /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Delete Modal Action */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                ) : (
                  <FiTrash2 size={13} />
                )}
                <span>Delete Short Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default UrlDetailsPopUp