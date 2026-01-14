/**
 * 진료안내 페이지 - Stitch Veterinary 디자인
 * - 의료진 목록 (/medical-guide)
 * - 의료진 상세 (/medical-guide/:id)
 * - DB 연동 (veterinarians 테이블)
 */

import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getAllVeterinarians, getVeterinarianById } from '@/shared/api/veterinarians.api'
import type { Veterinarian } from '@/shared/api/veterinarians.api'

// Material Symbol 컴포넌트
function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

// 기본 의료진 이미지
const defaultDoctorImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlAovFSHczyWjRolLJs6N-9O2qkcQ0uoh0zuojAzP2rLbrdwPfBHDpvvUDIzBB3QT8rJXIgYPFXRF44lLG6qECTQZqx7TSP6idP_95ZkTrY5SevhbUd2zXJrs5fUJWBIR5P_6_Lby0vh9w-bq7ejyqlhr2-o5qQc6Z798mXtr6O1B3n-YiR9eWRn9JKf4PMbt9m-kj2fZ_pT0s5BVAqPR0pqEZX4M64MfBYodbOcrtS047_kjTt6g7dkYm4HjBVOSrVS219UJPYzs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjIddZXtkSBYsIs5r2NNWqN7iHzlRkbZVPWbVjK0oZGKhY_H3R_Ch9QRKGu8fzfaiEe_dyxEedDCYdwlhdEWTt63mEv0oaFA9kyNrnSLEaggWdPpdTlWskPPw3I1AfgcWXz3CVQN2Y0f7QoT4uS8ukYRVTIE6XHCnHO-nAl-A62lt7y8Lm2RmuMoOxVwiEwjvKFWrvTYxdZN7IrfOAzxsUwqPQXQhJaxj33Y9-J-Ax5Ld8NCtRBwXFvL1fGwiLGuRJvZhACqeN9e4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJpO2xxJCWqbmcEjlVJftqQZkWpeoR6ljHMRIJrZJqRy0nqvOuX29xxlwpG4jzRkVjIeF0AQxwEECp9Jsi1gJg6TWcQPQ3F7ucPMlx0VCnf8vE7EoWBoMa-6XD6QjPNi-d7zcwzB-RLh82ruE0eqCcx56xv1PU8JDTN4K4DxkSOyvd9Dj7IJU75tH8A_KOeepP53BNu-Nkv5nXikxYMxpAT9zn4GchuRVra1SglDfPsiA2oYUBDLBrdw4kj_dPDJkUuPB1Q7wK6hw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBr-nFUlLXz7v97hLNZE-rbqh1yKHA13JPBf5QMYFQb8E5d5ZngMiG7ZOEVwOG2Dt8bMupaeHhOgV0IEYHxOv9eZFn8UnuaLj9J3RzR7JceDvH1OsNPxHp1VV2ZaPx4LEqcaTWCjXoMRt96KwbB7d1JfqqKpwBOSJ_FkGEpIMBZHrboQr9VjRZMrG61gryEa9zExC1YgFhRLbEUSNuBvPIoLjubNhi7Yr1WGn5Iue5PdgSBqZPmV_ah5gCWd5JJp4ygyA-91JI4jPw',
]

// 샘플 의료진 데이터 (DB에 데이터가 없을 경우)
const sampleVeterinarians = [
  { id: '1', name: '이소영', title: '교수', specialization: '내과 전문의', phone: '02-555-0101', email: 'lsy@aipetdoctor.kr' },
  { id: '2', name: '박준호', title: '교수', specialization: '외과 및 정형외과', phone: '02-555-0102', email: 'pjh@aipetdoctor.kr' },
  { id: '3', name: '최수민', title: '교수', specialization: '종양학과', phone: '02-555-0103', email: 'csm@aipetdoctor.kr' },
  { id: '4', name: '정우진', title: '교수', specialization: '응급의학과', phone: '02-555-0104', email: 'jwj@aipetdoctor.kr' },
]

export default function MedicalGuide() {
  const { id } = useParams()

  if (id) {
    return <VeterinarianDetail id={id} />
  }
  return <VeterinarianList />
}

