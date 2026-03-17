'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Location } from '../../types/location'
import { formatLocationLabel } from '../../types/location'
import { TextButton } from '../TextButton'

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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  const handleSelect = (location: Location) => {
    onSelect(location)
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
        {sublabel && (
          <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
        )}
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
          ${
            error
              ? 'border-red-500'
              : 'border-[#ECECEC] hover:border-[#B3B3B3] focus:border-[#262626]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-[#262626]' : ''}
          ${additionalDropdownClasses}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={
            selectedLocation
              ? 'text-gray-900 text-sm'
              : 'text-gray-400 text-sm'
          }
        >
          {selectedLocation
            ? formatLocationLabel(selectedLocation)
            : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
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
          {locations.length > 0 ? (
            locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelect(location)}
                className={`
                  w-full px-4 py-3
                  text-left text-sm text-gray-900
                  hover:bg-gray-50
                  transition-colors duration-150
                  cursor-pointer
                  ${
                    selectedLocation?.id === location.id
                      ? 'bg-gray-100 font-medium'
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
              <p className="text-sm text-gray-600 mb-2">{emptyMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onNewLocation()
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
          onClick={onNewLocation}
          additionalContainerClasses="w-full"
        >
          Novo local
        </TextButton>
      </div>
    </div>
  )
}
