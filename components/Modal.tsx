'use client'

import {
  HTMLAttributes,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  type RefObject,
} from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const ModalPortalRootContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

let bodyLockCount = 0
let previousBodyOverflow = ''

function lockBodyScroll() {
  if (typeof document === 'undefined') return () => {}

  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  bodyLockCount += 1

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1)
    if (bodyLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow
      previousBodyOverflow = ''
    }
  }
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[]

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  )
}

export function useModalPortalRoot() {
  return useContext(ModalPortalRootContext)
}

const modalBackdropVariants = cva('fixed inset-0 bg-gray-900/50 transition-opacity duration-200')

const modalContentVariants = cva(
  'relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white text-left shadow-2xl outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const modalCloseButtonVariants = cva(
  'ml-4 rounded-lg p-1 text-text-secondary transition-all duration-200 hover:bg-bg-hover hover:text-text focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-50',
)

const modalHeaderVariants = cva('flex flex-shrink-0 items-start justify-between border-b border-border px-4 pb-4 pt-6 sm:px-6')

const modalTitleVariants = cva('text-lg font-semibold text-text')

const modalDescriptionVariants = cva('mt-1 text-sm text-text-secondary')

const modalBodyVariants = cva('flex-1 overflow-y-auto px-4 py-6 sm:px-6')

const modalFooterVariants = cva('flex flex-shrink-0 flex-col items-stretch justify-end gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:px-6')

export interface ModalShellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  closeDisabled?: boolean
  focusTrapDisabled?: boolean
  closeOnOverlay?: boolean
  containerClassName?: string
  overlayClassName?: string
  zIndexClassName?: string
}

const ModalShell = forwardRef<HTMLDivElement, ModalShellProps>(
  (
    {
      isOpen,
      onClose,
      children,
      closeDisabled = false,
      focusTrapDisabled = false,
      closeOnOverlay = true,
      containerClassName,
      overlayClassName,
      zIndexClassName = 'z-50',
      size = 'md',
      className,
      onKeyDown,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLDivElement | null>(null)
    const portalRootRef = useRef<HTMLDivElement | null>(null)
    const closeDisabledRef = useRef(closeDisabled)
    const focusTrapDisabledRef = useRef(focusTrapDisabled)
    const onCloseRef = useRef(onClose)

    useEffect(() => {
      closeDisabledRef.current = closeDisabled
      focusTrapDisabledRef.current = focusTrapDisabled
      onCloseRef.current = onClose
    }, [closeDisabled, focusTrapDisabled, onClose])

    function setRefs(node: HTMLDivElement | null) {
      localRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    }

    useEffect(() => {
      if (!isOpen) return undefined
      return lockBodyScroll()
    }, [isOpen])

    useEffect(() => {
      if (!isOpen) return undefined

      const previousActiveElement = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

      const focusFrame = window.requestAnimationFrame(() => {
        const focusableElements = getFocusableElements(localRef.current)
        const firstFocusable = focusableElements[0]
        ;(firstFocusable ?? localRef.current)?.focus()
      })

      function handleDocumentKeyDown(event: KeyboardEvent) {
        if (event.defaultPrevented) return

        if (event.key === 'Escape' && !closeDisabledRef.current) {
          event.preventDefault()
          event.stopPropagation()
          onCloseRef.current()
          return
        }

        if (event.key !== 'Tab' || focusTrapDisabledRef.current) return

        const focusScope = portalRootRef.current ?? localRef.current
        const focusableElements = getFocusableElements(focusScope)
        if (focusableElements.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        const activeElement = document.activeElement

        if (focusScope && activeElement instanceof HTMLElement && !focusScope.contains(activeElement)) {
          event.preventDefault()
          firstElement.focus()
          return
        }

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
          return
        }

        if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }

      window.addEventListener('keydown', handleDocumentKeyDown)

      return () => {
        window.cancelAnimationFrame(focusFrame)
        window.removeEventListener('keydown', handleDocumentKeyDown)
        if (previousActiveElement && document.body.contains(previousActiveElement)) {
          previousActiveElement.focus()
        }
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <ModalPortalRootContext.Provider value={portalRootRef}>
        <div
          ref={portalRootRef}
          className={cn('fixed inset-0 flex items-center justify-center p-4', zIndexClassName, containerClassName)}
        >
          <div
            className={cn(modalBackdropVariants(), overlayClassName)}
            onClick={closeOnOverlay && !closeDisabled ? onClose : undefined}
            aria-hidden="true"
          />
          <div
            ref={setRefs}
            tabIndex={-1}
            className={cn(modalContentVariants({ size }), className)}
            onKeyDown={onKeyDown}
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalPortalRootContext.Provider>
    )
  },
)

ModalShell.displayName = 'ModalShell'

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'size'>,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  description?: string
  closeDisabled?: boolean
  closeOnOverlay?: boolean
  showCloseButton?: boolean
  bodyClassName?: string
  footer?: ReactNode
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = 'md',
      closeDisabled = false,
      closeOnOverlay = true,
      showCloseButton = true,
      children,
      footer,
      className,
      bodyClassName,
      ...props
    },
    ref,
  ) => {
    const titleId = useId()
    const descriptionId = useId()

    return (
      <ModalShell
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        closeDisabled={closeDisabled}
        closeOnOverlay={closeOnOverlay}
        size={size}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className={modalHeaderVariants()}>
            <div className="min-w-0 flex-1">
              {title && (
                <h3 id={titleId} className={modalTitleVariants()}>
                  {title}
                </h3>
              )}
              {description && (
                <p id={descriptionId} className={modalDescriptionVariants()}>
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={closeDisabled}
                className={modalCloseButtonVariants()}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className={cn(modalBodyVariants(), bodyClassName)}>{children}</div>
        {footer}
      </ModalShell>
    )
  },
)

Modal.displayName = 'Modal'

export type ModalFooterProps = HTMLAttributes<HTMLDivElement>

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(modalFooterVariants(), className)}
      {...props}
    />
  ),
)

ModalFooter.displayName = 'ModalFooter'

export {
  Modal,
  ModalShell,
  ModalFooter,
  modalBackdropVariants,
  modalContentVariants,
  modalCloseButtonVariants,
  modalHeaderVariants,
  modalTitleVariants,
  modalDescriptionVariants,
  modalBodyVariants,
  modalFooterVariants,
}
