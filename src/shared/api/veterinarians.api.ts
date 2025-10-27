/**
 * 수의사 API 함수
 */

import { supabase } from './supabase'

// Veterinarian types (수동 정의 - database.types.ts에 아직 없음)
export interface Veterinarian {
  id: string
  clinic_id: string | null
  name: string
  title: string | null
  specialization: string | null
  license_number: string | null
  photo_url: string | null
  email: string | null
  phone: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface VeterinarianInsert {
  id?: string
  clinic_id?: string | null
  name: string
  title?: string | null
  specialization?: string | null
  license_number?: string | null
  photo_url?: string | null
  email?: string | null
  phone?: string | null
  is_active?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface VeterinarianUpdate {
  id?: string
  clinic_id?: string | null
  name?: string
  title?: string | null
  specialization?: string | null
  license_number?: string | null
  photo_url?: string | null
  email?: string | null
  phone?: string | null
  is_active?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export interface VeterinarianWorkingHours {
  id: string
  veterinarian_id: string
  day_of_week: number // 0: 일요일, 6: 토요일
  is_working: boolean | null
  start_time: string | null // HH:mm
  end_time: string | null // HH:mm
  break_start: string | null // HH:mm
  break_end: string | null // HH:mm
  created_at: string | null
  updated_at: string | null
}

export interface VeterinarianWorkingHoursInsert {
  id?: string
  veterinarian_id: string
  day_of_week: number
  is_working?: boolean | null
  start_time?: string | null
  end_time?: string | null
  break_start?: string | null
  break_end?: string | null
}

export interface VeterinarianWorkingHoursUpdate {
  is_working?: boolean | null
  start_time?: string | null
  end_time?: string | null
  break_start?: string | null
  break_end?: string | null
}

/**
 * 모든 수의사 조회
 */
export async function getAllVeterinarians(): Promise<Veterinarian[]> {
  console.log('🔍 getAllVeterinarians 호출')
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .order('name')

  if (error) {
    console.error('❌ 수의사 조회 실패:', error)
    throw error
  }

  console.log('✅ 수의사 조회 성공:', data?.length, '명')
  console.log('데이터:', data)
  return data || []
}

/**
 * 클리닉별 수의사 조회
 */
export async function getVeterinariansByClinic(clinicId: string): Promise<Veterinarian[]> {
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data || []
}

/**
 * 수의사 ID로 조회
 */
export async function getVeterinarianById(id: string): Promise<Veterinarian | null> {
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

/**
 * 수의사 생성 (관리자)
 */
export async function createVeterinarian(
  veterinarian: VeterinarianInsert
): Promise<Veterinarian> {
  const { data, error } = await supabase
    .from('veterinarians')
    .insert(veterinarian)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 수의사 정보 수정 (관리자)
 */
export async function updateVeterinarian(
  id: string,
  updates: VeterinarianUpdate
): Promise<Veterinarian> {
  const { data, error } = await supabase
    .from('veterinarians')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 수의사 삭제 (관리자)
 */
export async function deleteVeterinarian(id: string): Promise<void> {
  const { error } = await supabase.from('veterinarians').delete().eq('id', id)

  if (error) throw error
}

/**
 * 특정 날짜/시간에 예약 가능한 수의사 조회
 */
export async function getAvailableVeterinarians(
  clinicId: string,
  date: string,
  time: string
): Promise<Veterinarian[]> {
  console.log('🔍 [수의사 조회] 시작 ---')
  console.log('  - clinicId:', clinicId)
  console.log('  - date:', date)
  console.log('  - time:', time)

  // 해당 시간에 승인된 예약이 있는 수의사 ID 조회
  const { data: bookedVets, error: bookingError } = await supabase
    .from('bookings')
    .select('veterinarian_id')
    .eq('clinic_id', clinicId)
    .eq('booking_date', date)
    .eq('booking_time', time)
    .eq('status', 'confirmed')

  if (bookingError) {
    console.error('❌ [수의사 조회] 예약된 수의사 조회 실패:', bookingError)
    throw bookingError
  }

  const bookedVetIds = bookedVets?.map((b) => b.veterinarian_id).filter(Boolean) || []
  console.log('  - 예약된 수의사 ID:', bookedVetIds)

  // 모든 활성화된 수의사 조회
  const { data: allVets, error: vetsError } = await supabase
    .from('veterinarians')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('is_active', true)
    .order('name')

  if (vetsError) {
    console.error('❌ [수의사 조회] 모든 수의사 조회 실패:', vetsError)
    throw vetsError
  }

  console.log('  - 조회된 전체 수의사 수:', allVets?.length || 0)
  console.log('  - 조회된 수의사:', allVets)

  // 예약되지 않은 수의사만 필터링
  const availableVets = (allVets || []).filter((vet) => !bookedVetIds.includes(vet.id))
  console.log('  - 예약 가능한 수의사 수:', availableVets.length)
  console.log('  - 예약 가능한 수의사:', availableVets)
  console.log('🔍 [수의사 조회] 완료 ---')

  return availableVets
}

// ============================================================================
// 수의사 근무 시간 관련
// ============================================================================

/**
 * 수의사의 근무 시간 조회
 */
export async function getVeterinarianWorkingHours(
  veterinarianId: string
): Promise<VeterinarianWorkingHours[]> {
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .select('*')
    .eq('veterinarian_id', veterinarianId)
    .order('day_of_week')

  if (error) throw error
  return data || []
}

/**
 * 수의사 근무 시간 일괄 업데이트
 */
export async function updateVeterinarianWorkingHours(
  veterinarianId: string,
  workingHours: VeterinarianWorkingHoursInsert[]
): Promise<VeterinarianWorkingHours[]> {
  // 기존 근무 시간 삭제
  const { error: deleteError } = await supabase
    .from('veterinarian_working_hours')
    .delete()
    .eq('veterinarian_id', veterinarianId)

  if (deleteError) throw deleteError

  // 새 근무 시간 삽입
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .insert(workingHours)
    .select()

  if (error) throw error
  return data || []
}

/**
 * 특정 요일의 근무 시간 업데이트
 */
export async function updateWorkingHoursByDay(
  veterinarianId: string,
  dayOfWeek: number,
  updates: VeterinarianWorkingHoursUpdate
): Promise<VeterinarianWorkingHours> {
  const { data, error } = await supabase
    .from('veterinarian_working_hours')
    .update(updates)
    .eq('veterinarian_id', veterinarianId)
    .eq('day_of_week', dayOfWeek)
    .select()
    .single()

  if (error) throw error
  return data
}
