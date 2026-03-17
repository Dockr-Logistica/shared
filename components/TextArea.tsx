'use client'

import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  additionalContainerClasses?: string
  additionalTextAreaClasses?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      additionalContainerClasses = '',
      additionalTextAreaClasses = '',
      className,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', additionalContainerClasses)}>
        {label && (
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3',
            'border rounded-[7px]',
            'text-sm text-gray-900',
            'placeholder:text-gray-400',
            'transition-all duration-200 ease-in-out',
            'resize-none',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#ECECEC] hover:border-[#B3B3B3] focus:border-[#262626]',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            additionalTextAreaClasses,
            className
          )}
          disabled={disabled}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
