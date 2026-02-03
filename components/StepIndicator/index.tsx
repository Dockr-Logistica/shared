import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Step {
  title: string
  subtitle?: string
}

interface StepIndicatorProps {
  currentStep: number
  steps: Step[]
  className?: string
}

export default function StepIndicator({
  currentStep,
  steps,
  className = ''
}: StepIndicatorProps) {
  return (
    <nav
      aria-label="Progresso"
      className={cn('flex items-start justify-center border-b-2 border-gray-200 pb-5', className)}
    >
      <ol className="flex items-start gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isFuture = stepNumber > currentStep

          return (
            <li key={stepNumber} className="flex items-start">
              <div
                className={cn(
                  'flex flex-col items-center pb-5 -mb-5 border-b-2',
                  isActive && 'border-primary',
                  !isActive && 'border-transparent'
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-all',
                      isActive && 'bg-primary text-text',
                      isCompleted && 'bg-primary text-text',
                      isFuture && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {stepNumber}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors',
                        isActive && 'text-text',
                        isCompleted && 'text-text',
                        isFuture && 'text-gray-400'
                      )}
                    >
                      {step.title}
                    </span>
                    {step.subtitle && (
                      <span
                        className={cn(
                          'text-xs transition-colors',
                          isActive && 'text-gray-500',
                          isCompleted && 'text-gray-500',
                          isFuture && 'text-gray-400'
                        )}
                      >
                        {step.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {stepNumber < steps.length && (
                <div className="flex items-center px-6 pt-1">
                  <ChevronRight
                    className={cn(
                      'w-6 h-6 transition-colors',
                      isCompleted ? 'text-gray-400' : 'text-gray-300'
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
