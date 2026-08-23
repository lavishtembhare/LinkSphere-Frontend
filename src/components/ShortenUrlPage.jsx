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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-5 text-slate-100">
      <div className="pointer-events-none absolute h-[400px] w-[500px] rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[100px]" />

      <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-edge-subtle bg-surface-card/90 p-8 text-center shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl sm:p-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
          <FiLayers size={28} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            LinkSphere Edge Router
          </span>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Redirecting target link...
          </h1>
          <p className="max-w-xs font-mono text-xs text-slate-400 sm:max-w-sm">
            Routing vanity slug <span className="font-bold text-accent-cyan">/{url}</span> through proxy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 py-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_12px_#38BDF8] [animation-delay:-0.32s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-accent-blue shadow-[0_0_12px_#3B82F6] [animation-delay:-0.16s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-white shadow-[0_0_12px_#FFFFFF]" />
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <FiExternalLink size={12} />
          <span>Encrypted Gateway Verification</span>
        </div>
      </div>
    </div>
  )
}

export default ShortenUrlPage