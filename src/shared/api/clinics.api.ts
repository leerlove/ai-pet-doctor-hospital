/**
 * Clinics API
 * - 클리닉(병원) 정보 관리
 */

import { supabase } from './supabase'
import type {
  Clinic,
  ClinicInsert,
  ClinicUpdate,
} from '@/shared/types/database.types'

// ============================================================================
// 조회 (Read)
// ============================================================================

/**
 * 모든 클리닉 조회
 */
export async function getAllClinics(): Promise<Clinic[]> {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * 활성화된 클리닉만 조회
 */
export async function getActiveClinics(): Promise<Clinic[]> {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * 특정 클리닉 조회
 */
export async function getClinicById(id: string): Promise<Clinic | null> {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

// ============================================================================
// 생성 (Create)
// ============================================================================

/**
 * 새 클리닉 생성
 */
export async function createClinic(clinic: ClinicInsert): Promise<Clinic> {
  const { data, error } = await supabase
    .from('clinics')
    .insert(clinic)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// 수정 (Update)
// ============================================================================

/**
 * 클리닉 업데이트
 */
export async function updateClinic(
  id: string,
  updates: ClinicUpdate
): Promise<Clinic> {
  const { data, error } = await supabase
    .from('clinics')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// 삭제 (Delete)
// ============================================================================

/**
 * 클리닉 삭제
 */
export async function deleteClinic(id: string): Promise<void> {
  const { error } = await supabase.from('clinics').delete().eq('id', id)

  if (error) throw error
}
