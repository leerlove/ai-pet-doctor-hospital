/**
 * Services API
 * - 병원 서비스(진료 항목) 관리
 */

import { supabase } from './supabase'
import type {
  Service,
  ServiceInsert,
  ServiceUpdate,
} from '@/shared/types/database.types'

// ============================================================================
// 조회 (Read)
// ============================================================================

/**
 * 모든 서비스 조회
 */
export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * 활성화된 서비스만 조회
 */
export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * 특정 서비스 조회
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
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
 * 클리닉별 서비스 조회
 */
export async function getServicesByClinicId(
  clinicId: string
): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

// ============================================================================
// 생성 (Create)
// ============================================================================

/**
 * 새 서비스 생성
 */
export async function createService(service: ServiceInsert): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// 수정 (Update)
// ============================================================================

/**
 * 서비스 업데이트
 */
export async function updateService(
  id: string,
  updates: ServiceUpdate
): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
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
 * 서비스 삭제
 */
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) throw error
}
