/**
 * 인증 상태 관리 Store (Zustand)
 * - 로그인/로그아웃
 * - 사용자 세션 관리
 * - 사용자 정보 조회
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { User as DBUser } from '@/shared/types/database.types'

interface AuthState {
  // State
  user: User | null
  session: Session | null
  profile: DBUser | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: DBUser | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  error: null,
}

/**
 * Auth Store
 * - localStorage에 세션 정보 저장 (persist)
 * - 페이지 새로고침 시에도 로그인 상태 유지
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setSession: (session) => set({ session }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      // session과 user만 persist (민감하지 않은 데이터만)
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
      }),
    }
  )
)

// Selector hooks (성능 최적화)
export const useUser = () => useAuthStore((state) => state.user)
export const useSession = () => useAuthStore((state) => state.session)
export const useProfile = () => useAuthStore((state) => state.profile)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)

// Helper: 관리자 여부 확인
export const useIsAdmin = () => {
  const profile = useProfile()
  return profile?.role === 'admin'
}

// Helper: 로그인 여부 확인
export const useIsAuthenticated = () => {
  const user = useUser()
  return !!user
}
