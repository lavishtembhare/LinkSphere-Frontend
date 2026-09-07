import React, { useState, useMemo } from 'react'
import {
  FiSearch,
  FiLink,
  FiCpu,
  FiCheckCircle,
  FiPower,
  FiList,
} from 'react-icons/fi'
import { useSearchUrls } from '../../hooks/useQuery'
import ShortenItem from './ShortenItem'

const ShortenUrlList = ({ data = [], isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'disabled'

  // Query natural-language endpoint when AI toggle is active
  const { data: aiResults = [], isFetching: isAiSearching } = useSearchUrls(
    searchTerm,
    isAiMode && searchTerm.trim().length > 2
  )

  // Calculate quick status tallies
  const activeCount = useMemo(() => data.filter((item) => item.active).length, [data])
  const disabledCount = useMemo(() => data.filter((item) => !item.active).length, [data])

  // Combined Status and Search Filtering
  const displayedLinks = useMemo(() => {
    const baseList =
      isAiMode && searchTerm.trim().length > 2 ? aiResults : data

    return baseList.filter((item) => {
      // 1. Status Filter check
      if (statusFilter === 'active' && !item.active) return false
      if (statusFilter === 'disabled' && item.active) return false

      // 2. Keyword check (only when not in AI search mode)
      if (!isAiMode && searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchesQuery =
          item.shortUrl?.toLowerCase().includes(q) ||
          item.originalUrl?.toLowerCase().includes(q) ||
          item.previewTitle?.toLowerCase().includes(q) ||
          item.previewDescription?.toLowerCase().includes(q)

        if (!matchesQuery) return false
      }

      return true
    })
  }, [data, aiResults, isAiMode, searchTerm, statusFilter])

  return (
    <div className="space-y-4">
      {/* Header, Status Filter Tabs & Search Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-edge-subtle pb-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
              Link Inventory
            </span>
            <span className="rounded-full border border-edge-subtle bg-ink-950 px-2 py-0.5 font-mono text-[9px] text-slate-400 sm:text-[10px]">
              {displayedLinks.length} Showing
            </span>
          </div>
          <h2 className="mt-0.5 font-display text-base font-bold text-white sm:text-lg lg:text-xl">
            Managed Short URLs
          </h2>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Status Tabs (All / Active / Disabled) */}
          <div className="flex rounded-xl border border-edge-subtle bg-ink-950/80 p-1 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                statusFilter === 'all'
                  ? 'border border-accent-blue/40 bg-accent-blue/20 text-accent-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiList size={12} />
              <span>All</span>
              <span className="ml-0.5 rounded-full bg-surface-card px-1.5 py-0.2 font-mono text-[9px]">
                {data.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                statusFilter === 'active'
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <FiCheckCircle size={12} />
              <span>Active</span>
              <span className="ml-0.5 rounded-full bg-surface-card px-1.5 py-0.2 font-mono text-[9px]">
                {activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('disabled')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                statusFilter === 'disabled'
                  ? 'border border-red-500/40 bg-red-500/20 text-red-300 shadow-sm'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <FiPower size={12} />
              <span>Disabled</span>
              <span className="ml-0.5 rounded-full bg-surface-card px-1.5 py-0.2 font-mono text-[9px]">
                {disabledCount}
              </span>
            </button>
          </div>

          {/* Search Box + AI Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56 lg:w-64">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={13}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isAiMode ? "AI Search: 'blog links'..." : 'Filter links...'
                }
                className="w-full rounded-xl border border-edge-subtle bg-ink-950/80 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 backdrop-blur-md transition-all focus:border-accent-blue focus:outline-none sm:py-2 sm:pl-9 sm:pr-3.5"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAiMode(!isAiMode)}
              title="Toggle Natural Language Search"
              className={`flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isAiMode
                  ? 'border border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan shadow-glow-cyan'
                  : 'border border-edge-subtle bg-ink-950 text-slate-400 hover:text-white'
              }`}
            >
              <FiCpu size={13} />
              <span className="hidden sm:inline">AI Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading || isAiSearching ? (
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 w-full animate-pulse rounded-xl border border-edge-subtle/40 bg-surface-card/40 sm:rounded-2xl"
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-edge-subtle bg-surface-card/50 py-12 text-center backdrop-blur-md sm:rounded-3xl sm:py-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue sm:h-12 sm:w-12 sm:rounded-2xl">
            <FiLink size={20} className="sm:text-[24px]" />
          </div>
          <h3 className="mt-3 font-display text-sm font-bold text-white sm:mt-4 sm:text-base lg:text-lg">
            No short links created yet
          </h3>
          <p className="mt-1 max-w-xs px-4 text-xs leading-relaxed text-slate-400 sm:max-w-sm">
            Generate your first vanity link to monitor traffic and bot mitigation metrics.
          </p>
        </div>
      ) : displayedLinks.length === 0 ? (
        <div className="rounded-xl border border-edge-subtle bg-surface-card/40 py-10 text-center text-xs text-slate-400 sm:rounded-2xl">
          No {statusFilter !== 'all' ? statusFilter : ''} links found
          {searchTerm ? ` matching "${searchTerm}"` : ''}.
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {displayedLinks.map((item) => (
            <ShortenItem key={item.id || item.shortUrl} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShortenUrlList