/**
 * Settings.tsx - 클리닉 설정 페이지 (관리자)
 * - 클리닉 기본 정보
 * - 영업 시간
 * - 휴무일 관리
 * - 서비스 관리
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Building2,
  Clock,
  Calendar,
  Stethoscope,
  Save,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { Button, Input, Card, CardBody, Badge } from '@/shared/components'
import { getFirstClinic, updateClinic } from '@/shared/api/clinics.api'
import { getBusinessHours } from '@/shared/api/business-hours.api'
import { getAllClosedDates, deleteClosedDate } from '@/shared/api/closed-dates.api'
import { getAllServices, deleteService } from '@/shared/api/services.api'
import { BusinessHoursEditor, ClosedDateModal, ServiceModal } from '@/features/clinic/components'
import { showToast } from '@/shared/components/Toast'
import type { Clinic, BusinessHour, ClosedDate, Service } from '@/shared/types/database.types'

// Validation Schema
const clinicInfoSchema = z.object({
  name: z.string().min(2, '병원명은 2자 이상 입력해주세요'),
  description: z.string().optional(),
  address: z.string().min(5, '주소를 입력해주세요'),
  phone_1: z.string().regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  phone_2: z.string().optional().or(z.literal('')),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
})

type ClinicInfoForm = z.infer<typeof clinicInfoSchema>

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'info' | 'hours' | 'holidays' | 'services'>('info')
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([])
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isClosedDateModalOpen, setIsClosedDateModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const clinicForm = useForm<ClinicInfoForm>({
    resolver: zodResolver(clinicInfoSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone_1: '',
      phone_2: '',
      email: '',
    },
  })

  useEffect(() => {
    loadClinicData()
  }, [])

  const loadClinicData = async () => {
    try {
      setIsLoading(true)
      // 첫 번째 클리닉 가져오기 (단일 클리닉 운영)
      const data = await getFirstClinic()

      if (!data) {
        throw new Error('클리닉 정보를 찾을 수 없습니다')
      }

      setClinic(data)

      // 폼 데이터 설정
      clinicForm.reset({
        name: data.name,
        description: data.description || '',
        address: data.address || '',
        phone_1: data.phone_1 || '',
        phone_2: data.phone_2 || '',
        email: data.email || '',
      })

      // 영업시간 로드
      const hours = await getBusinessHours(data.id)
      setBusinessHours(hours)

      // 휴무일 로드
      const dates = await getAllClosedDates(data.id)
      setClosedDates(dates)

      // 서비스 로드
      const servicesData = await getAllServices()
      setServices(servicesData)
    } catch (error) {
      console.error('클리닉 정보 로드 실패:', error)
      showToast({
        title: '클리닉 정보를 불러오는데 실패했습니다',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveClinicInfo = async (data: ClinicInfoForm) => {
    if (!clinic) return

    try {
      setIsSaving(true)

      await updateClinic(clinic.id, {
        name: data.name,
        description: data.description,
        address: data.address,
        phone_1: data.phone_1,
        phone_2: data.phone_2 || null,
        email: data.email,
        updated_at: new Date().toISOString(),
      })

      showToast({
        title: '클리닉 정보가 저장되었습니다',
        variant: 'success',
      })

      loadClinicData()
    } catch (error) {
      console.error('클리닉 정보 저장 실패:', error)
      showToast({
        title: '저장에 실패했습니다',
        description: '잠시 후 다시 시도해주세요.',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClosedDate = async (id: string, date: string) => {
    if (!confirm(`${date} 휴무일을 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteClosedDate(id)
      showToast({
        title: '휴무일 삭제 완료',
        description: '휴무일이 성공적으로 삭제되었습니다',
        variant: 'success',
      })
      loadClinicData()
    } catch (error) {
      console.error('휴무일 삭제 실패:', error)
      showToast({
        title: '삭제 실패',
        description: '휴무일 삭제 중 오류가 발생했습니다',
        variant: 'error',
      })
    }
  }

  const handleAddService = () => {
    setEditingService(null)
    setIsServiceModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsServiceModalOpen(true)
  }

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`"${name}" 서비스를 삭제하시겠습니까?`)) {
      return
    }

    try {
      await deleteService(id)
      showToast({
        title: '서비스 삭제 완료',
        description: '서비스가 성공적으로 삭제되었습니다',
        variant: 'success',
      })
      loadClinicData()
    } catch (error) {
      console.error('서비스 삭제 실패:', error)
      showToast({
        title: '삭제 실패',
        description: '서비스 삭제 중 오류가 발생했습니다',
        variant: 'error',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">클리닉 설정</h1>
              <p className="text-sm text-gray-500 mt-1">
                병원 정보 및 운영 설정을 관리합니다
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>기본 정보</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('hours')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'hours'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>영업 시간</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('holidays')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'holidays'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>휴무일 관리</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'services'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                <span>서비스 관리</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 기본 정보 탭 */}
        {activeTab === 'info' && (
          <Card>
            <CardBody>
              <form onSubmit={clinicForm.handleSubmit(handleSaveClinicInfo)} className="space-y-6">
                {/* 병원명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    병원명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...clinicForm.register('name')}
                    placeholder="행복동물병원"
                    error={clinicForm.formState.errors.name?.message}
                  />
                </div>

                {/* 병원 소개 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    병원 소개
                  </label>
                  <textarea
                    {...clinicForm.register('description')}
                    rows={4}
                    placeholder="우리 병원을 소개하는 문구를 입력해주세요."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  />
                </div>

                {/* 주소 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...clinicForm.register('address')}
                    placeholder="서울시 강남구 테헤란로 123"
                    leftIcon={<MapPin className="w-4 h-4" />}
                    error={clinicForm.formState.errors.address?.message}
                  />
                </div>

                {/* 전화번호 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      대표 전화번호 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...clinicForm.register('phone_1')}
                      placeholder="02-1234-5678"
                      leftIcon={<Phone className="w-4 h-4" />}
                      error={clinicForm.formState.errors.phone_1?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      보조 전화번호 (선택)
                    </label>
                    <Input
                      {...clinicForm.register('phone_2')}
                      placeholder="010-1234-5678"
                      leftIcon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...clinicForm.register('email')}
                    type="email"
                    placeholder="info@happyvet.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={clinicForm.formState.errors.email?.message}
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? '저장 중...' : '저장하기'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* 영업 시간 탭 */}
        {activeTab === 'hours' && (
          <Card>
            <CardBody>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">영업 시간 설정</h3>
                <p className="text-sm text-gray-500">
                  요일별 영업 시간과 휴게 시간을 설정합니다.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">로딩 중...</div>
              ) : businessHours.length > 0 ? (
                <BusinessHoursEditor
                  businessHours={businessHours}
                  onUpdate={loadClinicData}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  영업시간 정보가 없습니다.
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* 휴무일 관리 탭 */}
        {activeTab === 'holidays' && (
          <Card>
            <CardBody>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">휴무일 관리</h3>
                <p className="text-sm text-gray-500">특별 휴무일을 등록하고 관리합니다.</p>
              </div>

              <div className="mb-6">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsClosedDateModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  휴무일 추가
                </Button>
              </div>

              {closedDates.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">등록된 휴무일이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {closedDates.map((closedDate) => (
                    <div
                      key={closedDate.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-medium text-gray-900">{closedDate.date}</p>
                          <p className="text-sm text-gray-500">{closedDate.reason}</p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClosedDate(closedDate.id, closedDate.date)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* 휴무일 추가 모달 */}
        {clinic && (
          <ClosedDateModal
            isOpen={isClosedDateModalOpen}
            onClose={() => setIsClosedDateModalOpen(false)}
            onSuccess={loadClinicData}
            clinicId={clinic.id}
          />
        )}

        {/* 서비스 관리 탭 */}
        {activeTab === 'services' && (
          <Card>
            <CardBody>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">서비스 관리</h3>
                <p className="text-sm text-gray-500">
                  제공하는 진료 서비스를 등록하고 관리합니다.
                </p>
              </div>

              <div className="mb-6">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddService}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  서비스 추가
                </Button>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">등록된 서비스가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{service.name}</p>
                            {service.is_active ? (
                              <Badge variant="success">운영중</Badge>
                            ) : (
                              <Badge variant="default">중지</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            소요시간: {service.duration_minutes}분 · 가격: {(service.price || 0).toLocaleString()}원
                          </p>
                          {service.description && (
                            <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteService(service.id, service.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* 서비스 추가/수정 모달 */}
        {clinic && (
          <ServiceModal
            isOpen={isServiceModalOpen}
            onClose={() => {
              setIsServiceModalOpen(false)
              setEditingService(null)
            }}
            onSuccess={loadClinicData}
            clinicId={clinic.id}
            editingService={editingService}
          />
        )}
      </main>
    </div>
  )
}
