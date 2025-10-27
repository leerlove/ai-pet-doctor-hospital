/**
 * 내 예약 페이지 (고객용)
 * - 내 예약 목록
 * - 예약 상세보기
 * - 예약 취소
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { getBookingsByUserId } from '@/shared/api/bookings.api'
import { Badge, Button, Card, CardBody, PageHeader } from '@/shared/components'
import { BookingDetailModal } from '@/features/booking/components'
import { useBookingActions } from '@/features/booking/hooks/useBookingActions'
import type { Database } from '@/shared/types/database.types'
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import type { BookingStatus } from '@/features/booking/stores/bookingStore'

type Booking = Database['public']['Tables']['bookings']['Row']

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'past'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const { cancelBooking } = useBookingActions()

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  const loadBookings = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const data = await getBookingsByUserId(user.id)
      setBookings(data)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0]

    if (selectedTab === 'upcoming') {
      return bookings.filter(
        (b) => b.booking_date >= today && b.status !== 'cancelled' && b.status !== 'completed'
      )
    } else if (selectedTab === 'past') {
      return bookings.filter(
        (b) => b.booking_date < today || b.status === 'completed' || b.status === 'cancelled'
      )
    }
    return bookings
  }

  const filteredBookings = getFilteredBookings()

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const handleCancelBooking = async (booking: Booking) => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) {
      return
    }

    const success = await cancelBooking(booking.id)
    if (success) {
      setIsDetailModalOpen(false)
      loadBookings() // 목록 새로고침
    }
  }

  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedBooking(null)
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

    const icons: Record<BookingStatus, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      confirmed: <CheckCircle className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      'no-show': <AlertCircle className="w-3 h-3" />,
    }

    return (
      <Badge variant={variants[status]} dot>
        {icons[status]}
        <span>{labels[status]}</span>
      </Badge>
    )
  }

  const getStatusMessage = (booking: Booking) => {
    if (booking.status === 'pending') {
      return {
        type: 'warning',
        icon: <Clock className="w-5 h-5" />,
        title: '예약 승인 대기 중',
        message: '병원에서 예약을 확인 중입니다. 곧 연락드릴 예정입니다.',
      }
    } else if (booking.status === 'confirmed') {
      return {
        type: 'success',
        icon: <CheckCircle className="w-5 h-5" />,
        title: '예약 확정',
        message: '예약이 확정되었습니다. 예약 시간에 방문해주세요.',
      }
    } else if (booking.status === 'cancelled') {
      return {
        type: 'error',
        icon: <XCircle className="w-5 h-5" />,
        title: '예약 취소됨',
        message: '예약이 취소되었습니다.',
      }
    } else if (booking.status === 'completed') {
      return {
        type: 'success',
        icon: <CheckCircle className="w-5 h-5" />,
        title: '진료 완료',
        message: '진료가 완료되었습니다. 이용해 주셔서 감사합니다.',
      }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader title="내 예약" />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'all'
                ? 'text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            전체 ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'upcoming'
                ? 'text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            예정된 예약
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'past'
                ? 'text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            지난 예약
          </button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">예약 내역이 없습니다</h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'all'
                ? '아직 예약하신 내역이 없습니다.'
                : selectedTab === 'upcoming'
                ? '예정된 예약이 없습니다.'
                : '지난 예약 내역이 없습니다.'}
            </p>
            <Link to="/">
              <Button variant="primary">예약하러 가기</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const statusMsg = getStatusMessage(booking)
              return (
                <Card key={booking.id} className="hover:shadow-xl transition-shadow">
                  <CardBody>
                    {/* Status Alert */}
                    {statusMsg && (
                      <div
                        className={`flex items-start space-x-3 p-4 rounded-xl mb-6 ${
                          statusMsg.type === 'warning'
                            ? 'bg-amber-50 border border-amber-200'
                            : statusMsg.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 ${
                            statusMsg.type === 'warning'
                              ? 'text-amber-600'
                              : statusMsg.type === 'success'
                              ? 'text-emerald-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {statusMsg.icon}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-bold mb-1 ${
                              statusMsg.type === 'warning'
                                ? 'text-amber-900'
                                : statusMsg.type === 'success'
                                ? 'text-emerald-900'
                                : 'text-gray-900'
                            }`}
                          >
                            {statusMsg.title}
                          </h4>
                          <p
                            className={`text-sm ${
                              statusMsg.type === 'warning'
                                ? 'text-amber-700'
                                : statusMsg.type === 'success'
                                ? 'text-emerald-700'
                                : 'text-gray-700'
                            }`}
                          >
                            {statusMsg.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Booking Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {booking.booking_number}
                          </h3>
                          {getStatusBadge(booking.status as BookingStatus)}
                        </div>

                        <div className="flex items-center space-x-3 text-gray-700">
                          <Calendar className="w-5 h-5 text-teal-600" />
                          <div>
                            <div className="font-medium">{booking.booking_date}</div>
                            <div className="text-sm text-gray-500">{booking.booking_time}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-gray-700">
                          <Heart className="w-5 h-5 text-pink-600" />
                          <div>
                            <div className="font-medium">{booking.pet_name}</div>
                            <div className="text-sm text-gray-500">
                              {booking.pet_species} · {booking.pet_breed}
                              {booking.pet_age && ` · ${booking.pet_age}`}
                            </div>
                          </div>
                        </div>

                        {booking.symptoms && (
                          <div className="flex items-start space-x-3 text-gray-700">
                            <Stethoscope className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-medium mb-1">증상</div>
                              <div className="text-sm text-gray-600">{booking.symptoms}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Clinic Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4">병원 정보</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">행복동물병원</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">02-1234-5678</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">info@happyvet.com</span>
                          </div>
                        </div>

                        {booking.admin_notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              병원 메모
                            </div>
                            <div className="text-sm text-gray-600">{booking.admin_notes}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        상세보기
                      </Button>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking)}
                        >
                          예약 취소
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        onCancel={handleCancelBooking}
        isAdmin={false}
      />
    </div>
  )
}
