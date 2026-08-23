import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiZap,
  FiBarChart2,
  FiShield,
  FiGlobe,
  FiCode,
  FiLayers,
  FiCheck,
  FiArrowRight,
  FiCpu,
  FiLock,
  FiRefreshCw,
  FiShare2,
} from 'react-icons/fi'
import Logo from '../assets/logo.svg'

const featurePillars = [
  {
    icon: FiZap,
    badge: 'Edge Performance',
    title: 'Sub-50ms Global Redirection',
    desc: 'Vanilla redirects add hundreds of milliseconds of latency. LinkSphere evaluates and forwards requests at nearest edge nodes, guaranteeing sub-second routing globally.',
    highlights: ['Distributed Edge CDN', 'Zero cold-start lookups', 'Dynamic vanity slug mapping'],
  },
  {
    icon: FiBarChart2,
    badge: 'Real-Time Telemetry',
    title: 'Precision Click Intelligence',
    desc: 'Capture granular telemetry as click events happen. Inspect traffic trends across customizable time windows with interactive velocity graphs and event streams.',
    highlights: ['Rolling timeline aggregation', 'Zero-latency event ingestion', 'Interactive Line & Bar telemetry'],
  },
  {
    icon: FiShield,
    badge: 'Zero-Trust Security',
    title: 'Enterprise Token Shield',
    desc: 'Protect every vanity slug from phishing spoofing and unauthorized parameter injection using stateless JWT validation and automated rate guards.',
    highlights: ['Encrypted JWT tokens', 'Cross-origin header sanitation', 'Bot & scraper filtering'],
  },
  {
    icon: FiGlobe,
    badge: 'Routing Architecture',
    title: 'Multi-Subdomain Isolation',
    desc: 'Isolate user dashboards from redirect traffic. Host your management console on your root domain while serving shortened slugs from high-throughput dedicated vanity subdomains.',
    highlights: ['Wildcard subdomain routing', 'Multi-tenant slug isolation', 'CORS-hardened gateway'],
  },
  {
    icon: FiCode,
    badge: 'Developer Engine',
    title: 'RESTful API & TanStack Cache',
    desc: 'Integrate LinkSphere directly into CI/CD workflows, automated messaging, and headless apps with standard JSON endpoints and reactive client queries.',
    highlights: ['Optimistic TanStack cache invalidation', 'Spring Boot high-concurrency backend', 'Simple JSON payloads'],
  },
  {
    icon: FiLayers,
    badge: 'Link Hub Management',
    title: 'Centralized Slug Control',
    desc: 'Filter, inspect, and copy links with single-click clipboard triggers, full target URL inspection, and lifetime visitor accounting from a unified command deck.',
    highlights: ['Instant in-memory fuzzy search', 'One-click clipboard triggers', 'Modal inspector preview'],
  },
]

const comparisonData = [
  { feature: 'Edge Redirection Speed', linksphere: '< 50ms (Global)', legacy: '250ms - 600ms' },
  { feature: 'Telemetry Ingestion', linksphere: 'Real-Time (< 1s)', legacy: 'Batch (15-60 min delay)' },
  { feature: 'Subdomain Isolation', linksphere: 'Built-in (url.domain.com)', legacy: 'Enterprise add-on ($$$)' },
  { feature: 'Token Shield Protection', linksphere: 'Included by default', legacy: 'Basic captcha only' },
  { feature: 'Vanity Slug Customization', linksphere: 'Unlimited', legacy: 'Restricted' },
  { feature: 'API & Query Caching', linksphere: 'Native TanStack Query v5', legacy: 'Raw polling' },
]

const FeaturesPage = () => {
  return (
    <div className="relative overflow-hidden bg-ink bg-grid-pattern text-slate-100">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[900px] -left-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[1600px] -right-32 h-[500px] w-[500px] rounded-full bg-accent-blue/10 blur-[150px]" />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-semibold text-accent-cyan backdrop-blur-md">
            <FiCpu className="animate-pulse" size={13} />
            Platform Capabilities & Infrastructure
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Engineered for <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">speed</span>, built for <span className="bg-gradient-to-r from-accent-cyan to-white bg-clip-text text-transparent">scale</span>.
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            Discover the high-speed routing architecture, real-time telemetry pipelines, and zero-trust security layers that power LinkSphere links.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featurePillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/85 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 hover:bg-surface-card hover:shadow-glow-blue"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-edge-subtle/60 pt-4">
                  <ul className="space-y-2">
                    {pillar.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                        <FiCheck className="shrink-0 text-accent-cyan" size={13} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Matrix / Comparison Section */}
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Benchmarking
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Why developers switch to LinkSphere
            </h2>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              See how our edge telemetry architecture compares against traditional link shorteners.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/85 shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-edge-subtle bg-ink-950/70 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="p-5">Capability</th>
                    <th className="p-5 text-accent-cyan">LinkSphere</th>
                    <th className="p-5 text-slate-400">Legacy Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge-subtle/50">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="transition-colors hover:bg-white/[0.02]">
                      <td className="p-5 font-semibold text-white">{row.feature}</td>
                      <td className="p-5 font-mono font-bold text-accent-cyan">{row.linksphere}</td>
                      <td className="p-5 font-mono text-slate-400">{row.legacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative mt-28 overflow-hidden rounded-3xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-10 shadow-2xl shadow-accent-blue/10 backdrop-blur-xl sm:p-14">
          <img
            src={Logo}
            alt=""
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10 blur-[1px]"
          />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent-blue/20 blur-[80px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="max-w-xl space-y-2">
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Ready to deploy sub-second links?
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm">
                Join LinkSphere now and begin tracking clicks across global edge nodes in seconds.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-7 py-3.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
              >
                <span>Create Free Account</span>
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage