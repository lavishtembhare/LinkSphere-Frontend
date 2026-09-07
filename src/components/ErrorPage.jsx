import React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  FiShieldOff,
  FiAlertTriangle,
  FiHome,
} from 'react-icons/fi'

const ErrorPage = ({
  code = '404',
  title = 'Page Not Found',
  message = "We can't seem to find the resource you're looking for.",
}) => {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Read from query params (from Spring Boot 302 redirect) or React Router state
  const errorCode = searchParams.get('code') || location.state?.code || code
  const errorTitle = searchParams.get('title') || location.state?.title || title
  const rawMessage = searchParams.get('message') || location.state?.message || message
  const errorMessage = decodeURIComponent(rawMessage)

  const isSecurityBlock =
    errorCode === '403' ||
    errorMessage?.toLowerCase().includes('suspicious') ||
    errorMessage?.toLowerCase().includes('disabled')

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div
        className={`pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full blur-[130px] sm:h-[450px] sm:w-[700px] ${
          isSecurityBlock ? 'bg-amber-500/15' : 'bg-accent-blue/15'
        }`}
      />

      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-8 ${
          isSecurityBlock
            ? 'border-amber-500/30 bg-surface-card/95'
            : 'border-edge-subtle bg-surface-card/90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
              isSecurityBlock
                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
                : 'border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan'
            }`}
          >
            {isSecurityBlock ? <FiShieldOff size={13} /> : <FiAlertTriangle size={13} />}
            <span>{isSecurityBlock ? 'Security Shield Triggered' : 'Error Notice'}</span>
          </div>

          <span className="font-mono text-xs font-semibold text-slate-500">
            HTTP {errorCode}
          </span>
        </div>

        <div className="mt-5">
          <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
            {isSecurityBlock ? 'Link Routing Suspended' : errorTitle}
          </h1>

          <div
            className={`mt-3 rounded-xl p-3.5 text-xs ${
              isSecurityBlock
                ? 'border border-red-500/30 bg-red-500/10 text-red-200'
                : 'border border-edge-subtle bg-ink-950/70 text-slate-300'
            }`}
          >
            <p className="leading-relaxed font-medium">{errorMessage}</p>
          </div>

          {isSecurityBlock && (
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              This URL was automatically halted by DDoS burst mitigation or manually disabled. If you are the owner, sign in to your Command Center to review traffic logs and re-enable this link.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to="/"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.02]"
          >
            <FiHome size={13} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage