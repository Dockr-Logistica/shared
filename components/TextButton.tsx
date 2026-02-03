import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '../utils/cn'
import { Loader2 } from 'lucide-react'

const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out cursor-pointer hover:scale-105 active:scale-100 disabled:hover:scale-100 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

const variantClasses = {
  primary: 'bg-primary text-text hover:bg-primary-hover active:bg-primary-dark shadow-sm disabled:bg-gray-200 disabled:text-text-muted',
  secondary: 'bg-[#262626] text-white hover:bg-[rgb(38,38,38,0.9)] shadow-sm disabled:bg-gray-200 disabled:text-text-muted',
  outline: 'border-2 border-primary text-text bg-transparent hover:bg-primary disabled:border-gray-300 disabled:text-text-muted',
  outlineLight: 'border-2 border-primary text-white bg-transparent hover:bg-primary hover:text-text',
  outlineGrayLight: 'border border-[#d5d7da] text-[#f2f2f2] bg-transparent hover:bg-white/10',
  ghost: 'bg-transparent text-text hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50',
  error: 'bg-error text-white hover:bg-error/90 shadow-sm disabled:bg-gray-200 disabled:text-text-muted',
}

const sizeClasses = {
  xs: 'h-8 px-3 py-1.5 text-xs leading-4 gap-1.5 rounded-md',
  sm: 'h-10 px-4 py-2 text-sm leading-5 gap-2 rounded-button',
  md: 'h-12 px-6 py-3 text-base leading-6 gap-3 rounded-button',
  lg: 'h-14 px-8 py-4 text-lg leading-7 gap-3 rounded-button',
}

type Variant = keyof typeof variantClasses
type Size = keyof typeof sizeClasses

type BaseProps = {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  additionalContainerClasses?: string
  additionalTextClasses?: string
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: never
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & {
    href: string
    disabled?: boolean
  }

export type TextButtonProps = ButtonAsButton | ButtonAsLink

const TextButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TextButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = true,
      loading = false,
      icon,
      iconPosition = 'left',
      additionalContainerClasses,
      additionalTextClasses,
      className,
      ...rest
    } = props

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      additionalContainerClasses,
      className
    )

    const content = (
      <>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {icon && iconPosition === 'left' && !loading && icon}
        {additionalTextClasses ? (
          <span className={additionalTextClasses}>{children}</span>
        ) : (
          children
        )}
        {icon && iconPosition === 'right' && !loading && icon}
      </>
    )

    if ('href' in props && props.href) {
      const { href, disabled, ...linkProps } = rest as Omit<ButtonAsLink, keyof BaseProps> & { disabled?: boolean }
      const isDisabled = disabled || loading

      const handleDisabledClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDisabled) {
          e.preventDefault()
          return false
        }
      }

      const disabledClasses = isDisabled ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={isDisabled ? '#' : href}
          className={cn(classes, disabledClasses)}
          onClick={handleDisabledClick}
          aria-disabled={isDisabled ? 'true' : undefined}
          {...linkProps}
        >
          {content}
        </Link>
      )
    }

    const { disabled, ...buttonProps } = rest as Omit<ButtonAsButton, keyof BaseProps>
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        className={classes}
        {...buttonProps}
      >
        {content}
      </button>
    )
  }
)

TextButton.displayName = 'TextButton'

export { TextButton }
