/**
 * Main Layout
 * - 일반 사용자용 레이아웃
 * - 네비게이션 바 포함
 */

import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function MainLayout() {
  const { isAuthenticated, profile, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
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
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
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
                  <span className="text-sm text-gray-600">
                    {profile?.full_name || profile?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    로그아웃
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
                    className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
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
