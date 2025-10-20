/**
 * 관리자 예약 목록 페이지
 * - 예약 목록 (테이블)
 * - 필터링 (상태, 소스, 날짜, 검색)
 * - 정렬
 * - 예약 상세보기/생성/수정
 */

import { useEffect, useState } from 'react'
import {
  useBookingStore,
  useFilteredBookings,
  useBookingFilters,
  useBookingStats,
  useBookingLoading,
  type BookingStatus,
  type BookingSource,
} from '@/features/booking/stores/bookingStore'
import { getAllBookings, subscribeToBookings } from '@/shared/api/bookings.api'
import { getAllServices } from '@/shared/api/services.api'
import { Badge, Button, Input } from '@/shared/components'
import { toast } from '@/shared/components/Toast'
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  Heart,
  Download,
  RefreshCw,
} from 'lucide-react'

export default function Bookings() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  const filteredBookings = useFilteredBookings()
  const filters = useBookingFilters()
  const stats = useBookingStats()
  const isLoading = useBookingLoading()

  const { setBookings, setFilters, clearFilters, setServices, setLoading, addBooking, updateBooking } =
    useBookingStore()

  // Load bookings and services
  useEffect(() => {
    loadData()
  }, [])

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = subscribeToBookings((payload) => {
      if (payload.eventType === 'INSERT') {
        addBooking(payload.new)
        toast.success('새 예약', '새로운 예약이 등록되었습니다')
      } else if (payload.eventType === 'UPDATE') {
        updateBooking(payload.new.id, payload.new)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [bookingsData, servicesData] = await Promise.all([
        getAllBookings(),
        getAllServices(),
      ])
      setBookings(bookingsData)
      setServices(servicesData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('오류', '데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusFilter = (status?: BookingStatus) => {
    setFilters({ status })
  }

  const handleSourceFilter = (source?: BookingSource) => {
    setFilters({ source })
  }

  const handleSearch = (query: string) => {
    setFilters({ searchQuery: query })
  }

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

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getSourceBadge = (source: BookingSource) => {
    return source === 'ai_pet_doctor' ? (
      <Badge variant="info">AI 연동</Badge>
    ) : (
      <Badge variant="default">직접 예약</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">예약 관리</h1>
              <p className="text-gray-600 mt-1">전체 예약 목록을 확인하고 관리하세요</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={loadData}
                isLoading={isLoading}
              >
                새로고침
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Download className="w-4 h-4" />}
              >
                내보내기
              </Button>
              <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                새 예약
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-50">
            <div className="text-sm text-gray-600 mb-1">전체</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-50">
            <div className="text-sm text-gray-600 mb-1">대기중</div>
            <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-50">
            <div className="text-sm text-gray-600 mb-1">승인됨</div>
            <div className="text-3xl font-bold text-teal-600">{stats.confirmed}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-50">
            <div className="text-sm text-gray-600 mb-1">완료</div>
            <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">취소</div>
            <div className="text-3xl font-bold text-gray-600">{stats.cancelled}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-red-50">
            <div className="text-sm text-gray-600 mb-1">노쇼</div>
            <div className="text-3xl font-bold text-red-600">{stats.noShow}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-teal-50">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">필터</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="예약 번호, 고객명, 펫 이름 검색..."
                leftIcon={<Search className="w-4 h-4" />}
                value={filters.searchQuery || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                value={filters.status || ''}
                onChange={(e) => handleStatusFilter(e.target.value as BookingStatus || undefined)}
              >
                <option value="">전체 상태</option>
                <option value="pending">대기중</option>
                <option value="confirmed">승인됨</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소됨</option>
                <option value="no-show">노쇼</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                value={filters.source || ''}
                onChange={(e) => handleSourceFilter(e.target.value as BookingSource || undefined)}
              >
                <option value="">전체 소스</option>
                <option value="direct">직접 예약</option>
                <option value="ai_pet_doctor">AI 연동</option>
              </select>
            </div>
          </div>

          {(filters.status || filters.source || filters.searchQuery) && (
            <div className="mt-4 flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                필터 초기화
              </Button>
              <span className="text-sm text-gray-500">
                {filteredBookings.length}개 결과
              </span>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-teal-50">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-500 mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">예약이 없습니다</p>
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                첫 예약 등록하기
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-teal-50 border-b-2 border-teal-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      예약 번호
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      고객 정보
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      펫 정보
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      예약 일시
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      상태
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      소스
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedBookingId(booking.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {booking.booking_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-pink-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.pet_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.pet_species} · {booking.pet_breed}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.booking_date}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.booking_time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status as BookingStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {getSourceBadge(booking.source as BookingSource)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBookingId(booking.id)
                          }}
                        >
                          상세보기
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* TODO: Modals */}
      {/* <BookingDetailModal bookingId={selectedBookingId} onClose={() => setSelectedBookingId(null)} /> */}
      {/* <BookingCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
    </div>
  )
}
