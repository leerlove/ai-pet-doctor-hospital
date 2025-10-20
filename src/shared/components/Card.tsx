/**
 * Card Component
 * - 다양한 variant (기본, 테두리, 그림자)
 * - Header, Body, Footer 영역 지원
 * - 호버 효과 옵션
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const cardVariants = cva('rounded-lg', {
  variants: {
    variant: {
      default: 'bg-white shadow-md border border-gray-200',
      bordered: 'bg-white border-2 border-gray-200',
      elevated: 'bg-white shadow-xl',
      flat: 'bg-white',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    hoverable: {
      true: 'transition-all hover:shadow-xl cursor-pointer',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({
  className,
  variant,
  padding,
  hoverable,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding, hoverable }), className)}
      {...props}
    />
  )
}

// Card Header
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean
}

export function CardHeader({
  className,
  noBorder,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'mb-4',
        !noBorder && 'border-b border-gray-200 pb-4',
        className
      )}
      {...props}
    />
  )
}

// Card Title
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function CardTitle({
  className,
  as: Component = 'h3',
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn('text-xl font-bold text-gray-900', className)}
      {...props}
    />
  )
}

// Card Description
export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)} {...props} />
  )
}

// Card Body
export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

// Card Footer
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  noBorder?: boolean
}

export function CardFooter({ className, noBorder, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4',
        !noBorder && 'border-t border-gray-200 pt-4',
        className
      )}
      {...props}
    />
  )
}
