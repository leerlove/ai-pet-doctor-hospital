/**
 * Main Layout
 * - 일반 사용자용 레이아웃
 * - 네비게이션 바 포함
 */

import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { User, LogOut } from 'lucide-react'

export function MainLayout() {
  const { isAuthenticated, profile, logout } = useAuth()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()

    console.log('🚪 로그아웃 프로세스 시작...')

    // 백그라운드에서 로그아웃 실행 (결과를 기다리지 않음)
    logout().catch((error) => {
      console.error('❌ 로그아웃 중 오류 발생:', error)
    })

    // 즉시 페이지 리다이렉트 (로그아웃 완료를 기다리지 않음)
    console.log('🔄 페이지 새로고침...')
    window.location.replace('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                AI펫닥터 병원
              </Link>
            </div>

            {/* Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/booking"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                  >
                    예약하기
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    내 예약
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-md border border-primary-200">
                    <User className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                      {profile?.role === 'admin'
                        ? `${profile?.full_name || profile?.email || 'admin'} 관리자님`
                        : `${profile?.full_name || profile?.email || '사용자'} 보호자님`}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 AI펫닥터 병원 관리 시스템. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
