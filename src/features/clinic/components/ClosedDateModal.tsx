/**
 * ClosedDateModal.tsx - 휴무일 추가 모달
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar } from 'lucide-react'
import { Modal, Button, Input } from '@/shared/components'
import { showToast } from '@/shared/components/Toast'
import { createClosedDate } from '@/shared/api/closed-dates.api'

const closedDateSchema = z.object({
  date: z.string().min(1, '날짜를 선택해주세요'),
  reason: z.string().min(1, '휴무 사유를 입력해주세요'),
})

type ClosedDateForm = z.infer<typeof closedDateSchema>

interface ClosedDateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clinicId: string
}

export function ClosedDateModal({
  isOpen,
  onClose,
  onSuccess,
  clinicId,
}: ClosedDateModalProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ClosedDateForm>({
    resolver: zodResolver(closedDateSchema),
    defaultValues: {
      date: '',
      reason: '',
    },
  })

  const handleSubmit = async (data: ClosedDateForm) => {
    try {
      setIsSaving(true)

      // 날짜 검증: 과거 날짜 체크
      const selectedDate = new Date(data.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        showToast({
          title: '입력 오류',
          description: '과거 날짜는 선택할 수 없습니다',
          variant: 'error',
        })
        return
      }

      await createClosedDate({
        clinic_id: clinicId,
        date: data.date,
        reason: data.reason,
      })

      showToast({
        title: '휴무일 추가 완료',
        description: '휴무일이 성공적으로 추가되었습니다',
        variant: 'success',
      })

      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('휴무일 추가 실패:', error)
      showToast({
        title: '추가 실패',
        description: '휴무일 추가 중 오류가 발생했습니다',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">휴무일 추가</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-4">
          {/* 날짜 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴무 날짜 <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              {...form.register('date')}
              error={form.formState.errors.date?.message}
            />
          </div>

          {/* 사유 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴무 사유 <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register('reason')}
              placeholder="예: 신정, 설날 연휴, 내부 행사 등"
              error={form.formState.errors.reason?.message}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? '추가 중...' : '추가'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
