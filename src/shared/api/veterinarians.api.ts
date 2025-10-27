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

/**
 * 모든 수의사 조회
 */
export async function getAllVeterinarians(): Promise<Veterinarian[]> {
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
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
