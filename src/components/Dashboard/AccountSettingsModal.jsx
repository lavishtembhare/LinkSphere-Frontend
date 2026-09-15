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
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { useStoreContext } from '../../contextApi/contextApi'

const AccountSettingsModal = ({ open, setOpen, currentUsername }) => {
  const [activeTab, setActiveTab] = useState('username') // 'username' | 'email' | 'delete'
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setAuthTokens, clearAuth } = useStoreContext()

  // 1. Username form state
  const [newUsername, setNewUsername] = useState('')

  // 2. Email form state (EmailChangeRequest: { newEmail, password })
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')

  // 3. Delete account form state (DeleteAccountRequest: { password })
  const [deletePassword, setDeletePassword] = useState('')

  const handleClose = () => {
    setNewUsername('')
    setNewEmail('')
    setEmailPassword('')
    setDeletePassword('')
    setShowPassword(false)
    setLoading(false)
    setOpen(false)
  }

  // 1. PATCH /api/users/username -> { "newUsername": "..." }
  const handleUpdateUsername = async (e) => {
    e.preventDefault()
    if (!newUsername.trim()) return

    setLoading(true)
    try {
      const { data } = await api.patch('/api/users/username', {
        newUsername: newUsername.trim(),
      })

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

  // 2. PATCH /api/users/email -> { "newEmail": "...", "password": "..." }
  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    if (!newEmail.trim() || !emailPassword) return

    setLoading(true)
    try {
      const { data } = await api.patch('/api/users/email', {
        newEmail: newEmail.trim(),
        password: emailPassword,
      })
      toast.success(data?.message || 'Email address updated successfully.')
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update email.')
    } finally {
      setLoading(false)
    }
  }

  // 3. POST /api/users/delete-account -> { "password": "..." }
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    if (!deletePassword) return

    setLoading(true)
    try {
      const { data } = await api.post('/api/users/delete-account', {
        password: deletePassword,
      })
      toast.success(
        data?.message || 'Your account and all associated data have been permanently deleted.'
      )
      clearAuth()
      queryClient.clear()
      handleClose()
      navigate('/register')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Incorrect password.')
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
              className="absolute right-4 top-4 rounded-lg border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <RxCross2 size={16} />
            </button>
          </Tooltip>

          {/* Modal Header */}
          <div className="mb-4 pr-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
              Security &amp; Profile
            </span>
            <h2 className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
              Account Settings
            </h2>
            <p className="text-xs text-slate-400">
              Managing credentials for user{' '}
              <span className="font-semibold text-accent-cyan">@{currentUsername}</span>
            </p>
          </div>

          {/* Tabs */}
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
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
                  Saves the new username and rotates your active session credentials.
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

          {/* TAB 2: EMAIL UPDATE */}
          {activeTab === 'email' && (
            <form onSubmit={handleUpdateEmail} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
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
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                    Account Password
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
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Enter current password to confirm"
                    className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newEmail.trim() || !emailPassword}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                ) : (
                  <>
                    <FiCheckCircle size={14} />
                    <span>Update Email Address</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: DELETE ACCOUNT */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <FiAlertTriangle className="mt-0.5 shrink-0 text-red-400" size={15} />
                <p className="leading-relaxed">
                  Permanently deletes your user account, URLs, click telemetry events, and active sessions. This action cannot be reversed.
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                    Confirm Account Password
                  </label>
                  <div className="relative mt-1">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type="password"
                      required
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter password to authorize deletion"
                      className="w-full rounded-xl border border-edge-subtle bg-ink-950 py-2.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !deletePassword}
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
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AccountSettingsModal