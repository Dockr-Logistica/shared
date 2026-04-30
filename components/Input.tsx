import { forwardRef, InputHTMLAttributes, ReactNode, ChangeEvent, useCallback, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { fieldBaseClasses, fieldStateClasses } from './fieldStyles'

type MaskType = 'cep' | 'phone' | 'cpf' | 'cnpj' | 'date'

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
    case 'date':
      return digits.slice(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
    default:
      return value
  }
}

const inputVariants = cva(
  cn(
    'w-full px-4 text-text placeholder:text-text-placeholder',
    fieldBaseClasses,
  ),
  {
    variants: {
      variant: {
        default: fieldStateClasses(),
        error: fieldStateClasses({ error: true }),
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
  suffix?: string
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
      suffix,
      variant,
      size,
      className,
      disabled,
      mask,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = props.id || props.name || `input-${generatedId}`
    const hasError = Boolean(error)
    const computedVariant = hasError ? 'error' : variant
    const messageId = error || helperText ? `${inputId}-message` : undefined
    const describedBy = [ariaDescribedBy, messageId].filter(Boolean).join(' ') || undefined

    const inputClasses = cn(
      inputVariants({
        variant: computedVariant,
        size,
        hasIconLeft: Boolean(icon && iconPosition === 'left'),
        hasIconRight: Boolean(suffix || (icon && iconPosition === 'right')),
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
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={inputClasses}
            autoComplete="off"
            onChange={handleChange}
            {...props}
          />

          {suffix ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              {suffix}
            </span>
          ) : (
            icon && iconPosition === 'right' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {icon}
              </div>
            )
          )}
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

Input.displayName = 'Input'

export { Input, inputVariants }
