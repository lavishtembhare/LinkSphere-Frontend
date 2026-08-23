import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import { FiZap, FiLink, FiCopy, FiCheck, FiExternalLink, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/api'
import TextField from '../TextField'
import { useStoreContext } from '../../contextApi/ContextApi'

const CreateNewShorten = ({ setOpen, refetch }) => {
  const { token } = useStoreContext()
  const [loading, setLoading] = useState(false)
  const [createdData, setCreatedData] = useState(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: '',
    },
    mode: 'onTouched',
  })

  // Format full shortened link using subdomain or origin
  const getFullShortUrl = (shortSlug) => {
    const subdomain = import.meta.env.VITE_REACT_SUBDOMAIN || window.location.origin
    const baseUrl = subdomain.endsWith('/') ? subdomain.slice(0, -1) : subdomain
    return `${baseUrl}/${shortSlug}`
  }

  // Auto-copy helper
  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Short URL Copied to Clipboard!', {
        position: 'bottom-center',
        duration: 2500,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const createShortUrlHandler = async (formData) => {
    setLoading(true)
    try {
      const { data: res } = await api.post(
        '/api/urls/shorten',
        { originalUrl: formData.originalUrl.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      )

      const fullUrl = getFullShortUrl(res.shortUrl)

      setCreatedData({
        originalUrl: formData.originalUrl.trim(),
        shortUrl: res.shortUrl,
        fullShortUrl: fullUrl,
      })

      await copyToClipboard(fullUrl)

      if (refetch) {
        await refetch()
      }
      reset()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Create ShortURL Failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetForAnother = () => {
    setCreatedData(null)
    setCopied(false)
    reset()
  }

  const handleClose = () => {
    handleResetForAnother()
    setOpen(false)
  }

  return (
    <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-edge-subtle bg-surface-card/95 p-4 shadow-2xl backdrop-blur-2xl sm:rounded-3xl sm:p-6 lg:p-7">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-blue/20 blur-[70px] sm:h-48 sm:w-48 sm:blur-[80px]" />

      {/* Close button */}
      <Tooltip title="Close" arrow>
        <button
          type="button"
          disabled={loading}
          onClick={handleClose}
          className="absolute right-3.5 top-3.5 rounded-lg border border-edge-subtle bg-ink-950/60 p-1 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white sm:right-5 sm:top-5 sm:rounded-xl sm:p-1.5"
        >
          <RxCross2 className="text-lg sm:text-xl" />
        </button>
      </Tooltip>

      {!createdData ? (
        /* STEP 1: Link Generation Form */
        <form onSubmit={handleSubmit(createShortUrlHandler)} className="space-y-3 sm:space-y-4">
          <div className="pr-6">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-cyan sm:text-[11px]">
              Link Generator
            </span>
            <h1 className="mt-0.5 font-display text-lg font-bold text-white sm:text-xl">
              Create New Short URL
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Enter a destination link to generate a vanity short URL.
            </p>
          </div>

          <hr className="border-edge-subtle/60" />

          <div className="pt-0.5">
            <TextField
              label="Enter Target URL"
              required
              id="originalUrl"
              placeholder="https://example.com/very-long-target"
              type="url"
              message="Valid URL is required"
              register={register}
              errors={errors}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 sm:gap-3 sm:pt-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl border border-edge-subtle bg-ink-950 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50 sm:px-4 sm:py-2.5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 sm:gap-2 sm:px-5 sm:py-2.5"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent sm:h-4 sm:w-4" />
              ) : (
                <>
                  <span>Compress & Copy</span>
                  <FiZap size={13} />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: Success & Generated Link Card */
        <div className="space-y-4 sm:space-y-5">
          <div className="pr-6">
            <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 sm:text-[11px]">
              <FiCheck size={12} /> Link Generated & Copied!
            </div>
            <h1 className="mt-1.5 font-display text-lg font-bold text-white sm:text-xl">
              Short Link Ready
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Your vanity link is active and logging telemetry.
            </p>
          </div>

          <hr className="border-edge-subtle/60" />

          <div className="space-y-2.5 pt-0.5 sm:space-y-3">
            {/* Shortened URL Box */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-accent-cyan sm:text-[10px]">
                Short URL (Copied)
              </span>
              <div className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-accent-cyan/30 bg-ink-950 p-2.5 shadow-inner sm:p-3">
                <div className="flex items-center gap-1.5 overflow-hidden font-mono text-xs font-semibold text-accent-cyan sm:text-sm">
                  <FiLink className="shrink-0 text-accent-blue" size={14} />
                  <span className="truncate">{createdData.fullShortUrl}</span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(createdData.fullShortUrl)}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
                    copied
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'bg-accent-blue text-ink hover:bg-accent-cyan'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={12} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={12} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Original Destination URL */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                Destination Target
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-edge-subtle bg-ink-950/60 p-2.5 text-xs text-slate-300 sm:p-3">
                <FiExternalLink className="shrink-0 text-slate-500" size={13} />
                <span className="truncate">{createdData.originalUrl}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 sm:gap-3 sm:pt-3">
            <button
              type="button"
              onClick={handleResetForAnother}
              className="flex items-center gap-1 rounded-xl border border-edge-subtle bg-ink-950 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:text-white sm:px-4 sm:py-2.5"
            >
              <FiPlus size={13} />
              <span>Create Another</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.02] sm:px-5 sm:py-2.5"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateNewShorten