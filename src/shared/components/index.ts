/**
 * Shared Components Export
 * - 모든 공통 컴포넌트를 한 곳에서 export
 */

// Button
export { Button } from './Button'
export type { ButtonProps } from './Button'

// Input
export { Input } from './Input'
export type { InputProps } from './Input'

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from './Card'
export type { CardProps, CardHeaderProps, CardTitleProps, CardFooterProps } from './Card'

// Modal
export { Modal, ModalFooter } from './Modal'
export type { ModalProps } from './Modal'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  TableCaption,
} from './Table'
export type { TableProps, TableBodyProps, TableHeadProps } from './Table'

// Badge
export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

// Toast
export { ToastContainer, toast, useToastStore } from './Toast'
export type { Toast } from './Toast'

// Protected Route
export { ProtectedRoute } from './ProtectedRoute'

// Error Boundary
export { ErrorBoundary } from './ErrorBoundary'

// Skeleton
export { Skeleton, TableSkeleton, CardSkeleton } from './Skeleton'

// Page Header
export { PageHeader } from './PageHeader'
