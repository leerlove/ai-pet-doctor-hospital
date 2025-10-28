/**
 * BusinessHoursEditor.tsx - 영업시간 편집 컴포넌트
 */

import { useState } from 'react'
import { Clock, Save } from 'lucide-react'
import { Button } from '@/shared/components'
import { showToast } from '@/shared/components/Toast'
import { updateBusinessHour } from '@/shared/api/business-hours.api'
import type { BusinessHour } from '@/shared/types/database.types'

interface BusinessHoursEditorProps {
  businessHours: BusinessHour[]
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

export function BusinessHoursEditor({ businessHours, onUpdate }: BusinessHoursEditorProps) {
  const [editingHours, setEditingHours] = useState<BusinessHour[]>(businessHours)
  const [isSaving, setIsSaving] = useState(false)

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
    try {
      setIsSaving(true)

      // 검증
      for (let i = 0; i < editingHours.length; i++) {
        const hour = editingHours[i]
        if (hour.is_open) {
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
          updateBusinessHour(hour.id, {
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
        description: '영업시간이 성공적으로 저장되었습니다',
        variant: 'success',
      })

      onUpdate()
    } catch (error) {
      console.error('영업시간 저장 실패:', error)
      showToast({
        title: '저장 실패',
        description: '영업시간 저장 중 오류가 발생했습니다',
        variant: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {editingHours.map((hour, index) => (
        <div
          key={hour.id}
          className="border rounded-lg p-4 hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-teal-600" />
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
                <span className="text-sm text-gray-600">영업</span>
                <input
                  type="checkbox"
                  checked={hour.is_open || false}
                  onChange={() => handleToggleOpen(index)}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          {hour.is_open ? (
            hour.is_24h ? (
              <div className="text-center py-6 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-emerald-700 font-medium">24시간 영업</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 영업 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  영업 시간
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={hour.open_time || ''}
                    onChange={(e) => handleTimeChange(index, 'open_time', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    onChange={(e) => handleTimeChange(index, 'close_time', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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

              {/* 점심시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  점심시간 (선택)
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={hour.break_start || ''}
                    onChange={(e) =>
                      handleTimeChange(index, 'break_start', e.target.value || null)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
    </div>
  )
}
