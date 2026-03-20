'use client'

import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../utils/cn'

const alertVariants = cva(
  'border rounded-lg px-4 py-3 text-sm flex items-start gap-3',
  {
    variants: {
      variant: {
        error: 'bg-red-50 border-error text-error',
        warning: 'bg-amber-50 border-amber-500 text-amber-700',
        success: 'bg-green-50 border-green-500 text-green-700',
        info: 'bg-blue-50 border-blue-500 text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'error',
    },
  }
)

const variantIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
}

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof alertVariants> {
  children: ReactNode
  icon?: boolean
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'error', icon = true, dismissible = false, onDismiss, children, className, ...props }, ref) => {
    const IconComponent = variantIcons[variant ?? 'error']

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <IconComponent size={16} className="flex-shrink-0 mt-0.5" />}
        <div className="flex-1">{children}</div>
        {dismissible && onDismiss && (
          <button onClick={onDismiss} className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity">
            <X size={16} />
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert, alertVariants }
