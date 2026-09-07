import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { RxCross2 } from 'react-icons/rx'
import { IoIosMenu } from 'react-icons/io'
import { FiExternalLink } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Logo from '../assets/logo.svg'
import api from '../api/api'
import { useStoreContext } from '../contextApi/contextApi'

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const path = location.pathname

  const { token, refreshToken, clearAuth } = useStoreContext()

  const onLogOutHandler = async () => {
    try {
      if (refreshToken) {
        await api.post(
          '/api/auth/public/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
      }
    } catch {
      // Clean up client state regardless of network status
    } finally {
      clearAuth()
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'How it Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-edge-subtle/80 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <nav className="hidden items-center gap-1 rounded-full border border-edge-subtle bg-surface-card/60 px-2.5 py-1.5 shadow-inner-light backdrop-blur-md md:flex">
          {navLinks.map(({ label, to }) => {
            const isActive = path === to
            return (
              <Link
                key={label}
                to={to}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 lg:px-3.5 lg:py-1.5 ${
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

        <div className="hidden items-center gap-2.5 sm:flex">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-xl border border-edge-subtle bg-surface-card px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-accent-blue/40 hover:bg-surface-hover hover:text-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogOutHandler}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan p-[1px] font-semibold text-ink-950 shadow-glow-blue transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="flex h-full w-full items-center gap-1.5 rounded-[11px] bg-gradient-to-r from-accent-blue to-accent-cyan px-3.5 py-1.5 text-xs font-bold text-ink-950">
                  Get Started
                  <FiExternalLink size={12} />
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-edge-subtle bg-surface-card text-slate-300 hover:text-white sm:hidden"
          aria-label="Toggle menu"
        >
          {navbarOpen ? <RxCross2 size={20} /> : <IoIosMenu size={22} />}
        </button>
      </div>

      {navbarOpen && (
        <div className="border-b border-edge-subtle bg-ink-900/95 px-4 py-4 backdrop-blur-2xl sm:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setNavbarOpen(false)}
                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-surface hover:text-accent-cyan"
              >
                {label}
              </Link>
            ))}

            <div className="my-1.5 h-px bg-edge-subtle" />

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setNavbarOpen(false)}
                  className="rounded-lg bg-surface-card py-2 text-center text-xs font-semibold text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setNavbarOpen(false)
                    onLogOutHandler()
                  }}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-center text-xs font-semibold text-red-400"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setNavbarOpen(false)}
                  className="rounded-lg border border-edge-subtle bg-surface-card py-2 text-center text-xs font-semibold text-slate-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setNavbarOpen(false)}
                  className="rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan py-2 text-center text-xs font-bold text-ink-950"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar