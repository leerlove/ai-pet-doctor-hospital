/**
 * Button Component
 * - CVA를 사용한 variant 기반 스타일링
 * - 로딩 상태, 비활성화 상태 지원
 * - 아이콘 지원
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import { forwardRef } from 'react'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600 shadow-sm',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
        outline:
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-600',
        ghost:
          'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        danger:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
