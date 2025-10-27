/**
 * App.tsx - 루트 컴포넌트
 * - React Router 설정
 * - 인증 초기화
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { ToastContainer } from '@/shared/components'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Booking from '@/pages/Booking'
import MyBookings from '@/pages/MyBookings'

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard'
import Bookings from '@/pages/admin/Bookings'
import Settings from '@/pages/admin/Settings'

// Design Concepts
import DesignConcepts from '@/pages/DesignConcepts'
import Concept1_ModernMinimal from '@/pages/design-concepts/Concept1_ModernMinimal'
import Concept2_WarmPetCare from '@/pages/design-concepts/Concept2_WarmPetCare'
import Concept3_ProfessionalMedical from '@/pages/design-concepts/Concept3_ProfessionalMedical'
import Concept4_Glassmorphism from '@/pages/design-concepts/Concept4_Glassmorphism'
import Concept5_DarkTech from '@/pages/design-concepts/Concept5_DarkTech'
import Concept6_CleanBooking from '@/pages/design-concepts/Concept6_CleanBooking'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Design Concepts */}
        <Route path="/design" element={<DesignConcepts />} />
        <Route path="/design/modern-minimal" element={<Concept1_ModernMinimal />} />
        <Route path="/design/warm-pet-care" element={<Concept2_WarmPetCare />} />
        <Route path="/design/professional-medical" element={<Concept3_ProfessionalMedical />} />
        <Route path="/design/glassmorphism" element={<Concept4_Glassmorphism />} />
        <Route path="/design/dark-tech" element={<Concept5_DarkTech />} />
        <Route path="/design/clean-booking" element={<Concept6_CleanBooking />} />

        {/* Protected Routes - Customer */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute requireAdmin>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requireAdmin>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
