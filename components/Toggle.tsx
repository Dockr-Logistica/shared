'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const toggleVariants = cva(
  'relative inline-flex items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'data-[checked=true]:bg-primary data-[checked=false]:bg-gray-400',
        success: 'data-[checked=true]:bg-success data-[checked=false]:bg-gray-400',
        error: 'data-[checked=true]:bg-error data-[checked=false]:bg-gray-400',
      },
      size: {
        sm: 'h-5 w-9',
        md: 'h-[23px] w-[43px]',
        lg: 'h-[26px] w-[50px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const toggleThumbVariants = cva(
  'inline-block transform rounded-full bg-white transition-all duration-200 shadow-md',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[checked=true]:translate-x-[18px] data-[checked=false]:translate-x-0.5',
        md: 'h-[19px] w-[19px] data-[checked=true]:translate-x-[22px] data-[checked=false]:translate-x-0.5',
        lg: 'h-[22px] w-[22px] data-[checked=true]:translate-x-[26px] data-[checked=false]:translate-x-0.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof toggleVariants> {
  label?: string
  description?: string
  labelPosition?: 'left' | 'right'
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      labelPosition = 'right',
      variant,
      size,
      className,
      disabled,
      checked,
      id,
      ...props
    },
    ref
  ) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`
    const isChecked = Boolean(checked)

    const toggleButton = (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-labelledby={label ? `${toggleId}-label` : undefined}
        aria-describedby={description ? `${toggleId}-description` : undefined}
        disabled={disabled}
        data-checked={isChecked}
        onClick={() => {
          if (!disabled && props.onChange) {
            const event = {
              target: { checked: !isChecked },
            } as React.ChangeEvent<HTMLInputElement>
            props.onChange(event)
          }
        }}
        className={cn(
          toggleVariants({ variant, size }),
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:scale-105 active:scale-100'
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          data-checked={isChecked}
          className={toggleThumbVariants({ size })}
        />
      </button>
    )

    const labelContent = (label || description) && (
      <div className="flex-1">
        {label && (
          <label
            id={`${toggleId}-label`}
            htmlFor={toggleId}
            className={cn(
              'block text-sm font-medium text-text',
              !disabled && 'cursor-pointer'
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p
            id={`${toggleId}-description`}
            className="text-sm text-text-muted mt-1"
          >
            {description}
          </p>
        )}
      </div>
    )

    return (
      <div className={cn('flex items-start gap-3', className)}>
        {labelPosition === 'left' && labelContent}
        {toggleButton}
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        {labelPosition === 'right' && labelContent}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle, toggleVariants, toggleThumbVariants }
