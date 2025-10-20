/**
 * Booking Store (Zustand)
 * - 예약 목록 상태 관리
 * - 필터링, 정렬, 선택된 예약
 */

import { useMemo } from 'react'
import { create } from 'zustand'
import type { Database } from '@/shared/types/database.types'

type Booking = Database['public']['Tables']['bookings']['Row']
type Service = Database['public']['Tables']['services']['Row']

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
export type BookingSource = 'direct' | 'ai_pet_doctor'

interface BookingFilters {
  status?: BookingStatus
  source?: BookingSource
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
}

interface BookingState {
  // State
  bookings: Booking[]
  services: Service[]
  selectedBooking: Booking | null
  filters: BookingFilters
  isLoading: boolean
  error: string | null

  // Actions
  setBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  setSelectedBooking: (booking: Booking | null) => void
  setFilters: (filters: Partial<BookingFilters>) => void
  clearFilters: () => void
  setServices: (services: Service[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getFilteredBookings: () => Booking[]
  getBookingsByStatus: (status: BookingStatus) => Booking[]
  getBookingStats: () => {
    total: number
    pending: number
    confirmed: number
    cancelled: number
    completed: number
    noShow: number
  }
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial State
  bookings: [],
  services: [],
  selectedBooking: null,
  filters: {},
  isLoading: false,
  error: null,

  // Actions
  setBookings: (bookings) => set({ bookings }),

  addBooking: (booking) =>
    set((state) => ({
      bookings: [booking, ...state.bookings],
    })),

  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      ),
      selectedBooking:
        state.selectedBooking?.id === id
          ? { ...state.selectedBooking, ...updates }
          : state.selectedBooking,
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
      selectedBooking: state.selectedBooking?.id === id ? null : state.selectedBooking,
    })),

  setSelectedBooking: (booking) => set({ selectedBooking: booking }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: {} }),

  setServices: (services) => set({ services }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Computed
  getFilteredBookings: () => {
    const { bookings, filters } = get()
    let filtered = [...bookings]

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((b) => b.status === filters.status)
    }

    // Filter by source
    if (filters.source) {
      filtered = filtered.filter((b) => b.source === filters.source)
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((b) => b.booking_date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((b) => b.booking_date <= filters.dateTo!)
    }

    // Filter by search query (customer name, pet name, booking number)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(query) ||
          b.pet_name?.toLowerCase().includes(query) ||
          b.booking_number?.toLowerCase().includes(query)
      )
    }

    // Sort by booking_date DESC, then by booking_time DESC
    filtered.sort((a, b) => {
      const dateCompare = b.booking_date.localeCompare(a.booking_date)
      if (dateCompare !== 0) return dateCompare
      return (b.booking_time || '').localeCompare(a.booking_time || '')
    })

    return filtered
  },

  getBookingsByStatus: (status) => {
    const { bookings } = get()
    return bookings.filter((b) => b.status === status)
  },

  getBookingStats: () => {
    const { bookings } = get()
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      noShow: bookings.filter((b) => b.status === 'no-show').length,
    }
  },
}))

// Selector hooks for better performance
export const useBookings = () => useBookingStore((state) => state.bookings)

// Fix: Use useMemo to cache the result and prevent infinite loop
export const useFilteredBookings = () => {
  const bookings = useBookingStore((state) => state.bookings)
  const filters = useBookingStore((state) => state.filters)

  return useMemo(() => {
    let filtered = [...bookings]

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((b) => b.status === filters.status)
    }

    // Filter by source
    if (filters.source) {
      filtered = filtered.filter((b) => b.source === filters.source)
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((b) => b.booking_date >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((b) => b.booking_date <= filters.dateTo!)
    }

    // Filter by search query (customer name, pet name, booking number)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(query) ||
          b.pet_name?.toLowerCase().includes(query) ||
          b.booking_number?.toLowerCase().includes(query)
      )
    }

    // Sort by booking_date DESC, then by booking_time DESC
    filtered.sort((a, b) => {
      const dateCompare = b.booking_date.localeCompare(a.booking_date)
      if (dateCompare !== 0) return dateCompare
      return (b.booking_time || '').localeCompare(a.booking_time || '')
    })

    return filtered
  }, [bookings, filters])
}

export const useSelectedBooking = () => useBookingStore((state) => state.selectedBooking)
export const useBookingFilters = () => useBookingStore((state) => state.filters)

// Fix: Use useMemo to cache the result and prevent infinite loop
export const useBookingStats = () => {
  const bookings = useBookingStore((state) => state.bookings)

  // Only recalculate when bookings array reference changes
  return useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    noShow: bookings.filter((b) => b.status === 'no-show').length,
  }), [bookings])
}

export const useBookingLoading = () => useBookingStore((state) => state.isLoading)
export const useBookingError = () => useBookingStore((state) => state.error)
export const useServices = () => useBookingStore((state) => state.services)
