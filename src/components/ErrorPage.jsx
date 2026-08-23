import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiAlertTriangle, FiArrowLeft, FiCompass } from 'react-icons/fi'

const ErrorPage = ({
  code = '404',
  title = 'Page Not Found',
  message = "We can't seem to find the edge route or resource you're looking for.",
}) => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-10 text-center text-slate-100 sm:px-6 sm:py-14 lg:px-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[320px] w-[450px] rounded-full bg-accent-blue/15 blur-[120px] sm:h-[400px] sm:w-[500px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-accent-cyan/10 blur-[80px] sm:h-64 sm:w-64 sm:blur-[100px]" />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-edge-subtle bg-surface-card/90 p-5 shadow-2xl backdrop-blur-2xl sm:max-w-lg sm:gap-6 sm:rounded-3xl sm:p-8 lg:p-10">
        {/* Glowing Badge */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue sm:h-14 sm:w-14 sm:rounded-2xl">
          <FiAlertTriangle size={24} className="sm:text-[28px]" />
        </div>

        {/* Status Code & Title */}
        <div className="space-y-1.5 sm:space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent-cyan sm:text-xs">
            Error {code} • Routing Anomaly
          </span>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="font-sans text-xs leading-relaxed text-slate-400 sm:text-sm">
            {message}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex w-full flex-col gap-2.5 pt-1 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-edge-subtle bg-ink-950 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:text-white sm:w-auto sm:px-5 sm:py-2.5"
          >
            <FiArrowLeft size={13} />
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-5 py-2 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] sm:w-auto sm:px-6 sm:py-2.5"
          >
            <FiCompass size={13} />
            <span>Command Center</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage