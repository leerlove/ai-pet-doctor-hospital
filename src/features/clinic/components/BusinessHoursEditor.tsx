/**
 * BusinessHoursEditor.tsx - 영업시간 편집 컴포넌트
 */

import { useState } from 'react'
import { Clock, Save, Copy } from 'lucide-react'
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
  const [showBulkApply, setShowBulkApply] = useState(false)

  // 일괄 적용용 상태
  const [bulkSettings, setBulkSettings] = useState({
    is_open: true,
    is_24h: false,
    open_time: '09:00',
    close_time: '18:00',
    break_start: '',
    break_end: '',
  })

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

  // 일괄 적용 함수
  const handleBulkApply = () => {
    if (
      !window.confirm(
        '모든 요일에 동일한 영업시간을 적용하시겠습니까?\n기존 설정이 모두 변경됩니다.'
      )
    ) {
      return
    }

    const newHours = editingHours.map((hour) => ({
      ...hour,
      is_open: bulkSettings.is_open,
      is_24h: bulkSettings.is_24h,
      open_time: bulkSettings.is_open && !bulkSettings.is_24h ? bulkSettings.open_time : null,
      close_time: bulkSettings.is_open && !bulkSettings.is_24h ? bulkSettings.close_time : null,
      break_start:
        bulkSettings.is_open && !bulkSettings.is_24h && bulkSettings.break_start
          ? bulkSettings.break_start
          : null,
      break_end:
        bulkSettings.is_open && !bulkSettings.is_24h && bulkSettings.break_end
          ? bulkSettings.break_end
          : null,
    }))

    setEditingHours(newHours)
    setShowBulkApply(false)
    showToast({
      title: '일괄 적용 완료',
      description: '모든 요일에 동일한 설정이 적용되었습니다',
      variant: 'success',
    })
  }

  const handleSave = async () => {
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
      {/* 일괄 적용 섹션 */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">전체 일괄 적용</h3>
          </div>
          <button
            onClick={() => setShowBulkApply(!showBulkApply)}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            {showBulkApply ? '접기' : '펼치기'}
          </button>
        </div>

        {showBulkApply && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              모든 요일에 동일한 영업시간을 한 번에 설정합니다.
            </p>

            {/* 일괄 적용 설정 */}
            <div className="bg-white rounded-xl p-4 space-y-4">
              {/* 영업 여부 및 24시간 */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">영업</span>
                  <input
                    type="checkbox"
                    checked={bulkSettings.is_open}
                    onChange={(e) =>
                      setBulkSettings({ ...bulkSettings, is_open: e.target.checked })
                    }
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                  />
                </label>

                {bulkSettings.is_open && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">24시간</span>
                    <input
                      type="checkbox"
                      checked={bulkSettings.is_24h}
                      onChange={(e) =>
                        setBulkSettings({ ...bulkSettings, is_24h: e.target.checked })
                      }
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                )}
              </div>

              {/* 영업시간 설정 (24시간이 아닐 때만) */}
              {bulkSettings.is_open && !bulkSettings.is_24h && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 영업 시간 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      영업 시간
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={bulkSettings.open_time}
                        onChange={(e) =>
                          setBulkSettings({ ...bulkSettings, open_time: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">~</span>
                      <select
                        value={bulkSettings.close_time}
                        onChange={(e) =>
                          setBulkSettings({ ...bulkSettings, close_time: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
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
                        value={bulkSettings.break_start}
                        onChange={(e) =>
                          setBulkSettings({ ...bulkSettings, break_start: e.target.value })
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
                        value={bulkSettings.break_end}
                        onChange={(e) =>
                          setBulkSettings({ ...bulkSettings, break_end: e.target.value })
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
              )}

              {/* 24시간 영업 표시 */}
              {bulkSettings.is_open && bulkSettings.is_24h && (
                <div className="text-center py-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-700 font-medium">24시간 영업</p>
                </div>
              )}

              {/* 일괄 적용 버튼 */}
              <div className="flex justify-end">
                <Button variant="primary" size="md" onClick={handleBulkApply}>
                  <Copy className="w-4 h-4 mr-2" />
                  모든 요일에 적용
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 개별 요일 설정 */}
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
