/**
 * business-hours.api.ts - 영업시간 API
 */

import { supabase } from './supabase'
import type { BusinessHour, BusinessHourInsert, BusinessHourUpdate } from '@/shared/types/database.types'

/**
 * 클리닉의 모든 영업시간 조회
 */
export async function getBusinessHours(clinicId: string): Promise<BusinessHour[]> {
  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('day_of_week', { ascending: true })

  if (error) {
    console.error('영업시간 조회 실패:', error)
    throw error
  }

  return data || []
}

/**
 * 영업시간 수정
 */
export async function updateBusinessHour(
  id: string,
  updates: BusinessHourUpdate
): Promise<BusinessHour> {
  const { data, error } = await supabase
    .from('business_hours')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('영업시간 수정 실패:', error)
    throw error
  }

  return data
}

/**
 * 영업시간 생성 (초기 설정용)
 */
export async function createBusinessHour(
  businessHour: BusinessHourInsert
): Promise<BusinessHour> {
  const { data, error } = await supabase
    .from('business_hours')
    .insert(businessHour)
    .select()
    .single()

  if (error) {
    console.error('영업시간 생성 실패:', error)
    throw error
  }

  return data
}

/**
 * 요일별 기본 영업시간 초기화
 */
export async function initializeBusinessHours(clinicId: string): Promise<BusinessHour[]> {
  const defaultHours: BusinessHourInsert[] = [
    // 월~금 (0-4)
    ...Array.from({ length: 5 }, (_, i) => ({
      clinic_id: clinicId,
      day_of_week: i,
      is_open: true,
      open_time: '09:00',
      close_time: '18:00',
      break_start: '12:00',
      break_end: '13:00',
    })),
    // 토요일 (5)
    {
      clinic_id: clinicId,
      day_of_week: 5,
      is_open: true,
      open_time: '09:00',
      close_time: '14:00',
      break_start: null,
      break_end: null,
    },
    // 일요일 (6)
    {
      clinic_id: clinicId,
      day_of_week: 6,
      is_open: false,
      open_time: null,
      close_time: null,
      break_start: null,
      break_end: null,
    },
  ]

  const { data, error } = await supabase
    .from('business_hours')
    .insert(defaultHours)
    .select()

  if (error) {
    console.error('영업시간 초기화 실패:', error)
    throw error
  }

  return data || []
}
