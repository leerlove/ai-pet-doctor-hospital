/**
 * Protected Route 컴포넌트
 * - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 * - 관리자 전용 라우트 보호
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useUser, useProfile } from '@/features/auth/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const user = useUser()
  const profile = useProfile()
  const location = useLocation()

  // 인증되지 않은 경우
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 관리자 권한이 필요한데 관리자가 아닌 경우
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
