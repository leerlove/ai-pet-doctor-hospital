/**
 * Admin Layout
 * - 관리자용 레이아웃
 * - 사이드바 네비게이션 포함
 */

import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function AdminLayout() {
  const location = useLocation()
  const { profile, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/admin/dashboard', label: '대시보드' },
    { path: '/admin/bookings', label: '예약 관리' },
    { path: '/admin/services', label: '서비스 관리' },
    { path: '/admin/settings', label: '설정' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link to="/" className="text-xl font-bold text-primary-600">
              AI펫닥터 관리자
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b">
            <div className="text-sm font-medium text-gray-900">
              {profile?.full_name || profile?.email}
            </div>
            <div className="text-xs text-gray-500 mt-1">관리자</div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 w-64 p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              로그아웃
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <header className="bg-white shadow">
            <div className="px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {navItems.find((item) => isActive(item.path))?.label ||
                  '관리자 페이지'}
              </h1>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
