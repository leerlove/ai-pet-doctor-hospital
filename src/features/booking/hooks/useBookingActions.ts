/**
 * useBookingActions.ts
 * 예약 수정/취소 액션 훅
 */

import { useState } from 'react'
import { updateBooking, deleteBooking } from '@/shared/api/bookings.api'
import { showToast } from '@/shared/components/Toast'

export function useBookingActions() {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 예약 취소
   */
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      await updateBooking(bookingId, {
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })

      showToast({
        title: '예약이 취소되었습니다',
        variant: 'success',
      })

      return true
    } catch (error) {
      console.error('예약 취소 실패:', error)
      showToast({
        title: '예약 취소에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 예약 삭제 (완전 삭제)
   */
  const removeBooking = async (bookingId: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      await deleteBooking(bookingId)

      showToast({
        title: '예약이 삭제되었습니다',
        variant: 'success',
      })

      return true
    } catch (error) {
      console.error('예약 삭제 실패:', error)
      showToast({
        title: '예약 삭제에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 예약 상태 변경
   */
  const updateBookingStatus = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      await updateBooking(bookingId, {
        status,
        updated_at: new Date().toISOString(),
      })

      const statusText: Record<string, string> = {
        pending: '대기중',
        confirmed: '예약확정',
        cancelled: '취소됨',
        completed: '진료완료',
        'no-show': '노쇼',
      }

      showToast({
        title: `예약 상태가 "${statusText[status]}"(으)로 변경되었습니다`,
        variant: 'success',
      })

      return true
    } catch (error) {
      console.error('예약 상태 변경 실패:', error)
      showToast({
        title: '상태 변경에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 예약 날짜/시간 변경
   * 승인된(confirmed) 예약을 수정하면 대기(pending) 상태로 변경
   */
  const rescheduleBooking = async (
    bookingId: string,
    newDate: string,
    newTime: string,
    currentStatus?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      // 승인된 예약을 수정하면 대기 상태로 변경
      const shouldRevertToPending = currentStatus === 'confirmed'

      await updateBooking(bookingId, {
        booking_date: newDate,
        booking_time: newTime,
        status: shouldRevertToPending ? 'pending' : undefined,
        updated_at: new Date().toISOString(),
      })

      showToast({
        title: '예약 일정이 변경되었습니다',
        description: shouldRevertToPending
          ? '승인된 예약이 수정되어 다시 승인 대기 상태가 되었습니다.'
          : `${newDate} ${newTime}`,
        variant: 'success',
      })

      return true
    } catch (error) {
      console.error('예약 일정 변경 실패:', error)
      showToast({
        title: '일정 변경에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 관리자 메모 추가/수정
   */
  const updateAdminNotes = async (
    bookingId: string,
    notes: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      await updateBooking(bookingId, {
        admin_notes: notes,
        updated_at: new Date().toISOString(),
      })

      showToast({
        title: '관리자 메모가 저장되었습니다',
        variant: 'success',
      })

      return true
    } catch (error) {
      console.error('메모 저장 실패:', error)
      showToast({
        title: '메모 저장에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    cancelBooking,
    removeBooking,
    updateBookingStatus,
    rescheduleBooking,
    updateAdminNotes,
  }
}
