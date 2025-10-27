/**
 * BookingEditModal.tsx
 * 예약 일정 수정 모달 (날짜/시간만 수정)
 */

import { useState } from 'react'
import { Modal, Button } from '@/shared/components'
import { Calendar, Clock } from 'lucide-react'
import { BookingCalendar, TimeSlotPicker } from '.'
import { formatDateToYYYYMMDD } from '@/shared/utils/date'
import type { Booking } from '@/shared/types/database.types'

interface BookingEditModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  onSave: (bookingId: string, newDate: string, newTime: string) => Promise<void>
}

export function BookingEditModal({
  isOpen,
  onClose,
  booking,
  onSave,
}: BookingEditModalProps) {
  const [step, setStep] = useState<'date' | 'time'>('date')
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    booking ? new Date(booking.booking_date) : null
  )
  const [selectedTime, setSelectedTime] = useState<string | null>(booking?.booking_time || null)
  const [isSaving, setIsSaving] = useState(false)

  if (!booking) return null

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setStep('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) return

    try {
      setIsSaving(true)
      const formattedDate = formatDateToYYYYMMDD(selectedDate)
      await onSave(booking.id, formattedDate, selectedTime)
      onClose()
    } catch (error) {
      console.error('예약 수정 실패:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (step === 'time') {
      setStep('date')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 일정 수정"
      size="lg"
    >
      <div className="space-y-6">
        {/* 현재 예약 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">현재 예약 일정</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {formatDate(new Date(booking.booking_date))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">{booking.booking_time}</span>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === 'date'
                  ? 'bg-teal-600 text-white'
                  : selectedDate
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              1
            </div>
            <span className={`text-sm font-medium ${step === 'date' ? 'text-gray-900' : 'text-gray-500'}`}>
              날짜 선택
            </span>
          </div>

          <div className="w-8 h-0.5 bg-gray-200" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === 'time'
                  ? 'bg-teal-600 text-white'
                  : selectedTime
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              2
            </div>
            <span className={`text-sm font-medium ${step === 'time' ? 'text-gray-900' : 'text-gray-500'}`}>
              시간 선택
            </span>
          </div>
        </div>

        {/* 새 일정 선택 */}
        <div>
          {step === 'date' && (
            <BookingCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              minDate={new Date()}
            />
          )}

          {step === 'time' && (
            <div>
              <button
                onClick={handleBack}
                className="mb-4 text-sm text-gray-600 hover:text-gray-900"
              >
                ← 날짜 다시 선택
              </button>
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            </div>
          )}
        </div>

        {/* 선택된 새 일정 표시 */}
        {selectedDate && selectedTime && (
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <p className="text-sm text-teal-700 mb-2">변경할 예약 일정</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-900">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-900">{selectedTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* 수정 안내 */}
        {booking.status === 'confirmed' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ 승인된 예약을 수정하면 다시 승인 대기 상태로 변경됩니다.
            </p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            isLoading={isSaving}
            disabled={!selectedDate || !selectedTime}
          >
            {isSaving ? '저장 중...' : '예약 수정'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
