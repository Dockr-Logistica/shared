import { cn } from '../utils/cn'

interface FieldStateOptions {
  error?: boolean
  active?: boolean
}

export const fieldBaseClasses = cn(
  'border rounded-input bg-white',
  'transition-colors duration-200 ease-in-out',
  'focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
)

export function fieldStateClasses({ error, active }: FieldStateOptions = {}) {
  if (error) {
    return 'border-error hover:border-error focus:border-error focus:shadow-input-error'
  }

  if (active) {
    return 'border-input-border-focus shadow-input-focus hover:border-input-border-focus'
  }

  return cn(
    'border-input-border-default hover:border-input-border-hover',
    'focus:border-input-border-focus focus:shadow-input-focus focus:hover:border-input-border-focus',
  )
}
