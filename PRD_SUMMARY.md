# PRD Summary - AI펫닥터 병원 예약 관리 시스템

**Quick Reference for Development | 개발 시 빠른 참조용**
**Last Updated**: 2025-10-29 | **Version**: 3.1

> 💡 **상세 문서**: [docs/PRD.md](docs/PRD.md) 참고
> 💡 **개발 가이드**: [CLAUDE.md](CLAUDE.md) 참고
> 💡 **디자인 시스템**: [DESIGN_GUIDE.md](DESIGN_GUIDE.md) 참고

---

## 🎯 프로젝트 개요

### 서비스 정의
AI 기반 반려동물 1차 진단과 연계된 병원 예약 관리 시스템. 직접 예약과 AI 연동 예약을 통합 관리하며, 실시간 Webhook으로 AI펫닥터 앱과 양방향 동기화.

### 핵심 가치
- ✅ **당일 예약 가능** - 빠른 예약 처리
- ✅ **비회원 예약 지원** - 간편한 예약
- ✅ **수의사별 관리** - 개별 영업시간 및 휴무 설정
- 📋 **AI 진단서 연동** - 스마트 진단서 기반 예약 (Phase E)
- 📋 **실시간 Webhook** - 앱과 즉시 동기화 (Phase E)

---

## 📊 서비스 플로우

### 1. 직접 예약 (현재)
```
[홈페이지] → [날짜 선택] → [시간 선택] → [정보 입력] → [예약 완료]
```

### 2. AI 연동 예약 (Phase E)
```
[AI펫닥터 앱] → [AI 진단] → [예약 요청 Webhook]
       ↓
[병원 관리 시스템] → [예약 승인/수정/거절]
       ↓
[AI펫닥터 앱] (알림)
```

---

## 🗂️ 핵심 기능

### ✅ 완료된 기능 (Phase A-D)

#### 1. 예약 시스템
- **3단계 예약 프로세스**
  - Step 1: 날짜 선택 (월간 캘린더, 당일 예약 가능)
  - Step 2: 시간 선택 (30분 단위, 점심시간 제외)
  - Step 3: 정보 입력 (고객, 펫, 증상)
- **비회원 예약 지원**
- **예약 상태**: pending / confirmed / cancelled / completed / no-show
- **예약 소스**: direct (직접) / ai_pet_doctor (AI 연동)

#### 2. 관리자 기능
- **Dashboard**: 통계 카드, 차트, 최근 예약
- **Bookings**: 예약 목록, 필터링, 상태 변경
- **Settings (5개 탭)**:
  1. **기본정보**: 병원명, 주소, 연락처
  2. **영업시간**: 요일별 설정, **일괄 적용**, **24시간 영업**
  3. **수의사 영업시간**: 수의사별 개별 진료 시간 설정
  4. **휴무일 관리**: 전체 또는 특정 수의사 휴무
  5. **서비스 관리**: 진료 항목 CRUD

#### 3. 인증 시스템
- Supabase Auth (JWT)
- 회원/비회원 모두 지원
- 자동 프로필 생성 (Supabase Trigger)

#### 4. 디자인
- **Clean Booking** 디자인 시스템
- Teal/Green 색상 스킴
- 반응형 디자인 (mobile-first)
- Login/Signup 페이지 개선

### 📋 예정 기능 (Phase E - AI Integration)

#### 1. Webhook 수신
- AI펫닥터 앱에서 예약 요청 수신
- 스마트 진단서 저장
- 자동 예약 생성

#### 2. Webhook 전송
- 예약 응답 (승인/수정/거절)
- 재시도 로직
- 로그 저장

#### 3. 스마트 진단서 UI
- SmartDiagnosisCard 컴포넌트
- 긴급도 배지 (애니메이션)
- 펫 히스토리 표시
- 추천 검사 항목

#### 4. 긴급도 기반 기능
- 예약 목록 정렬/필터링
- 알림 우선순위
- 긴급도: low / medium / high / emergency

---

## 💾 데이터베이스 핵심 테이블

### 현재 사용 중
```
users                        # 사용자 (Supabase Auth)
clinics                      # 병원 정보
veterinarians                # 수의사 정보 ⭐
services                     # 진료 서비스
bookings                     # 예약 (source: direct/ai_pet_doctor)
business_hours               # 클리닉 영업시간 (is_24h 지원)
veterinarian_working_hours   # 수의사별 영업시간 ⭐
closed_dates                 # 휴무일 (veterinarian_id 지원) ⭐
pets                         # 반려동물
```

### Phase E 추가 예정
```
smart_diagnoses              # AI 진단서
booking_responses            # 예약 응답 로그
notifications                # 알림
```

---

## 🎨 UI/UX 가이드

