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
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useDeleteUrl } from '../../hooks/useQuery'
import UrlDetailsPopUp from './UrlDetailsPopUp'

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate }) => {
  const [copied, setCopied] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteUrlMutation = useDeleteUrl()

  const subdomain = import.meta.env.VITE_REACT_SUBDOMAIN || window.location.origin
  const baseUrl = subdomain.endsWith('/') ? subdomain.slice(0, -1) : subdomain
  const fullShortUrl = `${baseUrl}/${shortUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl)
      setCopied(true)
      toast.success('Short URL copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete /${shortUrl}?`)
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
      <div className="group relative flex flex-col justify-between gap-3.5 rounded-xl border border-edge-subtle bg-surface-card/75 p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 hover:bg-surface-card sm:rounded-2xl sm:p-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1 space-y-1.5">
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

            <div className="flex items-center gap-1 rounded-md border border-edge-subtle bg-ink-950 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 sm:text-[10px]">
              <FiCalendar size={10} className="text-accent-blue" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
            <span className="shrink-0 font-medium text-slate-500">Destination:</span>
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
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-edge-subtle/50 pt-2 sm:justify-end sm:border-0 sm:pt-0">
          {/* Click Badge */}
          <div className="flex items-center gap-1 rounded-lg border border-accent-blue/20 bg-accent-blue/10 px-2.5 py-1 font-mono text-[11px] font-bold text-accent-cyan sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs">
            <FiMousePointer size={12} />
            <span>{clickCount} {clickCount === 1 ? 'click' : 'clicks'}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs ${
                copied
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                  : 'border border-edge-subtle bg-ink-950 text-slate-300 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white'
              }`}
            >
              {copied ? <FiCheck size={12} className="text-emerald-400" /> : <FiCopy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Details Modal Trigger */}
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
              title="Delete URL"
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

      {/* Embedded Details Modal */}
      <UrlDetailsPopUp
        open={detailsOpen}
        setOpen={setDetailsOpen}
        item={{ id, originalUrl, shortUrl, clickCount, createdDate }}
      />
    </>
  )
}

export default ShortenItem