/**
 * Veterinarians (Admin) - 수의사 관리 페이지
 * - 수의사 목록 조회
 * - 수의사 추가/수정/삭제
 * - 근무 시간 설정
 * - 수의사별 예약 통계
 */

import { useState, useEffect } from 'react'
import {
  User,
  Plus,
  Edit,
  Trash2,
  Clock,
  BarChart3,
  Mail,
  Phone,
  Award,
} from 'lucide-react'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { Badge } from '@/shared/components/Badge'
import { showToast } from '@/shared/components/Toast'
import {
  getAllVeterinarians,
  createVeterinarian,
  updateVeterinarian,
  deleteVeterinarian,
  type Veterinarian,
  type VeterinarianInsert,
} from '@/shared/api/veterinarians.api'
import { VeterinarianFormModal } from '@/features/veterinarian/components/VeterinarianFormModal'
import { WorkingHoursModal } from '@/features/veterinarian/components/WorkingHoursModal'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Veterinarians() {
  const { profile } = useAuth()
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isWorkingHoursModalOpen, setIsWorkingHoursModalOpen] = useState(false)

  // 수의사 목록 조회
  useEffect(() => {
    loadVeterinarians()
  }, [])

  async function loadVeterinarians() {
    console.log('🚀 [PAGE] loadVeterinarians 호출됨')

    try {
      setIsLoading(true)
      console.log('⏳ [PAGE] isLoading = true 설정')
      console.log('📞 [PAGE] getAllVeterinarians() 호출 전...')

      const data = await getAllVeterinarians()

      console.log('✅ [PAGE] getAllVeterinarians() 응답 받음:', {
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: data?.length,
        firstItem: data?.[0]
      })

      setVeterinarians(data)
      console.log('💾 [PAGE] setVeterinarians 완료')

    } catch (error: any) {
      console.error('❌ [PAGE] 수의사 조회 실패:', error)
      console.error('🔍 [PAGE] 에러 상세:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      })

      showToast({
        title: '수의사 조회 실패',
        description: error.message || '알 수 없는 오류가 발생했습니다.',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
      console.log('🏁 [PAGE] isLoading = false 설정, loadVeterinarians 완료')
    }
  }

  // 수의사 추가/수정
  async function handleSave(data: VeterinarianInsert) {
    try {
      if (selectedVet) {
        // 수정
        await updateVeterinarian(selectedVet.id, data)
      } else {
        // 추가 (clinic_id는 현재 사용자의 clinic에서 가져와야 함)
        // TODO: 실제로는 사용자의 clinic_id를 가져와서 설정해야 함
        await createVeterinarian({
          ...data,
          clinic_id: null, // 임시로 null
        })
      }
      loadVeterinarians()
    } catch (error) {
      throw error
    }
  }

  // 수의사 삭제
  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 수의사를 삭제하시겠습니까?`)) return

    try {
      await deleteVeterinarian(id)
      showToast({
        title: '삭제 완료',
        description: `${name} 수의사가 삭제되었습니다.`,
        variant: 'success',
      })
      loadVeterinarians()
    } catch (error: any) {
      console.error('수의사 삭제 실패:', error)
      showToast({
        title: '삭제 실패',
        description: error.message,
        variant: 'error',
      })
    }
  }

  // 수의사 추가 버튼
  function handleAddClick() {
    setSelectedVet(null)
    setIsFormModalOpen(true)
  }

  // 수의사 수정 버튼
  function handleEditClick(vet: Veterinarian) {
    setSelectedVet(vet)
    setIsFormModalOpen(true)
  }

  // 모달 닫기
  function handleCloseModal() {
    setIsFormModalOpen(false)
    setSelectedVet(null)
  }

  // 근무 시간 설정 버튼
  function handleWorkingHoursClick(vet: Veterinarian) {
    setSelectedVet(vet)
    setIsWorkingHoursModalOpen(true)
  }

  // 근무 시간 모달 닫기
  function handleCloseWorkingHoursModal() {
    setIsWorkingHoursModalOpen(false)
    setSelectedVet(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">수의사 관리</h1>
          <p className="text-gray-600 mt-1">
            수의사 정보와 근무 시간을 관리합니다
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddClick}
        >
          수의사 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 수의사</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {veterinarians.length}명
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">활성 수의사</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {veterinarians.filter((v) => v.is_active).length}명
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">오늘 근무</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {veterinarians.filter((v) => v.is_active).length}명
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 수의사 목록 */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">수의사 목록</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : veterinarians.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">등록된 수의사가 없습니다</p>
            <Button variant="primary" size="sm">
              첫 수의사 등록하기
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {veterinarians.map((vet) => (
              <div key={vet.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  {/* 수의사 정보 */}
                  <div className="flex items-start gap-4">
                    {/* 프로필 사진 */}
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {vet.photo_url ? (
                        <img
                          src={vet.photo_url}
                          alt={vet.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-primary-600" />
                      )}
                    </div>

                    {/* 기본 정보 */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vet.name}
                        </h3>
                        {vet.title && (
                          <Badge variant="secondary">{vet.title}</Badge>
                        )}
                        {vet.is_active ? (
                          <Badge variant="success">활성</Badge>
                        ) : (
                          <Badge variant="default">비활성</Badge>
                        )}
                      </div>

                      {vet.specialization && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>전문분야: {vet.specialization}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {vet.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{vet.email}</span>
                          </div>
                        )}
                        {vet.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{vet.phone}</span>
                          </div>
                        )}
                      </div>

                      {vet.license_number && (
                        <p className="text-sm text-gray-500">
                          면허번호: {vet.license_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<BarChart3 className="w-4 h-4" />}
                    >
                      통계
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Clock className="w-4 h-4" />}
                      onClick={() => handleWorkingHoursClick(vet)}
                    >
                      근무시간
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEditClick(vet)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDelete(vet.id, vet.name)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 수의사 추가/수정 모달 */}
      <VeterinarianFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        veterinarian={selectedVet}
        onSave={handleSave}
      />

      {/* 근무 시간 설정 모달 */}
      {selectedVet && (
        <WorkingHoursModal
          isOpen={isWorkingHoursModalOpen}
          onClose={handleCloseWorkingHoursModal}
          veterinarianId={selectedVet.id}
          veterinarianName={selectedVet.name}
        />
      )}

      {/* TODO: 수의사 통계 모달 */}
    </div>
  )
}
