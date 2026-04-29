import { forwardRef, SelectHTMLAttributes, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { ChevronDown } from 'lucide-react'

const selectVariants = cva(
  'w-full px-4 pr-10 border rounded-input appearance-none transition-all duration-200 text-text bg-white focus:outline-none focus:ring-0',
  {
    variants: {
      variant: {
        default: 'border-input-border-default hover:border-input-border-hover focus:border-input-border-focus',
        error: 'border-error hover:border-error focus:border-error',
      },
      size: {
        sm: 'h-input-sm text-sm',
        md: 'h-input-md text-base',
        lg: 'h-input-lg text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof selectVariants>, 'variant'> {
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      placeholder = 'Selecione...',
      error,
      helperText,
      size,
      className,
      disabled,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = props.id || props.name || `select-${generatedId}`
    const hasError = Boolean(error)
    const computedVariant = hasError ? 'error' : 'default'
    const messageId = error || helperText ? `${selectId}-message` : undefined
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              selectVariants({
                variant: computedVariant,
                size,
              }),
              disabled && 'bg-input-background-disabled cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {(error || helperText) && (
          <p
            id={messageId}
            className={cn('text-sm mt-1.5', {
              'text-error': error,
              'text-text-muted': !error && helperText,
            })}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select, selectVariants }
export type { SelectOption as SelectOptionType }
