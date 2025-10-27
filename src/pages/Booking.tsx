/**
 * Booking.tsx - 예약 생성 페이지
 * 3단계 예약 프로세스: 날짜 선택 → 시간 선택 → 정보 입력
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { BookingCalendar, TimeSlotPicker, BookingForm } from '@/features/booking/components'
import type { BookingFormData } from '@/features/booking/components'
import { createBooking } from '@/shared/api/bookings.api'
import { getAllClinics } from '@/shared/api/clinics.api'
import { getAllServices } from '@/shared/api/services.api'
import { getAvailableVeterinarians, type Veterinarian } from '@/shared/api/veterinarians.api'
import { getUserProfile } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { showToast } from '@/shared/components/Toast'
import { PageHeader } from '@/shared/components'
import { formatDateToYYYYMMDD } from '@/shared/utils/date'
import type { Database } from '@/shared/types/database.types'

type DBUser = Database['public']['Tables']['users']['Row']

type BookingStep = 'date' | 'time' | 'info'

export default function Booking() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // 로그인 체크: 비로그인 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      showToast({
        title: '로그인이 필요합니다',
        description: '예약하려면 먼저 로그인해주세요.',
        variant: 'error',
      })
      navigate('/login')
    }
  }, [user, navigate])

  const [currentStep, setCurrentStep] = useState<BookingStep>('date')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clinicId, setClinicId] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<DBUser | null>(null)
  const [availableVeterinarians, setAvailableVeterinarians] = useState<Veterinarian[]>([])

  // 클리닉과 서비스 ID 조회
  useEffect(() => {
    async function loadClinicAndService() {
      try {
        console.log('🏥 클리닉/서비스 조회 시작...')
        console.log('현재 인증 상태:', user ? '로그인' : '비로그인')

        const [clinics, services] = await Promise.all([
          getAllClinics(),
          getAllServices(),
        ])

        console.log('✅ 조회된 클리닉:', clinics)
        console.log('✅ 조회된 서비스:', services)

        if (clinics && clinics.length > 0) {
          setClinicId(clinics[0].id)
          console.log('✅ 선택된 클리닉 ID:', clinics[0].id, '-', clinics[0].name)
        } else {
          console.warn('⚠️ 조회된 클리닉이 없습니다!')
          showToast({
            title: '클리닉 정보를 불러올 수 없습니다',
            description: '잠시 후 다시 시도해주세요.',
            variant: 'error',
          })
        }

        if (services && services.length > 0) {
          setServiceId(services[0].id)
          console.log('✅ 선택된 서비스 ID:', services[0].id, '-', services[0].name)
        } else {
          console.warn('⚠️ 조회된 서비스가 없습니다!')
          showToast({
            title: '서비스 정보를 불러올 수 없습니다',
            description: '잠시 후 다시 시도해주세요.',
            variant: 'error',
          })
        }
      } catch (error: any) {
        console.error('❌ 클리닉/서비스 조회 실패')
        console.error('에러 객체:', error)
        console.error('에러 메시지:', error?.message)
        console.error('에러 코드:', error?.code)
        console.error('에러 상세:', error?.details)

        showToast({
          title: '데이터 조회 실패',
          description: error?.message || '클리닉 정보를 불러올 수 없습니다.',
          variant: 'error',
        })
      }
    }

    loadClinicAndService()
  }, [])

  // 사용자 프로필 조회 (자동 입력용)
  useEffect(() => {
    async function loadUserProfile() {
      if (user?.id) {
        try {
          const profile = await getUserProfile(user.id)
          setUserProfile(profile)
          console.log('✅ 사용자 프로필 조회 성공:', profile)
        } catch (error) {
          console.error('❌ 사용자 프로필 조회 실패:', error)
          // 프로필 조회 실패는 치명적이지 않으므로 조용히 처리
        }
      }
    }

    loadUserProfile()
  }, [user])

  // 날짜와 시간이 선택되면 예약 가능한 수의사 조회
  useEffect(() => {
    async function loadAvailableVeterinarians() {
      if (!clinicId || !selectedDate || !selectedTime) {
        setAvailableVeterinarians([])
        return
      }

      try {
        const formattedDate = formatDateToYYYYMMDD(selectedDate)
        const vets = await getAvailableVeterinarians(clinicId, formattedDate, selectedTime)
        setAvailableVeterinarians(vets)
        console.log('✅ 예약 가능한 수의사:', vets)
      } catch (error) {
        console.error('❌ 수의사 조회 실패:', error)
        setAvailableVeterinarians([])
      }
    }

    loadAvailableVeterinarians()
  }, [clinicId, selectedDate, selectedTime])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setCurrentStep('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setCurrentStep('info')
  }

  const handleFormSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      showToast({
        title: '날짜와 시간을 선택해주세요',
        variant: 'error',
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (!clinicId || !serviceId) {
        showToast({
          title: '시스템 오류',
          description: '클리닉 정보를 불러올 수 없습니다.',
          variant: 'error',
        })
        return
      }

      // 로그인 필수 체크
      if (!user) {
        showToast({
          title: '로그인이 필요합니다',
          description: '예약하려면 먼저 로그인해주세요.',
          variant: 'error',
        })
        navigate('/login')
        return
      }

      // 예약 데이터 생성 (로그인 사용자만)
      const bookingData = {
        clinic_id: clinicId,
        service_id: serviceId,
        user_id: user.id, // 로그인한 사용자 ID
        veterinarian_id: data.veterinarianId,
        booking_date: formatDateToYYYYMMDD(selectedDate),
        booking_time: selectedTime,
        status: 'pending' as const,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        pet_name: data.petName,
        pet_species: data.petSpecies,
        pet_breed: data.petBreed || null,
        pet_age: data.petAge ? parseInt(data.petAge) : null,
        symptoms: data.symptoms,
        is_first_visit: data.isFirstVisit,
        source: 'direct' as const,
      }

      console.log('✅ 로그인 사용자:', user.email)
      console.log('✅ user_id:', bookingData.user_id)

      console.log('전송할 예약 데이터:', bookingData)

      const booking = await createBooking(bookingData)

      console.log('예약 생성 성공:', booking)

      showToast({
        title: '예약이 완료되었습니다!',
        description: `예약번호: ${booking.booking_number}`,
        variant: 'success',
      })

      // 예약 목록 페이지로 이동
      navigate('/my-bookings')
    } catch (error: any) {
      console.error('===== 예약 생성 실패 =====')
      console.error('전체 에러 객체:', error)
      console.error('에러 메시지:', error?.message)
      console.error('에러 코드:', error?.code)
      console.error('에러 상세:', error?.details)
      console.error('에러 힌트:', error?.hint)
      console.error('Supabase 에러:', error?.error)
      console.error('=========================')

      showToast({
        title: '예약에 실패했습니다',
        description: error?.message || error?.error?.message || '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep === 'time') {
      setCurrentStep('date')
      setSelectedTime(null)
    } else if (currentStep === 'info') {
      setCurrentStep('time')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title="예약하기" />

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Step 1: Date */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'date'
                    ? 'bg-teal-600 text-white'
                    : selectedDate
                    ? 'bg-teal-100 text-teal-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <span
                className={`hidden md:block text-sm font-medium ${
                  currentStep === 'date' || selectedDate
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                날짜 선택
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-200" />

            {/* Step 2: Time */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'time'
                    ? 'bg-teal-600 text-white'
                    : selectedTime
                    ? 'bg-teal-100 text-teal-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Clock className="w-5 h-5" />
              </div>
              <span
                className={`hidden md:block text-sm font-medium ${
                  currentStep === 'time' || selectedTime
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                시간 선택
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-200" />

            {/* Step 3: Info */}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'info'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <span
                className={`hidden md:block text-sm font-medium ${
                  currentStep === 'info' ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                정보 입력
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button (for time and info steps) */}
        {(currentStep === 'time' || currentStep === 'info') && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            이전 단계로
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                예약 정보
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">병원</p>
                  <p className="text-sm font-medium text-gray-900">
                    행복동물병원
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-1">날짜</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDate
                      ? selectedDate.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })
                      : '선택되지 않음'}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-1">시간</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTime || '선택되지 않음'}
                  </p>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-6 p-3 bg-teal-50 rounded-lg">
                    <p className="text-xs text-teal-700">
                      ✓ 날짜와 시간이 선택되었습니다.
                      <br />
                      정보를 입력하고 예약을 완료하세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Step Content */}
          <div className="lg:col-span-2">
            {currentStep === 'date' && (
              <BookingCalendar
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                minDate={new Date()}
              />
            )}

            {currentStep === 'time' && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            )}

            {currentStep === 'info' && (
              <BookingForm
                onSubmit={handleFormSubmit}
                isLoading={isSubmitting}
                initialData={
                  userProfile
                    ? {
                        customerName: userProfile.full_name || '',
                        customerPhone: userProfile.phone || '',
                        customerEmail: userProfile.email || '',
                      }
                    : undefined
                }
                availableVeterinarians={availableVeterinarians}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
