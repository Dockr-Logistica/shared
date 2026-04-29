'use client'

import { forwardRef, useId } from 'react'
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
      id,
      name,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const textAreaId = id || name || `textarea-${generatedId}`
    const messageId = error || helperText ? `${textAreaId}-message` : undefined
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined

    return (
      <div className={cn('w-full', additionalContainerClasses)}>
        {label && (
          <label htmlFor={textAreaId} className="block text-sm font-medium text-text mb-1.5">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          name={name}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full px-4 py-3',
            'border rounded-input',
            'text-sm text-text',
            'placeholder:text-text-placeholder',
            'transition-all duration-200 ease-in-out',
            'resize-none',
            error
              ? 'border-error focus:border-error'
              : 'border-input-border-default hover:border-input-border-hover focus:border-input-border-focus',
            disabled && 'opacity-50 cursor-not-allowed bg-input-background-disabled',
            additionalTextAreaClasses,
            className
          )}
          disabled={disabled}
          {...props}
        />
        {error && <p id={messageId} className="text-xs text-error mt-1" role="alert">{error}</p>}
        {helperText && !error && (
          <p id={messageId} className="text-xs text-text-muted mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
