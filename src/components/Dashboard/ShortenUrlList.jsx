import React, { useState, useMemo } from 'react'
import { FiSearch, FiLink } from 'react-icons/fi'
import ShortenItem from './ShortenItem'

const ShortenUrlList = ({ data = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter links by short URL or destination URL
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data
    const query = searchTerm.toLowerCase()
    return data.filter(
      (item) =>
        item.shortUrl.toLowerCase().includes(query) ||
        item.originalUrl.toLowerCase().includes(query)
    )
  }, [data, searchTerm])

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col justify-between gap-3 border-b border-edge-subtle pb-3 sm:flex-row sm:items-center sm:pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
              Managed Links
            </span>
            <span className="rounded-full border border-edge-subtle bg-ink-950 px-2 py-0.5 font-mono text-[9px] text-slate-400 sm:text-[10px]">
              {data.length} Total
            </span>
          </div>
          <h2 className="mt-0.5 font-display text-base font-bold text-white sm:text-lg lg:text-xl">
            Active Short URLs
          </h2>
        </div>

        {/* Search input */}
        {data.length > 0 && (
          <div className="relative w-full sm:w-60 lg:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search links or targets..."
              className="w-full rounded-xl border border-edge-subtle bg-ink-950/80 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 backdrop-blur-md transition-all focus:border-accent-blue focus:outline-none sm:py-2 sm:pl-9 sm:pr-3.5"
            />
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 w-full animate-pulse rounded-xl border border-edge-subtle/40 bg-surface-card/40 sm:h-20 sm:rounded-2xl"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-edge-subtle bg-surface-card/50 py-12 text-center backdrop-blur-md sm:rounded-3xl sm:py-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue sm:h-12 sm:w-12 sm:rounded-2xl">
            <FiLink size={20} className="sm:text-[24px]" />
          </div>
          <h3 className="mt-3 font-display text-sm font-bold text-white sm:mt-4 sm:text-base lg:text-lg">
            No short links generated yet
          </h3>
          <p className="mt-1 max-w-xs px-4 text-xs leading-relaxed text-slate-400 sm:max-w-sm">
            Click &quot;Create Short Link&quot; above to convert long target URLs into tracked vanity slugs.
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        /* Search Not Found */
        <div className="rounded-xl border border-edge-subtle bg-surface-card/40 py-8 text-center text-xs text-slate-400 sm:rounded-2xl sm:py-10">
          No short links match &quot;{searchTerm}&quot;
        </div>
      ) : (
        /* Render List */
        <div className="space-y-2.5 sm:space-y-3">
          {filteredData.map((item) => (
            <ShortenItem key={item.id || item.shortUrl} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShortenUrlList