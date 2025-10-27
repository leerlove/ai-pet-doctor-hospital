/**
 * closed-dates.api.ts - 휴무일 API
 */

import { supabase } from './supabase'
import type { ClosedDate, ClosedDateInsert } from '@/shared/types/database.types'

/**
 * 클리닉의 모든 휴무일 조회
 */
export async function getAllClosedDates(clinicId: string): Promise<ClosedDate[]> {
  const { data, error } = await supabase
    .from('closed_dates')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('date', { ascending: true })

  if (error) {
    console.error('휴무일 조회 실패:', error)
    throw error
  }

  return data || []
}

/**
 * 휴무일 추가
 */
export async function createClosedDate(
  closedDate: ClosedDateInsert
): Promise<ClosedDate> {
  const { data, error } = await supabase
    .from('closed_dates')
    .insert(closedDate)
    .select()
    .single()

  if (error) {
    console.error('휴무일 추가 실패:', error)
    throw error
  }

  return data
}

/**
 * 휴무일 삭제
 */
export async function deleteClosedDate(id: string): Promise<void> {
  const { error } = await supabase.from('closed_dates').delete().eq('id', id)

  if (error) {
    console.error('휴무일 삭제 실패:', error)
    throw error
  }
}
