import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import { Tooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import {
  FiMail,
  FiKey,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'

const ForgotPasswordModal = ({ open, setOpen }) => {
  const [step, setStep] = useState(1) // 1: Identifier, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleClose = () => {
    setStep(1)
    setUsernameOrEmail('')
    setOtp('')
    setResetToken('')
    setNewPassword('')
    setConfirmPassword('')
    setLoading(false)
    setOpen(false)
  }

  // Step 1: Request OTP code
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!usernameOrEmail.trim()) {
      toast.error('Please enter your username or email')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/public/forgot-password', {
        usernameOrEmail: usernameOrEmail.trim(),
      })
      toast.success(data?.message || 'Verification code emailed.')
      setStep(2)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Unable to process reset request.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP code and capture reset token
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/public/forgot-password/verify-otp', {
        usernameOrEmail: usernameOrEmail.trim(),
        username: usernameOrEmail.trim(),
        otp: otp.trim(),
      })

      if (!data?.resetToken) {
        throw new Error('Reset token missing from response.')
      }

      setResetToken(data.resetToken)
      toast.success('Code verified successfully.')
      setStep(3)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Incorrect or expired verification code.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/public/reset-password', {
        resetToken,
        newPassword,
      })
      toast.success(data?.message || 'Password reset successfully. Please log in.')
      handleClose()
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to update password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="forgot-password-modal"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <div className="flex h-full w-full items-center justify-center p-3 outline-none sm:p-4">
        <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-edge-subtle bg-surface-card/95 p-5 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-blue/20 blur-[70px]" />

          {/* Close button */}
          <Tooltip title="Close" arrow>
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <RxCross2 size={16} />
            </button>
          </Tooltip>

          {/* Header */}
          <div className="mb-4 pr-6">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
              <FiShield size={12} />
              <span>Step {step} of 3 • Security Recovery</span>
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify Code'}
              {step === 3 && 'New Credentials'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {step === 1 && 'Enter your account username or email to receive a 6-digit OTP.'}
              {step === 2 && `Enter the 6-digit code sent for ${usernameOrEmail}.`}
              {step === 3 && 'Choose a new password with at least 6 characters.'}
            </p>
          </div>

          <hr className="mb-4 border-edge-subtle/60" />

          {/* STEP 1: Enter Username or Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  Username or Email
                </label>
                <div className="relative mt-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="name@company.com or username"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <FiArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify 6-digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  6-Digit Security Code
                </label>
                <div className="relative mt-1">
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 font-mono text-center text-base tracking-[0.3em] text-accent-cyan placeholder-slate-600 focus:border-accent-blue focus:outline-none"
                  />
                </div>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Code expires in 10 minutes.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <span>Verify Code</span>
                    <FiArrowRight size={13} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white hover:underline"
                >
                  &larr; Change account
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-accent-cyan hover:underline"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  New Password
                </label>
                <div className="relative mt-1">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <FiCheckCircle size={13} />
                    <span>Update Password &amp; Finish</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ForgotPasswordModal