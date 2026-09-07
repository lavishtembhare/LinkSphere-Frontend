import React from 'react'
import { Link } from 'react-router-dom'
import { FiLink, FiBarChart2, FiShield, FiZap, FiArrowRight } from 'react-icons/fi'
import { useReveal } from '../hooks/useAnimations'
import ThreeCanvas from './ThreeCanvas'

const stats = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '<10ms', label: 'Redirect Latency' },
  { value: '100%', label: 'Data Encryption' },
  { value: '24/7', label: 'Edge Availability' },
]

const features = [
  {
    icon: FiLink,
    path: '/shorten',
    title: 'Instant URL Compression',
    description: 'Transform complex UTM parameters and lengthy links into clean, shareable URLs in milliseconds.',
  },
  {
    icon: FiBarChart2,
    path: '/telemetry',
    title: 'Real-Time Click Intelligence',
    description: 'Track visitor counts, referrer domains, and device metrics with high-precision edge logging.',
  },
  {
    icon: FiShield,
    path: '/security',
    title: 'Protected Link Routing',
    description: 'Every short code is scoped to user authentication and screened against malicious redirects.',
  },
  {
    icon: FiZap,
    path: '/edge',
    title: 'Global Edge Redirection',
    description: 'Distributed DNS and caching infrastructure ensure sub-second redirection worldwide.',
  },
]

const AboutPage = () => {
  const [headerRef, headerVisible] = useReveal()
  const [gridRef, gridVisible] = useReveal()

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-ink bg-grid-pattern pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
      {/* Interactive 3D Three.js Nodes */}
      <ThreeCanvas className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-50" />

      {/* Signature Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[450px] w-[450px] rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-96 -left-32 h-96 w-96 rounded-full bg-accent-cyan/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          ref={headerRef}
          className={`transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 font-mono text-xs font-medium text-accent-cyan shadow-glow-blue">
            <span>/about-linksphere</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Every link has a destination.{' '}
            <span className="bg-gradient-to-r from-accent-blue via-accent-cyan to-white bg-clip-text text-transparent">
              We make the journey fast.
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            LinkSphere was engineered to strip the noise out of link management. We provide clean vanity routing, granular click telemetry, and zero redirect latency — all accessible from a streamlined dashboard.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-edge-subtle bg-ink-surface/70 p-4 backdrop-blur-xl sm:grid-cols-4 sm:gap-4 sm:p-6 lg:p-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-display text-xl font-bold text-white sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-accent-cyan sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div
          ref={gridRef}
          className={`mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-14 transition-all duration-700 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/50 hover:bg-surface hover:shadow-glow-blue sm:p-7"
              >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan transition-colors group-hover:bg-accent-blue group-hover:text-ink sm:h-11 sm:w-11">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-xs text-slate-500">{feature.path}</span>
                </div>

                <h3 className="font-display text-base font-semibold text-white transition-colors group-hover:text-accent-cyan sm:text-lg">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-edge-subtle bg-gradient-to-r from-surface-card to-ink-card p-6 shadow-glow-blue sm:mt-16 sm:flex-row sm:p-8 lg:p-10">
          <div className="text-center sm:text-left">
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
              Ready to shorten your first link?
            </h3>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Sign up in seconds and get complete access to tracking tools.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3 text-xs font-bold text-ink transition-transform hover:scale-105"
          >
            <span>Create Free Account</span>
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage