# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI펫닥터 병원 예약 관리 서비스**는 반려동물 헬스케어 통합 플랫폼의 병원 관리자용 시스템입니다. AI 기반 1차 진단과 연계된 스마트 예약 시스템으로, React 19 + Vite + Supabase 기반으로 완전 재개발되었습니다.

**Status**: ✅ Phase A-D Complete | 📋 Phase E Ready
**Stack**: Vite + React 19 + Supabase + React Compiler 1.0
**Design**: Clean Booking (Teal/Green) - See [DESIGN_GUIDE.md](DESIGN_GUIDE.md)
**Last Updated**: 2025-10-29 (Version 3.1)

## Architecture Overview

### 서비스 플로우
```
[AI펫닥터 앱] → [AI 진단] → [예약 요청 (Webhook)]
       ↓
[병원 관리 시스템] → [예약 승인/수정/거절 (Webhook)]
       ↓
[AI펫닥터 앱] (알림)
```

### 핵심 기능
1. **직접 예약**: 웹사이트 직접 예약
2. **AI 연동 예약**: AI 진단서 + 예약 요청
3. **스마트 진단서**: AI 진단 결과, 펫 히스토리, 긴급도
4. **실시간 Webhook**: 양방향 통신
5. **긴급도 우선순위**: 응급/높음/보통/낮음

## Quick Start

```bash
# Development
pnpm dev              # Dev server (http://localhost:5175)
pnpm build            # Production build
pnpm typecheck        # TypeScript check

# Supabase
pnpm supabase:types   # Generate types from DB schema
pnpm supabase:studio  # Open Supabase Studio
```

## Tech Stack

### Frontend
- **Framework**: React 19.1.1 + Vite 7.1.7
- **Language**: TypeScript 5.8.3
- **Compiler**: React Compiler 1.0 (auto-memoization)
- **Router**: React Router DOM 7.9.3
- **State**: Zustand 5.0.8
- **Styling**: TailwindCSS 3.4.17 + CVA
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend (Supabase)
- **Database**: PostgreSQL 15
- **Auth**: Supabase Auth (JWT)
- **Realtime**: WebSocket subscriptions
- **Edge**: Deno Edge Functions

## Project Structure

```
src/
├── features/              # Feature modules
│   ├── auth/             # Authentication
│   ├── booking/          # Booking system
│   ├── clinic/           # Clinic settings
│   └── ai-integration/   # AI펫닥터 연동 (Phase E)
│
├── shared/               # Shared resources
│   ├── api/             # Supabase API functions
│   ├── components/      # UI components (Button, Input, Modal, etc.)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   └── types/           # TypeScript types (auto-generated)
│
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Booking.tsx
│   ├── MyBookings.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Bookings.tsx
│       └── Settings.tsx
│
└── layouts/             # Layout components
```

## Database Schema (Key Tables)

### Core Tables
- **users**: 사용자 (Supabase Auth 연동)
- **clinics**: 병원 정보
- **veterinarians**: 수의사 정보 ⭐
- **services**: 진료 서비스

### Booking System
- **bookings**: 예약 정보 (source: 'direct' | 'ai_pet_doctor')
- **business_hours**: 영업시간 (is_24h 지원)
- **veterinarian_working_hours**: 수의사별 영업시간 ⭐
- **closed_dates**: 휴무일 (veterinarian_id 지원) ⭐
- **pets**: 반려동물 정보

### AI Integration (Phase E)
- **smart_diagnoses**: AI 진단서 정보
- **booking_responses**: 예약 응답 (Webhook 로그)
- **notifications**: 알림

## Development Patterns

### API Functions
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

### State Management (Zustand)
```typescript
// src/features/auth/stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        const { data } = await supabase.auth.signInWithPassword({ email, password })
        set({ user: data.user })
      },
    }),
    { name: 'auth-storage' }
  )
)
```

