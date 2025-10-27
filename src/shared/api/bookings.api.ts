/**
 * Bookings API
 * - 예약 CRUD 및 관리
 */

import { supabase } from './supabase'
import type {
  Booking,
  BookingInsert,
  BookingUpdate,
} from '@/shared/types/database.types'

// ============================================================================
// 조회 (Read)
// ============================================================================

/**
 * 모든 예약 조회 (최근 3개월만)
 * 성능 최적화: 전체 데이터 대신 최근 데이터만 조회
 */
export async function getAllBookings(): Promise<Booking[]> {
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('booking_date', threeMonthsAgo.toISOString().split('T')[0])
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })
    .limit(500) // 최대 500개로 제한

  if (error) throw error
  return data || []
}

/**
 * 모든 예약 조회 (기간 제한 없음)
 * 관리자 전체 내역 조회용
 */
export async function getAllBookingsUnlimited(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 특정 예약 조회 (ID)
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
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
 * 특정 예약 조회 (예약 번호)
 */
export async function getBookingByNumber(
  bookingNumber: string
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_number', bookingNumber)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

/**
 * 사용자별 예약 조회
 */
export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 클리닉별 예약 조회
 */
export async function getBookingsByClinicId(
  clinicId: string
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('clinic_id', clinicId)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * 날짜별 예약 조회
 */
export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', date)
    .order('booking_time', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * 상태별 예약 조회
 */
export async function getBookingsByStatus(
  status: Booking['status']
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', status)
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * AI펫닥터 연동 예약만 조회
 */
export async function getAIPetDoctorBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('source', 'ai_pet_doctor')
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// 생성 (Create)
// ============================================================================

/**
 * 새 예약 생성
 */
export async function createBooking(
  booking: BookingInsert
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// 수정 (Update)
// ============================================================================

/**
 * 예약 업데이트
 */
export async function updateBooking(
  id: string,
  updates: BookingUpdate
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 예약 상태 변경
 */
export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<Booking> {
  return updateBooking(id, { status })
}

// ============================================================================
// 삭제 (Delete)
// ============================================================================

/**
 * 예약 삭제
 */
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) throw error
}

// ============================================================================
// Realtime 구독
// ============================================================================

/**
 * 예약 변경사항 실시간 구독
 */
export function subscribeToBookings(
  callback: (payload: any) => void
) {
  return supabase
    .channel('bookings-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
      },
      callback
    )
    .subscribe()
}

/**
 * 특정 클리닉의 예약 변경사항 구독
 */
export function subscribeToClinicBookings(
  clinicId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`clinic-${clinicId}-bookings`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `clinic_id=eq.${clinicId}`,
      },
      callback
    )
    .subscribe()
}
