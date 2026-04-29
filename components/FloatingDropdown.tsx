'use client'

import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../utils/cn'
import { useModalPortalRoot } from './Modal'

export interface FloatingDropdownPosition {
  left: number
  width: number
  maxHeight: number
  top?: number
  bottom?: number
}

export interface FloatingDropdownOptions {
  align?: 'start' | 'end'
  preferredMaxHeight?: number
  minHeight?: number
  gap?: number
  margin?: number
  openAboveThreshold?: number
  matchWidth?: boolean
  width?: number
}

interface FloatingDropdownProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  anchorRef: RefObject<HTMLElement | null>
  floatingRef?: RefObject<HTMLDivElement | null>
  children: ReactNode
  positionOptions?: FloatingDropdownOptions
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getFloatingDropdownPosition(
  anchor: HTMLElement | null,
  {
    preferredMaxHeight = 240,
    minHeight = 96,
    gap = 4,
    margin = 12,
    align = 'start',
    openAboveThreshold = 180,
    matchWidth = true,
    width,
  }: FloatingDropdownOptions = {},
): FloatingDropdownPosition | null {
  if (!anchor || typeof window === 'undefined') return null

  const rect = anchor.getBoundingClientRect()
  const dropdownWidth = width ?? (matchWidth ? rect.width : Math.max(rect.width, 240))
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const rawLeft = align === 'end' ? rect.right - dropdownWidth : rect.left
  const left = clamp(rawLeft, margin, Math.max(margin, viewportWidth - dropdownWidth - margin))
  const spaceBelow = viewportHeight - rect.bottom - margin
  const spaceAbove = rect.top - margin
  const openAbove = spaceBelow < openAboveThreshold && spaceAbove > spaceBelow
  const availableSpace = openAbove ? spaceAbove : spaceBelow
  const maxHeight = Math.max(Math.min(availableSpace, preferredMaxHeight), minHeight)

  return openAbove
    ? {
        left,
        width: dropdownWidth,
        maxHeight,
        bottom: viewportHeight - rect.top + gap,
      }
    : {
        left,
        width: dropdownWidth,
        maxHeight,
        top: rect.bottom + gap,
      }
}

export function FloatingDropdown({
  open,
  anchorRef,
  floatingRef,
  children,
  positionOptions,
  className,
  style,
  onKeyDown,
  ...props
}: FloatingDropdownProps) {
  const [position, setPosition] = useState<FloatingDropdownPosition | null>(null)
  const modalPortalRoot = useModalPortalRoot()
  const {
    preferredMaxHeight,
    minHeight,
    gap,
    margin,
    align,
    openAboveThreshold,
    matchWidth,
    width,
  } = positionOptions ?? {}

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      setPosition(getFloatingDropdownPosition(anchorRef.current, {
        preferredMaxHeight,
        minHeight,
        gap,
        margin,
        align,
        openAboveThreshold,
        matchWidth,
        width,
      }))
    }

    const frame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [
    anchorRef,
    align,
    gap,
    margin,
    matchWidth,
    minHeight,
    open,
    openAboveThreshold,
    preferredMaxHeight,
    width,
  ])

  if (!open || !position || typeof document === 'undefined') return null

  const dropdownStyle: CSSProperties = {
    left: position.left,
    width: position.width,
    maxHeight: position.maxHeight,
    top: position.top,
    bottom: position.bottom,
    ...style,
  }

  const portalRoot = modalPortalRoot?.current ?? document.body

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation()
    }
    onKeyDown?.(event)
  }

  return createPortal(
    <div
      ref={floatingRef}
      data-floating-dropdown
      className={cn('fixed z-[60] overflow-y-auto rounded-lg border border-border bg-white shadow-lg', className)}
      style={dropdownStyle}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>,
    portalRoot,
  )
}
