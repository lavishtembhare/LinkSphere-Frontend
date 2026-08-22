import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLayers, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'
import TextField from './TextField'
import { useStoreContext } from '../contextApi/ContextApi'

const perks = [
  'Instant access to all shortened links',
  'Live traffic telemetry & click graphs',
  'Sub-second vanity link routing',
]

const Login = () => {
  const [loader, setLoader] = useState(false)
  const [serverError, setServerError] = useState('')
  const { setToken } = useStoreContext()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const loginHandler = async (data) => {
    setLoader(true)
    setServerError('')

    const payload = {
      username: data.username.trim(),
      password: data.password,
    }

    try {
      const response = await api.post('/api/auth/public/login', payload)
      const token = response.data?.token || response.data

      if (token) {
        setToken(token)
        toast.success('Welcome back!')
        reset()
        navigate('/dashboard')
      } else {
        throw new Error('No token returned from server')
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        (err?.request
          ? 'Backend server unreachable. Make sure Spring Boot is running.'
          : 'Invalid username or password.')

      setServerError(message)
      toast.error(message)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-5 py-14 sm:px-8">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent-cyan/10 blur-[110px]" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/85 shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-5">
          {/* Left Hero Panel */}
          <div className="relative hidden flex-col justify-between border-r border-edge-subtle bg-gradient-to-b from-ink-900/90 to-ink-950/90 p-10 lg:col-span-2 lg:flex">
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
                  <FiLayers size={19} />
                </div>
                <span className="font-display text-lg font-bold text-white">
                  Link<span className="text-accent-cyan">Sphere</span>
                </span>
              </Link>

              <h2 className="mt-10 font-display text-2xl font-bold leading-snug text-white">
                Welcome back to your link telemetry hub.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Log in to generate secure vanity URLs, view analytics, and control routing.
              </p>

              <div className="mt-8 space-y-3.5">
                {perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <FiCheckCircle className="shrink-0 text-accent-cyan" size={15} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-edge-subtle pt-6 text-[11px] text-slate-500">
              Encrypted Session • JWT Authenticated
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-12 lg:col-span-3">
            <div className="mb-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
                Account Access
              </span>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                Sign in to LinkSphere
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-accent-cyan hover:underline">
                  Create one free
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(loginHandler)} className="space-y-4">
              <TextField
                label="Username"
                id="username"
                type="text"
                required
                message="Username is required"
                placeholder="Enter your username"
                register={register}
                errors={errors}
              />

              <TextField
                label="Password"
                id="password"
                type="password"
                required
                message="Password is required"
                placeholder="Enter your password"
                register={register}
                errors={errors}
              />

              <button
                type="submit"
                disabled={loader}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-3 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-cyan disabled:opacity-50"
              >
                {loader ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] text-slate-500">
              Protected by LinkSphere Enterprise Token Shield.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login