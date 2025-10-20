/**
 * 인증 API 함수
 * - Supabase Auth 사용
 * - 회원가입, 로그인, 로그아웃
 * - 사용자 프로필 조회/업데이트
 */

import { supabase } from '@/shared/api/supabase'
import type { User as DBUser, UserInsert, UserUpdate } from '@/shared/types/database.types'

// ============================================================================
// 인증 관련
// ============================================================================

/**
 * 회원가입 (이메일/비밀번호)
 */
export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // users 테이블에 프로필 생성
  if (data.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      full_name: fullName || null,
      role: 'customer',
    })

    if (profileError) {
      console.error('프로필 생성 실패:', profileError)
    }
  }

  return data
}

/**
 * 로그인 (이메일/비밀번호)
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * 로그아웃
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * 비밀번호 재설정 이메일 전송
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
}

/**
 * 비밀번호 업데이트
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) throw error
}

/**
 * 현재 세션 확인
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * 현재 사용자 확인
 */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// ============================================================================
// 사용자 프로필 관련
// ============================================================================

/**
 * 사용자 프로필 조회
 */
export async function getUserProfile(userId: string): Promise<DBUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // 프로필이 없는 경우 (회원가입 직후)
      return null
    }
    throw error
  }

  return data
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(
  userId: string,
  updates: UserUpdate
): Promise<DBUser> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 사용자 프로필 생성 (회원가입 시 자동 생성되지 않은 경우)
 */
export async function createUserProfile(profile: UserInsert): Promise<DBUser> {
  const { data, error } = await supabase
    .from('users')
    .insert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// 인증 상태 변경 리스너
// ============================================================================

/**
 * 인증 상태 변경 구독
 * @example
 * const { data } = supabase.auth.onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN') console.log('로그인됨')
 * })
 * // Cleanup: data.subscription.unsubscribe()
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback)
}
