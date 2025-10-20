/**
 * 관리자 대시보드
 * - 통계 카드 (예약, 매출 등)
 * - 최근 예약 목록
 * - 오늘의 일정
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBookingStore, useBookingStats, type BookingStatus } from '@/features/booking/stores/bookingStore'
import { getAllBookings } from '@/shared/api/bookings.api'
import { Badge } from '@/shared/components'
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

export default function Dashboard() {
  const stats = useBookingStats()
  const { bookings, setBookings, setLoading } = useBookingStore()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await getAllBookings()
      setBookings(data)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get today's bookings
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = bookings
    .filter((b) => b.booking_date === today)
    .sort((a, b) => (a.booking_time || '').localeCompare(b.booking_time || ''))

  // Get recent bookings (last 10)
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 10)

  // Get pending bookings
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, 'pending' | 'confirmed' | 'cancelled' | 'completed'> = {
      pending: 'pending',
      confirmed: 'confirmed',
      cancelled: 'cancelled',
      completed: 'completed',
      'no-show': 'cancelled',
    }

    const labels: Record<BookingStatus, string> = {
      pending: '대기중',
      confirmed: '승인됨',
      cancelled: '취소됨',
      completed: '완료',
      'no-show': '노쇼',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>전체 예약 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Urgent Alert */}
        {pendingBookings.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-1">
                승인 대기 중인 예약이 {pendingBookings.length}건 있습니다
              </h3>
              <p className="text-amber-700 mb-3">고객이 예약 승인을 기다리고 있습니다.</p>
              <Link
                to="/admin/bookings"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                <span>지금 확인하기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-teal-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</h3>
            <p className="text-gray-600">총 예약</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              {stats.pending > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.pending}</h3>
            <p className="text-gray-600">대기중</p>
          </div>

          {/* Confirmed Today */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{todayBookings.length}</h3>
            <p className="text-gray-600">오늘 예약</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">+8%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.completed}</h3>
            <p className="text-gray-600">완료</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">오늘의 일정</h2>
              </div>
              <Link
                to="/admin/bookings"
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                전체 보기 →
              </Link>
            </div>

            {todayBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">오늘 예약이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900">{booking.pet_name}</h3>
                        {getStatusBadge(booking.status as BookingStatus)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {booking.customer_name} · {booking.customer_phone}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{booking.booking_time}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">최근 예약</h2>
              </div>
              <Link
                to="/admin/bookings"
                className="text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                전체 보기 →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">예약이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {booking.pet_name}
                        </h3>
                        <p className="text-xs text-gray-600">{booking.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status as BookingStatus)}
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.booking_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            to="/admin/bookings"
            className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50 hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">예약 관리</h3>
            <p className="text-gray-600 text-sm">전체 예약을 확인하고 관리합니다</p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50 hover:shadow-xl transition-shadow group"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">클리닉 설정</h3>
            <p className="text-gray-600 text-sm">병원 정보와 영업시간을 설정합니다</p>
          </Link>

          <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl shadow-lg p-8 text-white hover:shadow-xl transition-shadow group cursor-pointer">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI 진단서</h3>
            <p className="text-teal-50 text-sm">AI 연동 예약과 스마트 진단서</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              Coming Soon
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
