import React from 'react'
import { Link } from 'react-router-dom'
import {
    FiShield,
    FiLock,
    FiDatabase,
    FiEye,
    FiFileText,
    FiServer,
    FiArrowLeft,
    FiCheckCircle,
} from 'react-icons/fi'

const sections = [
    {
        icon: FiDatabase,
        title: '1. Information We Collect',
        content: [
            'Account Credentials: Username, encrypted password hashes, and session authentication tokens (JWT).',
            'Managed Link Data: Original target URLs, generated vanity slugs, and creation timestamps.',
            'Telemetry & Click Logs: Anonymized IP addresses, HTTP referrers, user-agent device signatures, and request timestamps recorded during edge redirection.',
        ],
    },
    {
        icon: FiServer,
        title: '2. How Telemetry Data is Used',
        content: [
            'Executing high-speed, sub-50ms HTTP redirects across our distributed edge routing proxy.',
            'Aggregating real-time click volume, velocity graphs, and temporal analytics inside your Command Center.',
            'Monitoring automated scrapers, phishing URLs, and distributed abuse through our Enterprise Token Shield.',
        ],
    },
    {
        icon: FiLock,
        title: '3. Data Security & Encryption',
        content: [
            'All communications between clients, edge nodes, and database servers are secured via TLS 1.3 encryption.',
            'Authentication relies on stateless, cryptographically signed JSON Web Tokens (JWT) with automated expiration.',
            'We do not sell, rent, or trade raw user click streams or personal identity metadata to third-party ad networks.',
        ],
    },
    {
        icon: FiEye,
        title: '4. Cookies & Client Storage',
        content: [
            'We use secure browser LocalStorage strictly for persisting active authentication session tokens.',
            'No third-party tracking cookies or behavioral advertising pixels are injected into shortened redirection hops.',
        ],
    },
    {
        icon: FiFileText,
        title: '5. User Rights & Data Deletion',
        content: [
            'You retain full ownership over your vanity slugs and destination targets.',
            'Deleting a short link permanently terminates edge routing for that slug and disassociates its click logs.',
            'You may request account purge and complete telemetry data deletion at any time.',
        ],
    },
]

const PrivacyPolicy = () => {
    return (
        <div className="relative overflow-hidden bg-ink bg-grid-pattern text-slate-100">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/15 blur-[140px]" />
            <div className="pointer-events-none absolute top-[700px] -right-32 h-[450px] w-[450px] rounded-full bg-accent-cyan/10 blur-[130px]" />

            <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
                {/* Navigation Breadcrumb */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-edge-subtle bg-surface-card/80 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-accent-blue/40 hover:bg-surface-card hover:text-white"
                >
                    <FiArrowLeft size={14} /> Back to Home
                </Link>

                {/* Header Hero */}
                <div className="mt-8 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3.5 py-1 text-xs font-semibold text-accent-cyan backdrop-blur-md">
                        <FiShield size={13} />
                        Legal & Compliance
                    </div>

                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="font-mono text-xs text-slate-400">
                        Effective Date: August 2026 • Version 2.4
                    </p>

                    <p className="text-sm leading-relaxed text-slate-300">
                        At LinkSphere Technologies Inc., we are committed to transparent telemetry practices and zero-trust security architecture. This policy details how we process, store, and isolate link data.
                    </p>
                </div>

                <hr className="my-10 border-edge-subtle" />

                {/* Policy Sections */}
                <div className="space-y-8">
                    {sections.map(({ icon: Icon, title, content }) => (
                        <div
                            key={title}
                            className="rounded-3xl border border-edge-subtle bg-surface-card/85 p-6 shadow-xl backdrop-blur-xl sm:p-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
                                    <Icon size={18} />
                                </div>
                                <h2 className="font-display text-lg font-bold text-white sm:text-xl">
                                    {title}
                                </h2>
                            </div>

                            <ul className="mt-5 space-y-3">
                                {content.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                                        <FiCheckCircle className="mt-0.5 shrink-0 text-accent-cyan" size={16} />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact Footer Card */}
                <div className="mt-12 rounded-3xl border border-accent-blue/30 bg-ink-950/80 p-6 text-center backdrop-blur-xl sm:p-8">
                    <h3 className="font-display text-base font-bold text-white sm:text-lg">
                        Questions regarding our privacy standards?
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

export default PrivacyPolicy