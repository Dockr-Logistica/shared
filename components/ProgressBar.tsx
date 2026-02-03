'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const progressBarTrackVariants = cva(
  'w-full rounded-full overflow-hidden transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
      },
      variant: {
        default: 'bg-gray-300',
        light: 'bg-gray-200',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

const progressBarFillVariants = cva(
  'h-full rounded-full transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-info',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

const progressBarLabelVariants = cva(
  'flex justify-between text-sm text-text-muted mb-2'
)

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'size'>,
    Omit<VariantProps<typeof progressBarTrackVariants>, 'variant'>,
    Pick<VariantProps<typeof progressBarFillVariants>, 'variant'> {
  value: number
  max?: number
  showLabel?: boolean
  currentStep?: number
  totalSteps?: number
  label?: string
  size?: VariantProps<typeof progressBarTrackVariants>['size']
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      showLabel = true,
      currentStep,
      totalSteps,
      label,
      size,
      variant,
      className,
      ...props
    },
    ref
  ) => {
    const progress = Math.min(Math.max((value / max) * 100, 0), 100)

    const getLabel = () => {
      if (label) return label
      if (currentStep && totalSteps) {
        return `Passo ${currentStep} de ${totalSteps}`
      }
      return null
    }

    const getProgressText = () => {
      if (currentStep && totalSteps) {
        return `${Math.round(progress)}% concluído`
      }
      return `${Math.round(progress)}%`
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {showLabel && (
          <div className={progressBarLabelVariants()}>
            <span>{getLabel()}</span>
            <span>{getProgressText()}</span>
          </div>
        )}
        <div className={progressBarTrackVariants({ size, variant: 'default' })}>
          <div
            className={progressBarFillVariants({ variant })}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={
              label ||
              (currentStep && totalSteps
                ? `Progresso: Passo ${currentStep} de ${totalSteps}`
                : `Progresso: ${Math.round(progress)}%`)
            }
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export {
  ProgressBar,
  progressBarTrackVariants,
  progressBarFillVariants,
  progressBarLabelVariants,
}
