// Supabase 예약 삽입 테스트
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testBookingInsert() {
  console.log('=== Supabase 예약 삽입 테스트 ===\n')

  const bookingData = {
    clinic_id: '09b5aa17-e989-4850-b0e5-21ee2aa9861e',
    service_id: '6f4b07e8-ff66-4d91-9108-cf633e891a37',
    user_id: null,
    pet_id: null,
    booking_date: '2025-10-28',
    booking_time: '14:00',
    status: 'pending',
    customer_name: '테스트 사용자',
    customer_phone: '010-1234-5678',
    customer_email: 'test@example.com',
    pet_name: '테스트 펫',
    pet_species: 'dog',
    pet_breed: '푸들',
    pet_age: 5,
    symptoms: '테스트 증상입니다.',
    source: 'direct',
  }

  console.log('전송할 데이터:')
  console.log(JSON.stringify(bookingData, null, 2))
  console.log()

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (error) {
      console.error('❌ 예약 생성 실패!')
      console.error('에러 객체:', error)
      console.error('에러 메시지:', error.message)
      console.error('에러 코드:', error.code)
      console.error('에러 상세:', error.details)
      console.error('에러 힌트:', error.hint)
      return
    }

    console.log('✅ 예약 생성 성공!')
    console.log('생성된 예약:')
    console.log(JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('❌ 예외 발생:', err)
  }
}

testBookingInsert()
