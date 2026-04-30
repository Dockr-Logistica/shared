'use client'

import { useState, useRef, useEffect, useId, type KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Cargo, SelectedCargo } from '../../types/cargo'
import { formatCargoLabel } from '../../types/cargo'
import { formatCurrency, formatWeight } from '../../utils/quote/formatters'
import { TextButton } from '../TextButton'
import { FloatingDropdown } from '../FloatingDropdown'
import { cn } from '../../utils/cn'
import { fieldBaseClasses, fieldStateClasses } from '../fieldStyles'

export interface CargoDropdownProps {
  cargos: Cargo[]
  selectedCargos: SelectedCargo[]
  onSelect: (cargo: Cargo) => void
  onNewCargo: () => void
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

export function CargoDropdown({
  cargos,
  selectedCargos,
  onSelect,
  onNewCargo,
  placeholder = 'Selecione a carga',
  emptyMessage = 'Você ainda não tem cargas cadastradas.',
  emptyActionText = 'Clique aqui para adicionar.',
  label,
  sublabel,
  error,
  disabled = false,
  additionalContainerClasses = '',
  additionalDropdownClasses = '',
  additionalOptionClasses = '',
}: CargoDropdownProps) {
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

  const selectedIds = selectedCargos.map((sc) => sc.cargo.id)
  const availableCargos = cargos.filter((cargo) => !selectedIds.includes(cargo.id))

  const handleSelect = (cargo: Cargo) => {
    onSelect(cargo)
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
      `[data-cargo-dropdown-option="${index}"]`,
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
      focusOption(Math.min(index + 1, availableCargos.length - 1))
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
        {sublabel && <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>}
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
        <span className="min-w-0 flex-1 truncate text-left text-sm text-text-placeholder">{placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
          {availableCargos.length > 0 ? (
            availableCargos.map((cargo, index) => (
              <button
                key={cargo.id}
                type="button"
                onClick={() => handleSelect(cargo)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                data-cargo-dropdown-option={index}
                className={`
                  w-full px-4 py-3
                  text-left
                  hover:bg-bg-hover
                  focus:bg-bg-hover focus:outline-none
                  transition-colors duration-150
                  cursor-pointer
                  border-b border-border last:border-b-0
                  ${additionalOptionClasses}
                `}
                role="option"
                aria-selected={false}
              >
                <div className="text-sm text-text font-medium truncate">
                  {formatCargoLabel(cargo)}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {formatWeight(cargo.weight)} | {formatCurrency(cargo.value)}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-text-secondary mb-2">{emptyMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onNewCargo()
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
          onClick={onNewCargo}
          additionalContainerClasses="w-full"
        >
          Nova carga
        </TextButton>
      </div>
    </div>
  )
}
