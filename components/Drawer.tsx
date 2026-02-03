'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  title,
  children,
  className = 'bg-white',
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const panelPosition = position === 'right' ? 'right-0' : 'left-0'

  const panelTransform =
    position === 'right'
      ? isOpen
        ? 'translate-x-0'
        : 'translate-x-full'
      : isOpen
        ? 'translate-x-0'
        : '-translate-x-full'

  return (
    <>
      <div
        className={`fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`fixed z-[10000] top-0 ${panelPosition} h-full w-80 shadow-xl transition-transform duration-300 ease-out ${panelTransform} ${className}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {!title && <div />}
          <button
            type="button"
            onClick={onClose}
            className="close-btn p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
