'use client'

import { HTMLAttributes, ReactNode, forwardRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const modalBackdropVariants = cva(
  'fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity duration-200'
)

const modalContentVariants = cva(
  'relative z-50 inline-block align-bottom bg-white rounded-card text-left overflow-hidden shadow-xl transform transition-all duration-200 sm:my-8 sm:align-middle sm:w-full',
  {
    variants: {
      size: {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        full: 'sm:max-w-full sm:m-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const modalCloseButtonVariants = cva(
  'ml-4 text-gray-400 hover:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 hover:scale-110 active:scale-100'
)

const modalHeaderVariants = cva(
  'flex items-start justify-between mb-4'
)

const modalTitleVariants = cva(
  'text-xl font-semibold text-text'
)

const modalDescriptionVariants = cva(
  'mt-1 text-sm text-text-muted'
)

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'size'>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: string
  closeOnOverlay?: boolean
  showCloseButton?: boolean
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = 'md',
      closeOnOverlay = true,
      showCloseButton = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose()
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-6">
          <div
            className={modalBackdropVariants()}
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
          />

          <div
            ref={ref}
            className={cn(modalContentVariants({ size }), className)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            {...props}
          >
            <div className="bg-white px-6 pt-6 pb-4">
              {(title || showCloseButton) && (
                <div className={modalHeaderVariants()}>
                  <div className="flex-1">
                    {title && (
                      <h3 id="modal-title" className={modalTitleVariants()}>
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className={modalDescriptionVariants()}>
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className={modalCloseButtonVariants()}
                      aria-label="Fechar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

const modalFooterVariants = cva(
  'flex items-center justify-end gap-3 px-6 py-4 bg-gray-100 border-t border-input-border-default'
)

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalFooterVariants(), className)}
      {...props}
    />
  )
)

ModalFooter.displayName = 'ModalFooter'

export {
  Modal,
  ModalFooter,
  modalBackdropVariants,
  modalContentVariants,
  modalCloseButtonVariants,
  modalHeaderVariants,
  modalTitleVariants,
  modalDescriptionVariants,
  modalFooterVariants,
}
