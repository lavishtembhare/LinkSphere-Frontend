import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '@mui/material/Modal'
import { Tooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import {
  FiUser,
  FiMail,
  FiTrash2,
  FiKey,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { useStoreContext } from '../../contextApi/contextApi'

const AccountSettingsModal = ({ open, setOpen, currentUsername }) => {
  const [activeTab, setActiveTab] = useState('username') // 'username' | 'email' | 'delete'
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAuthTokens, clearAuth } = useStoreContext()

  // 1. Username state
  const [newUsername, setNewUsername] = useState('')

  // 2. Email change state
  const [newEmail, setNewEmail] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailStep, setEmailStep] = useState(1) // 1: Request, 2: Confirm

  // 3. Delete account state
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteOtp, setDeleteOtp] = useState('')
  const [deleteStep, setDeleteStep] = useState(1) // 1: Password Auth, 2: OTP Confirmation

  const handleClose = () => {
    setNewUsername('')
    setNewEmail('')
    setEmailOtp('')
    setEmailStep(1)
    setDeletePassword('')
    setDeleteOtp('')
    setDeleteStep(1)
    setLoading(false)
    setOpen(false)
  }

  // PATCH /api/users/username -> { "newUsername": "..." }
  const handleUpdateUsername = async (e) => {
    e.preventDefault()
    if (!newUsername.trim()) return

    setLoading(true)
    try {
      const { data } = await api.patch('/api/users/username', {
        newUsername: newUsername.trim(),
      })

      // Update tokens since the username is baked into the JWT
      if (data?.token) {
        setAuthTokens({
          token: data.token,
          refreshToken: data.refreshToken,
        })
      }

      toast.success('Username updated successfully!')
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update username.')
    } finally {
      setLoading(false)
    }
  }

  // POST /api/users/email/request-change -> { "newEmail": "..." }
  const handleRequestEmailChange = async (e) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setLoading(true)
    try {
      const { data } = await api.post('/api/users/email/request-change', {
        newEmail: newEmail.trim(),
      })
      toast.success(data?.message || 'Verification code sent to your new email address.')
      setEmailStep(2)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to request email change.')
    } finally {
      setLoading(false)
    }
  }

  // POST /api/users/email/confirm-change -> { "otp": "..." }
  const handleConfirmEmailChange = async (e) => {
    e.preventDefault()
    if (emailOtp.trim().length !== 6) {
      toast.error('Enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/users/email/confirm-change', {
        otp: emailOtp.trim(),
      })
      toast.success(data?.message || 'Email address updated successfully.')
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Incorrect or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  // POST /api/users/delete-account/request -> { "password": "..." }
  const handleRequestDeletion = async (e) => {
    e.preventDefault()
    if (!deletePassword) return

    setLoading(true)
    try {
      const { data } = await api.post('/api/users/delete-account/request', {
        password: deletePassword,
      })
      toast.success(data?.message || 'Verification code emailed.')
      setDeleteStep(2)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Incorrect password.')
    } finally {
      setLoading(false)
    }
  }

  // POST /api/users/delete-account/confirm -> { "otp": "..." }
  const handleConfirmDeletion = async (e) => {
    e.preventDefault()
    if (deleteOtp.trim().length !== 6) {
      toast.error('Enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      const { data } = await api.post('/api/users/delete-account/confirm', {
        otp: deleteOtp.trim(),
      })
      toast.success(data?.message || 'Account permanently deleted.')
      clearAuth()
      queryClient.clear()
      handleClose()
      navigate('/register')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to confirm account deletion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="account-settings-modal"
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
        <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-edge-subtle bg-surface-card/95 p-5 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent-blue/20 blur-[80px]" />

          {/* Close Button */}
          <Tooltip title="Close" arrow>
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 hover:border-accent-blue/40 hover:text-white"
            >
              <RxCross2 size={16} />
            </button>
          </Tooltip>

          {/* Modal Header */}
          <div className="mb-4 pr-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
              Security & Profile
            </span>
            <h2 className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
              Account Settings
            </h2>
            <p className="text-xs text-slate-400">
              Managing credentials for user{' '}
              <span className="font-semibold text-accent-cyan">@{currentUsername}</span>
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-5 flex rounded-xl border border-edge-subtle bg-ink-950/80 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('username')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-semibold transition-all ${
                activeTab === 'username'
                  ? 'bg-accent-blue/20 text-accent-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiUser size={13} />
              <span>Username</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-accent-blue/20 text-accent-cyan shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FiMail size={13} />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delete')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 font-semibold transition-all ${
                activeTab === 'delete'
                  ? 'bg-red-500/20 text-red-400 shadow-sm'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <FiTrash2 size={13} />
              <span>Delete</span>
            </button>
          </div>

          {/* TAB 1: USERNAME UPDATE */}
          {activeTab === 'username' && (
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  New Username
                </label>
                <div className="relative mt-1">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
                <span className="mt-1 block text-[10px] text-slate-500">
                  Updates your username and regenerates an active JWT session.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !newUsername.trim() || newUsername.trim() === currentUsername}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <FiCheckCircle size={14} />
                    <span>Save Username</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: EMAIL CHANGE */}
          {activeTab === 'email' && (
            <div>
              {emailStep === 1 ? (
                <form onSubmit={handleRequestEmailChange} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                      New Email Address
                    </label>
                    <div className="relative mt-1">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="newaddress@example.com"
                        className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                      />
                    </div>
                    <span className="mt-1 block text-[10px] text-slate-500">
                      An OTP code will be sent to the new address to verify ownership.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newEmail.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      <>
                        <span>Send Confirmation Code</span>
                        <FiArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmEmailChange} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                      Verification Code for {newEmail}
                    </label>
                    <div className="relative mt-1">
                      <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 font-mono text-center text-base tracking-[0.3em] text-accent-cyan focus:border-accent-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || emailOtp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    ) : (
                      <>
                        <FiCheckCircle size={14} />
                        <span>Confirm &amp; Update Email</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailStep(1)}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-white hover:underline"
                  >
                    &larr; Re-enter email address
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT DELETION */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <FiAlertTriangle className="mt-0.5 shrink-0 text-red-400" size={15} />
                <p className="leading-relaxed">
                  Permanently deletes your account, shortened URLs, click telemetry, and active tokens. This cannot be undone.
                </p>
              </div>

              {deleteStep === 1 ? (
                <form onSubmit={handleRequestDeletion} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                      Confirm Account Password
                    </label>
                    <div className="relative mt-1">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="password"
                        required
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !deletePassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/20 py-2.5 text-xs font-bold text-red-300 transition-all hover:bg-red-500/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <>
                        <span>Send Deletion Confirmation Code</span>
                        <FiArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmDeletion} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                      Enter 6-Digit Code Sent to Your Email
                    </label>
                    <div className="relative mt-1">
                      <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={deleteOtp}
                        onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full rounded-xl border border-red-500/40 bg-ink-950 py-2.5 pl-9 pr-3 font-mono text-center text-base tracking-[0.3em] text-red-400 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || deleteOtp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-red-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <FiTrash2 size={14} />
                        <span>Permanently Delete Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AccountSettingsModal