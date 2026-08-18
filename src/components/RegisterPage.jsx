import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiLayers, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
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

    try {
      // Connect to your backend authentication endpoint here:
      // await axios.post('/api/auth/register', data)
      console.log('Registration Payload:', data)
      await new Promise((resolve) => setTimeout(resolve, 900))

      reset()
      navigate('/login')
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed. Please check your credentials.')
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-ink bg-grid-pattern px-5 py-14 sm:px-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-accent-blue/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent-cyan/10 blur-[110px]" />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/85 shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-5">
          
          {/* Left Branding Panel */}
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
                Engineered for speed, built for scale.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Create clean links, monitor live engagement telemetry, and safeguard access from a single command center.
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
              Free plan available • No credit card required
            </div>
          </div>

          {/* Form Panel */}
          <div className="p-8 sm:p-12 lg:col-span-3">
            <div className="mb-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
                Authentication
              </span>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                Create your account
              </h1>
              <p className="mt-1 text-xs text-slate-400">
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

            <form onSubmit={handleSubmit(registerHandler)} className="space-y-4">
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

              <TextField
                label="Password"
                id="password"
                type="password"
                required
                min={6}
                message="Password is required"
                placeholder="Create a strong password"
                register={register}
                errors={errors}
              />

              <TextField
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                required
                message="Please confirm your password"
                placeholder="Re-enter password"
                validation={{
                  validate: (value) =>
                    value === passwordValue || 'Passwords do not match',
                }}
                register={register}
                errors={errors}
              />

              <button
                type="submit"
                disabled={loader}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-3 text-xs font-bold text-ink-950 shadow-glow-blue transition-all duration-300 hover:scale-[1.01] hover:shadow-glow-cyan disabled:opacity-50"
              >
                {loader ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950 border-t-transparent" />
                ) : (
                  <>
                    <span>Register Account</span>
                    <FiArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] text-slate-500">
              By registering, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage