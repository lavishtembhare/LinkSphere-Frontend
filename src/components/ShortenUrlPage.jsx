import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FiLayers, FiExternalLink } from 'react-icons/fi'

const ShortenUrlPage = () => {
  const { url } = useParams()

  useEffect(() => {
    if (url) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
      const cleanBackend = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
      window.location.href = `${cleanBackend}/${url}`
    }
  }, [url])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute h-[300px] w-[400px] rounded-full bg-accent-blue/15 blur-[120px] sm:h-[400px] sm:w-[500px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-accent-cyan/10 blur-[80px] sm:h-64 sm:w-64 sm:blur-[100px]" />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-edge-subtle bg-surface-card/90 p-6 text-center shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl sm:max-w-md sm:gap-5 sm:rounded-3xl sm:p-8 lg:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue sm:h-14 sm:w-14">
          <FiLayers size={24} className="sm:text-[28px]" />
        </div>

        <div className="space-y-1 sm:space-y-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
            LinkSphere Edge Router
          </span>
          <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
            Redirecting target link...
          </h1>
          <p className="max-w-xs font-mono text-xs text-slate-400">
            Routing vanity slug <span className="font-bold text-accent-cyan">/{url}</span> through proxy.
          </p>
        </div>

        <div className="flex items-center gap-2 py-1 sm:gap-2.5 sm:py-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_12px_#38BDF8] [animation-delay:-0.32s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-blue shadow-[0_0_12px_#3B82F6] [animation-delay:-0.16s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white shadow-[0_0_12px_#FFFFFF]" />
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
          <FiExternalLink size={12} />
          <span>Encrypted Gateway Verification</span>
        </div>
      </div>
    </div>
  )
}

export default ShortenUrlPage