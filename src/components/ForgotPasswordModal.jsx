import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import { Tooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import {
  FiUser,
  FiMail,
  FiLock,
  FiCheckCircle,
  FiShield,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../api/api'

const ForgotPasswordModal = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleClose = () => {
    setUsername('')
    setEmail('')
    setNewPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setLoading(false)
    setOpen(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!username.trim() || !email.trim()) {
      toast.error('Username and email are required')
      return
    }

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
      const { data } = await api.post('/api/auth/public/forgot-password', {
        username: username.trim(),
        email: email.trim(),
        newPassword,
      })

      toast.success(
        data?.message || 'Password reset successfully! Please sign in with your new password.'
      )
      handleClose()
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          (typeof error?.response?.data === 'string' ? error.response.data : null) ||
          'Username and email do not match our records.'
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
              <span>Identity Verification</span>
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
              Reset Your Password
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Provide your username and registered email on file to set a new password.
            </p>
          </div>

          <hr className="mb-4 border-edge-subtle/60" />

          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                Username <span className="text-accent-cyan">*</span>
              </label>
              <div className="relative mt-1">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. test4"
                  className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                Registered Email <span className="text-accent-cyan">*</span>
              </label>
              <div className="relative mt-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  New Password <span className="text-accent-cyan">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-accent-cyan"
                >
                  {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                Confirm New Password <span className="text-accent-cyan">*</span>
              </label>
              <div className="relative mt-1">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
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
                  <FiCheckCircle size={14} />
                  <span>Update Password &amp; Finish</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default ForgotPasswordModal