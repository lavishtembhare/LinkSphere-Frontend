import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiAlertTriangle, FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi'

const ErrorPage = ({
  code = '404',
  title = 'Page Not Found',
  message = "We can't seem to find the edge route or resource you're looking for.",
}) => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-5 py-16 text-center text-slate-100 sm:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[100px]" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-edge-subtle bg-surface-card/90 p-8 shadow-2xl backdrop-blur-2xl sm:p-12">
        {/* Glowing Badge */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
          <FiAlertTriangle size={32} />
        </div>

        {/* Status Code & Title */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent-cyan">
            Error {code} • Routing Anomaly
          </span>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h1>
          <p className="font-sans text-xs leading-relaxed text-slate-400 sm:text-sm">
            {message}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-edge-subtle bg-ink-950 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:text-white"
          >
            <FiArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02]"
          >
            <FiCompass size={14} />
            <span>Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage