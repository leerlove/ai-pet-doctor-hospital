/**
 * VeterinarianWorkingHoursEditor.tsx - 수의사별 영업시간 편집 컴포넌트
 */

import { useState, useEffect } from 'react'
import { Clock, Save, UserCog } from 'lucide-react'
import { Button } from '@/shared/components'
import { showToast } from '@/shared/components/Toast'
import {
  getVeterinarianWorkingHours,
  updateVeterinarianWorkingHour,
  initializeVeterinarianWorkingHours,
  type VeterinarianWorkingHour,
} from '@/shared/api/business-hours.api'
import type { BusinessHour, Veterinarian } from '@/shared/types/database.types'

interface VeterinarianWorkingHoursEditorProps {
  veterinarians: Veterinarian[]
  clinicHours: BusinessHour[]
  onUpdate: () => void
}

const DAY_NAMES = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

// 시간 옵션 생성 (09:00 ~ 21:00, 30분 단위)
const generateTimeOptions = () => {
  const options: string[] = []
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 21 && minute === 30) break
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      options.push(time)
    }
  }
  return options
}

const TIME_OPTIONS = generateTimeOptions()

export function VeterinarianWorkingHoursEditor({
  veterinarians,
  clinicHours,
  onUpdate,
}: VeterinarianWorkingHoursEditorProps) {
  const [selectedVetId, setSelectedVetId] = useState<string>('')
  const [workingHours, setWorkingHours] = useState<VeterinarianWorkingHour[]>([])
  const [editingHours, setEditingHours] = useState<VeterinarianWorkingHour[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 수의사 선택 시 영업시간 로드
  useEffect(() => {
    if (!selectedVetId) {
      setWorkingHours([])
      setEditingHours([])
      return
    }

    loadVeterinarianHours()
  }, [selectedVetId])

  const loadVeterinarianHours = async () => {
    if (!selectedVetId) return

    try {
      setIsLoading(true)
      const hours = await getVeterinarianWorkingHours(selectedVetId)

      // 영업시간이 없으면 초기화
      if (hours.length === 0) {
        const initialized = await initializeVeterinarianWorkingHours(selectedVetId, clinicHours)
        setWorkingHours(initialized)
        setEditingHours(initialized)
      } else {
        setWorkingHours(hours)
        setEditingHours(hours)
      }
    } catch (error) {
      console.error('수의사 영업시간 로드 실패:', error)
      showToast({
        title: '로드 실패',
        description: '수의사 영업시간을 불러오는데 실패했습니다',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleOpen = (index: number) => {
    const newHours = [...editingHours]
    newHours[index] = {
      ...newHours[index],
      is_open: !newHours[index].is_open,
    }
    setEditingHours(newHours)
  }

  const handleToggle24h = (index: number) => {
    const newHours = [...editingHours]
    newHours[index] = {
      ...newHours[index],
      is_24h: !newHours[index].is_24h,
    }
    setEditingHours(newHours)
  }

  const handleTimeChange = (
    index: number,
    field: 'open_time' | 'close_time' | 'break_start' | 'break_end',
    value: string | null
  ) => {
    const newHours = [...editingHours]
    newHours[index] = {
      ...newHours[index],
      [field]: value,
    }
    setEditingHours(newHours)
  }

  const handleSave = async () => {
    if (!selectedVetId) return

    try {
      setIsSaving(true)

      // 검증
      for (let i = 0; i < editingHours.length; i++) {
        const hour = editingHours[i]
        if (hour.is_open && !hour.is_24h) {
          if (!hour.open_time || !hour.close_time) {
            showToast({
              title: '입력 오류',
              description: `${DAY_NAMES[i]}: 영업 시간을 입력해주세요`,
              variant: 'error',
            })
            return
          }

          if (hour.open_time >= hour.close_time) {
            showToast({
              title: '입력 오류',
              description: `${DAY_NAMES[i]}: 종료 시간이 시작 시간보다 빠릅니다`,
              variant: 'error',
            })
            return
          }

          if (hour.break_start && hour.break_end) {
            if (hour.break_start >= hour.break_end) {
              showToast({
                title: '입력 오류',
                description: `${DAY_NAMES[i]}: 점심시간 종료 시간이 시작 시간보다 빠릅니다`,
                variant: 'error',
              })
              return
            }

            if (hour.break_start < hour.open_time || hour.break_end > hour.close_time) {
              showToast({
                title: '입력 오류',
                description: `${DAY_NAMES[i]}: 점심시간이 영업 시간을 벗어났습니다`,
                variant: 'error',
              })
              return
            }
          }
        }
      }

      // 모든 영업시간 업데이트
      await Promise.all(
        editingHours.map((hour) =>
          updateVeterinarianWorkingHour(hour.id, {
            is_open: hour.is_open,
            is_24h: hour.is_24h || false,
            open_time: hour.is_open && !hour.is_24h ? hour.open_time : null,
            close_time: hour.is_open && !hour.is_24h ? hour.close_time : null,
            break_start: hour.is_open && !hour.is_24h ? hour.break_start : null,
            break_end: hour.is_open && !hour.is_24h ? hour.break_end : null,
          })
        )
      )

      showToast({
        title: '저장 완료',
        description: '수의사 영업시간이 성공적으로 저장되었습니다',
        variant: 'success',
      })

      onUpdate()
    } catch (error) {
      console.error('수의사 영업시간 저장 실패:', error)
      showToast({
        title: '저장 실패',
        description: '영업시간 저장 중 오류가 발생했습니다',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedVet = veterinarians.find((v) => v.id === selectedVetId)

  return (
    <div className="space-y-6">
      {/* 수의사 선택 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <UserCog className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">수의사별 영업시간 설정</h3>
        </div>

        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            수의사 선택
          </label>
          <select
            value={selectedVetId}
            onChange={(e) => setSelectedVetId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">수의사를 선택하세요</option>
            {veterinarians
              .filter((vet) => vet.is_active)
              .map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.name} {vet.title && `(${vet.title})`}
                </option>
              ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            특정 수의사의 진료 가능 시간을 별도로 설정할 수 있습니다
          </p>
        </div>
      </div>

      {/* 영업시간 편집 */}
      {selectedVetId && (
        <>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="mt-4 text-gray-600">영업시간을 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 수의사 정보 표시 */}
              {selectedVet && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <UserCog className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedVet.name}</p>
                      {selectedVet.title && (
                        <p className="text-sm text-gray-600">{selectedVet.title}</p>
                      )}
                      {selectedVet.specialization && (
                        <p className="text-sm text-blue-600">전문: {selectedVet.specialization}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 개별 요일 설정 */}
              <div className="space-y-4">
                {editingHours.map((hour, index) => (
                  <div
                    key={hour.id}
                    className="border rounded-lg p-4 hover:border-blue-300 transition-colors bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium text-gray-900">{DAY_NAMES[index]}</h4>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* 24시간 영업 체크박스 */}
                        {hour.is_open && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-gray-600">24시간</span>
                            <input
                              type="checkbox"
                              checked={hour.is_24h || false}
                              onChange={() => handleToggle24h(index)}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                            />
                          </label>
                        )}

                        {/* 영업 여부 토글 */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-sm text-gray-600">진료</span>
                          <input
                            type="checkbox"
                            checked={hour.is_open || false}
                            onChange={() => handleToggleOpen(index)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>

                    {hour.is_open ? (
                      hour.is_24h ? (
                        <div className="text-center py-6 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-emerald-700 font-medium">24시간 진료</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 진료 시간 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              진료 시간
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                value={hour.open_time || ''}
                                onChange={(e) =>
                                  handleTimeChange(index, 'open_time', e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">선택</option>
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                              <span className="text-gray-500">~</span>
                              <select
                                value={hour.close_time || ''}
                                onChange={(e) =>
                                  handleTimeChange(index, 'close_time', e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">선택</option>
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* 휴게시간 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              휴게시간 (선택)
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                value={hour.break_start || ''}
                                onChange={(e) =>
                                  handleTimeChange(
                                    index,
                                    'break_start',
                                    e.target.value || null
                                  )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">없음</option>
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                              <span className="text-gray-500">~</span>
                              <select
                                value={hour.break_end || ''}
                                onChange={(e) =>
                                  handleTimeChange(index, 'break_end', e.target.value || null)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">없음</option>
                                {TIME_OPTIONS.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-4 text-gray-500">휴무</div>
                    )}
                  </div>
                ))}
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? '저장 중...' : '영업시간 저장'}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
