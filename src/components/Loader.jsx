import React from 'react'
import { FiLayers, FiRadio } from 'react-icons/fi'

const Loader = ({ label = 'Synchronizing Edge Telemetry...' }) => {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8">
      {/* Background ambient neon glows */}
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent-blue/15 blur-[100px] sm:h-80 sm:w-80 sm:blur-[120px]" />
      <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-accent-cyan/10 blur-[80px] sm:h-64 sm:w-64 sm:blur-[100px]" />

      <div className="relative flex flex-col items-center">
        {/* Orbital Ring Container */}
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          {/* Radar background ping */}
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-accent-cyan/15 blur-sm sm:h-24 sm:w-24" />

          {/* Outer rotating gradient ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-cyan border-r-accent-blue/50 [animation-duration:2s]" />

          {/* Inner counter-rotating dashed ring */}
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-dashed border-accent-blue/40 border-b-transparent [animation-direction:reverse] [animation-duration:3s]" />

          {/* Glowing Central Core Badge */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent-blue/40 bg-surface-card/90 text-accent-cyan shadow-[0_0_30px_rgba(56,189,248,0.35)] backdrop-blur-xl sm:h-14 sm:w-14 sm:rounded-2xl">
            <FiLayers className="animate-pulse" size={22} />
          </div>
        </div>

        {/* Status Text & Indicator */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center sm:mt-8 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan shadow-[0_0_8px_#38BDF8]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-xs">
              LinkSphere Gateway
            </span>
          </div>

          <p className="font-display text-xs font-bold text-white sm:text-sm md:text-base">
            {label}
          </p>

          {/* Mutating sequence dots */}
          <div className="flex items-center gap-1.5 pt-0.5 sm:gap-2 sm:pt-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent-cyan shadow-[0_0_8px_#38BDF8] [animation-delay:-0.32s] sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-accent-blue shadow-[0_0_8px_#3B82F6] [animation-delay:-0.16s] sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white shadow-[0_0_8px_#FFFFFF] sm:h-2.5 sm:w-2.5" />
          </div>

          <div className="flex items-center gap-1.5 pt-1 font-mono text-[10px] text-slate-500 sm:pt-2 sm:text-[11px]">
            <FiRadio size={11} className="animate-pulse text-accent-blue" />
            <span>Establishing zero-latency edge node link</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader