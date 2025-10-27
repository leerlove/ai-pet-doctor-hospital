/**
 * BookingCalendar.tsx
 * 예약 날짜 선택 캘린더 컴포넌트
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface BookingCalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  disabledDates?: Date[]
  minDate?: Date
  maxDate?: Date
}

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  disabledDates = [],
  minDate,
  maxDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 현재 월의 모든 날짜 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return disabledDates.some(
      (d) => d.toDateString() === date.toDateString()
    )
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    return date.toDateString() === new Date().toDateString()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  }

  const monthYearText = currentMonth.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          날짜를 선택해주세요.
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
            {monthYearText}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-2',
              index === 0 ? 'text-red-500' : 'text-gray-600',
              index === 6 ? 'text-blue-500' : ''
            )}
          >
            {day}
          </div>
        ))}

        {/* Date Cells */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />
          }

          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const today = isToday(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => !disabled && onSelectDate(date)}
              disabled={disabled}
              className={cn(
                'aspect-square rounded-lg text-sm font-medium transition-all',
                'flex items-center justify-center',
                // Default state
                'text-gray-700 hover:bg-teal-50',
                // Disabled state
                disabled && 'text-gray-300 cursor-not-allowed hover:bg-transparent',
                // Selected state
                selected && 'bg-teal-600 text-white hover:bg-teal-700',
                // Today indicator
                today && !selected && 'bg-teal-50 text-teal-600 font-semibold',
                // Sunday
                date.getDay() === 0 && !selected && !disabled && 'text-red-500',
                // Saturday
                date.getDay() === 6 && !selected && !disabled && 'text-blue-500'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
