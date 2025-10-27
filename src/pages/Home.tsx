/**
 * 홈 페이지 - Clean Booking Design
 * - Teal/Green 색상 스타일
 * - 깔끔한 카드 기반 디자인
 */

import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  Calendar,
  Clock,
  Stethoscope,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  User,
  LogOut,
} from 'lucide-react'

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-teal-500" />
              <span className="text-2xl font-bold text-gray-900">
                AI펫닥터 병원
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/booking"
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-sm"
                  >
                    예약하기
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                  >
                    내 예약
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg border border-teal-200">
                    <User className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium text-teal-700">
                      {profile?.role === 'admin'
                        ? `${profile?.full_name || profile?.email || 'admin'} 관리자님`
                        : `${profile?.full_name || profile?.email || '사용자'} 보호자님`}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-sm"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI 기반 스마트 예약 시스템</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              반려동물 건강,
              <br />
              <span className="text-teal-500">AI가 먼저 진단합니다</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AI 수의사가 1차 진단 후 가장 적합한 병원 예약까지.
              <br />
              우리 아이를 위한 스마트 헬스케어 서비스입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/booking"
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>지금 예약하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-medium text-lg"
                  >
                    <Clock className="w-5 h-5" />
                    <span>내 예약 보기</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
                  >
                    <span>무료로 시작하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-medium text-lg"
                  >
                    <span>로그인</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Hero Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">행복동물병원</h3>
                  <p className="text-sm text-gray-500">서울시 강남구</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">AI 진단 연동</p>
                    <p className="text-sm text-gray-600">
                      AI 진단 결과와 함께 예약 정보 전달
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">스마트 진단서</p>
                    <p className="text-sm text-gray-600">
                      증상, 히스토리, 긴급도 한눈에 확인
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">실시간 알림</p>
                    <p className="text-sm text-gray-600">
                      예약 승인/수정/거절 즉시 알림
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">500+</p>
                  <p className="text-sm text-gray-600">예약 완료</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">4.9</p>
                  <p className="text-sm text-gray-600">평균 평점</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">24h</p>
                  <p className="text-sm text-gray-600">빠른 응답</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            왜 AI펫닥터 병원인가요?
          </h2>
          <p className="text-xl text-gray-600">
            AI 기술과 수의학 전문성의 완벽한 결합
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI 1차 진단
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI 수의사가 증상을 분석하고 1차 진단을 제공합니다.
              병원 방문 전 미리 정보를 파악할 수 있어요.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              스마트 예약
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI 진단 결과와 함께 예약 요청이 전달됩니다.
              긴급도에 따라 우선순위가 자동 설정돼요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Stethoscope className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              스마트 진단서
            </h3>
            <p className="text-gray-600 leading-relaxed">
              증상, AI 분석, 펫 히스토리를 한눈에 확인.
              병원은 더 정확한 진료를 제공할 수 있어요.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              실시간 알림
            </h3>
            <p className="text-gray-600 leading-relaxed">
              예약 승인, 수정, 거절 시 즉시 알림을 받습니다.
              양방향 소통으로 스케줄을 조율해요.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              긴급도 우선순위
            </h3>
            <p className="text-gray-600 leading-relaxed">
              응급/높음/보통/낮음 긴급도 표시로
              위급한 환자를 우선 케어할 수 있어요.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-teal-50">
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              펫 히스토리
            </h3>
            <p className="text-gray-600 leading-relaxed">
              과거 진료 기록, 알레르기, 복용 중인 약 등
              모든 정보가 한곳에 저장돼요.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            어떻게 작동하나요?
          </h2>
          <p className="text-xl text-gray-600">
            간단한 4단계로 완료되는 스마트 예약
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              AI 상담
            </h3>
            <p className="text-gray-600">
              AI펫닥터 앱에서 증상을 입력하고 AI 수의사와 상담
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              진단서 생성
            </h3>
            <p className="text-gray-600">
              AI가 증상을 분석하고 스마트 진단서를 생성
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              병원 예약
            </h3>
            <p className="text-gray-600">
              진단서와 함께 병원에 예약 요청이 자동 전송
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              4
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              예약 확정
            </h3>
            <p className="text-gray-600">
              병원 승인 후 예약 확정 알림을 받고 방문
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-teal-50 mb-8 max-w-2xl mx-auto">
            AI 기술로 더 빠르고 정확한 반려동물 헬스케어를 경험해보세요.
            회원가입은 무료입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/booking"
                className="px-8 py-4 bg-white text-teal-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-lg"
              >
                지금 예약하기
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white text-teal-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-lg"
                >
                  무료로 시작하기
                </Link>
                <Link
                  to="/design"
                  className="px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-medium text-lg border-2 border-white/30"
                >
                  디자인 컨셉 보기
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-teal-500" />
                <span className="text-white font-bold text-lg">AI펫닥터</span>
              </div>
              <p className="text-sm">
                AI 기반 반려동물 헬스케어 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/booking" className="hover:text-teal-500 transition-colors">
                    예약하기
                  </Link>
                </li>
                <li>
                  <Link to="/my-bookings" className="hover:text-teal-500 transition-colors">
                    내 예약
                  </Link>
                </li>
                <li>
                  <Link to="/design" className="hover:text-teal-500 transition-colors">
                    디자인
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm">
                <li>FAQ</li>
                <li>고객센터</li>
                <li>이용약관</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-sm">
                <li>support@aipetdoctor.com</li>
                <li>02-1234-5678</li>
                <li>서울시 강남구</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 AI펫닥터 병원 관리 시스템. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
