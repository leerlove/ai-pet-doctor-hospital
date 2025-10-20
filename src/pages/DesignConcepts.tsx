/**
 * Design Concepts Selector Page
 * - 5가지 디자인 컨셉 미리보기 및 선택
 */

import { Link } from 'react-router-dom'

const concepts = [
  {
    id: 1,
    name: 'Modern Minimal',
    description: '깔끔하고 심플한 디자인, 넓은 여백, 타이포그래피 중심',
    colors: ['#334155', '#0284c7', '#10b981'],
    path: '/design/modern-minimal',
    preview: '🎨',
  },
  {
    id: 2,
    name: 'Warm Pet Care',
    description: '부드럽고 따뜻한 색감, 곡선 디자인, 친근한 느낌',
    colors: ['#fb7185', '#fb923c', '#6ee7b7'],
    path: '/design/warm-pet-care',
    preview: '🐾',
  },
  {
    id: 3,
    name: 'Professional Medical',
    description: '의료 전문성, 신뢰감, 블루 계열, 데이터 중심',
    colors: ['#0ea5e9', '#1e3a8a', '#06b6d4'],
    path: '/design/professional-medical',
    preview: '🏥',
  },
  {
    id: 4,
    name: 'Glassmorphism',
    description: '반투명 유리 효과, 블러 배경, 모던하고 세련됨',
    colors: ['#8b5cf6', '#6366f1', '#ec4899'],
    path: '/design/glassmorphism',
    preview: '✨',
  },
  {
    id: 5,
    name: 'Dark Mode Tech',
    description: '다크 테마, 네온 액센트, 테크/사이버펑크 느낌',
    colors: ['#10b981', '#06b6d4', '#fbbf24'],
    path: '/design/dark-tech',
    preview: '⚡',
  },
  {
    id: 6,
    name: 'Clean Booking System',
    description: '깔끔한 예약 시스템, Teal/Green 색상, 벤치마킹 기반',
    colors: ['#14b8a6', '#0d9488', '#f0fdfa'],
    path: '/design/clean-booking',
    preview: '📅',
  },
]

export default function DesignConcepts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            디자인 컨셉 선택
          </h1>
          <p className="text-xl text-gray-600">
            AI펫닥터 병원 관리 시스템을 위한 6가지 디자인을 준비했습니다
          </p>
          <p className="text-gray-500 mt-2">
            각 컨셉을 클릭하여 전체 디자인을 확인하세요
          </p>
        </div>

        {/* Concept Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {concepts.map((concept) => (
            <Link
              key={concept.id}
              to={concept.path}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Preview Section */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                  {concept.preview}
                </div>
                {/* Color Palette */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {concept.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full shadow-lg border-2 border-white"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {concept.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {concept.description}
                </p>
                <div className="mt-4 flex items-center text-primary-600 font-medium">
                  미리보기 →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            컨셉 비교
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">특징</th>
                  {concepts.map((concept) => (
                    <th key={concept.id} className="text-center py-4 px-4 font-semibold text-gray-700">
                      {concept.preview}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">타겟 사용자</td>
                  <td className="py-4 px-4 text-center text-sm">전문가</td>
                  <td className="py-4 px-4 text-center text-sm">일반 사용자</td>
                  <td className="py-4 px-4 text-center text-sm">병원 관리자</td>
                  <td className="py-4 px-4 text-center text-sm">트렌디한 사용자</td>
                  <td className="py-4 px-4 text-center text-sm">개발자/테크</td>
                  <td className="py-4 px-4 text-center text-sm">모든 사용자</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">난이도</td>
                  <td className="py-4 px-4 text-center text-sm">⭐⭐</td>
                  <td className="py-4 px-4 text-center text-sm">⭐</td>
                  <td className="py-4 px-4 text-center text-sm">⭐⭐⭐</td>
                  <td className="py-4 px-4 text-center text-sm">⭐⭐⭐⭐</td>
                  <td className="py-4 px-4 text-center text-sm">⭐⭐⭐</td>
                  <td className="py-4 px-4 text-center text-sm">⭐⭐</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">주요 색상</td>
                  <td className="py-4 px-4 text-center text-sm">Gray/Blue</td>
                  <td className="py-4 px-4 text-center text-sm">Pink/Orange</td>
                  <td className="py-4 px-4 text-center text-sm">Blue/Navy</td>
                  <td className="py-4 px-4 text-center text-sm">Purple/Pink</td>
                  <td className="py-4 px-4 text-center text-sm">Green/Cyan</td>
                  <td className="py-4 px-4 text-center text-sm">Teal/Green</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-600">느낌</td>
                  <td className="py-4 px-4 text-center text-sm">심플/세련</td>
                  <td className="py-4 px-4 text-center text-sm">따뜻함/친근</td>
                  <td className="py-4 px-4 text-center text-sm">전문적/신뢰</td>
                  <td className="py-4 px-4 text-center text-sm">모던/세련</td>
                  <td className="py-4 px-4 text-center text-sm">테크/미래</td>
                  <td className="py-4 px-4 text-center text-sm">깔끔함/실용</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            💡 참고사항
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• 각 컨셉은 완전한 페이지 구조로 구현되어 있습니다</li>
            <li>• TailwindCSS를 사용하여 반응형으로 제작되었습니다</li>
            <li>• 모든 컨셉은 React 19 + TypeScript로 작성되었습니다</li>
            <li>• 실제 프로젝트에 바로 적용 가능합니다</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
