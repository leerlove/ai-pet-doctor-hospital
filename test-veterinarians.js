import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jshuwjbdcfmwytgquvfi.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaHV3amJkY2Ztd3l0Z3F1dmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MjUwNjEsImV4cCI6MjA1MzEwMTA2MX0.sZY-qNvmm9V2zx9oLQW8gWSlGgSqO7pjWFWL5YCKgho'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testVeterinarians() {
  console.log('\n=== 수의사 테이블 테스트 ===\n')

  // 1. 모든 클리닉 조회
  console.log('1. 클리닉 조회...')
  const { data: clinics, error: clinicsError } = await supabase
    .from('clinics')
    .select('id, name')

  if (clinicsError) {
    console.error('❌ 클리닉 조회 실패:', clinicsError)
    return
  }

  console.log('✅ 조회된 클리닉:')
  clinics?.forEach((c) => {
    console.log(`  - ${c.name} (ID: ${c.id})`)
  })

  // 2. 모든 수의사 조회
  console.log('\n2. 수의사 조회...')
  const { data: vets, error: vetsError } = await supabase
    .from('veterinarians')
    .select('*')
    .eq('is_active', true)

  if (vetsError) {
    console.error('❌ 수의사 조회 실패:', vetsError)
    return
  }

  console.log(`✅ 조회된 수의사 수: ${vets?.length || 0}`)
  vets?.forEach((v) => {
    console.log(`  - ${v.name} (${v.title}) - Clinic ID: ${v.clinic_id}`)
    console.log(`    전문분야: ${v.specialization}`)
  })

  // 3. 특정 클리닉의 수의사 조회 (첫 번째 클리닉)
  if (clinics && clinics.length > 0) {
    const clinicId = clinics[0].id
    console.log(`\n3. ${clinics[0].name}의 수의사 조회...`)
    const { data: clinicVets, error: clinicVetsError } = await supabase
      .from('veterinarians')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('is_active', true)

    if (clinicVetsError) {
      console.error('❌ 클리닉 수의사 조회 실패:', clinicVetsError)
      return
    }

    console.log(`✅ ${clinics[0].name}의 수의사 수: ${clinicVets?.length || 0}`)
    clinicVets?.forEach((v) => {
      console.log(`  - ${v.name} (${v.title})`)
    })
  }

  console.log('\n=== 테스트 완료 ===\n')
}

testVeterinarians()
