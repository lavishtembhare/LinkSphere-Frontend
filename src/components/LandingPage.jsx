import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiLink,
  FiBarChart2,
  FiFolder,
  FiEdit3,
  FiShield,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiCheckCircle,
  FiTerminal,
  FiRadio,
} from 'react-icons/fi'
import Card from './Card'
import Logo from '../assets/logo.svg'
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

const DEMO_SAMPLES = [
  {
    long: 'https://github.com/torvalds/linux/commit/v6.12-rc1-arm64-telemetry',
    short: 'linksphr.io/k9X2bQ',
  },
  {
    long: 'https://store.notion.so/templates/engineering-system-architecture-2026',
    short: 'linksphr.io/arch89',
  },
  {
    long: 'https://linear.app/features/roadmaps/initiatives/q3-performance-audit',
    short: 'linksphr.io/lin93v',
  },
  {
    long: 'https://stripe.com/docs/billing/subscriptions/usage-based-meters-api',
    short: 'linksphr.io/strp5x',
  },
]

const HeroDemo = () => {
  const [sampleIndex, setSampleIndex] = useState(0)
  const [displayedLongUrl, setDisplayedLongUrl] = useState('')
  const [displayedShortUrl, setDisplayedShortUrl] = useState('linksphr.io/k9X2bQ')
  const [phase, setPhase] = useState('TYPING') // 'TYPING' | 'COMPRESSING' | 'GENERATED' | 'COPIED'
  const [liveClicks, setLiveClicks] = useState(14280)

  const currentSample = DEMO_SAMPLES[sampleIndex]

  // Automated typing and sequence state machine
  useEffect(() => {
    let timeoutId

    if (phase === 'TYPING') {
      if (displayedLongUrl.length < currentSample.long.length) {
        timeoutId = setTimeout(() => {
          setDisplayedLongUrl(currentSample.long.slice(0, displayedLongUrl.length + 1))
        }, 22)
      } else {
        timeoutId = setTimeout(() => setPhase('COMPRESSING'), 500)
      }
    } else if (phase === 'COMPRESSING') {
      timeoutId = setTimeout(() => {
        setDisplayedShortUrl(currentSample.short)
        setLiveClicks((prev) => prev + Math.floor(Math.random() * 6) + 1)
        setPhase('GENERATED')
      }, 800)
    } else if (phase === 'GENERATED') {
      timeoutId = setTimeout(() => setPhase('COPIED'), 600)
    } else if (phase === 'COPIED') {
      timeoutId = setTimeout(() => {
        setDisplayedLongUrl('')
        setPhase('TYPING')
        setSampleIndex((prev) => (prev + 1) % DEMO_SAMPLES.length)
      }, 2200)
    }

    return () => clearTimeout(timeoutId)
  }, [phase, displayedLongUrl, currentSample])

  return (
    <div className="relative w-full max-w-lg select-none rounded-3xl border border-edge-subtle bg-surface-card/90 p-6 shadow-2xl shadow-accent-blue/15 backdrop-blur-2xl">
      {/* Background Neon Ambient Aura */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-blue/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-accent-cyan/10 blur-[60px]" />

      {/* Terminal Header Bar */}
      <div className="mb-5 flex items-center justify-between border-b border-edge-subtle pb-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <div className="ml-2 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <FiTerminal size={12} className="text-accent-cyan" />
            <span>Autonomous Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
            {liveClicks.toLocaleString()} telemetry clicks
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1: Animated Target URL Input */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Long URL
            </label>
            <span className="flex items-center gap-1 font-mono text-[10px] text-accent-cyan">
              <FiRadio size={10} className="animate-pulse" /> Live Stream
            </span>
          </div>

          <div className="relative flex h-11 items-center overflow-hidden rounded-xl border border-edge-subtle bg-ink-950 px-3.5 font-mono text-xs text-slate-200 shadow-inner transition-colors focus-within:border-accent-blue/50">
            <FiLink className="mr-2 shrink-0 text-accent-blue" size={14} />
            <span className="truncate text-slate-100">
              {displayedLongUrl}
              <span className="inline-block h-3.5 w-1.5 animate-pulse bg-accent-cyan align-middle" />
            </span>
          </div>
        </div>

        {/* Step 2: Animated Button Trigger */}
        <div
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all duration-300 ${
            phase === 'COMPRESSING'
              ? 'border border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[0.99]'
              : 'border border-edge-subtle bg-ink-950 text-slate-300'
          }`}
        >
          {phase === 'COMPRESSING' ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
              <span>Routing Edge Node...</span>
            </>
          ) : (
            <>
              <FiZap size={14} className="text-accent-cyan" />
              <span>Compress URL</span>
            </>
          )}
        </div>

        {/* Step 3: Shortened Link Output with Auto-Copy Action */}
        <div className="rounded-2xl border border-edge-subtle bg-ink-950/70 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Shortened Link Output
            </span>
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-2 py-0.5 font-mono text-[9px] text-accent-cyan">
              Sub-50ms SLA
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden font-mono text-sm font-bold text-accent-cyan">
              <FiLink className="shrink-0 text-accent-blue" size={16} />
              <span className="truncate transition-all duration-300">
                {displayedShortUrl}
              </span>
            </div>

            {/* Auto-Triggering Copy Pill */}
            <div
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
                phase === 'COPIED'
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.04]'
                  : 'border border-edge-subtle bg-ink-900 text-slate-400'
              }`}
            >
              {phase === 'COPIED' ? (
                <>
                  <FiCheck size={13} className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <FiCopy size={13} />
                  <span>Copy</span>
                </>
              )}
            </div>
          </div>
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
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 animate-pulse-glow rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[600px] -left-32 h-[450px] w-[450px] animate-float-slow rounded-full bg-accent-cyan/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[1200px] -right-32 h-[500px] w-[500px] animate-float rounded-full bg-accent-indigo/10 blur-[150px]" />

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:flex-row lg:px-12 lg:pt-24">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-medium text-accent-cyan backdrop-blur-md">
            <span className="flex h-2 w-2 animate-ping rounded-full bg-accent-cyan" />
            V2.4 Powered by Global Edge Routing
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            <span className="inline-block animate-[text-float-subtle_6s_ease-in-out_infinite]">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-[white-shimmer_7s_ease_infinite]">
                Smarter links.
              </span>
            </span>

            <br />

            <span className="inline-block mt-1 animate-[text-float-subtle_6s_ease-in-out_infinite_0.8s]">
              <span className="inline-block animate-[text-glow-pulse_4s_ease-in-out_infinite]">
                <span className="bg-gradient-to-r from-accent-blue via-accent-cyan via-white to-accent-blue bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-pan_4s_ease_infinite]">
                  Sharper analytics.
                </span>
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
        className={`mx-auto max-w-6xl px-5 py-24 transition-all duration-700 sm:px-8 lg:px-12 ${
          howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
              className="relative rounded-2xl border border-edge-subtle bg-surface-card/60 p-7 shadow-inner-light backdrop-blur-md transition-all hover:border-accent-blue/40 hover:bg-surface"
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
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan hover:underline"
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
        className={`relative mx-auto max-w-5xl px-5 py-24 text-center transition-all duration-700 sm:px-8 lg:px-12 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-10 shadow-2xl shadow-accent-blue/10 sm:p-16">
          <img
            src={Logo}
            alt=""
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10 blur-[1px]"
          />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-accent-blue/20 blur-[90px]" />

          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Start tracking high-performance short links today
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-xs text-slate-300 sm:text-sm">
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