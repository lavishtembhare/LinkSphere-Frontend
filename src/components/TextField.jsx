import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const TextField = ({
  label,
  id,
  type = 'text',
  errors,
  register,
  required = false,
  message = 'This field is required',
  className = '',
  min,
  validation = {},
  placeholder,
  autoComplete = 'on',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const error = errors?.[id]

  const validationRules = {
    required: required ? message : false,
    ...(min && {
      minLength: {
        value: min,
        message: `Minimum ${min} characters required`,
      },
    }),
    ...validation,
  }

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs"
        >
          {label} {required && <span className="text-accent-cyan">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          {...(register ? register(id, validationRules) : {})}
          className={`w-full rounded-xl border bg-ink-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none sm:px-4 sm:py-2.5 sm:text-sm ${
            isPasswordField ? 'pr-10 sm:pr-11' : ''
          } ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
              : 'border-edge-subtle hover:border-accent-blue/40 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 focus:shadow-glow-blue'
          }`}
          {...rest}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-accent-cyan focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <span className="font-mono text-[10px] text-red-400 sm:text-[11px]">
          {error.message}
        </span>
      )}
    </div>
  )
}

export default TextField