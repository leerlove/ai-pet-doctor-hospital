/**
 * 디자인 컨셉 2: Warm Pet Care
 * - 부드럽고 따뜻한 색감
 * - 곡선 디자인과 라운드 요소
 * - 친근하고 아늑한 느낌
 */

export default function Concept2_WarmPetCare() {
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navigation - 부드러운 곡선 */}
      <nav className="bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🐾</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                AI펫닥터
              </h1>
            </div>
            <button className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full font-medium shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all">
              예약하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - 따뜻한 그라데이션 배경 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-rose-600 mb-4">
              ✨ AI 기반 스마트 펫 케어
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              사랑하는 반려동물을 위한<br />
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                특별한 건강 관리
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              24시간 AI 수의사가 함께하는 든든한 반려동물 헬스케어 파트너
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full font-medium shadow-xl shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105 transition-all">
                지금 시작하기 →
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                서비스 둘러보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features - 카드 디자인 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            우리의 특별한 서비스
          </h3>
          <p className="text-gray-600">
            반려동물과 보호자 모두를 위한 맞춤형 케어
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">🏥</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              AI 건강 체크
            </h4>
            <p className="text-gray-600 leading-relaxed">
              증상을 입력하면 AI가 즉시 분석하여 건강 상태를 체크하고 조언을 제공합니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📅</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              간편한 예약
            </h4>
            <p className="text-gray-600 leading-relaxed">
              클릭 몇 번으로 가까운 동물병원 예약 완료. AI가 최적의 시간을 추천합니다.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              건강 기록 관리
            </h4>
            <p className="text-gray-600 leading-relaxed">
              예방접종, 진료 기록, 복용 약물까지 모든 정보를 체계적으로 관리합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - 따뜻한 후기 */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            보호자님들의 후기 💕
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                  김
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">김지수</div>
                  <div className="text-sm text-gray-500">말티즈 '구름' 보호자</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "밤에 갑자기 구토 증상이 있어서 AI 진단을 받았는데, 바로 응급 예약까지 연결해줘서 정말 큰 도움이 되었어요!"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  박
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">박민준</div>
                  <div className="text-sm text-gray-500">골든리트리버 '해피' 보호자</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "건강 기록이 자동으로 저장되어서 다른 병원에 갈 때도 바로 확인할 수 있어 편리해요. 강력 추천합니다!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              우리 아이의 건강, 지금 시작하세요
            </h3>
            <p className="text-rose-50 mb-8 text-lg">
              가입하고 첫 AI 건강 체크 무료 체험
            </p>
            <button className="px-8 py-4 bg-white text-rose-500 rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
              무료로 시작하기 →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-rose-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-gray-900">AI펫닥터</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 AI펫닥터. 사랑으로 만든 펫 헬스케어 플랫폼
          </p>
        </div>
      </footer>
    </div>
  )
}