// 의료진 목록 컴포넌트
function VeterinarianList() {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllVeterinarians()
        setVeterinarians(data.filter(v => v.is_active))
      } catch (error) {
        console.error('의료진 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const displayVets = veterinarians.length > 0
    ? veterinarians
    : sampleVeterinarians.map((v, i) => ({
        ...v,
        clinic_id: null,
        license_number: null,
        photo_url: defaultDoctorImages[i],
        is_active: true,
        created_at: null,
        updated_at: null,
      } as Veterinarian))

  const filteredVets = filter
    ? displayVets.filter(
        v =>
          v.name.toLowerCase().includes(filter.toLowerCase()) ||
          v.specialization?.toLowerCase().includes(filter.toLowerCase())
      )
    : displayVets

  return (
    <div className="min-h-screen flex flex-col font-display antialiased bg-background-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-stitch-primary">
                <MaterialIcon name="pets" className="text-[32px]" />
              </Link>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-text-main leading-tight">
                <Link to="/">AI펫닥터 <span className="hidden sm:inline">대학동물병원</span></Link>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-stitch-primary transition-colors">
                홈
              </Link>
              <Link to="/medical-guide" className="text-sm font-medium text-stitch-primary font-bold">
                진료안내
              </Link>
              <Link to="/booking" className="text-sm font-medium hover:text-stitch-primary transition-colors">
                예약하기
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <MaterialIcon name="search" className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-subtle text-[20px] top-2.5" />
                <input
                  type="text"
                  placeholder="의료진 찾기..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background-light border-none rounded-lg text-sm focus:ring-2 focus:ring-stitch-primary w-48 transition-all focus:w-64 placeholder:text-text-subtle"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-background-light pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-text-subtle">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="hover:text-stitch-primary transition-colors">
                  홈
                </Link>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-text-main">의료진 소개</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main mb-2">분야별 전문 의료진</h1>
            <p className="text-gray-600">각 분야를 선도하는 전문의들을 만나보세요.</p>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mb-6">
            <div className="relative">
              <MaterialIcon name="search" className="absolute left-3 top-2.5 text-text-subtle text-[20px]" />
              <input
                type="text"
                placeholder="의료진 찾기..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-stitch-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <MaterialIcon name="progress_activity" className="text-4xl text-stitch-primary animate-spin" />
              <p className="mt-4 text-gray-600">의료진 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVets.map((vet, index) => (
                <Link
                  key={vet.id}
                  to={`/medical-guide/${vet.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group"
                >
                  <div
                    className="aspect-[4/5] bg-cover bg-top transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${vet.photo_url || defaultDoctorImages[index % 4]}')`,
                    }}
                  />
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-text-main">{vet.name} {vet.title}</h3>
                    <p className="text-stitch-primary text-sm font-medium mb-4">
                      {vet.specialization || '수의사'}
                    </p>
                    <div className="mt-auto w-full py-2 rounded border border-gray-200 text-sm font-semibold hover:bg-gray-50 text-text-main transition-colors text-center">
                      프로필 보기
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredVets.length === 0 && (
            <div className="text-center py-12">
              <MaterialIcon name="search_off" className="text-4xl text-gray-400" />
              <p className="mt-4 text-gray-600">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-subtle">
          <div className="flex justify-center gap-2 mb-4 text-stitch-primary">
            <MaterialIcon name="pets" />
          </div>
          <p className="text-sm">© 2025 AI펫닥터 대학동물병원. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-stitch-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-stitch-primary transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 의료진 상세 컴포넌트
function VeterinarianDetail({ id }: { id: string }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [veterinarian, setVeterinarian] = useState<Veterinarian | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getVeterinarianById(id)
        setVeterinarian(data)
      } catch (error) {
        console.error('의료진 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // 샘플 데이터 (DB에 없을 경우)
  const sampleVet = sampleVeterinarians.find(v => v.id === id) || sampleVeterinarians[0]
  const vet = veterinarian || {
    ...sampleVet,
    clinic_id: null,
    license_number: 'VET-2012-1234',
    photo_url: defaultDoctorImages[parseInt(id) % 4 || 0],
    is_active: true,
    created_at: null,
    updated_at: null,
  } as Veterinarian

  const vetIndex = parseInt(id) % 4 || 0

  return (
    <div className="min-h-screen flex flex-col font-display antialiased bg-background-light text-text-main">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-stitch-primary">
                <MaterialIcon name="pets" className="text-[32px]" />
              </Link>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-text-main leading-tight">
                <Link to="/">AI펫닥터 <span className="hidden sm:inline">대학동물병원</span></Link>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-stitch-primary transition-colors">
                홈
              </Link>
              <Link to="/medical-guide" className="text-sm font-medium text-stitch-primary font-bold">
                진료안내
              </Link>
              <Link to="/booking" className="text-sm font-medium hover:text-stitch-primary transition-colors">
                예약하기
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="md:hidden p-2 text-text-main">
                <MaterialIcon name="arrow_back" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-background-light pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-text-subtle">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="hover:text-stitch-primary transition-colors">홈</Link>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li>
                <Link to="/medical-guide" className="hover:text-stitch-primary transition-colors">진료과</Link>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li>
                <Link to="/medical-guide" className="hover:text-stitch-primary transition-colors">
                  {vet.specialization || '일반진료'}
                </Link>
              </li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-text-main">{vet.name} {vet.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <MaterialIcon name="progress_activity" className="text-4xl text-stitch-primary animate-spin" />
              <p className="mt-4 text-gray-600">의료진 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Sidebar */}
              <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                {/* Photo Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url('${vet.photo_url || defaultDoctorImages[vetIndex]}')`,
                      }}
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-4">
                    <Link
                      to={isAuthenticated ? '/booking' : '/login'}
                      className="w-full flex items-center justify-center gap-2 bg-stitch-primary hover:bg-stitch-primary-dark text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
                    >
                      <MaterialIcon name="calendar_add_on" className="text-[20px]" />
                      진료 예약하기
                    </Link>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${vet.phone || '02-123-4567'}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-background-light text-text-main font-medium py-2.5 px-4 rounded-lg border border-transparent hover:border-gray-300 transition-colors text-sm"
                      >
                        <MaterialIcon name="call" className="text-[18px]" />
                        전화 문의
                      </a>
                      <a
                        href={`mailto:${vet.email || 'contact@aipetdoctor.kr'}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-background-light text-text-main font-medium py-2.5 px-4 rounded-lg border border-transparent hover:border-gray-300 transition-colors text-sm"
                      >
                        <MaterialIcon name="mail" className="text-[18px]" />
                        이메일 문의
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hospital Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-text-subtle mb-4 border-b pb-2 border-gray-100">
                    병원 정보
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <MaterialIcon name="location_on" className="text-stitch-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-text-main text-sm">소동물병원</p>
                        <p className="text-text-subtle text-sm">
                          C동 2층<br />
                          서울특별시 관악구 관악로 1
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <MaterialIcon name="phone_in_talk" className="text-stitch-primary" />
                      <div>
                        <p className="text-text-subtle text-sm">직통 번호</p>
                        <p className="font-medium text-text-main text-sm">{vet.phone || '02-555-0123'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <MaterialIcon name="schedule" className="text-stitch-primary" />
                      <div>
                        <p className="text-text-subtle text-sm">진료 시간</p>
                        <p className="font-medium text-text-main text-sm">월-목, 오전 8시 - 오후 4시</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credential Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    전문의 자격 보유
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    PhD 연구
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    교수진
                  </span>
                </div>
              </aside>

              {/* Article Content */}
              <article className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
                {/* Header */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold text-text-main mb-2 tracking-tight">
                        {vet.name}
                        <span className="text-xl md:text-2xl font-normal text-text-subtle ml-2">
                          {vet.title && `${vet.title}, `}DVM, PhD
                        </span>
                      </h1>
                      <h2 className="text-xl text-stitch-primary font-medium flex items-center gap-2">
                        {vet.specialization || '일반진료'} 과장
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-1" />
                        수의과대학 교수
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-stitch-primary transition-colors" title="공유하기">
                        <MaterialIcon name="share" />
                      </button>
                      <button className="text-gray-400 hover:text-stitch-primary transition-colors" title="인쇄하기">
                        <MaterialIcon name="print" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-accent-sage/20 text-stitch-primary-dark font-medium text-sm border border-accent-sage/20">
                      {vet.specialization || '일반진료'}
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-text-subtle hover:text-text-main font-medium text-sm border border-gray-200">
                      내과
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-text-subtle hover:text-text-main font-medium text-sm border border-gray-200">
                      전기생리학
                    </span>
                  </div>
                </div>

                {/* Philosophy Quote */}
                <div className="bg-stitch-primary/5 border-l-4 border-stitch-primary p-6 rounded-r-lg">
                  <p className="text-lg md:text-xl italic text-text-main leading-relaxed">
                    "저의 진료 철학은 환자를 치료하는 것이 곧 그 가족을 보살피는 것이라는 믿음에 뿌리를 두고 있습니다.
                    대학 병원 수준의 정밀한 과학적 근거와 지역 병원의 따뜻한 마음을 결합하여,
                    반려동물의 건강뿐만 아니라 가족의 마음까지 치유하고자 노력합니다."
                  </p>
                </div>

                {/* Biography */}
                <div className="prose max-w-none text-text-subtle leading-relaxed">
                  <p>
                    {vet.name} {vet.title || '수의사'}는 현재 본 수의과대학 동물병원 {vet.specialization || '일반진료'} 과장으로 재직 중입니다.
                    반려동물의 복합적인 질환 진단 및 치료 분야에서 15년 이상의 경력을 보유하고 있으며,
                    특히 최소 침습적 중재 시술 분야의 권위자로 인정받고 있습니다.
                  </p>
                  <p className="mt-4">
                    수의학 박사(DVM) 학위를 취득한 후, 전문의 인턴 과정을 마쳤습니다.
                    레지던트 과정을 수료함과 동시에 전문 분야 연구로 박사 학위(PhD)를 받았습니다.
                    {vet.name} {vet.title || '수의사'}는 임상적 탁월함과 후학 양성을 통해 수의학 발전에 헌신하고 있습니다.
                  </p>
                </div>

                {/* Education & Credentials */}
                <section>
                  <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <MaterialIcon name="school" className="text-stitch-primary" />
                    학력 및 자격사항
                  </h3>
                  <div className="relative border-l border-gray-200 ml-3 space-y-8">
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-stitch-primary ring-4 ring-white" />
                      <h4 className="font-bold text-text-main">수의내과 전문의 자격 취득</h4>
                      <p className="text-sm text-text-subtle">전문의 자격 취득, 2012</p>
                    </div>
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                      <h4 className="font-bold text-text-main">수의학 박사 (PhD)</h4>
                      <p className="text-sm text-text-subtle">서울대학교, 2011</p>
                    </div>
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                      <h4 className="font-bold text-text-main">수의학 박사 (DVM)</h4>
                      <p className="text-sm text-text-subtle">서울대학교 수의과대학, 2007</p>
                    </div>
                  </div>
                </section>

                {/* Specialization Services */}
                <section>
                  <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                    <MaterialIcon name="stethoscope" className="text-stitch-primary" />
                    전문 진료 분야
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <MaterialIcon name="monitoring" className="text-stitch-primary mt-0.5" />
                          <div>
                            <p className="font-semibold text-stitch-primary group-hover:underline text-sm md:text-base">
                              정밀 진단 및 검사
                            </p>
                            <p className="text-xs text-text-subtle mt-1">
                              첨단 장비를 활용한 정밀 검사 및 다각적 평가
                            </p>
                          </div>
                        </div>
                        <MaterialIcon name="chevron_right" className="text-gray-300 group-hover:text-stitch-primary text-[20px]" />
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <MaterialIcon name="medication" className="text-stitch-primary mt-0.5" />
                          <div>
                            <p className="font-semibold text-stitch-primary group-hover:underline text-sm md:text-base">
                              질환 관리 및 치료
                            </p>
                            <p className="text-xs text-text-subtle mt-1">
                              조기 발견 및 체계적인 질환 관리 프로토콜
                            </p>
                          </div>
                        </div>
                        <MaterialIcon name="chevron_right" className="text-gray-300 group-hover:text-stitch-primary text-[20px]" />
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3">
                          <MaterialIcon name="precision_manufacturing" className="text-stitch-primary mt-0.5" />
                          <div>
                            <p className="font-semibold text-stitch-primary group-hover:underline text-sm md:text-base">
                              최소 침습 중재 시술
                            </p>
                            <p className="text-xs text-text-subtle mt-1">
                              비절개 방식의 최소 침습 중재 치료
                            </p>
                          </div>
                        </div>
                        <MaterialIcon name="chevron_right" className="text-gray-300 group-hover:text-stitch-primary text-[20px]" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Related Departments */}
                <section className="bg-background-light p-6 rounded-xl border border-dashed border-gray-300">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-text-subtle mb-4">관련 진료과</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/medical-guide"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <MaterialIcon name="cardiology" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-main">전문 진료 센터</p>
                        <p className="text-xs text-text-subtle">정밀 진단 및 수술</p>
                      </div>
                    </Link>
                    <Link
                      to="/medical-guide"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MaterialIcon name="emergency" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-main">응급 의료 센터</p>
                        <p className="text-xs text-text-subtle">24/7 중증 케어</p>
                      </div>
                    </Link>
                  </div>
                </section>
              </article>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-subtle">
          <div className="flex justify-center gap-2 mb-4 text-stitch-primary">
            <MaterialIcon name="pets" />
          </div>
          <p className="text-sm">© 2025 AI펫닥터 대학동물병원. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-stitch-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-stitch-primary transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
