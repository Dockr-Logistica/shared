'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'
import { FloatingDropdown } from './FloatingDropdown'

export interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  sublabel?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  additionalContainerClasses?: string
  additionalDropdownClasses?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  sublabel,
  placeholder = 'Selecione',
  error,
  disabled = false,
  additionalContainerClasses = '',
  additionalDropdownClasses = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownId = useId()
  const labelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return
      }

        setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  function closeDropdown(restoreFocus = false) {
    setIsOpen(false)
    if (restoreFocus) {
      window.setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }

  const handleSelectOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  function focusOption(index: number) {
    const option = dropdownRef.current?.querySelector<HTMLButtonElement>(
      `[data-multiselect-option="${index}"]`,
    )
    option?.focus()
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      window.setTimeout(() => focusOption(0), 0)
      return
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      event.stopPropagation()
      closeDropdown(true)
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeDropdown(true)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(Math.min(index + 1, options.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (index === 0) {
        triggerRef.current?.focus()
      } else {
        focusOption(index - 1)
      }
    }
  }

  const displayText = value.length === 0
    ? placeholder
    : value.length === 1
    ? value[0]
    : `${value.length} selecionados`

  return (
    <div className={cn('relative', additionalContainerClasses)} ref={containerRef}>
      {label && (
        <div className="mb-2">
          <label id={labelId} className="text-sm font-medium text-text">{label}</label>
          {sublabel && <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        className={cn(
          'w-full h-input-md px-4',
          'flex items-center justify-between',
          'bg-white',
          'border rounded-input',
          'transition-all duration-200 ease-in-out',
          error ? 'border-error' : 'border-input-border-default hover:border-input-border-hover focus:border-input-border-focus',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          isOpen ? 'border-input-border-focus' : '',
          additionalDropdownClasses
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? dropdownId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : placeholder}
      >
        <span className={value.length === 0 ? 'text-text-placeholder text-sm' : 'text-text text-sm'}>
          {displayText}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {error && <p className="text-xs text-error mt-1" role="alert">{error}</p>}

      <FloatingDropdown
        open={isOpen}
        anchorRef={triggerRef}
        floatingRef={dropdownRef}
        id={dropdownId}
        role="listbox"
        aria-multiselectable="true"
        positionOptions={{ preferredMaxHeight: 240, minHeight: 96 }}
        className="transition-all duration-200"
      >
          {options.map((option, index) => {
            const isSelected = value.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                data-multiselect-option={index}
                className={cn(
                  'w-full px-4 py-3',
                  'flex items-center justify-between',
                  'text-left text-sm',
                  'hover:bg-bg-hover',
                  'focus:bg-bg-hover focus:outline-none',
                  'transition-colors duration-150',
                  'border-b border-border last:border-b-0',
                  isSelected ? 'text-text font-medium' : 'text-text-secondary'
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </button>
            )
          })}
      </FloatingDropdown>
    </div>
  )
}
