import React, { useState } from 'react'
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiMousePointer,
  FiCalendar,
  FiBarChart2,
  FiTrash2,
  FiAlertTriangle,
  FiPower,
  FiFileText,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDeleteUrl, useToggleUrlStatus } from '../../hooks/useQuery'
import UrlDetailsPopUp from './UrlDetailsPopUp'

const ShortenItem = ({
  id,
  originalUrl,
  shortUrl,
  clickCount,
  createdDate,
  active = true,
  disabledReason = null,
  previewTitle = null,
  previewDescription = null,
}) => {
  const [copied, setCopied] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteUrlMutation = useDeleteUrl()
  const toggleStatusMutation = useToggleUrlStatus()

  const subdomain =
    // import.meta.env.VITE_REACT_SUBDOMAIN
  import.meta.env.VITE_BACKEND_URL 
  const baseUrl = subdomain.endsWith('/') ? subdomain.slice(0, -1) : subdomain
  const fullShortUrl = `${baseUrl}/${shortUrl}`

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

  const handleToggleStatus = async () => {
    const nextState = !active
    try {
      await toggleStatusMutation.mutateAsync({
        shortUrl,
        active: nextState,
      })
      toast.success(`Routing ${nextState ? 're-enabled' : 'disabled'}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update link status')
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Permanently delete /${shortUrl}?`)
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      await deleteUrlMutation.mutateAsync(shortUrl)
      toast.success('Short link deleted successfully')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete link')
    } finally {
      setIsDeleting(false)
    }
  }

  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : 'Recent'

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between gap-3.5 rounded-xl border p-4 shadow-lg backdrop-blur-xl transition-all duration-300 sm:rounded-2xl sm:p-5 ${!active
          ? 'border-red-500/30 bg-red-950/10 hover:border-red-500/50'
          : 'border-edge-subtle bg-surface-card/75 hover:border-accent-blue/40 hover:bg-surface-card'
          }`}
      >
        <div className="min-w-0 flex-1 space-y-2">
          {/* Top Row: Short URL + Status Badge + Date */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs font-bold text-accent-cyan transition-colors hover:text-white sm:text-sm"
            >
              <FiLink className="text-accent-blue" size={14} />
              <span className="truncate">{fullShortUrl}</span>
              <FiExternalLink className="opacity-0 transition-opacity group-hover:opacity-100" size={11} />
            </a>

            {/* Active / Inactive Status Indicator */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${active
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border border-red-500/30 bg-red-500/10 text-red-400'
                }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {active ? 'Active' : 'Disabled'}
            </span>

            <div className="flex items-center gap-1 rounded-md border border-edge-subtle bg-ink-950 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 sm:text-[10px]">
              <FiCalendar size={10} className="text-accent-blue" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* AI / Scraped Link Preview Title & Description */}
          {(previewTitle || previewDescription) && (
            <div className="rounded-lg border border-edge-subtle/70 bg-ink-950/50 p-2.5 sm:p-3">
              {previewTitle && (
                <div className="flex items-center gap-1.5 font-display text-xs font-bold text-slate-200 sm:text-sm">
                  <FiFileText size={12} className="shrink-0 text-accent-cyan" />
                  <span className="truncate">{previewTitle}</span>
                </div>
              )}
              {previewDescription && (
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                  {previewDescription}
                </p>
              )}
            </div>
          )}

          {/* DDoS Burst Auto-Disable Reason Banner */}
          {!active && disabledReason && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300">
              <FiAlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
              <div className="min-w-0">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-400">
                  Security Circuit Tripped:
                </span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-amber-200">{disabledReason}</p>
              </div>
            </div>
          )}

          {/* Destination URL */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
            <span className="shrink-0 font-medium text-slate-500">Target:</span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-xs truncate hover:text-slate-200 hover:underline sm:max-w-md lg:max-w-lg"
              title={originalUrl}
            >
              {originalUrl}
            </a>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-edge-subtle/50 pt-2.5 sm:justify-end sm:border-0 sm:pt-0">
          <div className="flex items-center gap-1 rounded-lg border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1 font-mono text-[11px] font-bold text-accent-cyan sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs">
            <FiMousePointer size={12} />
            <span>{clickCount} {clickCount === 1 ? 'click' : 'clicks'}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Status Toggle Button */}
            <button
              type="button"
              onClick={handleToggleStatus}
              title={active ? 'Disable link routing' : 'Re-enable link routing'}
              disabled={toggleStatusMutation.isPending}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${active
                ? 'border border-edge-subtle bg-ink-950 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
            >
              <FiPower size={12} />
              <span>{active ? 'Disable' : 'Enable'}</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${copied
                ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                : 'border border-edge-subtle bg-ink-950 text-slate-300 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white'
                }`}
            >
              {copied ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Details Modal */}
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="flex items-center gap-1 rounded-lg border border-accent-blue/30 bg-accent-blue/15 px-2.5 py-1 text-[11px] font-bold text-accent-cyan transition-all hover:bg-accent-blue hover:text-ink sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <FiBarChart2 size={12} />
              <span>Details</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              aria-label="Delete short URL"
              className="flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50 sm:rounded-xl sm:p-2"
            >
              {isDeleting ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent sm:h-3.5 sm:w-3.5" />
              ) : (
                <FiTrash2 size={13} />
              )}
            </button>
          </div>
        </div>
      </div>

      <UrlDetailsPopUp
        open={detailsOpen}
        setOpen={setDetailsOpen}
        item={{ id, originalUrl, shortUrl, clickCount, createdDate }}
      />
    </>
  )
}

export default ShortenItem