### 디자인 시스템: Clean Booking
- **Primary**: Teal (#14B8A6)
- **Secondary**: Emerald (#10B981)
- **Background**: Gradient (from-teal-50 via-white to-emerald-50)
- **Cards**: rounded-2xl, shadow-xl
- **Buttons**: Gradient, rounded-xl
- **Icons**: Lucide React (w-5 h-5)

### 긴급도 색상
```typescript
const urgencyColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  emergency: 'bg-red-100 text-red-700 animate-pulse',
}
```

---

## 🛠️ 기술 스택

### Frontend
- React 19.1.1 + Vite 7.1.7
- TypeScript 5.8.3
- React Compiler 1.0 (자동 메모이제이션)
- React Router 7.9.3
- Zustand 5.0.8
- TailwindCSS 3.4.17 + CVA
- React Hook Form + Zod
- Lucide React

### Backend
- Supabase (PostgreSQL 15)
- Supabase Auth (JWT)
- Supabase Realtime (WebSocket)
- Supabase Edge Functions (Deno)

---

## 📝 개발 참고사항

### API 패턴
```typescript
// src/shared/api/bookings.api.ts
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false })

  if (error) throw error
  return data
}
```

### 상태 관리 (Zustand)
```typescript
export const useAuthStore = create<AuthState>()(
  persist((set) => ({
    user: null,
    login: async (email, password) => {
      const { data } = await supabase.auth.signInWithPassword({ email, password })
      set({ user: data.user })
    },
  }), { name: 'auth-storage' })
)
```

### 폼 검증 (Zod)
```typescript
const schema = z.object({
  customer_name: z.string().min(2, '이름을 입력해주세요'),
  customer_phone: z.string().regex(/^010-\d{4}-\d{4}$/, '전화번호 형식'),
})

const form = useForm({ resolver: zodResolver(schema) })
```

---

## 🚀 개발 우선순위

### ✅ Phase D Complete (2025-10-29)
1. ~~예약 시스템 (직접 예약)~~
2. ~~관리자 대시보드~~
3. ~~영업시간 관리 (일괄 적용, 24시간)~~
4. ~~수의사별 영업시간~~
5. ~~휴무일 관리 (수의사별)~~
6. ~~디자인 시스템 확립~~

### 📋 Phase E: AI Integration (Next)
1. **Webhook 수신** (우선순위 높음)
   - Edge Function 구현
   - 스마트 진단서 파싱
   - 예약 자동 생성

2. **Webhook 전송**
   - 예약 응답 API
   - 재시도 로직
   - 로그 시스템

3. **스마트 진단서 UI**
   - 컴포넌트 개발
   - 긴급도 표시
   - 펫 히스토리

4. **긴급도 기반 기능**
   - 정렬/필터링
   - 알림 시스템

---

## ✅ 코드 품질 체크리스트

### 필수 사항
- [ ] TypeScript strict mode (no `any`)
- [ ] API 에러 핸들링 (try/catch + toast)
- [ ] Zod로 폼 검증
- [ ] CVA로 컴포넌트 variant 관리
- [ ] Clean Booking 디자인 일관성
- [ ] 반응형 디자인 (mobile-first)

### 성능
- ✅ React Compiler 1.0 (자동 최적화)
- ✅ Vite (빠른 HMR, ~6초 빌드)
- ✅ Zustand (경량 상태 관리)
- ⏳ Code splitting (Phase E)
- ⏳ Image optimization (Phase E)

### 보안
- ✅ Supabase RLS 정책
- ✅ JWT 인증
- ✅ Input sanitization (Zod)
- ⏳ Webhook signature verification (Phase E)
- ⏳ Rate limiting (Phase E)

---

## 📈 현재 상태

### 구현 통계 (Phase D Complete)
- **총 코드 라인**: ~3,500+
- **컴포넌트**: 10개
- **페이지**: 4개 (Home, Booking, MyBookings, Login, Signup + Admin)
- **Hooks**: 1개
- **Migrations**: 4개
- **Type Errors**: 0 ✅
- **Build Time**: ~6초
- **Bundle Size**: 765.84 kB (gzip: 204.66 kB)

### 배포 환경
- **Development**: http://localhost:5175
- **Production**: https://ai-pet-doctor-hospital.vercel.app
- **Database**: Supabase Production
- **Monitoring**: Vercel Analytics

---

## 📚 참고 문서

### 내부 문서
- **[docs/PRD.md](docs/PRD.md)** - 상세 PRD (2544줄)
- **[CLAUDE.md](CLAUDE.md)** - 개발 가이드 (314줄)
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - 디자인 시스템
- **[README.md](README.md)** - 프로젝트 소개

### 외부 리소스
- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Version**: 3.1
**Last Updated**: 2025-10-29
**Status**: ✅ Phase A-D Complete | 📋 Phase E Ready
