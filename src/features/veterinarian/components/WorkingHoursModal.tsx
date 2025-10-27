/**
 * WorkingHoursModal - 수의사 근무 시간 설정 모달
 */

import { useState, useEffect } from 'react'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { showToast } from '@/shared/components/Toast'
import { Clock } from 'lucide-react'
import {
  getVeterinarianWorkingHours,
  updateVeterinarianWorkingHours,
  type VeterinarianWorkingHours,
  type VeterinarianWorkingHoursInsert,
} from '@/shared/api/veterinarians.api'

interface WorkingHoursModalProps {
  isOpen: boolean
  onClose: () => void
  veterinarianId: string
  veterinarianName: string
}

const DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

export function WorkingHoursModal({
  isOpen,
  onClose,
  veterinarianId,
  veterinarianName,
}: WorkingHoursModalProps) {
  const [workingHours, setWorkingHours] = useState<VeterinarianWorkingHours[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 근무 시간 조회
  useEffect(() => {
    if (isOpen && veterinarianId) {
      loadWorkingHours()
    }
  }, [isOpen, veterinarianId])

  async function loadWorkingHours() {
    try {
      setIsLoading(true)
      const data = await getVeterinarianWorkingHours(veterinarianId)

      // 데이터가 없으면 기본값 생성
      if (data.length === 0) {
        const defaultHours: VeterinarianWorkingHours[] = Array.from({ length: 7 }, (_, i) => ({
          id: `temp-${i}`,
          veterinarian_id: veterinarianId,
          day_of_week: i,
          is_working: i >= 1 && i <= 5, // 월-금만 근무
          start_time: '09:00',
          end_time: '18:00',
          break_start: '12:00',
          break_end: '13:00',
          created_at: null,
          updated_at: null,
        }))
        setWorkingHours(defaultHours)
      } else {
        setWorkingHours(data)
      }
    } catch (error: any) {
      console.error('근무 시간 조회 실패:', error)
      showToast({
        title: '조회 실패',
        description: error.message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 근무 여부 토글
  function toggleWorking(dayOfWeek: number) {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day_of_week === dayOfWeek ? { ...wh, is_working: !wh.is_working } : wh
      )
    )
  }

  // 시간 변경
  function updateTime(
    dayOfWeek: number,
    field: 'start_time' | 'end_time' | 'break_start' | 'break_end',
    value: string
  ) {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day_of_week === dayOfWeek ? { ...wh, [field]: value } : wh
      )
    )
  }

  // 저장
  async function handleSave() {
    try {
      setIsSaving(true)

      const insertData: VeterinarianWorkingHoursInsert[] = workingHours.map((wh) => ({
        veterinarian_id: veterinarianId,
        day_of_week: wh.day_of_week,
        is_working: wh.is_working,
        start_time: wh.start_time,
        end_time: wh.end_time,
        break_start: wh.break_start,
        break_end: wh.break_end,
      }))

      await updateVeterinarianWorkingHours(veterinarianId, insertData)

      showToast({
        title: '저장 완료',
        description: `${veterinarianName}의 근무 시간이 저장되었습니다.`,
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
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`근무 시간 설정 - ${veterinarianName}`}
      size="xl"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">로딩 중...</div>
        ) : (
          <>
            <div className="space-y-3">
              {workingHours.map((wh) => (
                <div
                  key={wh.day_of_week}
                  className={`p-4 border rounded-lg ${
                    wh.is_working ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={wh.is_working ?? false}
                        onChange={() => toggleWorking(wh.day_of_week)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        {DAYS[wh.day_of_week]}
                      </span>
                    </div>
                    {!wh.is_working && (
                      <span className="text-xs text-gray-500">휴무</span>
                    )}
                  </div>

                  {wh.is_working && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      {/* 근무 시간 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          근무 시간
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={wh.start_time || ''}
                            onChange={(e) =>
                              updateTime(wh.day_of_week, 'start_time', e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <span className="text-gray-500">~</span>
                          <input
                            type="time"
                            value={wh.end_time || ''}
                            onChange={(e) =>
                              updateTime(wh.day_of_week, 'end_time', e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* 점심 시간 */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          점심 시간
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={wh.break_start || ''}
                            onChange={(e) =>
                              updateTime(wh.day_of_week, 'break_start', e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <span className="text-gray-500">~</span>
                          <input
                            type="time"
                            value={wh.break_end || ''}
                            onChange={(e) =>
                              updateTime(wh.day_of_week, 'break_end', e.target.value)
                            }
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 안내 메시지 */}
            <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">근무 시간 설정 안내</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>체크박스를 해제하면 해당 요일은 휴무로 설정됩니다.</li>
                  <li>근무 시간과 점심 시간을 각각 설정할 수 있습니다.</li>
                  <li>설정한 시간에는 예약이 불가능합니다.</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isLoading}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  )
}
