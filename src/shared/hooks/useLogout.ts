/**
 * useLogout Hook
 * - 로그아웃 로직을 통합 관리
 * - MainLayout과 AdminLayout에서 공통으로 사용
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { showToast } from '@/shared/components/Toast'
import { logger } from '@/shared/utils/logger'

export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      logger.info('⏸️ 이미 로그아웃 진행 중...')
      return // 중복 클릭 방지
    }

    try {
      setIsLoggingOut(true)
      logger.info('🚪 로그아웃 시작...')

      // Toast 먼저 표시
      showToast({
        title: '로그아웃 중입니다...',
        description: '잠시만 기다려주세요.',
        variant: 'info',
        duration: 2000,
      })

      // 로그아웃 실행 (Supabase signOut + localStorage 제거)
      await logout()

      logger.success('✅ 로그아웃 완료')

      // 상태가 완전히 정리될 때까지 약간 대기
      await new Promise(resolve => setTimeout(resolve, 100))

      // React Router로 페이지 이동 (새로고침 없음)
      logger.info('🏠 홈으로 이동...')
      navigate('/', { replace: true })

      // 약간의 딜레이 후 성공 Toast
      setTimeout(() => {
        showToast({
          title: '로그아웃 되었습니다',
          description: '안전하게 로그아웃 되었습니다.',
          variant: 'success',
          duration: 2000,
        })
      }, 200)
    } catch (error) {
      logger.error('❌ 로그아웃 실패:', error)
      showToast({
        title: '로그아웃에 실패했습니다',
        description: '다시 시도해주세요.',
        variant: 'error',
        duration: 3000,
      })
      // 오류 발생해도 홈으로 이동
      navigate('/', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout, navigate, isLoggingOut])

  return {
    handleLogout,
    isLoggingOut,
  }
}
