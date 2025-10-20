/**
 * 테스트 데이터 생성 스크립트
 * Usage: node scripts/create-test-data.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Environment variables not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestData() {
  console.log('🚀 Creating test data...\n')

  try {
    // Get clinic ID
    const { data: clinics } = await supabase.from('clinics').select('id').limit(1).single()

    if (!clinics) {
      throw new Error('No clinic found. Please run migrations first.')
    }

    const clinicId = clinics.id

    // Get service ID
    const { data: services } = await supabase.from('services').select('id').limit(1).single()
    const serviceId = services?.id

    console.log('📝 Creating test bookings...')

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const testBookings = [
      {
        clinic_id: clinicId,
        service_id: serviceId,
        booking_number: `A2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        booking_date: today.toISOString().split('T')[0],
        booking_time: '10:00',
        status: 'pending',
        source: 'direct',
        customer_name: '김철수',
        customer_phone: '010-1234-5678',
        customer_email: 'kim@example.com',
        pet_name: '행복이',
        pet_species: '강아지',
        pet_breed: '골든 리트리버',
        pet_age: '3세',
        symptoms: '기침과 재채기가 계속됩니다',
      },
      {
        clinic_id: clinicId,
        service_id: serviceId,
        booking_number: `A2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        booking_date: today.toISOString().split('T')[0],
        booking_time: '14:00',
        status: 'confirmed',
        source: 'direct',
        customer_name: '이영희',
        customer_phone: '010-2345-6789',
        customer_email: 'lee@example.com',
        pet_name: '초코',
        pet_species: '강아지',
        pet_breed: '푸들',
        pet_age: '2세',
        symptoms: '설사 증상이 있습니다',
      },
      {
        clinic_id: clinicId,
        service_id: serviceId,
        booking_number: `A2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        booking_date: tomorrow.toISOString().split('T')[0],
        booking_time: '11:00',
        status: 'confirmed',
        source: 'ai_pet_doctor',
        customer_name: '박민수',
        customer_phone: '010-3456-7890',
        customer_email: 'park@example.com',
        pet_name: '나비',
        pet_species: '고양이',
        pet_breed: '페르시안',
        pet_age: '4세',
        symptoms: '식욕 부진 및 구토',
        ai_pet_doctor_request_id: 'APD-2025-001',
      },
      {
        clinic_id: clinicId,
        service_id: serviceId,
        booking_number: `A2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        booking_date: yesterday.toISOString().split('T')[0],
        booking_time: '15:00',
        status: 'completed',
        source: 'direct',
        customer_name: '최지훈',
        customer_phone: '010-4567-8901',
        customer_email: 'choi@example.com',
        pet_name: '뽀삐',
        pet_species: '강아지',
        pet_breed: '치와와',
        pet_age: '1세',
        symptoms: '예방접종',
      },
      {
        clinic_id: clinicId,
        service_id: serviceId,
        booking_number: `A2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        booking_date: yesterday.toISOString().split('T')[0],
        booking_time: '16:30',
        status: 'cancelled',
        source: 'direct',
        customer_name: '정수진',
        customer_phone: '010-5678-9012',
        customer_email: 'jung@example.com',
        pet_name: '호랑이',
        pet_species: '고양이',
        pet_breed: '코리안 숏헤어',
        pet_age: '5세',
        symptoms: '피부 가려움증',
      },
    ]

    for (const booking of testBookings) {
      const { error } = await supabase.from('bookings').insert(booking)

      if (error) {
        console.error(`❌ Failed to create booking: ${error.message}`)
      } else {
        console.log(`✅ Created: ${booking.customer_name} (${booking.status})`)
      }
    }

    console.log('\n✅ Test data created successfully!\n')
    console.log('📊 Summary:')
    console.log(`   - ${testBookings.length} bookings created`)
    console.log(`   - 1 pending (대기중)`)
    console.log(`   - 2 confirmed (승인됨)`)
    console.log(`   - 1 completed (완료)`)
    console.log(`   - 1 cancelled (취소됨)`)
    console.log('\n🔗 View at: http://localhost:5174/admin/bookings\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error creating test data:', error.message)
    process.exit(1)
  }
}

// Run the script
createTestData()
