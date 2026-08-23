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

      // Store created link to display success view
      setCreatedData({
        originalUrl: formData.originalUrl.trim(),
        shortUrl: res.shortUrl,
        fullShortUrl: fullUrl,
      })

      // Auto-copy short link immediately
      await copyToClipboard(fullUrl)

      // Trigger background queries refetch
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
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/95 p-6 shadow-2xl shadow-accent-blue/10 sm:p-8 backdrop-blur-2xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-blue/20 blur-[80px]" />

      {/* Close button */}
      <Tooltip title="Close" arrow>
        <button
          type="button"
          disabled={loading}
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-xl border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
        >
          <RxCross2 className="text-xl" />
        </button>
      </Tooltip>

      {!createdData ? (
        /* STEP 1: Link Generation Form */
        <form onSubmit={handleSubmit(createShortUrlHandler)} className="space-y-4">
          <div>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
              Link Generator
            </span>
            <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
              Create New Short URL
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter a destination link to generate and auto-copy a vanity short URL.
            </p>
          </div>

          <hr className="border-edge-subtle/60" />

          <div className="pt-1">
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

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleClose}
              className="rounded-xl border border-edge-subtle bg-ink-950 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              ) : (
                <>
                  <span>Compress & Copy</span>
                  <FiZap size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* STEP 2: Success & Generated Link Card */
        <div className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-400">
              <FiCheck size={13} /> Link Generated & Copied!
            </div>
            <h1 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
              Short Link Ready
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Your shortened vanity link is active and logging telemetry.
            </p>
          </div>

          <hr className="border-edge-subtle/60" />

          <div className="space-y-3 pt-1">
            {/* Shortened URL Box */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                Short URL (Copied)
              </span>
              <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-accent-cyan/30 bg-ink-950 p-3 shadow-inner-light">
                <div className="flex items-center gap-2 overflow-hidden font-mono text-xs font-semibold text-accent-cyan sm:text-sm">
                  <FiLink className="shrink-0 text-accent-blue" size={15} />
                  <span className="truncate">{createdData.fullShortUrl}</span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(createdData.fullShortUrl)}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    copied
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'bg-accent-blue text-ink hover:bg-accent-cyan'
                  }`}
                >
                  {copied ? (
                    <>
                      <FiCheck size={13} /> Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={13} /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Original Destination URL */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Destination Target
              </span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-edge-subtle bg-ink-950/60 p-3 text-xs text-slate-300">
                <FiExternalLink className="shrink-0 text-slate-500" size={14} />
                <span className="truncate">{createdData.originalUrl}</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={handleResetForAnother}
              className="flex items-center gap-1.5 rounded-xl border border-edge-subtle bg-ink-950 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <FiPlus size={14} />
              <span>Create Another</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all hover:scale-[1.02]"
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