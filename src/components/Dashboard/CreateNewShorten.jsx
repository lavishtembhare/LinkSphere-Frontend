import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { Tooltip } from '@mui/material'
import { RxCross2 } from 'react-icons/rx'
import { FiZap, FiLink } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/api'
import TextField from '../TextField'
import { useStoreContext } from '../../contextApi/ContextApi'

const CreateNewShorten = ({ setOpen, refetch }) => {
  const { token } = useStoreContext()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

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

  const createShortUrlHandler = async (data) => {
    setLoading(true)
    try {
      const response = await api.post('/api/urls/shorten', data)
      const res = response.data

      // Build target shortened URL using subdomain or fallback origin
      const subdomain = import.meta.env.VITE_REACT_SUBDOMAIN || window.location.origin
      const baseUrl = subdomain.endsWith('/') ? subdomain.slice(0, -1) : subdomain
      const shortenUrl = `${baseUrl}/${res.shortUrl}`

      // Automatic clipboard copy upon successful compression
      await navigator.clipboard.writeText(shortenUrl)
      toast.success('Short URL copied to clipboard!', {
        position: 'bottom-center',
        duration: 3500,
      })

      // Invalidate cache and trigger refetch
      queryClient.invalidateQueries({ queryKey: ['url-totalClicks'] })
      queryClient.invalidateQueries({ queryKey: ['user-click-summary'] })
      if (refetch) {
        await refetch()
      }

      reset()
      setOpen(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create short URL')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-edge-subtle bg-surface-card/95 p-6 shadow-2xl shadow-accent-blue/10 backdrop-blur-2xl sm:p-8">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-blue/20 blur-[80px]" />

      {/* Header and Close Icon */}
      <div className="relative mb-6 flex items-start justify-between">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Link Engine
          </span>
          <h1 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
            Create New Short URL
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Compress your destination link into a high-speed vanity slug.
          </p>
        </div>

        {!loading && (
          <Tooltip title="Close" arrow>
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-edge-subtle bg-ink-950/60 p-1.5 text-slate-400 transition-colors hover:border-accent-blue/40 hover:text-white"
            >
              <RxCross2 className="text-xl" />
            </button>
          </Tooltip>
        )}
      </div>

      <hr className="mb-6 border-edge-subtle" />

      {/* Shorten Form */}
      <form onSubmit={handleSubmit(createShortUrlHandler)} className="space-y-5">
        <div>
          <TextField
            label="Destination Target URL"
            required
            id="originalUrl"
            placeholder="https://example.com/very-long-path"
            type="url"
            message="Destination URL is required"
            validation={{
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Enter a valid web URL (e.g. https://domain.com)',
              },
            }}
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => setOpen(false)}
            className="rounded-xl border border-edge-subtle bg-ink-950 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-6 py-2.5 text-xs font-bold text-ink shadow-glow-blue transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-cyan disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
            ) : (
              <>
                <span>Compress URL</span>
                <FiZap size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateNewShorten