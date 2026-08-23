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
  FiShield,
  FiZap,
  FiServer,
  FiRepeat,
} from 'react-icons/fi'
import Logo from '../assets/logo.svg'

const workflowSteps = [
  {
    step: '01',
    badge: 'Step 1 • Ingestion',
    title: 'URL Ingestion & Validation',
    icon: FiLink,
    desc: 'The client sends a payload containing the long destination URL. Client-side regex verifies format integrity while JWT authorization headers protect against unauthorized requests.',
    codeSnippet: `POST /api/urls/shorten
Host: api.linksphere.io
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Content-Type: application/json

{
  "originalUrl": "https://github.com/torvalds/linux"
}`,
    highlights: ['Sanitizes destination target', 'JWT session verification', 'Validates custom vanity alias availability'],
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
    desc: 'Each redirect logs an asynchronous telemetry event (timestamp, status code, clicks) without impacting redirect speed. Data surfaces live on your interactive Chart.js dashboard.',
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
    a: 'By separating the user management dashboard from the dedicated redirect gateway (`url.domain.com`), lookup overhead is stripped down to raw in-memory index resolution.',
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
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-[800px] -left-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[1600px] -right-32 h-[500px] w-[500px] rounded-full bg-accent-blue/10 blur-[150px]" />

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-semibold text-accent-cyan backdrop-blur-md">
            <FiRepeat className="animate-spin text-accent-cyan [animation-duration:8s]" size={13} />
            Architecture & Pipeline
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            How <span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">LinkSphere</span> works.
          </h1>

          <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
            From client input to edge redirection and telemetry logging—here is the end-to-end data lifecycle of every shortened URL.
          </p>
        </div>

        {/* Step-by-Step Architecture Pipeline */}
        <div className="mt-20 space-y-12">
          {workflowSteps.map((item, index) => {
            const Icon = item.icon
            const isEven = index % 2 === 1

            return (
              <div
                key={item.step}
                className={`flex flex-col items-stretch gap-8 rounded-3xl border border-edge-subtle bg-surface-card/85 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/40 lg:flex-row sm:p-8 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Description Column */}
                <div className="flex flex-1 flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 font-mono text-sm font-bold text-accent-cyan shadow-glow-blue">
                        {item.step}
                      </div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent-cyan">
                        {item.badge}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <ul className="space-y-2 border-t border-edge-subtle/60 pt-4">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 font-mono text-xs text-slate-400">
                        <FiCheck className="shrink-0 text-accent-cyan" size={14} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Code Terminal Visualizer */}
                <div className="flex-1 overflow-hidden rounded-2xl border border-edge-subtle bg-ink-950 p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between border-b border-edge-subtle pb-2.5 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-[10px] text-slate-500">Pipeline Stage {item.step}</span>
                    </div>
                    <FiTerminal size={13} className="text-accent-blue" />
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
        <div className="mt-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-cyan">
              Technical FAQ
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-3xl border border-edge-subtle bg-surface-card/80 p-6 shadow-lg backdrop-blur-md"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {faq.q}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action CTA */}
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
                Ready to experience sub-second routing?
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm">
                Deploy fast vanity aliases with instant click telemetry tracking in seconds.
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-center">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-7 py-3.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-200 hover:scale-[1.03]"
              >
                <span>Get Started Free</span>
                <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage