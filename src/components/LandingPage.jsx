import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiLink, FiBarChart2, FiFolder, FiEdit3, FiShield,
  FiCopy, FiCheck, FiArrowRight, FiZap, FiCheckCircle
} from 'react-icons/fi'
import Card from './Card'
import { useCountUp, useReveal } from '../hooks/useAnimations'

const features = [
  { icon: FiLink, title: 'Instant Link Shortening', desc: 'Transform unwieldy URLs into lightning-fast 6-character links in milliseconds.' },
  { icon: FiBarChart2, title: 'Real-Time Click Intelligence', desc: 'Track geographic origin, referrers, device breakdown, and velocity graphs.' },
  { icon: FiFolder, title: 'Centralized Link Hub', desc: 'Tag, categorize, search, and bulk export all your generated short links from one screen.' },
  { icon: FiEdit3, title: 'Custom Branded Slugs', desc: 'Customize aliases with your product or brand name to boost click-through trust.' },
  { icon: FiShield, title: 'Enterprise Token Shield', desc: 'Every link is monitored for phishing protection and secured under encrypted session tokens.' },
  { icon: FiZap, title: 'Global Edge Redirection', desc: 'Sub-50ms redirect response times routed through high-speed edge distribution.' },
]

const steps = [
  { number: '01', title: 'Paste destination URL', desc: 'Drop in UTM campaign links, product pages, or long document addresses.' },
  { number: '02', title: 'Generate branded link', desc: 'LinkSphere creates a clean, secure vanity slug ready to share anywhere.' },
  { number: '03', title: 'Monitor engagement', desc: 'Watch real-time live click feeds and geographic traffic metrics populate.' },
]

const HeroDemo = () => {
  const [copied, setCopied] = useState(false)
  const [urlInput, setUrlInput] = useState('https://github.com/features/actions/workflows/deploy-production-2026')
  const [shortUrl, setShortUrl] = useState('linksphr.io/x7K9pQ')
  const [isGenerating, setIsGenerating] = useState(false)
  const clicks = useCountUp(14280, 1400, true)

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimulate = (e) => {
    e.preventDefault()
    setIsGenerating(true)
    setTimeout(() => {
      setShortUrl(`linksphr.io/${Math.random().toString(36).substring(2, 8)}`)
      setIsGenerating(false)
    }, 450)
  }

  return (
    <div className="relative w-full max-w-lg rounded-2xl border border-edge-subtle bg-ink-900/90 p-6 shadow-2xl shadow-accent-blue/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-edge-subtle pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">Live URL Sandbox</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {clicks.toLocaleString()} clicks tracked
        </span>
      </div>

      <form onSubmit={handleSimulate} className="space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Long URL</label>
          <div className="flex rounded-lg border border-edge-subtle bg-ink-950 px-3 py-2 focus-within:border-accent-blue/60">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-slate-200 focus:outline-none"
              placeholder="Paste URL here..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue/20 border border-accent-blue/40 py-2 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-blue/30"
        >
          {isGenerating ? 'Shortening link...' : 'Compress URL'}
          <FiZap size={13} />
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-edge-subtle bg-surface-card p-3.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Shortened Link Output</span>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden font-mono text-sm font-semibold text-accent-cyan">
            <FiLink className="shrink-0 text-accent-blue" size={15} />
            <span className="truncate">{shortUrl}</span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-accent-blue text-ink font-bold hover:bg-accent-cyan'
              }`}
          >
            {copied ? (
              <>
                <FiCheck size={13} /> Copied
              </>
            ) : (
              <>
                <FiCopy size={13} /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const [howRef, howVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

  return (
    <div className="relative overflow-hidden bg-grid-pattern">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-accent-blue/15 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-[600px] -left-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px] animate-float-slow" />
      <div className="pointer-events-none absolute top-[1200px] -right-32 h-[500px] w-[500px] rounded-full bg-accent-indigo/10 blur-[150px] animate-float" />

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:flex-row lg:px-12 lg:pt-24">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-medium text-accent-cyan backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-ping" />
            V2.4 Powered by Global Edge Routing
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            {/* First line: smooth blur-fade up */}
            <span className="inline-block animate-[title-reveal_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] text-white">
              Smarter links.
            </span>{' '}
            <br />
            {/* Second line: delayed reveal with dynamic multi-stop gradient wave */}
            <span className="inline-block animate-[title-reveal_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
              <span className="bg-gradient-to-r from-accent-blue via-accent-cyan via-white to-accent-blue bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-flow_5s_ease_infinite] drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                Sharper analytics.
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base lg:mx-0">
            LinkSphere compresses complex URLs into fast, branded short codes and logs geographic click performance in real time without lag.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3.5 text-sm font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
            >
              Start Shortening Free
              <FiArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-edge-subtle bg-surface-card/80 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white"
            >
              Explore Architecture
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 lg:justify-start">
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="text-accent-cyan" /> 99.99% Uptime SLA
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="text-accent-cyan" /> Zero tracking latency
            </div>
            <div className="flex items-center gap-1.5">
              <FiCheckCircle className="text-accent-cyan" /> SSL Secured Endpoints
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <HeroDemo />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        ref={howRef}
        className={`mx-auto max-w-6xl px-5 py-24 transition-all duration-700 sm:px-8 lg:px-12 ${howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            Workflow Process
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Shorten in three frictionless steps
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-edge-subtle bg-surface-card/60 p-7 backdrop-blur-md transition-all hover:border-accent-blue/40 hover:bg-surface"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 font-mono text-sm font-bold text-accent-cyan shadow-glow-blue">
                {step.number}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:text-left md:flex-row">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Infrastructure
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for speed and data clarity
            </h2>
          </div>
          <Link
            to="/register"
            className="text-xs font-semibold text-accent-cyan hover:underline inline-flex items-center gap-1"
          >
            See all developer features <FiArrowRight />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={feature.title} {...feature} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className={`relative mx-auto max-w-5xl px-5 py-24 text-center transition-all duration-700 sm:px-8 lg:px-12 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-10 shadow-2xl shadow-accent-blue/10 sm:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-accent-blue/20 blur-[90px]" />

          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Start tracking high-performance short links today
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-xs sm:text-sm text-slate-300">
            Join thousands of developers, creators, and teams tracking their link engagement with LinkSphere.
          </p>

          <div className="relative mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-7 py-3.5 text-sm font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage