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
import { useReveal } from '../hooks/useAnimations'

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
  const [phase, setPhase] = useState('TYPING')
  const [liveClicks, setLiveClicks] = useState(14280)

  const currentSample = DEMO_SAMPLES[sampleIndex]

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
    <div className="relative w-full max-w-lg select-none rounded-2xl border border-edge-subtle bg-surface-card/90 p-4 shadow-2xl shadow-accent-blue/15 backdrop-blur-2xl sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-blue/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-accent-cyan/10 blur-[60px]" />

      {/* Terminal Header */}
      <div className="mb-4 flex items-center justify-between border-b border-edge-subtle pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
          <div className="ml-1.5 flex items-center gap-1 font-mono text-[10px] text-slate-400 sm:text-[11px]">
            <FiTerminal size={11} className="text-accent-cyan" />
            <span>Autonomous Engine</span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
          {liveClicks.toLocaleString()} telemetry clicks
        </span>
      </div>

      <div className="space-y-3.5">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
              Target Long URL
            </label>
            <span className="flex items-center gap-1 font-mono text-[9px] text-accent-cyan sm:text-[10px]">
              <FiRadio size={9} className="animate-pulse" /> Live Stream
            </span>
          </div>

          <div className="relative flex h-10 items-center overflow-hidden rounded-xl border border-edge-subtle bg-ink-950 px-3 font-mono text-xs text-slate-200">
            <FiLink className="mr-2 shrink-0 text-accent-blue" size={13} />
            <span className="truncate text-slate-100">
              {displayedLongUrl}
              <span className="inline-block h-3.5 w-1.5 animate-pulse bg-accent-cyan align-middle" />
            </span>
          </div>
        </div>

        <div
          className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all duration-300 ${
            phase === 'COMPRESSING'
              ? 'border border-accent-cyan/50 bg-accent-cyan/20 text-accent-cyan shadow-[0_0_20px_rgba(56,189,248,0.4)]'
              : 'border border-edge-subtle bg-ink-950 text-slate-300'
          }`}
        >
          {phase === 'COMPRESSING' ? (
            <>
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
              <span>Routing Edge Node...</span>
            </>
          ) : (
            <>
              <FiZap size={13} className="text-accent-cyan" />
              <span>Compress URL</span>
            </>
          )}
        </div>

        <div className="rounded-xl border border-edge-subtle bg-ink-950/70 p-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
              Shortened Link Output
            </span>
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-2 py-0.5 font-mono text-[9px] text-accent-cyan">
              Sub-50ms SLA
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-hidden font-mono text-xs font-bold text-accent-cyan sm:text-sm">
              <FiLink className="shrink-0 text-accent-blue" size={14} />
              <span className="truncate">{displayedShortUrl}</span>
            </div>

            <div
              className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all duration-300 ${
                phase === 'COPIED'
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                  : 'border border-edge-subtle bg-ink-900 text-slate-400'
              }`}
            >
              {phase === 'COPIED' ? (
                <>
                  <FiCheck size={12} className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <FiCopy size={12} />
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

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:flex-row lg:gap-14 lg:px-8 lg:pt-18">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-cyan backdrop-blur-md">
            <span className="flex h-2 w-2 animate-ping rounded-full bg-accent-cyan" />
            V2.4 Powered by Global Edge Routing
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
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

          <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm lg:mx-0 lg:text-base">
            LinkSphere compresses complex URLs into fast, branded short codes and logs geographic click performance in real time without lag.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-5 py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03] sm:px-6 sm:text-sm"
            >
              Start Shortening Free
              <FiArrowRight size={15} />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-edge-subtle bg-surface-card/80 px-5 py-3 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white sm:px-6 sm:text-sm"
            >
              Explore Architecture
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 lg:justify-start sm:gap-6">
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

        <div className="flex w-full flex-1 justify-center lg:w-auto">
          <HeroDemo />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={howRef}
        className={`mx-auto max-w-7xl px-4 py-14 transition-all duration-700 sm:px-6 sm:py-20 lg:px-8 ${
          howVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            Workflow Process
          </span>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Shorten in three frictionless steps
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-edge-subtle bg-surface-card/60 p-5 shadow-inner-light backdrop-blur-md transition-all hover:border-accent-blue/40 hover:bg-surface sm:p-7"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 font-mono text-xs font-bold text-accent-cyan shadow-glow-blue sm:h-10 sm:w-10 sm:text-sm">
                {step.number}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-white sm:text-lg">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:text-left md:flex-row">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Infrastructure
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {features.map((feature, i) => (
            <Card key={feature.title} {...feature} delay={i * 70} />
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section
        ref={ctaRef}
        className={`relative mx-auto max-w-7xl px-4 py-14 text-center transition-all duration-700 sm:px-6 sm:py-20 lg:px-8 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-6 shadow-2xl shadow-accent-blue/10 sm:p-12 lg:p-16">
          <img
            src={Logo}
            alt=""
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10 blur-[1px]"
          />

          <h2 className="relative font-display text-2xl font-bold text-white sm:text-4xl">
            Start tracking high-performance short links today
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-xs text-slate-300 sm:text-sm">
            Join thousands of developers, creators, and teams tracking their link engagement with LinkSphere.
          </p>

          <div className="relative mt-6 flex justify-center">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-sm"
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