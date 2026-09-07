import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLayers, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'
import TextField from './TextField'
import ForgotPasswordModal from './ForgotPasswordModal'
import { useStoreContext } from '../contextApi/contextApi'

const perks = [
  'Instant access to all shortened links',
  'Live traffic telemetry & click graphs',
  'Sub-second vanity link routing',
]

const Login = () => {
  const [loader, setLoader] = useState(false)
  const [serverError, setServerError] = useState('')
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  const { setAuthTokens } = useStoreContext()
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
      const accessToken = response.data?.token || response.data
      const refreshToken = response.data?.refreshToken || null

      if (accessToken) {
        setAuthTokens({ token: accessToken, refreshToken })
        toast.success('Welcome back!')
        reset()
        navigate('/dashboard')
      } else {
        throw new Error('No authentication token returned by server.')
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Invalid username or password.'

      setServerError(message)
      toast.error(message)
    } finally {
      setLoader(false)
    }
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-accent-blue/15 blur-[120px] sm:h-[450px] sm:w-[700px] sm:blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-accent-cyan/10 blur-[90px] sm:h-72 sm:w-72 sm:blur-[110px]" />

        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/90 shadow-2xl backdrop-blur-2xl sm:rounded-3xl lg:max-w-4xl">
          <div className="grid lg:grid-cols-5">
            {/* Left Hero Panel */}
            <div className="relative hidden flex-col justify-between border-r border-edge-subtle bg-gradient-to-b from-ink-900/90 to-ink-950/90 p-8 lg:col-span-2 lg:flex lg:p-10">
              <div>
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-blue/40 bg-accent-blue/10 text-accent-cyan shadow-glow-blue">
                    <FiLayers size={19} />
                  </div>
                  <span className="font-display text-lg font-bold text-white">
                    Link<span className="text-accent-cyan">Sphere</span>
                  </span>
                </Link>

                <h2 className="mt-8 font-display text-xl font-bold leading-snug text-white lg:mt-10 lg:text-2xl">
                  Welcome back to your link telemetry hub.
                </h2>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                  Log in to inspect click trends, adjust routing toggles, and generate AI-screened vanity links.
                </p>

                <div className="mt-6 space-y-3 lg:mt-8">
                  {perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2 text-xs text-slate-300">
                      <FiCheckCircle className="shrink-0 text-accent-cyan" size={14} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-edge-subtle pt-5 text-[11px] text-slate-500">
                Encrypted Session • Automated 30-Day Refresh Rotation
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="p-5 sm:p-8 lg:col-span-3 lg:p-10">
              <div className="mb-5 sm:mb-6">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
                  Account Access
                </span>
                <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                  Sign in to LinkSphere
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Don&apos;t have an account?{' '}
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

              <form onSubmit={handleSubmit(loginHandler)} className="space-y-3.5 sm:space-y-4">
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

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs"
                    >
                      Password <span className="text-accent-cyan">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] font-medium text-accent-cyan transition-colors hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <TextField
                    id="password"
                    type="password"
                    required
                    message="Password is required"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loader}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-cyan disabled:opacity-50 sm:mt-6 sm:py-3 sm:text-sm"
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

              <p className="mt-4 text-center text-[10px] text-slate-500 sm:mt-5 sm:text-[11px]">
                Protected by LinkSphere Heuristic Bot Shield &amp; Burst Detection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        setOpen={setForgotPasswordOpen}
      />
    </>
  )
}

export default Login