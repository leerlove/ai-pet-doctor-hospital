/**
 * 디자인 컨셉 4: Glassmorphism
 * - 반투명 유리 효과 (backdrop-blur)
 * - 그라데이션 배경
 * - 모던하고 세련된 느낌
 * - 플로팅 카드 디자인
 */

export default function Concept4_Glassmorphism() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation - Glass Effect */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                  펫닥터
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-white/80 hover:text-white font-medium transition-colors">
                  서비스
                </a>
                <a href="#" className="text-white/80 hover:text-white font-medium transition-colors">
                  예약
                </a>
                <a href="#" className="text-white/80 hover:text-white font-medium transition-colors">
                  정보
                </a>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  시작하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Glass Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8 mb-16">
          <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <span className="text-white font-medium">✨ AI 기반 스마트 헬스케어</span>
          </div>
          <h2 className="text-6xl font-bold text-white leading-tight">
            미래의 펫 케어,<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              지금 경험하세요
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            첨단 AI 기술과 수의학의 만남, 반려동물의 건강을 한 차원 높은 수준으로
          </p>
        </div>

        {/* Glass Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/20 hover:shadow-2xl hover:shadow-purple-500/20 transition-all group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-3">AI 진단</h3>
            <p className="text-white/70">
              실시간 증상 분석과 질병 예측으로 빠른 대응이 가능합니다
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/20 hover:shadow-2xl hover:shadow-pink-500/20 transition-all group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-3">즉시 예약</h3>
            <p className="text-white/70">
              AI가 최적의 시간을 찾아 자동으로 예약을 완료합니다
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 hover:bg-white/20 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all group">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📱</div>
            <h3 className="text-2xl font-bold text-white mb-3">통합 관리</h3>
            <p className="text-white/70">
              모든 건강 기록을 하나의 앱에서 편리하게 관리합니다
            </p>
          </div>
        </div>

        {/* Stats - Glass Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 shadow-2xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-white/70">활성 사용자</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                99%
              </div>
              <div className="text-white/70">진단 정확도</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-white/70">AI 상담</div>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                5분
              </div>
              <div className="text-white/70">평균 응답</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Glass Steps */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">
          이렇게 간단해요
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-white mb-2">증상 입력</h4>
              <p className="text-white/70 text-sm">
                반려동물의 증상을 간단히 입력하세요
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-white mb-2">AI 분석</h4>
              <p className="text-white/70 text-sm">
                AI가 즉시 증상을 분석합니다
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-white mb-2">진단 결과</h4>
              <p className="text-white/70 text-sm">
                상세한 진단서를 받아보세요
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          </div>

          <div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                4
              </div>
              <h4 className="text-xl font-bold text-white mb-2">병원 예약</h4>
              <p className="text-white/70 text-sm">
                자동으로 병원 예약이 완료됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Large Glass Card */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-16 text-center shadow-2xl">
          <h3 className="text-4xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h3>
          <p className="text-xl text-white/80 mb-10">
            무료 AI 진단으로 반려동물의 건강을 체크해보세요
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all">
              무료로 시작하기 →
            </button>
            <button className="px-10 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
              데모 보기
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Glass */}
      <footer className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 px-8 py-6">
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-sm">
                © 2025 AI펫닥터. Crafted with modern technology.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  개인정보처리방침
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  이용약관
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
