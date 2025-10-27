/**
 * TimeSlotPicker.tsx
 * 예약 시간 선택 컴포넌트
 */

import { Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotPickerProps {
  selectedDate: Date | null
  selectedTime: string | null
  onSelectTime: (time: string) => void
  availableSlots?: TimeSlot[]
}

// 기본 시간 슬롯 (09:00 ~ 18:00, 30분 단위)
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '12:00', available: false }, // 점심시간
  { time: '12:30', available: false },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true },
]

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  availableSlots = DEFAULT_TIME_SLOTS,
}: TimeSlotPickerProps) {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시간 선택</h3>
        <p className="text-sm text-gray-500 text-center py-8">
          먼저 날짜를 선택해주세요.
        </p>
      </div>
    )
  }

  const dateText = selectedDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">시간 선택</h3>
        <p className="text-sm text-teal-600 font-medium">{dateText}</p>
      </div>

      {/* Time Slots */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {availableSlots.map((slot) => {
          const isSelected = selectedTime === slot.time
          const isAvailable = slot.available

          return (
            <button
              key={slot.time}
              onClick={() => isAvailable && onSelectTime(slot.time)}
              disabled={!isAvailable}
              className={cn(
                'w-full px-4 py-3 rounded-lg text-sm font-medium transition-all',
                'flex items-center justify-between',
                // Default state
                'border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50',
                // Disabled state
                !isAvailable &&
                  'bg-gray-50 text-gray-400 cursor-not-allowed hover:border-gray-200 hover:bg-gray-50',
                // Selected state
                isSelected &&
                  'bg-teal-600 text-white border-teal-600 hover:bg-teal-700 hover:border-teal-700'
              )}
            >
              <span>{slot.time}</span>
              {isSelected && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">확인</span>
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      {selectedTime && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            선택된 시간: <span className="font-semibold text-gray-700">{selectedTime}</span>
          </p>
        </div>
      )}
    </div>
  )
}
