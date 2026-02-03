'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-200 text-text border border-gray-300',
        primary: 'bg-primary-background text-primary-dark border border-primary',
        success: 'bg-success-light/20 text-success-dark border border-success',
        warning: 'bg-warning/20 text-warning-darker border border-warning-dark',
        error: 'bg-error-light/20 text-error border border-error',
        info: 'bg-info-light/20 text-info border border-info',
      },
      size: {
        sm: 'text-xs px-2 h-[20px] rounded-full',
        md: 'text-sm px-2.5 h-[22px] rounded-full',
        lg: 'text-sm px-3 h-[26px] rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const badgeDotVariants = cva('w-1.5 h-1.5 rounded-full', {
  variants: {
    variant: {
      default: 'bg-gray-600',
      primary: 'bg-primary-dark',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'size'>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  clickable?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant,
      size,
      dot = false,
      clickable,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          clickable && 'cursor-pointer hover:scale-105 active:scale-100',
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={badgeDotVariants({ variant })}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants, badgeDotVariants }
