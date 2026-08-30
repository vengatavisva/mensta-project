import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs))
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 bg-white border border-border rounded-xl text-sm text-ink placeholder-ink-muted',
              'transition-all duration-150 outline-none',
              'focus:border-brand-500 focus:ring-3 focus:ring-brand-100',
              'disabled:opacity-50 disabled:bg-surface-100 disabled:cursor-not-allowed',
              error && 'border-brand-500 focus:ring-brand-100',
              leftIcon ? 'pl-10' : 'pl-4',
              rightElement ? 'pr-12' : 'pr-4',
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-brand-600 font-medium">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
