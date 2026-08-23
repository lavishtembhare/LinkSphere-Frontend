import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaReddit,
  FaEnvelope,
} from 'react-icons/fa'
import { FaXTwitter, FaThreads } from 'react-icons/fa6'
import Logo from '../assets/logo.svg'

const socials = [
  {
    icon: FaGithub,
    href: 'https://github.com/lavishtembhare',
    label: 'GitHub',
  },
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/lavishtembhare/',
    label: 'LinkedIn',
  },
  {
    icon: FaXTwitter,
    href: 'https://x.com/lavish_tembhare',
    label: 'X (Twitter)',
  },
  {
    icon: FaThreads,
    href: 'https://www.threads.com/@lavish_tembhare',
    label: 'Threads',
  },
  {
    icon: FaInstagram,
    href: 'https://www.instagram.com/lavish_tembhare/?next=%2F&hl=en',
    label: 'Instagram',
  },
  {
    icon: FaFacebook,
    href: 'https://www.facebook.com/lavish.tembhare.39',
    label: 'Facebook',
  },
  {
    icon: FaReddit,
    href: 'https://www.reddit.com/user/LavishTembhare/',
    label: 'Reddit',
  },
]

const Footer = () => {
  return (
    <footer className="border-t border-edge-subtle bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-blue/30 bg-accent-blue/10 p-1 text-accent-cyan shadow-glow-blue transition-all duration-300 group-hover:scale-105">
              <img src={Logo} alt="LinkSphere" className="h-full w-full object-contain" />
            </div>
            <span className="font-display text-base font-bold text-white">
              Link<span className="text-accent-cyan">Sphere</span>
            </span>
          </Link>

          {/* Edge Node Operational Badge */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-slate-400">All edge systems operational</span>
          </div>

          {/* Social Icons Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge-subtle bg-surface-card text-slate-400 transition-all duration-200 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-accent-cyan hover:shadow-glow-blue"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-edge-subtle/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; 2026 LinkSphere Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="transition-colors hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-slate-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer