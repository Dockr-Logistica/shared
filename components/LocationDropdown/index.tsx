'use client'

import { useState, useRef, useEffect, useId, type KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Location } from '../../types/location'
import { formatLocationLabel } from '../../types/location'
import { TextButton } from '../TextButton'
import { FloatingDropdown } from '../FloatingDropdown'
import { cn } from '../../utils/cn'
import { fieldBaseClasses, fieldStateClasses } from '../fieldStyles'

export interface LocationDropdownProps {
  locations: Location[]
  selectedLocation: Location | null
  onSelect: (location: Location) => void
  onNewLocation: () => void
  placeholder?: string
  emptyMessage?: string
  emptyActionText?: string
  label: string
  sublabel?: string
  error?: string
  disabled?: boolean
  additionalContainerClasses?: string
  additionalDropdownClasses?: string
  additionalOptionClasses?: string
}

export function LocationDropdown({
  locations,
  selectedLocation,
  onSelect,
  onNewLocation,
  placeholder = 'Selecione o local',
  emptyMessage = 'Você ainda não tem locais cadastrados.',
  emptyActionText = 'Clique aqui para adicionar.',
  label,
  sublabel,
  error,
  disabled = false,
  additionalContainerClasses = '',
  additionalDropdownClasses = '',
  additionalOptionClasses = '',
}: LocationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownId = useId()
  const labelId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (location: Location) => {
    onSelect(location)
    setIsOpen(false)
  }

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

  function focusOption(index: number) {
    const option = dropdownRef.current?.querySelector<HTMLButtonElement>(
      `[data-location-dropdown-option="${index}"]`,
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
      focusOption(Math.min(index + 1, locations.length - 1))
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

  return (
    <div className={`relative ${additionalContainerClasses}`} ref={containerRef}>
      <div className="mb-2">
        <label id={labelId} className="text-sm font-medium text-text">{label}</label>
        {sublabel && (
          <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>
        )}
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        className={cn(
          'w-full h-input-md px-4',
          'flex items-center justify-between gap-3',
          fieldBaseClasses,
          fieldStateClasses({ error: Boolean(error), active: isOpen }),
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          additionalDropdownClasses,
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? dropdownId : undefined}
        aria-labelledby={labelId}
      >
        <span
          className={cn(
            'min-w-0 flex-1 truncate text-left text-sm',
            selectedLocation ? 'text-text' : 'text-text-placeholder',
          )}
        >
          {selectedLocation
            ? formatLocationLabel(selectedLocation)
            : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {error && <p className="text-xs text-error mt-1">{error}</p>}

      <FloatingDropdown
        open={isOpen}
        anchorRef={triggerRef}
        floatingRef={dropdownRef}
        id={dropdownId}
        role="listbox"
        positionOptions={{ preferredMaxHeight: 240, minHeight: 96 }}
        className="transition-all duration-200 ease-in-out"
      >
          {locations.length > 0 ? (
            locations.map((location, index) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelect(location)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                data-location-dropdown-option={index}
                className={`
                  w-full px-4 py-3
                  text-left text-sm text-text
                  hover:bg-bg-hover
                  focus:bg-bg-hover focus:outline-none
                  transition-colors duration-150
                  cursor-pointer
                  ${
                    selectedLocation?.id === location.id
                      ? 'bg-bg-muted font-medium'
                      : ''
                  }
                  ${additionalOptionClasses}
                `}
                role="option"
                aria-selected={selectedLocation?.id === location.id}
              >
                {formatLocationLabel(location)}
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-text-secondary mb-2">{emptyMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onNewLocation()
                }}
                className="text-sm text-primary hover:underline"
              >
                {emptyActionText}
              </button>
            </div>
          )}
      </FloatingDropdown>

      <div className="mt-3">
        <TextButton
          variant="outline"
          size="sm"
          onClick={onNewLocation}
          additionalContainerClasses="w-full"
        >
          Novo local
        </TextButton>
      </div>
    </div>
  )
}
