/**
 * Table Component
 * - 반응형 테이블
 * - 정렬 기능
 * - 호버 효과
 * - 스트라이프 효과
 */

import { cn } from '@/shared/utils/cn'

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  hoverable?: boolean
  striped?: boolean
}

export function Table({
  className,
  hoverable,
  striped,
  ...props
}: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full text-sm text-left', className)}
        {...props}
      />
    </div>
  )
}

// Table Header
export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('text-xs text-gray-700 uppercase bg-gray-50', className)}
      {...props}
    />
  )
}

// Table Body
export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  striped?: boolean
  hoverable?: boolean
}

export function TableBody({
  className,
  striped,
  hoverable,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      className={cn(
        'divide-y divide-gray-200',
        striped && '[&>tr:nth-child(even)]:bg-gray-50',
        hoverable && '[&>tr]:hover:bg-gray-100 [&>tr]:transition-colors',
        className
      )}
      {...props}
    />
  )
}

// Table Row
export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('', className)} {...props} />
}

// Table Head Cell
export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | null
  onSort?: () => void
}

export function TableHead({
  className,
  sortable,
  sortDirection,
  onSort,
  children,
  ...props
}: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-6 py-3 font-medium',
        sortable && 'cursor-pointer select-none hover:bg-gray-100',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="flex flex-col">
            <svg
              className={cn(
                'w-3 h-3',
                sortDirection === 'asc' ? 'text-gray-900' : 'text-gray-400'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </span>
        )}
      </div>
    </th>
  )
}

// Table Cell
export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-6 py-4', className)} {...props} />
}

// Table Footer
export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn('text-xs text-gray-700 uppercase bg-gray-50', className)}
      {...props}
    />
  )
}

// Table Caption
export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn('py-3 text-sm text-gray-600 text-left', className)}
      {...props}
    />
  )
}
