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

      const session = await getSession()
      if (!session) {
        reset()
        return
      }

      const user = await getCurrentUser()
      if (!user) {
        reset()
        return
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

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

      await signOut()
      reset()
    } catch (error: any) {
      console.error('로그아웃 실패:', error)
      setError(error.message)
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
