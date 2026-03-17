'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'

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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
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

  const handleSelectOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
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
          <label className="text-sm font-semibold text-gray-900">{label}</label>
          {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'w-full h-[47px] px-4',
          'flex items-center justify-between',
          'bg-white',
          'border rounded-[7px]',
          'transition-all duration-200 ease-in-out',
          error ? 'border-red-500' : 'border-[#ECECEC] hover:border-[#B3B3B3] focus:border-[#262626]',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          isOpen ? 'border-[#262626]' : '',
          additionalDropdownClasses
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={value.length === 0 ? 'text-gray-400 text-sm' : 'text-gray-900 text-sm'}>
          {displayText}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full bg-white border border-[#ECECEC] rounded-lg shadow-lg max-h-[240px] overflow-y-auto transition-all duration-200"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => {
            const isSelected = value.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={cn(
                  'w-full px-4 py-3',
                  'flex items-center justify-between',
                  'text-left text-sm',
                  'hover:bg-gray-50',
                  'transition-colors duration-150',
                  'border-b border-gray-100 last:border-b-0',
                  isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option}</span>
                {isSelected && <Check className="w-4 h-4 text-[#FFCE12]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
