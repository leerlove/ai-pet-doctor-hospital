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
    if (isLoggingOut) return // 중복 클릭 방지

    try {
      setIsLoggingOut(true)
      logger.info('로그아웃 시작...')

      await logout()

      logger.success('로그아웃 완료')
      showToast({
        title: '로그아웃되었습니다',
        variant: 'success',
        duration: 2000,
      })

      // React Router로 리다이렉트
      navigate('/', { replace: true })
    } catch (error) {
      logger.error('로그아웃 실패:', error)
      showToast({
        title: '로그아웃에 실패했습니다',
        description: '다시 시도해주세요.',
        variant: 'error',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout, navigate, isLoggingOut])

  return {
    handleLogout,
    isLoggingOut,
  }
}