### Form Validation (Zod)
```typescript
const schema = z.object({
  customer_name: z.string().min(2, '이름을 입력해주세요'),
  customer_phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호'),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

### UI Components (CVA)
모든 공용 컴포넌트는 `src/shared/components/`에 있으며 CVA로 variant 관리:
- Button (6 variants, 4 sizes)
- Input (icons, error states)
- Modal (portal-based)
- Table (sortable)
- Badge (status colors)
- Toast (global state)

자세한 디자인 가이드는 [DESIGN_GUIDE.md](DESIGN_GUIDE.md) 참고.

## Development Progress

### ✅ Phase A: Supabase Setup (Complete)
- Supabase 프로젝트 생성 및 연결
- 10개 테이블 마이그레이션
- RLS 정책 설정
- TypeScript 타입 자동 생성

### ✅ Phase B: Core Infrastructure (Complete)
- 인증 시스템 (Supabase Auth)
- React Router 설정
- API Functions (CRUD + Realtime)
- Layouts (Main, Admin)

### ✅ Phase C: UI Components (Complete)
- 7개 핵심 컴포넌트 (CVA 기반)
- TailwindCSS 4.x 설정
- Clean Booking 디자인 시스템 확립

### ✅ Phase D: Feature Implementation (Complete - 2025-10-29)

#### 예약 시스템
- [x] 3단계 예약 프로세스 (날짜 → 시간 → 정보)
- [x] BookingCalendar, TimeSlotPicker, BookingForm
- [x] 비회원 예약 지원
- [x] **당일 예약 가능** ⭐
- [x] 예약 상세/수정/취소 (BookingDetailModal)

#### 관리자 기능
- [x] Dashboard (통계, 차트, 최근 예약)
- [x] Bookings (예약 목록, 필터링)
- [x] **Settings (5개 탭)** ⭐
  - 기본정보
  - 영업시간 (**일괄 적용**, **24시간 영업**)
  - **수의사별 영업시간** (NEW)
  - 휴무일 관리 (**수의사별 휴무**)
  - 서비스 관리

#### 디자인 개선
- [x] Login/Signup 페이지 (Clean Booking 스타일)
- [x] 그라데이션 배경 (Teal/Green)
- [x] 반응형 디자인

#### 데이터베이스 확장
- [x] veterinarians 테이블 추가
- [x] veterinarian_working_hours 테이블 추가
- [x] business_hours.is_24h 추가
- [x] closed_dates.veterinarian_id 추가

### 📋 Phase E: AI Integration (Planned)
- [ ] Webhook 수신 (Supabase Edge Function)
- [ ] SmartDiagnosisCard 컴포넌트
- [ ] 긴급도 기반 필터링
- [ ] Webhook 전송 (예약 응답)

## Critical Files

### Configuration
- `vite.config.ts` - Vite + React Compiler
- `tailwind.config.js` - TailwindCSS 4.x
- `.env.local` - Environment variables
- `tsconfig.json` - TypeScript + path aliases

### Entry Points
- `src/main.tsx` - App entry
- `src/App.tsx` - Router setup
- `src/index.css` - TailwindCSS import

### Key Components
- `src/pages/admin/Settings.tsx` - 관리자 설정 (5 tabs)
- `src/features/clinic/components/BusinessHoursEditor.tsx` - 영업시간 (일괄 적용, 24시간)
- `src/features/clinic/components/VeterinarianWorkingHoursEditor.tsx` - 수의사 영업시간
- `src/features/clinic/components/ClosedDateModal.tsx` - 휴무일 (수의사 선택)

### API Files
- `src/shared/api/supabase.ts` - Supabase client
- `src/shared/api/business-hours.api.ts` - 영업시간 (clinic + veterinarian)
- `src/shared/api/veterinarians.api.ts` - 수의사 관리
- `src/shared/api/bookings.api.ts` - 예약 CRUD + Realtime

### Types
- `src/shared/types/database.types.ts` - Auto-generated from Supabase

## Development Workflow

### Adding a New Feature
1. Create feature folder in `src/features/[feature-name]/`
2. Add components, hooks, api, types, stores
3. Define Zod schemas for forms
4. Create API functions in `src/shared/api/`
5. Add routes in `src/App.tsx`
6. Update database schema if needed

### Modifying Database Schema
1. Write migration SQL in Supabase Dashboard
2. Regenerate types: `pnpm supabase:types`
3. Update API functions and components

### Code Quality Rules
- TypeScript strict mode (no `any`)
- All forms use React Hook Form + Zod
- API errors must be handled with try/catch + toast
- Use CVA for component variants
- Follow Clean Booking design system

## Environment Variables

```env
# .env.local
VITE_APP_URL=http://localhost:5173
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# AI펫닥터 연동 (Phase E)
VITE_AI_PET_DOCTOR_WEBHOOK_URL=https://api.aipetdoctor.com/webhooks/booking-status
VITE_AI_PET_DOCTOR_API_KEY=apd_xxx
```

## Implementation Stats (Phase D Complete)

- **Total Lines**: ~3,500+
- **Components**: 10 (Calendar, TimePicker, Form, Modal, VetWorkingHoursEditor, etc.)
- **Pages**: 4 (Home, Booking, MyBookings, Login, Signup + Admin pages)
- **Hooks**: 1 (useBookingActions)
- **Migrations**: 4 (user profile, veterinarians, working hours, 24h support)
- **Type Errors**: 0 ✅
- **Build Time**: ~6 seconds (Vite)
- **Bundle Size**: 765.84 kB (gzip: 204.66 kB)

## Resources

### Documentation
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Complete design system guide
- **[PRD_SUMMARY.md](PRD_SUMMARY.md)** - Quick reference for development
- **[ARKA_PRD_REACT_SUPABASE.md](ARKA_PRD_REACT_SUPABASE.md)** - Detailed PRD

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Version**: 3.1 (Phase A-D Complete - Full Booking System + Enhanced Admin Settings)
**Last Updated**: 2025-10-29
