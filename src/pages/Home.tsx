/**
 * 홈 페이지 - Stitch Veterinary 디자인 + AI펫닥터 콘텐츠 병합
 * - Material Symbols 아이콘
 * - 통합 진료 시스템 (3카드)
 * - 의료진 섹션 (DB 연동)
 * - 응급 섹션
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/shared/hooks/useLogout'
import { getAllVeterinarians } from '@/shared/api/veterinarians.api'
import type { Veterinarian } from '@/shared/api/veterinarians.api'

// Material Symbol 컴포넌트
function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

export default function Home() {
  const { isAuthenticated, profile } = useAuth()
  const { handleLogout, isLoggingOut } = useLogout()
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])

  // 의료진 데이터 로드
  useEffect(() => {
    async function loadVeterinarians() {
      try {
        const data = await getAllVeterinarians()
        setVeterinarians(data.filter(v => v.is_active).slice(0, 4))
      } catch (error) {
        console.error('의료진 로드 실패:', error)
      }
    }
    loadVeterinarians()
  }, [])

  // 기본 의료진 이미지 (DB에 photo_url이 없을 경우)
  const defaultDoctorImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBlAovFSHczyWjRolLJs6N-9O2qkcQ0uoh0zuojAzP2rLbrdwPfBHDpvvUDIzBB3QT8rJXIgYPFXRF44lLG6qECTQZqx7TSP6idP_95ZkTrY5SevhbUd2zXJrs5fUJWBIR5P_6_Lby0vh9w-bq7ejyqlhr2-o5qQc6Z798mXtr6O1B3n-YiR9eWRn9JKf4PMbt9m-kj2fZ_pT0s5BVAqPR0pqEZX4M64MfBYodbOcrtS047_kjTt6g7dkYm4HjBVOSrVS219UJPYzs',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBjIddZXtkSBYsIs5r2NNWqN7iHzlRkbZVPWbVjK0oZGKhY_H3R_Ch9QRKGu8fzfaiEe_dyxEedDCYdwlhdEWTt63mEv0oaFA9kyNrnSLEaggWdPpdTlWskPPw3I1AfgcWXz3CVQN2Y0f7QoT4uS8ukYRVTIE6XHCnHO-nAl-A62lt7y8Lm2RmuMoOxVwiEwjvKFWrvTYxdZN7IrfOAzxsUwqPQXQhJaxj33Y9-J-Ax5Ld8NCtRBwXFvL1fGwiLGuRJvZhACqeN9e4',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJpO2xxJCWqbmcEjlVJftqQZkWpeoR6ljHMRIJrZJqRy0nqvOuX29xxlwpG4jzRkVjIeF0AQxwEECp9Jsi1gJg6TWcQPQ3F7ucPMlx0VCnf8vE7EoWBoMa-6XD6QjPNi-d7zcwzB-RLh82ruE0eqCcx56xv1PU8JDTN4K4DxkSOyvd9Dj7IJU75tH8A_KOeepP53BNu-Nkv5nXikxYMxpAT9zn4GchuRVra1SglDfPsiA2oYUBDLBrdw4kj_dPDJkUuPB1Q7wK6hw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBr-nFUlLXz7v97hLNZE-rbqh1yKHA13JPBf5QMYFQb8E5d5ZngMiG7ZOEVwOG2Dt8bMupaeHhOgV0IEYHxOv9eZFn8UnuaLj9J3RzR7JceDvH1OsNPxHp1VV2ZaPx4LEqcaTWCjXoMRt96KwbB7d1JfqqKpwBOSJ_FkGEpIMBZHrboQr9VjRZMrG61gryEa9zExC1YgFhRLbEUSNuBvPIoLjubNhi7Yr1WGn5Iue5PdgSBqZPmV_ah5gCWd5JJp4ygyA-91JI4jPw',
  ]

  return (
    <div className="min-h-screen flex flex-col font-display antialiased text-gray-600 bg-background-light">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="size-10 bg-stitch-primary/10 rounded-lg flex items-center justify-center text-stitch-primary">
                <MaterialIcon name="pets" className="text-[28px]" />
              </div>
              <div>
                <h1 className="text-text-main text-lg font-bold leading-none tracking-tight">
                  AI펫닥터 대학동물병원
                </h1>
                <p className="text-xs text-stitch-primary font-medium uppercase tracking-wider mt-0.5">
                  AI 기반 교육 협력 병원
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-text-main text-sm font-medium hover:text-stitch-primary transition-colors">
                홈
              </Link>
              <Link to="/medical-guide" className="text-text-main text-sm font-medium hover:text-stitch-primary transition-colors">
                진료안내
              </Link>
              <Link to="/medical-guide" className="text-text-main text-sm font-medium hover:text-stitch-primary transition-colors">
                의료진 소개
              </Link>
              {isAuthenticated && (
                <Link to="/booking" className="text-text-main text-sm font-medium hover:text-stitch-primary transition-colors">
                  예약하기
                </Link>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Emergency Link */}
              <a href="tel:02-123-4567" className="hidden lg:flex items-center gap-2 text-alert-red font-bold text-sm">
                <MaterialIcon name="emergency" className="text-[20px]" />
                <span>응급의료센터</span>
              </a>

              {/* Auth Controls */}
              {isAuthenticated ? (
                <>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="hidden sm:flex text-gray-700 hover:text-stitch-primary font-medium text-sm transition-colors"
                    >
                      관리자
                    </Link>
                  )}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stitch-primary/10 rounded-lg">
                    <MaterialIcon name="person" className="text-[18px] text-stitch-primary" />
                    <span className="text-sm font-medium text-stitch-primary">
                      {profile?.full_name || profile?.email || '사용자'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-alert-red hover:bg-red-50 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    <MaterialIcon name="logout" className="text-[18px]" />
                    <span className="hidden sm:inline">{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-stitch-primary font-medium text-sm transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center rounded-lg h-10 px-5 bg-stitch-primary hover:bg-stitch-primary-dark transition-all text-white text-sm font-bold shadow-soft"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="flex flex-col gap-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stitch-primary/10 text-stitch-primary w-fit">
                  <MaterialIcon name="school" className="text-[16px]" />
                  <span className="text-xs font-bold uppercase tracking-wide">학문적 수월성 • AI 기반</span>
                </div>
                <h1 className="text-text-main text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  AI가 먼저 진단하는
                  <br />
                  <span className="text-stitch-primary">세계적 수준의 케어</span>
                </h1>
                <p className="text-lg text-gray-600 font-normal leading-relaxed max-w-xl">
                  AI 수의사가 1차 진단 후 가장 적합한 병원 예약까지.
                  대학 연구 기반의 첨단 의료 기술을 결합하여 최고의 케어를 제공합니다.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/booking"
                        className="h-12 px-8 rounded-lg bg-stitch-primary text-white font-bold text-base hover:bg-stitch-primary-dark transition-all shadow-lg shadow-stitch-primary/20 flex items-center gap-2"
                      >
                        <MaterialIcon name="calendar_add_on" className="text-[20px]" />
                        진료 예약
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="h-12 px-8 rounded-lg border border-gray-300 hover:bg-gray-50 text-text-main font-medium text-base transition-all flex items-center gap-2"
                      >
                        <MaterialIcon name="event_note" className="text-[20px]" />
                        내 예약
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        className="h-12 px-8 rounded-lg bg-stitch-primary text-white font-bold text-base hover:bg-stitch-primary-dark transition-all shadow-lg shadow-stitch-primary/20 flex items-center gap-2"
                      >
                        <MaterialIcon name="calendar_add_on" className="text-[20px]" />
                        진료 예약
                      </Link>
                      <Link
                        to="/medical-guide"
                        className="h-12 px-8 rounded-lg border border-gray-300 hover:bg-gray-50 text-text-main font-medium text-base transition-all flex items-center gap-2"
                      >
                        <MaterialIcon name="stethoscope" className="text-[20px]" />
                        진료 과목
                      </Link>
                    </>
                  )}
                </div>
                {/* Social Proof */}
                <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url('${defaultDoctorImages[0]}')` }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url('${defaultDoctorImages[1]}')` }}
                    />
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url('${defaultDoctorImages[2]}')` }}
                    />
                  </div>
                  <p>올해 10,000명 이상의 보호자가 선택했습니다</p>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4o0SUKYpkO45PnPYp9q9ZZL0saR2XqiQcMVw6lrPCWcSxkCegKZ-sen3AIZG3ZbQ3RwGvPZghqa_kWSwEnsyKSo1tErqwgA2A1PubObdiw562SoG39MnQx9cN51Y6ZUCpNzAsk6Ywe80q29-8wR_YImr11dPe4ZQzsOy16Fj9pmCyeUxMHfSY9EdMtXmmo9Ir4Cn72RCBgYwOB-yv0NsJnJVh9LvGdOkzCJRueLy30lvEY06hxGNWOhEEWGClPS_ena3nv7ctUOQ')`,
                  }}
                />
                <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-4 max-w-xs">
                    <p className="font-bold text-lg">김지은 교수</p>
                    <p className="text-sm opacity-90">외과 과장, 15년 경력</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrated Care System Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-3xl font-bold text-text-main mb-4">통합 진료 시스템</h2>
              <p className="text-lg text-gray-600">
                AI 기술과 대학 연구 기반의 첨단 의료를 결합한 스마트 헬스케어
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: AI Diagnosis */}
              <div className="p-8 rounded-xl bg-background-light border border-gray-100 transition-all hover:shadow-soft group">
                <div className="w-12 h-12 rounded-lg bg-stitch-primary/10 text-stitch-primary flex items-center justify-center mb-6 group-hover:bg-stitch-primary group-hover:text-white transition-colors">
                  <MaterialIcon name="biotech" className="text-[28px]" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">AI 진단 시스템</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI 수의사가 증상을 분석하고 1차 진단을 제공합니다.
                  스마트 진단서로 더 정확한 진료를 받으세요.
                </p>
              </div>
              {/* Card 2: 24/7 Emergency */}
              <div className="p-8 rounded-xl bg-background-light border border-gray-100 transition-all hover:shadow-soft group">
                <div className="w-12 h-12 rounded-lg bg-alert-red/10 text-alert-red flex items-center justify-center mb-6 group-hover:bg-alert-red group-hover:text-white transition-colors">
                  <MaterialIcon name="emergency" className="text-[28px]" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">365일 24시간 응급센터</h3>
                <p className="text-gray-600 leading-relaxed">
                  응급 전문의가 상주하는 외상 센터가 연중무휴로 운영되어
                  위급한 상황에 신속히 대처합니다.
                </p>
              </div>
              {/* Card 3: University Hospital */}
              <div className="p-8 rounded-xl bg-background-light border border-gray-100 transition-all hover:shadow-soft group">
                <div className="w-12 h-12 rounded-lg bg-stitch-primary/10 text-stitch-primary flex items-center justify-center mb-6 group-hover:bg-stitch-primary group-hover:text-white transition-colors">
                  <MaterialIcon name="school" className="text-[28px]" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3">대학 부속 병원</h3>
                <p className="text-gray-600 leading-relaxed">
                  최신 수의학 연구와 임상 시험을 바탕으로
                  과학적으로 검증된 치료 프로토콜을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Medical Staff Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-text-main mb-2">분야별 전문 의료진</h2>
                <p className="text-gray-600">각 분야를 선도하는 전문의들을 만나보세요.</p>
              </div>
              <Link
                to="/medical-guide"
                className="text-stitch-primary font-bold hover:text-stitch-primary-dark inline-flex items-center gap-1"
              >
                전체 의료진 보기
                <MaterialIcon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {veterinarians.length > 0
                ? veterinarians.map((vet, index) => (
                    <div
                      key={vet.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                    >
                      <div
                        className="aspect-[4/5] bg-cover bg-top"
                        style={{
                          backgroundImage: `url('${vet.photo_url || defaultDoctorImages[index % 4]}')`,
                        }}
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-text-main">{vet.name}</h3>
                        <p className="text-stitch-primary text-sm font-medium mb-4">
                          {vet.title || vet.specialization || '수의사'}
                        </p>
                        <Link
                          to={`/medical-guide/${vet.id}`}
                          className="mt-auto w-full py-2 rounded border border-gray-200 text-sm font-semibold hover:bg-gray-50 text-text-main transition-colors text-center block"
                        >
                          프로필 보기
                        </Link>
                      </div>
                    </div>
                  ))
                : // 샘플 데이터 (DB에 데이터가 없을 경우)
                  [
                    { name: '이소영 교수', title: '내과 전문의' },
                    { name: '박준호 교수', title: '외과 및 정형외과' },
                    { name: '최수민 교수', title: '종양학과' },
                    { name: '정우진 교수', title: '응급의학과' },
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                    >
                      <div
                        className="aspect-[4/5] bg-cover bg-top"
                        style={{ backgroundImage: `url('${defaultDoctorImages[index]}')` }}
                      />
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-text-main">{doc.name}</h3>
                        <p className="text-stitch-primary text-sm font-medium mb-4">{doc.title}</p>
                        <Link
                          to="/medical-guide"
                          className="mt-auto w-full py-2 rounded border border-gray-200 text-sm font-semibold hover:bg-gray-50 text-text-main transition-colors text-center block"
                        >
                          프로필 보기
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Emergency Section */}
        <section className="bg-background-dark py-16 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-stitch-primary/10 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-alert-red/20 text-red-400 mb-4 border border-red-900/50">
                  <MaterialIcon name="emergency" className="text-[18px] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">응급 프로토콜</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">응급 상황 발생 시</h2>
                <p className="text-gray-400 text-lg mb-8 max-w-xl">
                  반려동물에게 응급 상황이 발생한 경우 즉시 병원으로 내원해 주십시오.
                  위급 상황 시 예약 없이 진료 가능합니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:02-123-4567"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-white text-background-dark font-bold text-lg hover:bg-gray-100 transition-colors"
                  >
                    <MaterialIcon name="call" />
                    02-123-4567
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg border border-gray-600 text-white font-bold text-lg hover:bg-gray-800 transition-colors"
                  >
                    <MaterialIcon name="directions" />
                    오시는 길
                  </a>
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-auto">
                <div className="bg-surface-dark p-6 rounded-xl border border-gray-700 max-w-sm w-full">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <MaterialIcon name="schedule" className="text-stitch-primary" />
                    진료 시간
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                      <span>응급진료</span>
                      <span className="font-bold text-accent-sage">연중무휴 24시간</span>
                    </li>
                    <li className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
                      <span>전문 진료 (예약)</span>
                      <span>평일: 08:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>일반 진료</span>
                      <span>월-토: 09:00 - 17:00</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-stitch-primary/10 rounded-md flex items-center justify-center text-stitch-primary">
                  <MaterialIcon name="pets" className="text-[20px]" />
                </div>
                <span className="text-text-main text-lg font-bold">AI펫닥터 대학동물병원</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                AI 기술과 수의학 연구를 선도하며 동물의 삶의 질 향상을 위해 헌신하고 따뜻한 케어를 제공합니다.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-stitch-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-stitch-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-text-main mb-4">바로가기</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-stitch-primary transition-colors">
                    병원 소개
                  </Link>
                </li>
                <li>
                  <Link to="/medical-guide" className="hover:text-stitch-primary transition-colors">
                    진료 안내
                  </Link>
                </li>
                <li>
                  <Link to="/medical-guide" className="hover:text-stitch-primary transition-colors">
                    의료진 찾기
                  </Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link to="/my-bookings" className="hover:text-stitch-primary transition-colors">
                      내 예약
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h4 className="font-bold text-text-main mb-4">문의하기</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex gap-3 items-start">
                  <MaterialIcon name="location_on" className="text-stitch-primary shrink-0" />
                  <span>
                    서울특별시 관악구 관악로 1<br />
                    AI펫닥터 대학동물병원
                  </span>
                </li>
                <li className="flex gap-3 items-center">
                  <MaterialIcon name="call" className="text-stitch-primary shrink-0" />
                  <span>02-123-4567</span>
                </li>
                <li className="flex gap-3 items-center">
                  <MaterialIcon name="mail" className="text-stitch-primary shrink-0" />
                  <span>contact@aipetdoctor.kr</span>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <div className="rounded-lg overflow-hidden h-40 w-full bg-gray-200 relative group cursor-pointer">
                <div
                  className="w-full h-full bg-cover bg-center transition-opacity hover:opacity-90"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGtuOd6fOwQSQ1Vd2rIX1tmR3G3EDIGf9ZUNba5oZnJx-L1NRKXoVIeyxpPaLamHHLSixo-z1zTPBoRdtU_g3ai0DiHnYaFVTnWMV2lZ1lCbm6eKbJB_vKI_hdu7Xd401OAYxAynZcdd35zJ-gliKgdDufo6yzfdtZY0mjhOZj5GnBxOlchExDXn2niJgULq4WX9PA6Mu_zQo3530X9v5Fyoragpzte3ggW7JN6K9JoYqk1QmzqUF9f212bzWOsIbHpg5JhpiwTHE')`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 p-2 rounded-full shadow-lg">
                    <MaterialIcon name="pin_drop" className="text-stitch-primary text-2xl" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-xs font-bold rounded shadow-sm text-gray-800">
                  지도에서 보기
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>© 2025 AI펫닥터 대학동물병원. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-600">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-gray-600">
                이용약관
              </a>
              <a href="#" className="hover:text-gray-600">
                접근성 정책
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
