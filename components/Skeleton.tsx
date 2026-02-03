'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const skeletonVariants = cva('bg-gray-200 transition-all duration-200', {
  variants: {
    variant: {
      text: 'rounded h-4',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-lg',
      card: 'rounded-card',
    },
    animation: {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'rectangular',
    animation: 'pulse',
  },
})

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant,
      animation,
      width,
      height,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const inlineStyles = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && {
        height: typeof height === 'number' ? `${height}px` : height,
      }),
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, animation }), className)}
        style={inlineStyles}
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton, skeletonVariants }
