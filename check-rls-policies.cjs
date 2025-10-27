require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkRLS() {
  console.log('🔍 RLS 정책 및 veterinarians 조회 디버깅\n')

  // 1. 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('1. 현재 로그인 사용자:', {
    id: user?.id,
    email: user?.email,
    role: user?.role,
  })

  // 2. users 테이블에서 프로필 확인
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    console.log('\n2. users 테이블 프로필:', {
      data: profile,
      error: profileError,
    })
  }

  // 3. veterinarians 테이블 조회 시도 (RLS 적용됨)
  console.log('\n3. veterinarians 조회 시도 (RLS 적용)...')
  const { data, error, count } = await supabase
    .from('veterinarians')
    .select('*', { count: 'exact' })

  console.log('결과:', {
    dataLength: data?.length,
    count: count,
    error: error,
    errorCode: error?.code,
    errorMessage: error?.message,
    errorDetails: error?.details,
    errorHint: error?.hint,
  })

  if (data) {
    console.log('\n조회된 데이터:', data)
  }

  // 4. 다른 테이블 조회 테스트 (비교용)
  console.log('\n4. clinics 조회 테스트 (비교용)...')
  const { data: clinics, error: clinicsError } = await supabase
    .from('clinics')
    .select('*')

  console.log('clinics 결과:', {
    dataLength: clinics?.length,
    error: clinicsError,
  })
}

checkRLS().catch((err) => {
  console.error('❌ 에러 발생:', err)
  process.exit(1)
})
