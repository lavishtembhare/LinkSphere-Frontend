import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiLink,
  FiCpu,
  FiGlobe,
  FiBarChart2,
  FiArrowRight,
  FiCheck,
  FiTerminal,
  FiRepeat,
  FiActivity,
} from 'react-icons/fi'
import Logo from '../assets/logo.svg'
import ThreeCanvas from './ThreeCanvas'

const workflowSteps = [
  {
    step: '01',
    badge: 'Step 1 • Ingestion',
    title: 'URL Ingestion & Validation',
    icon: FiLink,
    desc: 'The client sends a payload containing the destination target. Client-side validation checks URL format while stateless JWT headers verify user ownership and screening shields.',
    codeSnippet: `POST /api/urls/shorten
Host: api.linksphere.io
Authorization: Bearer eyJhbGciOiJIUzM4NC...
Content-Type: application/json

{
  "originalUrl": "https://github.com/torvalds/linux"
}`,
    highlights: ['Sanitizes destination target', 'JWT session verification', 'Validates vanity slug availability'],
  },
  {
    step: '02',
    badge: 'Step 2 • Processing',
    title: 'Base62 Slug Encoding',
    icon: FiCpu,
    desc: 'The Spring Boot core processes the URL, generating a collision-resistant 6-8 character Base62 alphanumeric hash stored with relational metadata in the database.',
    codeSnippet: `// Spring Boot Base62 Shortening Logic
String slug = Base62.encode(urlEntity.getId());
urlEntity.setShortUrl(slug);
urlEntity.setCreatedDate(LocalDateTime.now());
urlRepository.save(urlEntity);`,
    highlights: ['Collision-proof unique key generation', 'Atomic database persistence', 'Instant cache warming'],
  },
  {
    step: '03',
    badge: 'Step 3 • Edge Routing',
    title: 'Sub-50ms Subdomain Resolution',
    icon: FiGlobe,
    desc: 'When a visitor hits the short URL on the dedicated routing subdomain (e.g. url.linksphere.io/slug), the edge server performs an instant 302 redirect to the destination target.',
    codeSnippet: `HTTP/1.1 302 Found
Location: https://github.com/torvalds/linux
X-Redirect-Latency: 18ms
Cache-Control: no-cache, no-store`,
    highlights: ['Subdomain traffic isolation', 'Zero cold-start lookups', 'Encrypted TLS handshakes'],
  },
  {
    step: '04',
    badge: 'Step 4 • Telemetry',
    title: 'Asynchronous Telemetry Ingestion',
    icon: FiBarChart2,
    desc: 'Each redirect logs an asynchronous telemetry event (timestamp, IP hash, bot score) without impacting redirect speed. Data surfaces live on your interactive Chart.js dashboard.',
    codeSnippet: `GET /api/urls/analytics/k9X2bQ
{
  "shortUrl": "k9X2bQ",
  "clickCount": 1420,
  "events": [{ "timestamp": "2026-08-23T18:28:00Z" }]
}`,
    highlights: ['Non-blocking event recording', 'Real-time TanStack Query hydration', 'Rolling velocity graphs'],
  },
]

const faqs = [
  {
    q: 'How does LinkSphere achieve sub-50ms redirects?',
    a: 'By separating the user management dashboard from the dedicated redirect gateway, lookup overhead is stripped down to raw in-memory index resolution.',
  },
  {
    q: 'Are shortened links permanent?',
    a: 'Yes. Unless deleted by the account creator, all generated short slugs remain active indefinitely with full historical click logs preserved.',
  },
  {
    q: 'How does the telemetry chart update in real time?',
    a: 'The frontend leverages TanStack Query v5 with targeted cache invalidation, re-fetching timeline arrays instantly whenever new links or time filters change.',
  },
]

const HowItWorksPage = () => {
  return (
    <div className="relative overflow-hidden bg-ink bg-grid-pattern text-slate-100">
      <ThreeCanvas className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40" />

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[800px] -left-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 text-xs font-semibold text-accent-cyan backdrop-blur-md">
            <FiRepeat className="animate-spin text-accent-cyan [animation-duration:8s]" size={13} />
            Architecture & Pipeline
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            How{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
              LinkSphere
            </span>{' '}
            works.
          </h1>

          <p className="mt-4 text-xs leading-relaxed text-slate-300 sm:text-sm lg:text-base">
            From client input to edge redirection and telemetry logging — here is the end-to-end data lifecycle of every shortened URL.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="mt-12 space-y-6 sm:mt-16 sm:space-y-8 lg:space-y-10">
          {workflowSteps.map((item, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={item.step}
                className={`group flex flex-col items-stretch gap-6 rounded-2xl border border-edge-subtle bg-surface-card/85 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 sm:p-7 lg:flex-row ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Description */}
                <div className="flex flex-1 flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 font-mono text-xs font-bold text-accent-cyan shadow-glow-blue sm:h-10 sm:w-10 sm:text-sm">
                        {item.step}
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-cyan sm:text-[11px]">
                        {item.badge}
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <ul className="space-y-1.5 border-t border-edge-subtle/60 pt-3">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 font-mono text-xs text-slate-400">
                        <FiCheck className="shrink-0 text-accent-cyan" size={13} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Terminal Box */}
                <div className="flex-1 overflow-hidden rounded-xl border border-edge-subtle bg-ink-950 p-3.5 shadow-2xl sm:p-4">
                  <div className="mb-2.5 flex items-center justify-between border-b border-edge-subtle pb-2 font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500/80" />
                      <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                      <span className="ml-1 text-[10px] text-slate-500">Stage {item.step} Payload</span>
                    </div>
                    <FiTerminal size={12} className="text-accent-blue" />
                  </div>
                  <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
                    <code>{item.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Technical FAQ
            </span>
            <h2 className="mt-1.5 font-display text-2xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-edge-subtle bg-surface-card/80 p-5 shadow-lg backdrop-blur-md sm:p-6"
              >
                <h3 className="font-display text-sm font-bold text-white sm:text-base">
                  {faq.q}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-accent-blue/30 bg-gradient-to-b from-surface-card to-ink-900 p-6 shadow-2xl backdrop-blur-xl sm:mt-24 sm:p-10 lg:p-12">
          <img
            src={Logo}
            alt=""
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-10 blur-[1px]"
          />
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="max-w-xl space-y-1.5">
              <h3 className="font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                Ready to experience sub-second routing?
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm">
                Deploy fast vanity aliases with instant click telemetry tracking in seconds.
              </p>
            </div>

            <Link
              to="/register"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
            >
              <span>Get Started Free</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage