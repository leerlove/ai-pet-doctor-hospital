/**
 * 예약 생성 테스트 스크립트
 * - Clinic과 Service ID 확인
 * - 예약 생성 테스트
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testBooking() {
  console.log('🔍 Clinic 데이터 확인...')
  const { data: clinics, error: clinicError } = await supabase
    .from('clinics')
    .select('*')
    .limit(1)

  if (clinicError) {
    console.error('❌ Clinic 조회 실패:', clinicError)
    return
  }

  console.log('✅ Clinic 데이터:', clinics)

  console.log('\n🔍 Service 데이터 확인...')
  const { data: services, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .limit(1)

  if (serviceError) {
    console.error('❌ Service 조회 실패:', serviceError)
    return
  }

  console.log('✅ Service 데이터:', services)

  if (!clinics || clinics.length === 0) {
    console.error('\n❌ Clinic 데이터가 없습니다!')
    console.log('💡 먼저 Clinic 데이터를 생성해야 합니다.')
    return
  }

  if (!services || services.length === 0) {
    console.error('\n❌ Service 데이터가 없습니다!')
    console.log('💡 먼저 Service 데이터를 생성해야 합니다.')
    return
  }

  console.log('\n🔍 예약 생성 테스트...')
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      clinic_id: clinics[0].id,
      service_id: services[0].id,
      user_id: null,
      booking_date: '2025-10-23',
      booking_time: '10:00',
      status: 'pending',
      customer_name: '테스트 고객',
      customer_phone: '010-1234-5678',
      customer_email: 'test@example.com',
      pet_name: '테스트펫',
      pet_species: 'dog',
      pet_breed: '말티즈',
      pet_age: 3,
      symptoms: '테스트 증상',
      source: 'direct',
    })
    .select()
    .single()

  if (bookingError) {
    console.error('❌ 예약 생성 실패:', bookingError)
    console.error('   message:', bookingError.message)
    console.error('   details:', bookingError.details)
    console.error('   hint:', bookingError.hint)
    return
  }

  console.log('✅ 예약 생성 성공!')
  console.log('   booking_number:', booking.booking_number)
  console.log('   booking_id:', booking.id)
}

testBooking()
