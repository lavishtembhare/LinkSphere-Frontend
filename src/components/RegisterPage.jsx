import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLayers, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'
import TextField from './TextField'

const perks = [
  'Custom vanity codes & branded aliases',
  'Sub-second global redirection infrastructure',
  'Real-time geographic & referrer analytics',
]

const RegisterPage = () => {
  const [loader, setLoader] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const passwordValue = watch('password')

  const registerHandler = async (data) => {
    setLoader(true)
    setServerError('')

    const payload = {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      role: ['ROLE_USER'],
    }

    try {
      const response = await api.post('/api/auth/public/register', payload)

      const successMsg =
        typeof response.data === 'string'
          ? response.data
          : response.data?.message || 'Registration Successful'

      toast.success(successMsg)
      reset()
      navigate('/login')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        (err?.request
          ? 'Backend server unreachable. Make sure Spring Boot is running on port 8080.'
          : 'Registration failed. Please try again.')

      setServerError(message)
      toast.error(message)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-accent-blue/15 blur-[120px] sm:h-[450px] sm:w-[700px] sm:blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-accent-cyan/10 blur-[90px] sm:h-72 sm:w-72 sm:blur-[110px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-edge-subtle bg-surface-card/90 shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl sm:rounded-3xl lg:max-w-4xl">
        <div className="grid lg:grid-cols-5">
          {/* Left Hero Panel (Desktop & Large Tablets) */}
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
                Engineered for speed, built for scale.
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                Create clean links, monitor live engagement telemetry, and safeguard access from a single command center.
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
              Free plan available • No credit card required
            </div>
          </div>

          {/* Right Form Panel (Mobile, Tablet & Desktop) */}
          <div className="p-5 sm:p-8 lg:col-span-3 lg:p-10">
            <div className="mb-5 sm:mb-6">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
                Authentication
              </span>
              <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                Create your account
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-accent-cyan hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(registerHandler)} className="space-y-3 sm:space-y-3.5">
              <TextField
                label="Username"
                id="username"
                type="text"
                required
                min={3}
                message="Username is required"
                placeholder="Choose a username"
                register={register}
                errors={errors}
              />

              <TextField
                label="Email"
                id="email"
                type="email"
                required
                message="Email address is required"
                placeholder="name@company.com"
                validation={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address',
                  },
                }}
                register={register}
                errors={errors}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Password"
                  id="password"
                  type="password"
                  required
                  min={6}
                  message="Password is required"
                  placeholder="Create password"
                  register={register}
                  errors={errors}
                />

                <TextField
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  required
                  message="Confirm password"
                  placeholder="Re-enter password"
                  validation={{
                    validate: (value) =>
                      value === passwordValue || 'Passwords do not match',
                  }}
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
                    <span>Register Account</span>
                    <FiArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-[10px] text-slate-500 sm:mt-5 sm:text-[11px]">
              By registering, you agree to our{' '}
              <Link to="/terms" className="text-slate-400 hover:underline">
                Terms of Service
              </Link>{' '}
              &amp;{' '}
              <Link to="/privacy" className="text-slate-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage