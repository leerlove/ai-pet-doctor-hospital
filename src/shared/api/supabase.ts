/**
 * Supabase 클라이언트 초기화
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database.types'

// 환경변수 검증
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
  )
}

/**
 * Supabase 클라이언트 인스턴스
 * - 타입 안전성을 위해 Database 타입 적용
 * - 자동 세션 갱신 활성화
 * - localStorage에 세션 저장
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

/**
 * Supabase 스토리지 URL 생성
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('현재 사용자 정보를 가져오는데 실패했습니다:', error)
    return null
  }

  return user
}

/**
 * 현재 세션 정보 가져오기
 */
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('현재 세션 정보를 가져오는데 실패했습니다:', error)
    return null
  }

  return session
}
