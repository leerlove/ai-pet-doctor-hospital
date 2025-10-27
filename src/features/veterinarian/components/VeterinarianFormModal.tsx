/**
 * VeterinarianFormModal - 수의사 추가/수정 모달
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { showToast } from '@/shared/components/Toast'
import type { Veterinarian } from '@/shared/api/veterinarians.api'

const veterinarianSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해주세요'),
  title: z.string().optional(),
  specialization: z.string().optional(),
  license_number: z.string().optional(),
  email: z.string().email('올바른 이메일 형식이 아닙니다').optional().or(z.literal('')),
  phone: z.string().optional(),
  photo_url: z.string().url('올바른 URL 형식이 아닙니다').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

type VeterinarianFormData = z.infer<typeof veterinarianSchema>

interface VeterinarianFormModalProps {
  isOpen: boolean
  onClose: () => void
  veterinarian?: Veterinarian | null
  onSave: (data: VeterinarianFormData) => Promise<void>
}

export function VeterinarianFormModal({
  isOpen,
  onClose,
  veterinarian,
  onSave,
}: VeterinarianFormModalProps) {
  const isEdit = !!veterinarian

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VeterinarianFormData>({
    resolver: zodResolver(veterinarianSchema),
    defaultValues: {
      name: '',
      title: '',
      specialization: '',
      license_number: '',
      email: '',
      phone: '',
      photo_url: '',
      is_active: true,
    },
  })

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (veterinarian) {
      reset({
        name: veterinarian.name,
        title: veterinarian.title || '',
        specialization: veterinarian.specialization || '',
        license_number: veterinarian.license_number || '',
        email: veterinarian.email || '',
        phone: veterinarian.phone || '',
        photo_url: veterinarian.photo_url || '',
        is_active: veterinarian.is_active ?? true,
      })
    } else {
      reset({
        name: '',
        title: '',
        specialization: '',
        license_number: '',
        email: '',
        phone: '',
        photo_url: '',
        is_active: true,
      })
    }
  }, [veterinarian, reset])

  const onSubmit = async (data: VeterinarianFormData) => {
    try {
      await onSave(data)
      showToast({
        title: isEdit ? '수정 완료' : '등록 완료',
        description: `${data.name} 수의사가 ${isEdit ? '수정' : '등록'}되었습니다.`,
        variant: 'success',
      })
      onClose()
    } catch (error: any) {
      console.error('저장 실패:', error)
      showToast({
        title: '저장 실패',
        description: error.message,
        variant: 'error',
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? '수의사 정보 수정' : '수의사 등록'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">기본 정보</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="이름 *"
              {...register('name')}
              error={errors.name?.message}
              placeholder="홍길동"
            />

            <Input
              label="직급"
              {...register('title')}
              error={errors.title?.message}
              placeholder="원장, 수의사, 전문의"
            />
          </div>

          <Input
            label="전문 분야"
            {...register('specialization')}
            error={errors.specialization?.message}
            placeholder="일반진료, 외과, 내과"
          />

          <Input
            label="면허 번호"
            {...register('license_number')}
            error={errors.license_number?.message}
            placeholder="123456"
          />
        </div>

        {/* 연락처 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">연락처</h3>

          <Input
            label="이메일"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="doctor@example.com"
          />

          <Input
            label="전화번호"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="010-1234-5678"
          />
        </div>

        {/* 프로필 사진 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">프로필 사진</h3>

          <Input
            label="사진 URL"
            {...register('photo_url')}
            error={errors.photo_url?.message}
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs text-gray-500">
            프로필 사진 URL을 입력하세요 (선택사항)
          </p>
        </div>

        {/* 활성 상태 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...register('is_active')}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            활성 수의사 (체크 해제 시 비활성화)
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEdit ? '수정' : '등록'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
