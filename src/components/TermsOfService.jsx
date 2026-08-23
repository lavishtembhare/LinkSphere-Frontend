import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiFileText,
  FiAlertOctagon,
  FiLock,
  FiActivity,
  FiSlash,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
} from 'react-icons/fi'

const sections = [
  {
    icon: FiCheckCircle,
    title: '1. Acceptance of Agreement',
    content: [
      'By accessing LinkSphere, creating an account, or generating shortened URLs, you agree to be bound by these Terms of Service.',
      'If you are using LinkSphere on behalf of an organization, you confirm you have legal authority to bind that entity to these conditions.',
    ],
  },
  {
    icon: FiAlertOctagon,
    title: '2. Prohibited Use & Abuse Policies',
    content: [
      'Malicious Redirection: You may not use LinkSphere to redirect to phishing hubs, credential harvesters, malware distribution payloads, or ransomware.',
      'Spam & Scraping: Automated mass generation of vanity slugs intended for unsolicited spam campaigns or search index poisoning is strictly prohibited.',
      'Illegal Activities: Links redirecting to content violating copyright laws, promoting unlawful acts, or infringing intellectual property will be immediately neutralized.',
    ],
  },
  {
    icon: FiLock,
    title: '3. Authentication & Account Security',
    content: [
      'You are responsible for safeguarding your login credentials and JWT authentication tokens.',
      'LinkSphere is not liable for unauthorized URL generation or configuration modifications resulting from compromised credentials.',
      'Notify administration immediately upon suspecting any unauthorized access to your account.',
    ],
  },
  {
    icon: FiActivity,
    title: '4. Edge Routing & Service Availability',
    content: [
      'We strive for 99.99% edge gateway uptime and sub-50ms redirection response times globally.',
      'We reserve the right to conduct scheduled infrastructure maintenance, gateway patches, or database migrations with prior notice.',
      'Telemetry statistics and click aggregation data are provided for analytical purposes on an "as-available" basis.',
    ],
  },
  {
    icon: FiSlash,
    title: '5. Slug Ownership & Link Revocation',
    content: [
      'LinkSphere reserves the right to reclaim, suspend, or modify custom vanity slugs that infringe on registered trademarks, impersonate verified brands, or violate policy.',
      'We may terminate or suspend links exhibiting anomalous bot traffic or abusive distributed request patterns without prior warning.',
    ],
  },
  {
    icon: FiShield,
    title: '6. Limitation of Liability & Warranty',
    content: [
      'LinkSphere is provided "AS IS" without warranties of any kind, whether express or implied.',
      'Under no circumstances shall LinkSphere Technologies Inc. be liable for lost profits, downtime, target destination unavailability, or indirect damages.',
    ],
  },
]

const TermsOfService = () => {
  return (
    <div className="relative overflow-hidden bg-ink bg-grid-pattern text-slate-100">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[120px] sm:h-[500px] sm:w-[800px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute top-[700px] -left-32 h-64 w-64 rounded-full bg-accent-cyan/10 blur-[100px] sm:h-[450px] sm:w-[450px] sm:blur-[130px]" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-edge-subtle bg-surface-card/80 px-3.5 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-accent-blue/40 hover:bg-surface-card hover:text-white sm:px-4 sm:py-2"
        >
          <FiArrowLeft size={13} /> Back to Home
        </Link>

        {/* Header Hero */}
        <div className="mt-6 space-y-2 sm:mt-8 sm:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 text-[11px] font-semibold text-accent-cyan backdrop-blur-md sm:text-xs">
            <FiFileText size={12} />
            User Agreement
          </div>

          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>

          <p className="font-mono text-[11px] text-slate-400 sm:text-xs">
            Last Updated: August 2026 • Platform Version 2.4
          </p>

          <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
            Please read these terms carefully before utilizing LinkSphere edge redirection, link management consoles, or API endpoints.
          </p>
        </div>

        <hr className="my-6 border-edge-subtle sm:my-8" />

        {/* Policy Sections */}
        <div className="space-y-4 sm:space-y-6">
          {sections.map(({ icon: Icon, title, content }) => (
            <div
              key={title}
              className="rounded-2xl border border-edge-subtle bg-surface-card/85 p-4 shadow-xl backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:p-7"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue sm:h-10 sm:w-10">
                  <Icon size={16} className="sm:text-[18px]" />
                </div>
                <h2 className="font-display text-base font-bold text-white sm:text-lg lg:text-xl">
                  {title}
                </h2>
              </div>

              <ul className="mt-3.5 space-y-2 sm:mt-5 sm:space-y-3">
                {content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300 sm:gap-3 sm:text-sm">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-accent-cyan" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Footer Card */}
        <div className="mt-8 rounded-2xl border border-accent-blue/30 bg-ink-950/80 p-5 text-center backdrop-blur-xl sm:mt-10 sm:rounded-3xl sm:p-7">
          <h3 className="font-display text-sm font-bold text-white sm:text-base lg:text-lg">
            Need clarification on these terms?
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Reach out directly at{' '}
            <a
              href="mailto:lavishtembhare93@gmail.com"
              className="font-mono font-semibold text-accent-cyan transition-colors hover:text-accent-blue hover:underline"
            >
              lavishtembhare93@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService