/**
 * Badge Component
 * - 상태 표시용 배지
 * - 다양한 variant와 색상
 * - 아이콘 지원
 * - 닫기 버튼 옵션
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        // 예약 상태용
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-gray-100 text-gray-800',
        // 긴급도용
        emergency: 'bg-red-100 text-red-800 ring-2 ring-red-500',
        high: 'bg-orange-100 text-orange-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
      dot: {
        true: 'pl-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  onRemove?: () => void
  dot?: boolean
}

export function Badge({
  className,
  variant,
  size,
  icon,
  onRemove,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, dot }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-2 w-2 rounded-full',
            variant === 'primary' && 'bg-primary-500',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-yellow-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'pending' && 'bg-yellow-500',
            variant === 'confirmed' && 'bg-green-500',
            variant === 'cancelled' && 'bg-red-500',
            variant === 'completed' && 'bg-gray-500',
            variant === 'emergency' && 'bg-red-500 animate-pulse',
            variant === 'high' && 'bg-orange-500',
            variant === 'medium' && 'bg-yellow-500',
            variant === 'low' && 'bg-green-500'
          )}
        />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover:opacity-70 transition-opacity"
          aria-label="제거"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
