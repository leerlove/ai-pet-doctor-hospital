/**
 * 디자인 컨셉 3: Professional Medical
 * - 의료 전문성과 신뢰감
 * - 블루 계열 색상
 * - 데이터와 통계 중심
 * - 깔끔하고 체계적인 레이아웃
 */

export default function Concept3_ProfessionalMedical() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - 의료 기관 느낌 */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span>📞 24시간 긴급 상담: 1588-0000</span>
            <span>✉️ support@aipetdoctor.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-200">관리자 로그인</a>
          </div>
        </div>
      </div>

      {/* Navigation - 전문적인 네비게이션 */}
      <nav className="bg-white border-b-2 border-blue-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">+</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">AI펫닥터</h1>
                <p className="text-xs text-gray-500">Professional Pet Healthcare</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">진료 예약</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">진료 과목</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">의료진 소개</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">진료 안내</a>
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                온라인 상담
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 전문적이고 신뢰감 있는 */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                AI 기반 수의학 진단 시스템
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                정확한 진단과<br />
                신뢰할 수 있는 치료
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                최첨단 AI 기술과 전문 수의사의 경험을 결합하여
                반려동물에게 최고의 의료 서비스를 제공합니다.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                  진료 예약하기
                </button>
                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition-colors">
                  AI 진단 체험
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                <div className="text-3xl font-bold text-blue-600">98.7%</div>
                <div className="text-sm text-gray-600 mt-1">진단 정확도</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                <div className="text-3xl font-bold text-cyan-600">15분</div>
                <div className="text-sm text-gray-600 mt-1">평균 응답 시간</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="text-3xl font-bold text-blue-500">12,847</div>
                <div className="text-sm text-gray-600 mt-1">누적 진료 건수</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-500">
                <div className="text-3xl font-bold text-cyan-500">24/7</div>
                <div className="text-sm text-gray-600 mt-1">긴급 상담 가능</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - 의료 서비스 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">진료 과목</h3>
            <p className="text-gray-600">전문화된 진료 시스템으로 최상의 케어를 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-2xl mb-4">
                🏥
              </div>
              <h4 className="font-bold text-gray-900 mb-2">일반 진료</h4>
              <p className="text-sm text-gray-600">기본 건강 검진 및 예방 치료</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded flex items-center justify-center text-2xl mb-4">
                🚑
              </div>
              <h4 className="font-bold text-gray-900 mb-2">응급 진료</h4>
              <p className="text-sm text-gray-600">24시간 응급 상황 대응</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded flex items-center justify-center text-2xl mb-4">
                💉
              </div>
              <h4 className="font-bold text-gray-900 mb-2">예방 접종</h4>
              <p className="text-sm text-gray-600">필수 백신 및 추가 접종</p>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-2xl mb-4">
                🔬
              </div>
              <h4 className="font-bold text-gray-900 mb-2">정밀 검사</h4>
              <p className="text-sm text-gray-600">혈액검사, X-ray, 초음파</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Diagnosis System */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">AI 진단 시스템</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 text-xl">✓</span>
                  <div>
                    <div className="font-semibold">증상 기반 자동 분석</div>
                    <div className="text-blue-200 text-sm">입력된 증상을 즉시 분석하여 가능한 질병 예측</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 text-xl">✓</span>
                  <div>
                    <div className="font-semibold">긴급도 자동 판단</div>
                    <div className="text-blue-200 text-sm">응급 상황 여부를 실시간으로 판단</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 text-xl">✓</span>
                  <div>
                    <div className="font-semibold">과거 진료 기록 통합</div>
                    <div className="text-blue-200 text-sm">알레르기, 복용 약물, 과거 질환 자동 연동</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3 text-xl">✓</span>
                  <div>
                    <div className="font-semibold">최적 치료 방안 제시</div>
                    <div className="text-blue-200 text-sm">수의사와 협업하여 맞춤형 치료 계획 수립</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-cyan-400">98.7%</div>
                <div className="text-blue-200 mt-2">AI 진단 정확도</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>소화기 질환</span>
                    <span>99.2%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{width: '99.2%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>피부 질환</span>
                    <span>98.5%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{width: '98.5%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>호흡기 질환</span>
                    <span>97.8%</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{width: '97.8%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 AI 진단을 시작하세요
          </h3>
          <p className="text-gray-600 mb-8">
            24시간 365일, 언제든지 전문적인 진단을 받을 수 있습니다
          </p>
          <button className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg">
            무료 AI 진단 시작하기 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">AI펫닥터</h4>
              <p className="text-sm">전문적인 반려동물 헬스케어 플랫폼</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">진료 안내</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">진료 시간</a></li>
                <li><a href="#" className="hover:text-white">진료 과목</a></li>
                <li><a href="#" className="hover:text-white">의료진</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">AI 진단</a></li>
                <li><a href="#" className="hover:text-white">온라인 예약</a></li>
                <li><a href="#" className="hover:text-white">건강 기록</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">문의</h4>
              <ul className="space-y-2 text-sm">
                <li>📞 1588-0000</li>
                <li>✉️ support@aipetdoctor.com</li>
                <li>📍 서울시 강남구 테헤란로 123</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 AI펫닥터. All rights reserved. | 사업자등록번호: 123-45-67890</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
