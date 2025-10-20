/**
 * Modal Component
 * - Portal을 사용한 모달 렌더링
 * - 오버레이 클릭으로 닫기
 * - ESC 키로 닫기
 * - 다양한 사이즈 지원
 */

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  title?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, closeOnEsc])

  // Body 스크롤 방지
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

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative z-50 w-full bg-white rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200',
          sizeClasses[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="닫기"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}

// Modal Footer
export function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-6',
        className
      )}
      {...props}
    />
  )
}
