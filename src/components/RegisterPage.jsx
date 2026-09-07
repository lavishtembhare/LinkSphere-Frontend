import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLayers, FiArrowRight, FiCheckCircle, FiMail, FiKey } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'
import TextField from './TextField'

const perks = [
  'LLM-driven vanity slug synthesis',
  'Real-time phishing & malware screening',
  'Automated OpenGraph metadata unfurling',
]

const RegisterPage = () => {
  const [loader, setLoader] = useState(false)
  const [serverError, setServerError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [registeredUsername, setRegisteredUsername] = useState('')
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
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
    }

    try {
      const response = await api.post('/api/auth/public/register', payload)
      toast.success(response.data?.message || 'Verification code emailed')
      setRegisteredUsername(payload.username)
      setOtpStep(true)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Registration failed. Please check your credentials.'

      setServerError(message)
      toast.error(message)
    } finally {
      setLoader(false)
    }
  }

  const verifyOtpHandler = async (e) => {
    e.preventDefault()
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }

    setLoader(true)
    setServerError('')

    try {
      const response = await api.post('/api/auth/public/register/verify-otp', {
        username: registeredUsername,
        otp: otp.trim(),
      })

      toast.success(response.data?.message || 'Email verified! Please sign in.')
      navigate('/login')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        'Invalid or expired verification code.'

      setServerError(message)
      toast.error(message)
    } finally {
      setLoader(false)
    }
  }

  return (
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
                Zero-trust edge routing with automated telemetry.
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                Create verified links protected by email OTP validation, heuristic bot suppression, and DDoS burst shields.
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
              Stateless JWT Architecture • Refresh Token Rotation
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-5 sm:p-8 lg:col-span-3 lg:p-10">
            {!otpStep ? (
              <>
                <div className="mb-5 sm:mb-6">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
                    Authentication Gateway
                  </span>
                  <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                    Create your account
                  </h1>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Already registered?{' '}
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
                        <span>Continue to Email Verification</span>
                        <FiArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div>
                <div className="mb-5 sm:mb-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 font-mono text-[10px] font-semibold text-accent-cyan">
                    <FiMail size={12} /> Verification Code Dispatched
                  </div>
                  <h1 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                    Verify your email
                  </h1>
                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Enter the 6-digit OTP code sent to your email to activate account{' '}
                    <span className="font-bold text-accent-cyan">@{registeredUsername}</span>.
                  </p>
                </div>

                {serverError && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    {serverError}
                  </div>
                )}

                <form onSubmit={verifyOtpHandler} className="space-y-4">
                  <div>
                    <label
                      htmlFor="otp"
                      className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs"
                    >
                      6-Digit Confirmation Code
                    </label>
                    <div className="relative mt-1">
                      <FiKey
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        size={15}
                      />
                      <input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-10 pr-3 font-mono text-center text-lg tracking-[0.35em] text-accent-cyan placeholder-slate-600 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue/30"
                      />
                    </div>
                    <span className="mt-1 block text-[10px] text-slate-500">
                      Code expires in 10 minutes. Check your spam folder if unreceived.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loader || otp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-cyan disabled:opacity-50 sm:py-3 sm:text-sm"
                  >
                    {loader ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      <>
                        <span>Verify & Activate Account</span>
                        <FiCheckCircle size={14} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white hover:underline"
                  >
                    &larr; Re-enter registration details
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage