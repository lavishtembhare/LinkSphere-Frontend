import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa'
import Logo from '../assets/logo.svg'

const socials = [
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebook, href: '#', label: 'Facebook' },
]

const Footer = () => {
  return (
    <footer className="border-t border-edge-subtle bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-blue/30 bg-accent-blue/10 p-1 text-accent-cyan shadow-glow-blue transition-all duration-300 group-hover:scale-105">
              <img src={Logo} alt="LinkSphere" className="h-full w-full object-contain" />
            </div>
            <span className="font-display text-base font-bold text-white">
              Link<span className="text-accent-cyan">Sphere</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-slate-400">All edge systems operational</span>
          </div>

          <div className="flex gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge-subtle bg-surface-card text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-accent-cyan"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-edge-subtle/60 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; 2026 LinkSphere Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
            <a href="#security" className="hover:text-slate-400">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer