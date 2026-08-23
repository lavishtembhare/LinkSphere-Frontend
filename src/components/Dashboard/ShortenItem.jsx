import React, { useState } from 'react'
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiMousePointer,
  FiCalendar,
  FiBarChart2,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import UrlDetailsPopUp from './UrlDetailsPopUp'

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate }) => {
  const [copied, setCopied] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

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

  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent'

  return (
    <>
      <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-edge-subtle bg-surface-card/75 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 hover:bg-surface-card sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-sm font-bold text-accent-cyan transition-colors hover:text-white"
            >
              <FiLink className="text-accent-blue" size={15} />
              <span className="truncate">{fullShortUrl}</span>
              <FiExternalLink className="opacity-0 transition-opacity group-hover:opacity-100" size={12} />
            </a>

            <div className="flex items-center gap-1 rounded-md border border-edge-subtle bg-ink-950 px-2 py-0.5 font-mono text-[10px] text-slate-400">
              <FiCalendar size={11} className="text-accent-blue" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="shrink-0 font-medium text-slate-500">Destination:</span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-md truncate hover:text-slate-200 hover:underline"
              title={originalUrl}
            >
              {originalUrl}
            </a>
          </div>
        </div>

        {/* Stats & Action Controls */}
        <div className="flex shrink-0 items-center justify-between gap-2.5 sm:justify-end">
          {/* Click Badge */}
          <div className="flex items-center gap-1.5 rounded-xl border border-accent-blue/20 bg-accent-blue/10 px-3 py-1.5 font-mono text-xs font-bold text-accent-cyan">
            <FiMousePointer size={13} />
            <span>{clickCount} {clickCount === 1 ? 'click' : 'clicks'}</span>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              copied
                ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                : 'border border-edge-subtle bg-ink-950 text-slate-300 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white'
            }`}
          >
            {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Details & Graph Modal Trigger */}
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-accent-blue/30 bg-accent-blue/15 px-3.5 py-2 text-xs font-bold text-accent-cyan transition-all hover:bg-accent-blue hover:text-ink hover:shadow-glow-blue"
          >
            <FiBarChart2 size={14} />
            <span>Details</span>
          </button>
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