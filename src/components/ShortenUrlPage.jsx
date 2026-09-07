import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiShieldOff,
  FiAlertTriangle,
  FiArrowLeft,
  FiActivity,
  FiLock,
  FiExternalLink,
} from 'react-icons/fi'
import api from '../api/api'

const ShortenUrlPage = () => {
  const { url } = useParams()
  const [loading, setLoading] = useState(true)
  const [securityBlock, setSecurityBlock] = useState(null)
  const [genericError, setGenericError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const resolveAndRedirect = async () => {
      if (!url) return

      try {
        setLoading(true)
        // Spring Boot redirect mapping /{shortUrl}
        const response = await api.get(`/${url}`, {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        })

        // If backend returns a JSON payload with destination URL
        const destination = response.data?.originalUrl || response.headers?.location

        if (destination) {
          window.location.replace(destination)
        } else {
          window.location.replace(`${api.defaults.baseURL}/${url}`)
        }
      } catch (error) {
        if (!isMounted) return

        const errorData = error?.response?.data
        const status = error?.response?.status

        // Capture suspicious burst detection / bot mitigation block
        if (
          status === 403 ||
          errorData?.message?.toLowerCase().includes('suspicious') ||
          errorData?.message?.toLowerCase().includes('disabled')
        ) {
          setSecurityBlock({
            message:
              errorData?.message ||
              'This link has been disabled due to suspicious activity.',
            slug: url,
            reason:
              errorData?.disabledReason ||
              'Anomalous burst traffic or heuristic bot signatures exceeded automated security thresholds.',
          })
        } else if (status === 404) {
          setGenericError({
            title: 'Link Not Found',
            description: `The vanity slug /${url} does not exist or has expired.`,
          })
        } else {
          setGenericError({
            title: 'Routing Interrupted',
            description:
              errorData?.message || 'Unable to resolve destination target.',
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    resolveAndRedirect()

    return () => {
      isMounted = false
    }
  }, [url])

  // 1. Loading State
  if (loading) {
    return (
      <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-ink bg-grid-pattern px-4 text-center">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-accent-blue/15 blur-[120px]" />
        
        <div className="relative flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-accent-cyan/20 duration-1000" />
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent shadow-glow-cyan" />
          </div>
          <span className="mt-6 font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            Resolving Vanity Route
          </span>
          <p className="mt-1 text-xs text-slate-400">
            Checking telemetry integrity for <span className="font-mono text-slate-200">/{url}</span>...
          </p>
        </div>
      </div>
    )
  }

  // 2. Suspicious Activity / DDoS Security Block Screen
  if (securityBlock) {
    return (
      <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8 sm:px-6 lg:px-8">
        {/* Warning Ambient Lighting */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-amber-500/10 blur-[130px] sm:h-[450px] sm:w-[700px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-red-500/10 blur-[110px]" />

        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-500/30 bg-surface-card/95 p-6 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-8">
          {/* Top Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
              <FiShieldOff size={13} className="text-amber-400" />
              <span>Security Shield Tripped</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">HTTP 403 Forbidden</span>
          </div>

          {/* Heading */}
          <div className="mt-5">
            <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
              Link Temporarily Suspended
            </h1>
            <p className="mt-1 font-mono text-xs font-semibold text-accent-cyan">
              Target: /{securityBlock.slug}
            </p>
          </div>

          {/* Core Backend Message Highlight */}
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 sm:p-4">
            <div className="flex items-start gap-2.5">
              <FiAlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <div>
                <p className="font-semibold text-red-200">
                  {securityBlock.message}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-red-300/80">
                  {securityBlock.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Security Diagnostic Breakdown */}
          <div className="mt-5 space-y-2.5 rounded-xl border border-edge-subtle bg-ink-950/70 p-4 text-xs">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Automated Defense Protocols
            </span>

            <div className="flex items-start gap-2 text-slate-300">
              <FiActivity size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
              <span className="leading-relaxed">
                Traffic burst protection triggered to safeguard destination hosts against DDoS attacks.
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <FiLock size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
              <span className="leading-relaxed">
                Only the link creator can manually re-enable routing via their telemetry console.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-edge-subtle bg-ink-950 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <FiArrowLeft size={13} />
              <span>Return Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.02]"
            >
              <span>Manage in Dashboard</span>
              <FiExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. Generic Fallback Error Screen
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-ink bg-grid-pattern px-4 py-8">
      <div className="relative w-full max-w-md rounded-2xl border border-edge-subtle bg-surface-card/95 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-8">
        <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
          {genericError?.title || 'Unable to Route'}
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          {genericError?.description || 'An unexpected routing error occurred.'}
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.02]"
          >
            <FiArrowLeft size={13} />
            <span>Back to Safety</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ShortenUrlPage