'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-300 text-text-muted',
        primary: 'bg-primary text-text',
        success: 'bg-success text-white',
        error: 'bg-error text-white',
      },
      size: {
        sm: 'w-[25px] h-[25px] text-xs',
        md: 'w-[40px] h-[40px] text-sm',
        lg: 'w-[50px] h-[50px] text-base',
        xl: 'w-16 h-16 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'circle',
    },
  }
)

const statusVariants = cva(
  'absolute bottom-0 right-0 rounded-full border-2 border-white',
  {
    variants: {
      status: {
        online: 'bg-success',
        offline: 'bg-gray-400',
        busy: 'bg-error',
        away: 'bg-warning',
      },
      size: {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
      },
    },
  }
)

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  clickable?: boolean
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      fallback,
      variant,
      size,
      shape,
      status,
      clickable,
      className,
      ...props
    },
    ref
  ) => {
    const getFallbackText = () => {
      if (fallback) return fallback
      if (alt) {
        const words = alt.split(' ')
        if (words.length >= 2) {
          return `${words[0][0]}${words[1][0]}`.toUpperCase()
        }
        return alt.substring(0, 2).toUpperCase()
      }
      return '?'
    }

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ variant, size, shape }),
          clickable && 'cursor-pointer hover:scale-110 active:scale-100',
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getFallbackText()}</span>
        )}

        {status && (
          <span
            className={statusVariants({ status, size })}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export { Avatar, avatarVariants, statusVariants }
