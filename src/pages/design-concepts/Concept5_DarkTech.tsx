/**
 * 디자인 컨셉 5: Dark Mode Tech
 * - 다크 테마 기반
 * - 네온 컬러 액센트
 * - 테크/사이버펑크 느낌
 * - 데이터 시각화 중심
 */

export default function Concept5_DarkTech() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Status Bar */}
      <div className="bg-black border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-6 text-gray-400">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              System Online
            </span>
            <span>v2.1.0</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <span>📊 Dashboard</span>
            <span>⚙️ Settings</span>
          </div>
        </div>
      </div>

      {/* Navigation - Cyber Style */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg blur-md opacity-50"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono">
                  <span className="text-emerald-500">AI</span>
                  <span className="text-cyan-500">PET</span>
                  <span className="text-white">DOCTOR</span>
                </h1>
                <div className="text-[10px] text-gray-500 font-mono">SMART HEALTHCARE SYSTEM</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-500 font-mono text-sm transition-colors">
                [SERVICES]
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 font-mono text-sm transition-colors">
                [BOOKING]
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 font-mono text-sm transition-colors">
                [STATS]
              </a>
              <button className="px-6 py-2 bg-emerald-500 text-black font-bold font-mono text-sm hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                ACCESS SYSTEM
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Tech Style */}
      <section className="relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded font-mono text-sm text-emerald-500 mb-6">
                {'>'} NEXT-GEN VETERINARY AI
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                <span className="text-emerald-500">ADVANCED</span><br />
                <span className="text-white">PET HEALTHCARE</span><br />
                <span className="text-cyan-500">PROTOCOL</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed font-mono">
                Powered by Neural Networks & Machine Learning<br />
                24/7 Real-time Monitoring & Analysis
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-emerald-500 text-black font-bold font-mono hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                  INITIALIZE {'>>'}
                </button>
                <button className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 font-bold font-mono hover:bg-cyan-500/10 transition-all">
                  LEARN MORE
                </button>
              </div>
            </div>

            {/* Tech Stats Panel */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-emerald-500/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm text-gray-400">DIAGNOSTIC_ACCURACY</span>
                  <span className="font-mono text-2xl font-bold text-emerald-500">99.2%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[99.2%]"></div>
                </div>
              </div>

              <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm text-gray-400">RESPONSE_TIME</span>
                  <span className="font-mono text-2xl font-bold text-cyan-500">{'<'}3s</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 w-[95%]"></div>
                </div>
              </div>

              <div className="bg-gray-900 border border-yellow-500/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-sm text-gray-400">UPTIME_STATUS</span>
                  <span className="font-mono text-2xl font-bold text-yellow-500">99.9%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-emerald-500 w-[99.9%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-500 font-mono">50K+</div>
                  <div className="text-xs text-gray-500 font-mono">USERS</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-500 font-mono">24/7</div>
                  <div className="text-xs text-gray-500 font-mono">ONLINE</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-500 font-mono">100+</div>
                  <div className="text-xs text-gray-500 font-mono">CLINICS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Terminal Style */}
      <section className="border-y border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold font-mono text-emerald-500 mb-12">
            {'>'} CORE_FEATURES
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
              <h4 className="font-mono font-bold text-lg text-white mb-2">
                NEURAL_DIAGNOSIS
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Advanced AI neural networks analyze symptoms and predict conditions with high accuracy
              </p>
              <div className="mt-4 flex items-center text-emerald-500 text-xs font-mono">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                ACTIVE
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h4 className="font-mono font-bold text-lg text-white mb-2">
                INSTANT_BOOKING
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automated scheduling system finds optimal time slots and confirms appointments instantly
              </p>
              <div className="mt-4 flex items-center text-cyan-500 text-xs font-mono">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                ONLINE
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-yellow-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h4 className="font-mono font-bold text-lg text-white mb-2">
                DATA_VAULT
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Secure cloud storage for all medical records, accessible anytime, anywhere
              </p>
              <div className="mt-4 flex items-center text-yellow-500 text-xs font-mono">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                SECURED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold font-mono text-cyan-500 mb-12">
            {'>'} TECHNICAL_SPECIFICATIONS
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black border border-gray-800 rounded-lg p-8">
              <h4 className="font-mono text-emerald-500 mb-6">AI_ENGINE_SPECS</h4>
              <div className="space-y-4 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Model Version:</span>
                  <span className="text-white">GPT-Vet-4.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Training Dataset:</span>
                  <span className="text-white">2.5M+ cases</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy Rate:</span>
                  <span className="text-emerald-500">99.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Speed:</span>
                  <span className="text-cyan-500">{'<'}3 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supported Species:</span>
                  <span className="text-white">Dogs, Cats, Birds</span>
                </div>
              </div>
            </div>

            <div className="bg-black border border-gray-800 rounded-lg p-8">
              <h4 className="font-mono text-cyan-500 mb-6">SYSTEM_STATUS</h4>
              <div className="space-y-4 text-sm font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API Status:</span>
                  <span className="flex items-center text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    OPERATIONAL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Database:</span>
                  <span className="flex items-center text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    CONNECTED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Realtime Sync:</span>
                  <span className="flex items-center text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Security:</span>
                  <span className="flex items-center text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                    ENCRYPTED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Terminal Style */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-black border-2 border-emerald-500 rounded-lg p-12">
            <div className="font-mono text-sm text-emerald-500 mb-4">
              {'>'} system_prompt_
            </div>
            <h3 className="text-4xl font-bold font-mono mb-6">
              <span className="text-white">READY TO</span>{' '}
              <span className="text-emerald-500">INITIALIZE</span>
              <span className="text-white">?</span>
            </h3>
            <p className="text-gray-400 font-mono mb-8">
              Join 50,000+ users protecting their pets with AI technology
            </p>
            <button className="px-10 py-4 bg-emerald-500 text-black font-bold font-mono hover:bg-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all">
              EXECUTE_START {'>>'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Cyber */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="text-gray-500">
              © 2025 AIPETDOCTOR_SYSTEM | v2.1.0
            </div>
            <div className="flex items-center space-x-6 text-gray-500">
              <a href="#" className="hover:text-emerald-500">DOCS</a>
              <a href="#" className="hover:text-emerald-500">API</a>
              <a href="#" className="hover:text-emerald-500">SUPPORT</a>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
