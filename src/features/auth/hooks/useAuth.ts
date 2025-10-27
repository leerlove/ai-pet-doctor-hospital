/**
 * useAuth Hook
 * - 인증 관련 로직을 통합 관리
 * - 로그인/로그아웃/회원가입
 * - 세션 초기화 및 동기화
 */

import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'
import {
  signIn,
  signOut,
  signUp,
  getUserProfile,
  onAuthStateChange,
  getSession,
  getCurrentUser,
} from '../api/auth.api'
import { clearAuthCache, isSessionValid } from '@/shared/utils/auth-cache'

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    error,
    setUser,
    setSession,
    setProfile,
    setLoading,
    setError,
    reset,
  } = useAuthStore()

  /**
   * 초기 세션 로드
   */
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Supabase 세션 확인
      const session = await getSession()
      if (!session) {
        console.log('세션이 없습니다. 로그아웃 상태로 설정합니다.')
        reset()
        return
      }

      // 세션이 만료되었는지 확인
      if (!isSessionValid(session)) {
        console.log('세션이 만료되었습니다. 로그아웃 상태로 설정합니다.')
        reset()
        return
      }

      const user = await getCurrentUser()
      if (!user) {
        console.log('사용자 정보를 가져올 수 없습니다. 로그아웃 상태로 설정합니다.')
        reset()
        return
      }

      console.log('세션 초기화 성공:', { userId: user.id, email: user.email })
      setSession(session)
      setUser(user)

      // 프로필 조회
      const profile = await getUserProfile(user.id)
      if (profile) {
        setProfile(profile)
      }
    } catch (error: any) {
      console.error('세션 초기화 실패:', error)
      setError(error.message)
      reset()
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, setSession, setUser, setProfile, reset])

  /**
   * 인증 상태 변경 리스너 설정
   */
  useEffect(() => {
    // 초기 세션 로드
    initializeAuth()

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)

      if (event === 'SIGNED_IN' && session) {
        setSession(session)
        setUser(session.user)

        // 프로필 조회
        const profile = await getUserProfile(session.user.id)
        if (profile) {
          setProfile(profile)
        }
      } else if (event === 'SIGNED_OUT') {
        reset()
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session)
      }
    })

    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [initializeAuth, setSession, setUser, setProfile, reset]) // 필요한 의존성 추가

  /**
   * 로그인
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true)
        setError(null)

        const { user, session } = await signIn(email, password)

        if (!user || !session) {
          throw new Error('로그인에 실패했습니다.')
        }

        setUser(user)
        setSession(session)

        // 프로필 조회
        const profile = await getUserProfile(user.id)
        if (profile) {
          setProfile(profile)
        }

        return { user, session, profile }
      } catch (error: any) {
        console.error('로그인 실패:', error)
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser, setSession, setProfile]
  )

  /**
   * 회원가입
   */
  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      try {
        setLoading(true)
        setError(null)

        const { user, session } = await signUp(email, password, fullName)

        if (!user) {
          throw new Error('회원가입에 실패했습니다.')
        }

        setUser(user)
        if (session) {
          setSession(session)
        }

        // 프로필 조회 (자동 생성됨)
        const profile = await getUserProfile(user.id)
        if (profile) {
          setProfile(profile)
        }

        return { user, session, profile }
      } catch (error: any) {
        console.error('회원가입 실패:', error)
        setError(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, setUser, setSession, setProfile]
  )

  /**
   * 로그아웃
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('로그아웃 시작...')
      
      // Supabase 로그아웃
      await signOut()
      
      // Zustand store 초기화
      reset()
      
      // 모든 인증 관련 캐시 정리
      clearAuthCache()
      
      console.log('로그아웃 완료')
    } catch (error: any) {
      console.error('로그아웃 실패:', error)
      setError(error.message)
      // 에러가 발생해도 로컬 상태는 정리
      reset()
      throw error
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, reset])

  return {
    // State
    user,
    session,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',

    // Actions
    login,
    register,
    logout,
    initializeAuth,
  }
}
