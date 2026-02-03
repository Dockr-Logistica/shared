import { forwardRef, InputHTMLAttributes, ReactNode, ChangeEvent, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

type MaskType = 'cep' | 'phone' | 'cpf' | 'cnpj'

const applyMask = (value: string, mask: MaskType): string => {
  const digits = value.replace(/\D/g, '')

  switch (mask) {
    case 'cep':
      return digits.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
    case 'phone':
      return digits.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3')
    case 'cpf':
      return digits.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3').replace(/(\d{3})(\d{3})/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2')
    case 'cnpj':
      return digits.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    default:
      return value
  }
}

const inputVariants = cva(
  'w-full px-4 border rounded-input transition-all duration-200 text-text placeholder:text-text-placeholder focus:outline-none focus:ring-0',
  {
    variants: {
      variant: {
        default: 'border-input-border-default hover:border-input-border-hover focus:border-input-border-focus',
        error: 'border-error focus:border-error hover:border-error',
      },
      size: {
        sm: 'h-input-sm text-sm',
        md: 'h-input-md text-base',
        lg: 'h-input-lg text-lg',
      },
      hasIconLeft: {
        true: 'pl-10',
        false: '',
      },
      hasIconRight: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasIconLeft: false,
      hasIconRight: false,
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'hasIconLeft' | 'hasIconRight'> {
  label?: string
  labelClassName?: string
  helperText?: string
  error?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  mask?: MaskType
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelClassName,
      helperText,
      error,
      icon,
      iconPosition = 'left',
      variant,
      size,
      className,
      disabled,
      mask,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = props.id || props.name
    const hasError = Boolean(error)
    const computedVariant = hasError ? 'error' : variant

    const inputClasses = cn(
      inputVariants({
        variant: computedVariant,
        size,
        hasIconLeft: Boolean(icon && iconPosition === 'left'),
        hasIconRight: Boolean(icon && iconPosition === 'right'),
      }),
      disabled && 'bg-input-background-disabled cursor-not-allowed',
      className
    )

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (mask) {
        const maskedValue = applyMask(e.target.value, mask)
        e.target.value = maskedValue
      }
      onChange?.(e)
    }, [mask, onChange])

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn('block text-sm font-medium text-text mb-1.5', labelClassName)}
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClasses}
            onChange={handleChange}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn('text-sm mt-1.5', {
              'text-error': error,
              'text-text-muted': !error && helperText,
            })}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
