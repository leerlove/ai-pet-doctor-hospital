/**
 * BookingDetailModal.tsx
 * 예약 상세 정보 모달
 */

import { Modal, Badge, Button } from '@/shared/components'
import { Calendar, Clock, User, Dog, FileText, Phone, Mail } from 'lucide-react'
import type { Booking } from '@/shared/types/database.types'

interface BookingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  onEdit?: (booking: Booking) => void
  onCancel?: (booking: Booking) => void
  onApprove?: (booking: Booking) => void
  onReject?: (booking: Booking) => void
  onRevertToPending?: (booking: Booking) => void
  isAdmin?: boolean
}

export function BookingDetailModal({
  isOpen,
  onClose,
  booking,
  onEdit,
  onCancel,
  onApprove,
  onReject,
  onRevertToPending,
  isAdmin = false,
}: BookingDetailModalProps) {
  if (!booking) return null

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '대기중',
      confirmed: '예약확정',
      cancelled: '취소됨',
      completed: '진료완료',
      'no-show': '노쇼',
    }
    return statusMap[status] || status
  }

  const getStatusVariant = (status: string) => {
    const variantMap: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'default',
      'no-show': 'danger',
    }
    return variantMap[status] || 'default'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    })
  }

  const canEdit = booking.status === 'pending' || booking.status === 'confirmed'
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="예약 상세 정보">
      <div className="space-y-6">
        {/* 예약 번호 & 상태 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">예약번호</p>
            <p className="text-lg font-semibold text-gray-900">
              {booking.booking_number}
            </p>
          </div>
          <Badge variant={getStatusVariant(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
        </div>

        {/* 예약 일시 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">예약 날짜</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(booking.booking_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">예약 시간</p>
              <p className="text-sm font-medium text-gray-900">
                {booking.booking_time}
              </p>
            </div>
          </div>
        </div>

        {/* 보호자 정보 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">보호자 정보</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-16">이름</span>
              <span className="text-gray-900 font-medium">{booking.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-900">{booking.customer_phone}</span>
            </div>
            {booking.customer_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-900">{booking.customer_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* 반려동물 정보 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Dog className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">반려동물 정보</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-16">이름</span>
              <span className="text-gray-900 font-medium">{booking.pet_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-16">종류</span>
              <span className="text-gray-900">{booking.pet_species}</span>
            </div>
            {booking.pet_breed && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-16">품종</span>
                <span className="text-gray-900">{booking.pet_breed}</span>
              </div>
            )}
            {booking.pet_age && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-16">나이</span>
                <span className="text-gray-900">{booking.pet_age}</span>
              </div>
            )}
          </div>
        </div>

        {/* 증상 */}
        {booking.symptoms && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">증상 및 방문 목적</h4>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
              {booking.symptoms}
            </p>
          </div>
        )}

        {/* 관리자 메모 (관리자만 표시) */}
        {isAdmin && booking.admin_notes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">관리자 메모</h4>
            </div>
            <p className="text-sm text-gray-700 bg-yellow-50 rounded-lg p-3 whitespace-pre-wrap border border-yellow-200">
              {booking.admin_notes}
            </p>
          </div>
        )}

        {/* 출처 정보 */}
        {booking.source === 'ai_pet_doctor' && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="text-xs text-teal-700">
              ✨ AI펫닥터 앱에서 전달된 예약입니다
            </p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
          {/* 관리자 전용: 승인/거절 버튼 (pending 상태일 때만) */}
          {isAdmin && booking.status === 'pending' && (
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => onApprove?.(booking)}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                ✓ 예약 승인
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => onReject?.(booking)}
                className="flex-1"
              >
                ✗ 예약 거절
              </Button>
            </div>
          )}

          {/* 관리자 전용: 승인 완료 건을 대기로 전환 */}
          {isAdmin && booking.status === 'confirmed' && onRevertToPending && (
            <Button
              variant="outline"
              size="md"
              onClick={() => onRevertToPending(booking)}
              className="w-full text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              ← 승인 대기로 전환
            </Button>
          )}

          {/* 일반 사용자 또는 관리자의 기타 액션 */}
          {(!isAdmin || booking.status !== 'pending') && (
            <div className="flex gap-3">
              {canEdit && onEdit && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => onEdit(booking)}
                  className="flex-1"
                >
                  예약 수정
                </Button>
              )}
              {canCancel && onCancel && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => onCancel(booking)}
                  className="flex-1"
                >
                  예약 취소
                </Button>
              )}
              {!canEdit && !canCancel && !isAdmin && (
                <Button variant="outline" size="md" onClick={onClose} className="flex-1">
                  닫기
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
