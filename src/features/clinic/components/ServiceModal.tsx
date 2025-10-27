/**
 * ServiceModal.tsx - 서비스 추가/수정 모달
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Stethoscope } from 'lucide-react'
import { Modal, Button, Input } from '@/shared/components'
import { showToast } from '@/shared/components/Toast'
import { createService, updateService } from '@/shared/api/services.api'
import type { Service } from '@/shared/types/database.types'

const serviceSchema = z.object({
  name: z.string().min(1, '서비스명을 입력해주세요'),
  description: z.string().optional(),
  duration_minutes: z.number().min(15, '최소 15분 이상').max(180, '최대 180분'),
  price: z.number().min(0, '가격은 0 이상이어야 합니다'),
  is_active: z.boolean(),
})

type ServiceForm = z.infer<typeof serviceSchema>

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clinicId: string
  editingService?: Service | null
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 180]

export function ServiceModal({
  isOpen,
  onClose,
  onSuccess,
  clinicId,
  editingService,
}: ServiceModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const isEditMode = !!editingService

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_minutes: 30,
      price: 0,
      is_active: true,
    },
  })

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (editingService) {
      form.reset({
        name: editingService.name,
        description: editingService.description || '',
        duration_minutes: editingService.duration_minutes,
        price: editingService.price || 0,
        is_active: editingService.is_active || true,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        duration_minutes: 30,
        price: 0,
        is_active: true,
      })
    }
  }, [editingService, form])

  const handleSubmit = async (data: ServiceForm) => {
    try {
      setIsSaving(true)

      if (isEditMode && editingService) {
        // 수정
        await updateService(editingService.id, {
          name: data.name,
          description: data.description || null,
          duration_minutes: data.duration_minutes,
          price: data.price,
          is_active: data.is_active,
          updated_at: new Date().toISOString(),
        })

        showToast({
          title: '서비스 수정 완료',
          description: '서비스가 성공적으로 수정되었습니다',
          variant: 'success',
        })
      } else {
        // 추가
        await createService({
          clinic_id: clinicId,
          name: data.name,
          description: data.description || null,
          duration_minutes: data.duration_minutes,
          price: data.price,
          is_active: data.is_active,
        })

        showToast({
          title: '서비스 추가 완료',
          description: '서비스가 성공적으로 추가되었습니다',
          variant: 'success',
        })
      }

      form.reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('서비스 저장 실패:', error)
      showToast({
        title: '저장 실패',
        description: '서비스 저장 중 오류가 발생했습니다',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? '서비스 수정' : '서비스 추가'}
            </h2>
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
          {/* 서비스명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              서비스명 <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register('name')}
              placeholder="예: 일반 진료, 예방접종, 건강검진"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 (선택)
            </label>
            <textarea
              {...form.register('description')}
              rows={3}
              placeholder="서비스에 대한 설명을 입력해주세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>

          {/* 소요 시간 & 가격 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 소요 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소요 시간 (분) <span className="text-red-500">*</span>
              </label>
              <select
                {...form.register('duration_minutes', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {DURATION_OPTIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}분
                  </option>
                ))}
              </select>
              {form.formState.errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.duration_minutes.message}
                </p>
              )}
            </div>

            {/* 가격 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 (원) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="0"
                error={form.formState.errors.price?.message}
              />
            </div>
          </div>

          {/* 활성화 상태 */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...form.register('is_active')}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">
                서비스 활성화 (예약 시 선택 가능)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
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
              {isSaving ? '저장 중...' : isEditMode ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
