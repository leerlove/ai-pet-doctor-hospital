/**
 * BookingForm.tsx
 * 예약 정보 입력 폼 (고객정보, 펫 정보, 증상)
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Dog, FileText, Phone, Mail } from 'lucide-react'
import { Input, Button } from '@/shared/components'

// Validation Schema
const bookingFormSchema = z.object({
  customerName: z.string().min(2, '이름은 2자 이상 입력해주세요'),
  customerPhone: z
    .string()
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'),
  customerEmail: z.string().email('올바른 이메일 주소를 입력해주세요').optional().or(z.literal('')),
  petName: z.string().min(1, '반려동물 이름을 입력해주세요'),
  petSpecies: z.string().min(1, '동물 종류를 선택해주세요'),
  petBreed: z.string().optional(),
  petAge: z.string().optional(),
  symptoms: z.string().min(5, '증상을 5자 이상 입력해주세요'),
  isFirstVisit: z.boolean(),
  veterinarianId: z.string().min(1, '담당 수의사를 선택해주세요'),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

interface Veterinarian {
  id: string
  name: string
  title?: string
  specialization?: string
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void
  isLoading?: boolean
  initialData?: {
    customerName?: string
    customerPhone?: string
    customerEmail?: string
  }
  availableVeterinarians?: Veterinarian[]
}

export function BookingForm({ onSubmit, isLoading = false, initialData, availableVeterinarians = [] }: BookingFormProps) {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: initialData?.customerName || '',
      customerPhone: initialData?.customerPhone || '',
      customerEmail: initialData?.customerEmail || '',
      petName: '',
      petSpecies: '',
      petBreed: '',
      petAge: '',
      symptoms: '',
      isFirstVisit: true,
      veterinarianId: '',
    },
  })

  // initialData가 변경되면 폼 업데이트
  useEffect(() => {
    if (initialData) {
      if (initialData.customerName) form.setValue('customerName', initialData.customerName)
      if (initialData.customerPhone) form.setValue('customerPhone', initialData.customerPhone)
      if (initialData.customerEmail) form.setValue('customerEmail', initialData.customerEmail)
    }
  }, [initialData, form])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '')

    // 010/011/016/017/018/019 자동 하이픈 추가
    if (value.length <= 3) {
      // 3자리 이하는 그대로
    } else if (value.length <= 6) {
      // 010, 011 등 (3자리)
      value = `${value.slice(0, 3)}-${value.slice(3)}`
    } else if (value.length <= 10) {
      // 010-123-4567 (중간 3자리)
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
    } else {
      // 010-1234-5678 (중간 4자리)
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
    }

    form.setValue('customerPhone', value)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 보호자 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">보호자 정보</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register('customerName')}
              placeholder="홍길동"
              error={form.formState.errors.customerName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register('customerPhone')}
              placeholder="010-0000-0000"
              onChange={handlePhoneChange}
              leftIcon={<Phone className="w-4 h-4" />}
              error={form.formState.errors.customerPhone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 (선택)
            </label>
            <Input
              {...form.register('customerEmail')}
              type="email"
              placeholder="example@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={form.formState.errors.customerEmail?.message}
            />
          </div>
        </div>
      </div>

      {/* 반려동물 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dog className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">반려동물 정보</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register('petName')}
              placeholder="행복이"
              error={form.formState.errors.petName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              동물 종류 <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register('petSpecies')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">선택해주세요</option>
              <option value="dog">강아지</option>
              <option value="cat">고양이</option>
              <option value="rabbit">토끼</option>
              <option value="hamster">햄스터</option>
              <option value="bird">새</option>
              <option value="other">기타</option>
            </select>
            {form.formState.errors.petSpecies && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.petSpecies.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                품종 (선택)
              </label>
              <Input
                {...form.register('petBreed')}
                placeholder="말티즈"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                나이 (선택)
              </label>
              <Input
                {...form.register('petAge')}
                placeholder="3세"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 담당 수의사 선택 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">담당 수의사</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            담당 수의사 선택 <span className="text-red-500">*</span>
          </label>
          {availableVeterinarians.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              선택한 날짜/시간에 예약 가능한 수의사가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {availableVeterinarians.map((vet) => (
                <label
                  key={vet.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    form.watch('veterinarianId') === vet.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={vet.id}
                    {...form.register('veterinarianId')}
                    className="mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{vet.name}</span>
                      {vet.title && (
                        <span className="px-2 py-0.5 text-xs font-medium text-teal-700 bg-teal-100 rounded">
                          {vet.title}
                        </span>
                      )}
                    </div>
                    {vet.specialization && (
                      <p className="mt-1 text-sm text-gray-600">{vet.specialization}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
          {form.formState.errors.veterinarianId && (
            <p className="mt-2 text-sm text-red-600">
              {form.formState.errors.veterinarianId.message}
            </p>
          )}
        </div>
      </div>

      {/* 증상/방문 목적 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">증상 및 방문 목적</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              증상 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              {...form.register('symptoms')}
              rows={4}
              placeholder="반려동물의 증상이나 방문 목적을 자세히 적어주세요.&#10;예) 구토를 계속하고 식욕이 없어요."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
            {form.formState.errors.symptoms && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.symptoms.message}
              </p>
            )}
          </div>

          {/* 첫 방문 고객 체크박스 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFirstVisit"
              {...form.register('isFirstVisit')}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
            />
            <label htmlFor="isFirstVisit" className="text-sm font-medium text-gray-700 cursor-pointer">
              첫 방문 고객입니다
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Button
          type="submit"
          variant="primary"
          size="xl"
          className="w-full bg-teal-600 hover:bg-teal-700 focus-visible:ring-teal-600 text-lg font-semibold shadow-lg"
          isLoading={isLoading}
        >
          {isLoading ? '예약 중...' : '예약 완료하기'}
        </Button>
        <p className="text-center text-sm text-gray-500 mt-3">
          예약 버튼을 누르시면 예약이 접수됩니다.
        </p>
      </div>
    </form>
  )
}
