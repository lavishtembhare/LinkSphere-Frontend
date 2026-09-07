import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiCpu,
  FiShield,
  FiBarChart2,
  FiZap,
  FiKey,
  FiSearch,
  FiCheck,
  FiArrowRight,
  FiTerminal,
  FiActivity,
  FiAlertTriangle,
  FiLayers,
} from 'react-icons/fi'
import Logo from '../assets/logo.svg'
import ThreeCanvas from './ThreeCanvas'

const featurePillars = [
  {
    icon: FiCpu,
    badge: 'LLM Engine',
    title: 'AI Smart Slugs & Meta Extraction',
    desc: 'Bypasses random character strings by prompting an LLM to generate concise, human-readable slugs directly from destination URLs. Background workers automatically scrape OpenGraph metadata via Jsoup with AI-written fallbacks.',
    highlights: [
      'Context-aware vanity slug generation',
      'Async Jsoup OpenGraph scraping & AI summaries',
      'Groq-primary inference with automated fallback',
    ],
  },
  {
    icon: FiShield,
    badge: 'Abuse & DDoS Shield',
    title: 'Automated Burst Circuit Breakers',
    desc: 'Protects destination endpoints against malicious abuse. Links that experience sudden anomalous bursts are automatically flipped to inactive with an AI-generated attack analysis, while heuristic bot clicks are filtered from total counts.',
    highlights: [
      'Burst attack detection & automatic link suspension',
      'AI-analyzed traffic anomaly explanation',
      'Pre-creation malicious & phishing screening',
    ],
  },
  {
    icon: FiBarChart2,
    badge: 'Click Intelligence',
    title: 'Natural Language Telemetry',
    desc: 'Analyzes per-link and account-wide traffic metrics within customizable time windows. Features an LLM trend interpreter that converts complex click arrays into concise plain-English performance summaries.',
    highlights: [
      'Date-bounded daily click event aggregation',
      'Plain-English AI click trend summaries',
      'Rolling interactive velocity graphs',
    ],
  },
  {
    icon: FiSearch,
    badge: 'Semantic Discovery',
    title: 'Natural-Language Link Search',
    desc: 'Search your link library using conversational prompts like "my links about operating systems" instead of memorizing exact URLs. The LLM evaluates your entire inventory in real time without vector DB overhead.',
    highlights: [
      'Prompt-based semantic link discovery',
      'Dual mode: Exact match or AI semantic search',
      'Zero-latency query hydration via TanStack Query',
    ],
  },
  {
    icon: FiKey,
    badge: 'Zero-Trust Identity',
    title: 'Cryptographic Auth & OTP Recovery',
    desc: 'Built on stateless Spring Security with BCrypt hashing, short-lived 24-hour access tokens, and 30-day refresh token rotation. Every profile operation is guarded by time-sensitive email verification codes.',
    highlights: [
      'Immediate access token revocation on refresh/logout',
      'Enumeration-proof OTP forgot password flow',
      'Cascade account deletion with password + OTP validation',
    ],
  },
  {
    icon: FiZap,
    badge: 'Core Performance',
    title: 'Sub-50ms Subdomain Redirects',
    desc: 'Engineered for near-instant 302 Found hops through an isolated redirect controller. Suspicious or disabled links automatically re-route visitors to a specialized security shield page without crashing downstream applications.',
    highlights: [
      'Subdomain-isolated 302 redirect controller',
      'Manual link kill-switch toggle (active/disabled)',
      'Multi-stage Dockerized deployment with health checks',
    ],
  },
]

