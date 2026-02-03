import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all cursor-pointer disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-text hover:bg-primary-hover hover:scale-105 active:scale-100 active:bg-primary-dark shadow-sm rounded-button disabled:bg-button-disabled disabled:opacity-100',
        secondary:
          'bg-text text-white hover:bg-text-light hover:scale-105 active:scale-100 active:bg-text shadow-sm rounded-button disabled:bg-button-disabled disabled:text-text-muted disabled:opacity-100',
        outline:
          'border-2 border-gray-300 text-primary bg-transparent hover:border-text hover:scale-105 active:scale-100 rounded-button-outlined disabled:border-gray-300 disabled:text-text-muted disabled:opacity-100',
        ghost:
          'bg-transparent text-text hover:bg-gray-100 hover:scale-105 active:scale-100 active:bg-gray-200 rounded-button disabled:opacity-50',
        error:
          'bg-error text-white hover:bg-error-alt hover:scale-105 active:scale-100 shadow-sm rounded-button disabled:bg-button-disabled disabled:text-text-muted disabled:opacity-100',
        success:
          'bg-success text-white hover:bg-success-dark hover:scale-105 active:scale-100 shadow-sm rounded-button disabled:bg-button-disabled disabled:text-text-muted disabled:opacity-100',
        outlineGray:
          'border border-gray-300 text-text bg-transparent hover:border-text hover:scale-105 active:scale-100 rounded-button disabled:border-gray-300 disabled:text-text-muted disabled:opacity-100',
      },
      size: {
        xs: 'h-8 px-3 py-1.5 text-xs gap-1.5',
        sm: 'h-button-sm px-button-padding-x-sm py-button-padding-y-sm text-sm gap-2',
        md: 'h-button-md px-button-padding-x-md py-button-padding-y-md text-base gap-3',
        lg: 'h-button-lg px-button-padding-x-lg py-button-padding-y-lg text-lg gap-3',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      fullWidth,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          icon && size === 'sm' && 'px-5',
          icon && size === 'md' && 'px-8',
          icon && size === 'lg' && 'px-10',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {icon && iconPosition === 'left' && !loading && icon}
        {children}
        {icon && iconPosition === 'right' && !loading && icon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
