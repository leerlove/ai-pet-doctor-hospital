import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jshuwjbdcfmwytgquvfi.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaHV3amJkY2Ztd3l0Z3F1dmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MjUwNjEsImV4cCI6MjA1MzEwMTA2MX0.sZY-qNvmm9V2zx9oLQW8gWSlGgSqO7pjWFWL5YCKgho'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
  console.log('\n=== 데이터베이스 확인 ===\n')

  // 1. 클리닉 조회
  const { data: clinics } = await supabase.from('clinics').select('id, name')
  console.log('1. 클리닉:')
  if (clinics && clinics.length > 0) {
    clinics.forEach((c) => console.log(`   - ${c.name} (${c.id})`))
  } else {
    console.log('   없음')
  }

  // 2. 수의사 조회
  const { data: vets } = await supabase.from('veterinarians').select('*')
  console.log('\n2. 수의사:')
  if (vets && vets.length > 0) {
    vets.forEach((v) =>
      console.log(`   - ${v.name} (${v.title}) - clinic_id: ${v.clinic_id}, active: ${v.is_active}`)
    )
  } else {
    console.log('   ❌ 수의사 데이터가 없습니다!')
  }

  console.log('\n=== 확인 완료 ===\n')
}

checkData()
