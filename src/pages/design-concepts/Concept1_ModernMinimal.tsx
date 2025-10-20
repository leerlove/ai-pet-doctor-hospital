/**
 * 디자인 컨셉 1: Modern Minimal
 * - 깔끔하고 심플한 디자인
 * - 넓은 여백과 타이포그래피 중심
 * - 프로페셔널한 느낌
 */

export default function Concept1_ModernMinimal() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - 심플한 상단 네비게이션 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <h1 className="text-2xl font-light text-gray-900 tracking-tight">
                AI펫닥터
              </h1>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  예약
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  서비스
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  정보
                </a>
              </div>
            </div>
            <button className="px-6 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded transition-colors">
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - 넓은 여백 */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-light text-gray-900 tracking-tight leading-tight">
            스마트한 반려동물<br />건강 관리
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            AI 기반 진단과 전문 수의사의 케어를 결합한<br />
            차세대 펫 헬스케어 플랫폼
          </p>
          <div className="flex justify-center gap-4 pt-8">
            <button className="px-8 py-3 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded transition-colors">
              예약하기
            </button>
            <button className="px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 rounded transition-colors">
              자세히 보기
            </button>
          </div>
        </div>
      </section>

      {/* Stats - 미니멀한 통계 */}
      <section className="max-w-5xl mx-auto px-8 py-16 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-light text-gray-900">10K+</div>
            <div className="mt-2 text-sm text-gray-600 font-light">예약 완료</div>
          </div>
          <div>
            <div className="text-4xl font-light text-gray-900">98%</div>
            <div className="mt-2 text-sm text-gray-600 font-light">만족도</div>
          </div>
          <div>
            <div className="text-4xl font-light text-gray-900">24/7</div>
            <div className="mt-2 text-sm text-gray-600 font-light">AI 상담</div>
          </div>
        </div>
      </section>

      {/* Features - 카드 없는 심플한 리스트 */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <h3 className="text-3xl font-light text-gray-900 mb-16 text-center">
          주요 기능
        </h3>
        <div className="space-y-16">
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-medium">01</span>
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-2">
                AI 기반 사전 진단
              </h4>
              <p className="text-gray-600 leading-relaxed">
                증상을 입력하면 AI가 즉시 분석하여 가능한 질병과 긴급도를 판단합니다.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-medium">02</span>
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-2">
                스마트 예약 시스템
              </h4>
              <p className="text-gray-600 leading-relaxed">
                AI 진단 결과와 함께 병원에 자동으로 예약 요청이 전달됩니다.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-medium">03</span>
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900 mb-2">
                통합 건강 관리
              </h4>
              <p className="text-gray-600 leading-relaxed">
                과거 진료 기록, 알레르기, 현재 복용 중인 약 등을 한눈에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-8 py-24 text-center border-t border-gray-200">
        <h3 className="text-3xl font-light text-gray-900 mb-4">
          지금 시작하세요
        </h3>
        <p className="text-gray-600 mb-8">
          반려동물의 건강을 더 스마트하게 관리하세요
        </p>
        <button className="px-8 py-3 text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 rounded transition-colors">
          무료로 시작하기
        </button>
      </section>

      {/* Footer - 심플한 푸터 */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-sm text-gray-500 font-light">
            © 2025 AI펫닥터. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
