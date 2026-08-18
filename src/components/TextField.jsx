import React from 'react'

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
  ...rest
}) => {
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
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-accent-cyan">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...(register ? register(id, validationRules) : {})}
          className={`w-full rounded-xl border bg-ink-950/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 backdrop-blur-md transition-all duration-200 focus:outline-none ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
              : 'border-edge-subtle hover:border-accent-blue/40 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 focus:shadow-glow-blue'
          }`}
          {...rest}
        />
      </div>

      {error && (
        <span className="font-mono text-[11px] text-red-400">
          {error.message}
        </span>
      )}
    </div>
  )
}

export default TextField