const comparisonData = [
  {
    feature: 'Vanity Slug Creation',
    linksphere: 'Context-Aware AI Slug Generation',
    legacy: 'Random Alphanumeric Strings',
  },
  {
    feature: 'DDoS & Burst Mitigation',
    linksphere: 'Auto-Kill Circuit Breaker + AI Diagnostic',
    legacy: 'Unchecked or Hard Rate-Limits',
  },
  {
    feature: 'Phishing Screening',
    linksphere: 'Pre-flight LLM Scan (Fails Open)',
    legacy: 'Reactive / Manual Blacklist',
  },
  {
    feature: 'Link Discovery',
    linksphere: 'Natural-Language Semantic Prompt Search',
    legacy: 'Exact Keyword Matching Only',
  },
  {
    feature: 'Click Telemetry',
    linksphere: 'Daily Grouping + AI Plain-English Summary',
    legacy: 'Raw Counter Increments Only',
  },
  {
    feature: 'Session Security',
    linksphere: 'Zero-Enumeration OTP & Immediate JWT Revocation',
    legacy: 'Standard Session Cookies',
  },
]

const FeaturesPage = () => {
  return (
    <div className="relative overflow-hidden bg-ink bg-grid-pattern text-slate-100">
      {/* Interactive Three.js Constellation Background */}
      <ThreeCanvas className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-45" />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[900px] -left-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-semibold text-accent-cyan shadow-glow-blue backdrop-blur-md">
            <FiCpu className="animate-pulse" size={13} />
            Production-Grade Capabilities
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Engineered for{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
              intelligence
            </span>
            , built for{' '}
            <span className="bg-gradient-to-r from-accent-cyan to-white bg-clip-text text-transparent">
              security
            </span>
            .
          </h1>

          <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm lg:text-base">
            From multi-provider LLM pipelines and automated burst defenses to zero-enumeration cryptographic session controls, explore the full architecture powering LinkSphere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3">
          {featurePillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/85 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 hover:bg-surface-card hover:shadow-glow-blue sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-5 border-t border-edge-subtle/60 pt-3.5">
                  <ul className="space-y-1.5">
                    {pillar.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 font-mono text-[11px] text-slate-300"
                      >
                        <FiCheck className="mt-0.5 shrink-0 text-accent-cyan" size={13} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Benchmarking Comparison */}
        <div className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Technical Comparison
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-white sm:text-4xl">
              Why engineers choose LinkSphere
            </h2>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              See how intelligent URL infrastructure compares against traditional shortener stacks.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/85 shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-edge-subtle bg-ink-950/70 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="p-4 sm:p-5">Capability</th>
                    <th className="p-4 text-accent-cyan sm:p-5">LinkSphere Platform</th>
                    <th className="p-4 text-slate-400 sm:p-5">Traditional URL Services</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge-subtle/50">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="transition-colors hover:bg-white/[0.02]">
                      <td className="p-4 font-semibold text-white sm:p-5">{row.feature}</td>
                      <td className="p-4 font-mono font-bold text-accent-cyan sm:p-5">
                        {row.linksphere}
                      </td>
                      <td className="p-4 font-mono text-slate-400 sm:p-5">{row.legacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Interactive Diagnostic Banner */}
        <div className="mt-16 grid gap-4 rounded-2xl border border-edge-subtle bg-ink-950/70 p-5 backdrop-blur-xl sm:grid-cols-3 sm:gap-6 sm:p-7">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent-cyan">
              <FiActivity size={13} />
              <span>Multi-Provider AI Fallback</span>
            </div>
            <p className="text-xs text-slate-400">
              Primary Groq execution with automated recovery to ensure high-availability URL ingestion without single provider lock-in.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent-cyan">
              <FiAlertTriangle size={13} />
              <span>DDoS Mitigation Circuit</span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-disables links exceeding 20 clicks in 30 seconds with automatic agent diversity analysis and human-only manual toggles.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-accent-cyan">
              <FiTerminal size={13} />
              <span>Stateless Session Control</span>
            </div>
            <p className="text-xs text-slate-400">
              Server-tracked active access tokens invalidate previous sessions immediately upon refresh, password reset, or username update.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-6 shadow-2xl backdrop-blur-xl sm:mt-24 sm:p-10 lg:p-12">
          <img
            src={Logo}
            alt=""
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10 blur-[1px]"
          />
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="max-w-xl space-y-1.5">
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                Ready to deploy AI-screened short links?
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm">
                Register in seconds with email verification and start routing links through LinkSphere today.
              </p>
            </div>

            <Link
              to="/register"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
            >
              <span>Create Free Account</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage