/**
 * 수의사 테스트 데이터 삽입 스크립트
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testVeterinariansInsert() {
  console.log('🏥 수의사 데이터 삽입 테스트 시작...')
  console.log('Supabase URL:', supabaseUrl)

  try {
    // 1. 클리닉 조회
    console.log('\n1️⃣ 클리닉 조회...')
    const { data: clinics, error: clinicError } = await supabase
      .from('clinics')
      .select('*')

    if (clinicError) {
      console.error('❌ 클리닉 조회 실패:', clinicError)
      throw clinicError
    }

    console.log('✅ 조회된 클리닉:', clinics?.length, '개')
    console.log(clinics)

    if (!clinics || clinics.length === 0) {
      console.error('❌ 클리닉이 없습니다. 먼저 클리닉을 생성해주세요.')
      return
    }

    const clinicId = clinics[0].id
    console.log('선택된 클리닉 ID:', clinicId)

    // 2. 기존 수의사 확인
    console.log('\n2️⃣ 기존 수의사 확인...')
    const { data: existingVets, error: checkError } = await supabase
      .from('veterinarians')
      .select('*')

    if (checkError) {
      console.error('❌ 수의사 조회 실패:', checkError)
      throw checkError
    }

    console.log('✅ 기존 수의사:', existingVets?.length, '명')
    console.log(existingVets)

    // 3. 수의사 데이터 삽입
    console.log('\n3️⃣ 수의사 데이터 삽입...')

    const veterinarians = [
      {
        clinic_id: clinicId,
        name: '김수의',
        title: '원장',
        specialization: '일반진료, 외과',
        license_number: 'VET-2023-001',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        is_active: true,
      },
      {
        clinic_id: clinicId,
        name: '이진료',
        title: '수의사',
        specialization: '내과, 피부과',
        license_number: 'VET-2023-002',
        email: 'lee@example.com',
        phone: '010-2345-6789',
        is_active: true,
      },
      {
        clinic_id: clinicId,
        name: '박전문',
        title: '전문의',
        specialization: '정형외과, 재활',
        license_number: 'VET-2023-003',
        email: 'park@example.com',
        phone: '010-3456-7890',
        is_active: true,
      },
    ]

    const { data: insertedVets, error: insertError } = await supabase
      .from('veterinarians')
      .insert(veterinarians)
      .select()

    if (insertError) {
      console.error('❌ 수의사 삽입 실패:', insertError)
      console.error('에러 상세:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      })
      throw insertError
    }

    console.log('✅ 수의사 삽입 성공:', insertedVets?.length, '명')
    console.log(insertedVets)

    // 4. 최종 확인
    console.log('\n4️⃣ 최종 확인...')
    const { data: finalVets, error: finalError } = await supabase
      .from('veterinarians')
      .select('*')

    if (finalError) {
      console.error('❌ 최종 확인 실패:', finalError)
      throw finalError
    }

    console.log('✅ 전체 수의사:', finalVets?.length, '명')
    console.log(finalVets)

    console.log('\n🎉 테스트 완료!')
  } catch (error) {
    console.error('\n💥 테스트 실패:', error)
    process.exit(1)
  }
}

testVeterinariansInsert()
