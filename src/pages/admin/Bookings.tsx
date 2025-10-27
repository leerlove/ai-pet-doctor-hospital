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
import { getAllBookings, subscribeToBookings, updateBooking } from '@/shared/api/bookings.api'
import { getAllServices } from '@/shared/api/services.api'
import { Badge, Button, Input, TableSkeleton, CardSkeleton } from '@/shared/components'
import { showToast } from '@/shared/components/Toast'
import { BookingDetailModal, BookingEditModal } from '@/features/booking/components'
import { useBookingActions } from '@/features/booking/hooks/useBookingActions'
import type { Booking } from '@/shared/types/database.types'
import {
  Calendar,
  Search,
  Filter,
  Clock,
  User,
  Heart,
  Download,
  RefreshCw,
} from 'lucide-react'

export default function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const filteredBookings = useFilteredBookings()
  const filters = useBookingFilters()
  const stats = useBookingStats()
  const isLoading = useBookingLoading()

  const { setBookings, setFilters, clearFilters, setServices, setLoading, addBooking, updateBooking: updateBookingInStore } =
    useBookingStore()

  const { rescheduleBooking } = useBookingActions()

  // Load bookings and services on mount
  useEffect(() => {
    loadData()
    loadServicesOnce()
  }, [])

  // Services는 한 번만 로드 (변경 빈도 낮음)
  const loadServicesOnce = async () => {
    try {
      const servicesData = await getAllServices()
      setServices(servicesData)
    } catch (error) {
      console.error('Failed to load services:', error)
    }
  }

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = subscribeToBookings((payload) => {
      if (payload.eventType === 'INSERT') {
        addBooking(payload.new)
        showToast({ title: '새 예약', description: '새로운 예약이 등록되었습니다', variant: 'success' })
      } else if (payload.eventType === 'UPDATE') {
        updateBookingInStore(payload.new.id, payload.new)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const bookingsData = await getAllBookings()
      setBookings(bookingsData)
    } catch (error) {
      console.error('Failed to load bookings:', error)
      showToast({ title: '오류', description: '예약 데이터를 불러오는데 실패했습니다', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleApprove = async (booking: Booking) => {
    try {
      const updated = await updateBooking(booking.id, { status: 'confirmed' })
      updateBookingInStore(booking.id, updated)
      showToast({ title: '예약 승인', description: '예약이 승인되었습니다', variant: 'success' })
      setIsDetailModalOpen(false)
      // loadData() 제거 - Realtime 구독과 Store 업데이트로 충분
    } catch (error) {
      console.error('Failed to approve booking:', error)
      showToast({ title: '오류', description: '예약 승인에 실패했습니다', variant: 'error' })
    }
  }

  const handleReject = async (booking: Booking) => {
    try {
      const updated = await updateBooking(booking.id, { status: 'cancelled' })
      updateBookingInStore(booking.id, updated)
      showToast({ title: '예약 거절', description: '예약이 취소되었습니다', variant: 'success' })
      setIsDetailModalOpen(false)
      // loadData() 제거 - Realtime 구독과 Store 업데이트로 충분
    } catch (error) {
      console.error('Failed to reject booking:', error)
      showToast({ title: '오류', description: '예약 거절에 실패했습니다', variant: 'error' })
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (bookingId: string, newDate: string, newTime: string) => {
    const success = await rescheduleBooking(
      bookingId,
      newDate,
      newTime,
      selectedBooking?.status
    )
    if (success) {
      setIsEditModalOpen(false)
      setSelectedBooking(null)
      loadData() // 목록 새로고침
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBooking(null)
  }

  // 승인 완료 건을 다시 승인 대기로 전환
  const handleRevertToPending = async (booking: Booking) => {
    if (!window.confirm('승인된 예약을 다시 승인 대기 상태로 변경하시겠습니까?')) {
      return
    }

    try {
      const updated = await updateBooking(booking.id, { status: 'pending' })
      updateBookingInStore(booking.id, updated)
      showToast({
        title: '상태 변경 완료',
        description: '예약이 승인 대기 상태로 변경되었습니다',
        variant: 'success',
      })
      setIsDetailModalOpen(false)
    } catch (error) {
      console.error('Failed to revert to pending:', error)
      showToast({ title: '오류', description: '상태 변경에 실패했습니다', variant: 'error' })
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
              {/* TODO: 새 예약 모달 구현 */}
              {/* <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                새 예약
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : (
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
        )}

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
            <div className="p-6">
              <TableSkeleton rows={10} />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">예약이 없습니다</p>
              {/* TODO: 새 예약 모달 구현 */}
              {/* <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                첫 예약 등록하기
              </Button> */}
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
                      onClick={() => handleBookingClick(booking)}
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
                            setSelectedBooking(booking)
                            setIsDetailModalOpen(true)
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

      {/* Booking Detail Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        onEdit={handleEditBooking}
        onApprove={handleApprove}
        onReject={handleReject}
        onRevertToPending={handleRevertToPending}
        isAdmin={true}
      />

      {/* Booking Edit Modal */}
      <BookingEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        booking={selectedBooking}
        onSave={handleSaveEdit}
      />

      {/* TODO: Create Modal */}
      {/* <BookingCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
    </div>
  )
}
