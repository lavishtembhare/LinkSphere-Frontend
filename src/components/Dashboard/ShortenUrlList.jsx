import React, { useState, useMemo } from 'react'
import { FiSearch, FiLayers, FiLink } from 'react-icons/fi'
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
    <div className="space-y-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-edge-subtle pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
              Managed Links
            </span>
            <span className="rounded-full border border-edge-subtle bg-ink-950 px-2 py-0.5 font-mono text-[10px] text-slate-400">
              {data.length} Total
            </span>
          </div>
          <h2 className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
            Active Short URLs
          </h2>
        </div>

        {/* Real-time search filter */}
        {data.length > 0 && (
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search links or targets..."
              className="w-full rounded-xl border border-edge-subtle bg-ink-950/80 py-2 pl-9 pr-3.5 text-xs text-slate-200 placeholder-slate-500 backdrop-blur-md transition-all focus:border-accent-blue focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 w-full animate-pulse rounded-2xl border border-edge-subtle/40 bg-surface-card/40"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-edge-subtle bg-surface-card/50 py-16 text-center backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
            <FiLink size={24} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-white sm:text-lg">
            No short links generated yet
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-400">
            Click &quot;Create Short Link&quot; above to convert long target URLs into tracked vanity slugs.
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        /* No search results */
        <div className="rounded-2xl border border-edge-subtle bg-surface-card/40 py-10 text-center text-xs text-slate-400">
          No short links match &quot;{searchTerm}&quot;
        </div>
      ) : (
        /* Render List of URL Items */
        <div className="space-y-3">
          {filteredData.map((item) => (
            <ShortenItem key={item.id || item.shortUrl} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShortenUrlList