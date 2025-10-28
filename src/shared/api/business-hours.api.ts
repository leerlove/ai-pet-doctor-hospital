/**
 * business-hours.api.ts - 영업시간 API
 */

import { supabase } from './supabase'
import type { BusinessHour, BusinessHourInsert, BusinessHourUpdate } from '@/shared/types/database.types'

// 수의사별 영업시간 타입
export interface VeterinarianWorkingHour {
  id: string
  veterinarian_id: string
  day_of_week: number
  is_open: boolean
  is_24h?: boolean
  open_time: string | null
  close_time: string | null
  break_start: string | null
  break_end: string | null
  created_at?: string
  updated_at?: string
}

export type VeterinarianWorkingHourInsert = Omit<VeterinarianWorkingHour, 'id' | 'created_at' | 'updated_at'>
export type VeterinarianWorkingHourUpdate = Partial<Omit<VeterinarianWorkingHour, 'id' | 'veterinarian_id' | 'day_of_week' | 'created_at' | 'updated_at'>>

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

/**
 * 수의사별 영업시간 조회
 */
export async function getVeterinarianWorkingHours(
  veterinarianId: string
): Promise<VeterinarianWorkingHour[]> {
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .select('*')
    .eq('veterinarian_id', veterinarianId)
    .order('day_of_week', { ascending: true })

  if (error) {
    console.error('수의사 영업시간 조회 실패:', error)
    throw error
  }

  return data || []
}

/**
 * 수의사별 영업시간 생성
 */
export async function createVeterinarianWorkingHour(
  workingHour: VeterinarianWorkingHourInsert
): Promise<VeterinarianWorkingHour> {
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .insert(workingHour)
    .select()
    .single()

  if (error) {
    console.error('수의사 영업시간 생성 실패:', error)
    throw error
  }

  return data
}

/**
 * 수의사별 영업시간 수정
 */
export async function updateVeterinarianWorkingHour(
  id: string,
  updates: VeterinarianWorkingHourUpdate
): Promise<VeterinarianWorkingHour> {
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('수의사 영업시간 수정 실패:', error)
    throw error
  }

  return data
}

/**
 * 수의사별 영업시간 초기화 (클리닉 영업시간 기반)
 */
export async function initializeVeterinarianWorkingHours(
  veterinarianId: string,
  clinicHours: BusinessHour[]
): Promise<VeterinarianWorkingHour[]> {
  const defaultHours: VeterinarianWorkingHourInsert[] = clinicHours.map((hour) => ({
    veterinarian_id: veterinarianId,
    day_of_week: hour.day_of_week,
    is_open: hour.is_open || false,
    is_24h: hour.is_24h || false,
    open_time: hour.open_time,
    close_time: hour.close_time,
    break_start: hour.break_start,
    break_end: hour.break_end,
  }))

  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .insert(defaultHours)
    .select()

  if (error) {
    console.error('수의사 영업시간 초기화 실패:', error)
    throw error
  }

  return data || []
}
