import { forwardRef, SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { ChevronDown } from 'lucide-react'

const selectVariants = cva(
  'w-full px-4 pr-10 border rounded-[7px] appearance-none transition-all duration-200 text-[#262626] bg-white focus:outline-none focus:ring-0',
  {
    variants: {
      variant: {
        default: 'border-[#ECECEC] hover:border-[#B3B3B3] focus:border-[#262626]',
        error: 'border-error hover:border-error focus:border-error',
      },
      size: {
        sm: 'h-[40px] text-sm',
        md: 'h-[47px] text-base',
        lg: 'h-[52px] text-lg',
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
      ...props
    },
    ref
  ) => {
    const selectId = props.id || props.name
    const hasError = Boolean(error)
    const computedVariant = hasError ? 'error' : 'default'

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
            aria-invalid={hasError}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={cn(
              selectVariants({
                variant: computedVariant,
                size,
              }),
              disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
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
            id={error ? `${selectId}-error` : undefined}
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
