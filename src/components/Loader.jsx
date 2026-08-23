import React from 'react'
import { FiLayers, FiRadio } from 'react-icons/fi'

const Loader = ({ label = 'Synchronizing Edge Telemetry...' }) => {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4">
      {/* Background ambient neon glows */}
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-accent-blue/15 blur-[120px]" />
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent-cyan/10 blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Orbital Ring Container */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Radar background ping */}
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-accent-cyan/15 blur-sm" />

          {/* Outer rotating gradient ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-cyan border-r-accent-blue/50 [animation-duration:2s]" />

          {/* Inner counter-rotating dashed ring */}
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-dashed border-accent-blue/40 border-b-transparent [animation-direction:reverse] [animation-duration:3s]" />

          {/* Glowing Central Core Badge */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-blue/40 bg-surface-card/90 text-accent-cyan shadow-[0_0_30px_rgba(56,189,248,0.35)] backdrop-blur-xl">
            <FiLayers className="animate-pulse" size={26} />
          </div>
        </div>

        {/* Status Text & Indicator */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan shadow-[0_0_8px_#38BDF8]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              LinkSphere Gateway
            </span>
          </div>

          <p className="font-display text-sm font-bold text-white sm:text-base">
            {label}
          </p>

          {/* Mutating sequence dots */}
          <div className="flex items-center gap-2 pt-1">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_10px_#38BDF8] [animation-delay:-0.32s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-accent-blue shadow-[0_0_10px_#3B82F6] [animation-delay:-0.16s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
          </div>

          <div className="flex items-center gap-1.5 pt-2 text-[11px] text-slate-500 font-mono">
            <FiRadio size={12} className="animate-pulse text-accent-blue" />
            <span>Establishing zero-latency edge node link</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader