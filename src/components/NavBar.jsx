import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx'
import { IoIosMenu } from 'react-icons/io'
import { FiExternalLink } from 'react-icons/fi'
import Logo from '../assets/logo.svg'
import { useStoreContext } from '../contextApi/ContextApi'

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  // 1. Consume reactive state from ContextApi instead of static localStorage
  const { token, setToken } = useStoreContext()

  const onLogOutHandler = () => {
    // 2. Clear both React Context state and localStorage
    setToken(null)
    localStorage.removeItem('token')
    navigate('/login')
  }

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'How it Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-edge-subtle/80 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-blue/40 bg-accent-blue/10 p-1.5 shadow-glow-blue transition-all duration-300 group-hover:scale-105 group-hover:bg-accent-blue/20">
            <img 
              src={Logo} 
              alt="LinkSphere" 
              className="h-full w-full object-contain transition-transform duration-300 group-hover:rotate-6" 
            />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Link<span className="bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">Sphere</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-edge-subtle bg-surface-card/60 px-3 py-1.5 shadow-inner-light backdrop-blur-md md:flex">
          {navLinks.map(({ label, to }) => {
            const isActive = path === to
            return (
              <Link
                key={label}
                to={to}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'border border-accent-blue/30 bg-accent-blue/15 text-accent-cyan shadow-sm'
                    : 'text-slate-400 hover:bg-surface-hover/60 hover:text-slate-100'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg border border-edge-subtle bg-surface-card px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogOutHandler}
                className="rounded-lg border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan p-[1px] font-semibold text-ink-950 shadow-glow-blue transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-cyan"
              >
                <span className="flex h-full w-full items-center gap-1.5 rounded-[7px] bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-1.5 text-xs font-bold text-ink-950">
                  Get Started
                  <FiExternalLink size={13} />
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-edge-subtle bg-surface-card text-slate-300 hover:text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {navbarOpen ? <RxCross2 size={20} /> : <IoIosMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {navbarOpen && (
        <div className="border-b border-edge-subtle bg-ink-900/95 px-6 py-5 backdrop-blur-2xl sm:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setNavbarOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-surface hover:text-accent-cyan"
              >
                {label}
              </Link>
            ))}
            <div className="my-2 h-px bg-edge-subtle" />
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setNavbarOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setNavbarOpen(false)
                    onLogOutHandler()
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/register"
                onClick={() => setNavbarOpen(false)}
                className="w-full rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-center text-xs font-bold text-ink-950"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar