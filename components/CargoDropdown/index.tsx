'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Cargo, SelectedCargo } from '../../types/cargo'
import { formatCargoLabel } from '../../types/cargo'
import { formatCurrency, formatWeight } from '../../utils/quote/formatters'
import { TextButton } from '../TextButton'

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

  return (
    <div className={`relative ${additionalContainerClasses}`} ref={containerRef}>
      <div className="mb-2">
        <label className="text-sm font-semibold text-gray-900">{label}</label>
        {sublabel && <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full h-[47px] px-4
          flex items-center justify-between
          bg-white
          border rounded-[7px]
          transition-all duration-200 ease-in-out
          ${error ? 'border-red-500' : 'border-[#ECECEC] hover:border-[#B3B3B3] focus:border-[#262626]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-[#262626]' : ''}
          ${additionalDropdownClasses}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-gray-400 text-sm">{placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1 w-full
            bg-white
            border border-[#ECECEC]
            rounded-lg
            shadow-lg
            max-h-[240px]
            overflow-y-auto
            transition-all duration-200 ease-in-out
          `}
          role="listbox"
        >
          {availableCargos.length > 0 ? (
            availableCargos.map((cargo) => (
              <button
                key={cargo.id}
                type="button"
                onClick={() => handleSelect(cargo)}
                className={`
                  w-full px-4 py-3
                  text-left
                  hover:bg-gray-50
                  transition-colors duration-150
                  cursor-pointer
                  border-b border-gray-100 last:border-b-0
                  ${additionalOptionClasses}
                `}
                role="option"
              >
                <div className="text-sm text-gray-900 font-medium truncate">
                  {formatCargoLabel(cargo)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatWeight(cargo.weight)} | {formatCurrency(cargo.value)}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-600 mb-2">{emptyMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onNewCargo()
                }}
                className="text-sm text-[#FFCE12] hover:underline"
              >
                {emptyActionText}
              </button>
            </div>
          )}
        </div>
      )}

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
