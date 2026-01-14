# CLAUDE.md

AI 개발 가이드 - Claude Code 작업 시 참고

## 프로젝트 개요

**AI펫닥터 대학동물병원** - 반려동물 예약 및 진료 시스템
- AI 기반 1차 진단 연계 스마트 예약
- Stitch Veterinary 디자인 적용 완료

**Status**: ✅ Phase A-D Complete | Stitch Design Applied
**Stack**: Vite + React 19 + Supabase + TailwindCSS
**Last Updated**: 2025-01-15

## Quick Start

```bash
pnpm dev              # 개발 서버 (http://localhost:5175)
pnpm build            # 프로덕션 빌드
pnpm typecheck        # TypeScript 검증
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.1 + Vite 7.1 |
| Language | TypeScript 5.8 |
| State | Zustand 5.0 |
| Styling | TailwindCSS + Material Symbols |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |

## Project Structure

```
src/
├── features/           # 기능 모듈
│   ├── auth/          # 인증
│   ├── booking/       # 예약 시스템
│   └── clinic/        # 병원 설정
├── shared/            # 공용 리소스
│   ├── api/          # Supabase API
│   ├── components/   # UI 컴포넌트
│   └── types/        # TypeScript 타입
├── pages/            # 페이지 컴포넌트
│   ├── Home.tsx     # 메인 (Stitch 디자인)
│   ├── MedicalGuide.tsx  # 진료안내
│   ├── Booking.tsx
│   └── admin/       # 관리자 페이지
└── layouts/          # 레이아웃
```

## Database Tables

**Core**: users, clinics, veterinarians, services
**Booking**: bookings, business_hours, veterinarian_working_hours, closed_dates, pets
**AI Integration**: smart_diagnoses, booking_responses, notifications

## Key Pages

| Route | Component | 설명 |
|-------|-----------|------|
| `/` | Home.tsx | 메인 (Stitch 디자인) |
| `/medical-guide` | MedicalGuide.tsx | 진료안내 (의료진 목록) |
| `/booking` | Booking.tsx | 예약 페이지 |
| `/my-bookings` | MyBookings.tsx | 내 예약 |
| `/admin/*` | admin/*.tsx | 관리자 페이지 |

## Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

**Vercel 배포 시 반드시 환경 변수 설정 필요**

## Design System (Stitch)

**Colors**:
- Primary: `#2d6a7b` (Teal)
- Accent: `#A3D9B5` (Sage Green)
- Alert: `#ef4444` (Red)
- Dark: `#22262a`

**Icons**: Material Symbols Outlined (CDN)
```tsx
<span className="material-symbols-outlined">pets</span>
```

**Inline Styles**: Tailwind 커스텀 색상이 적용되지 않을 경우 인라인 스타일 사용
```tsx
style={{ backgroundColor: '#2d6a7b', color: '#ffffff' }}
```

## Development Patterns

**API Functions**: `src/shared/api/*.api.ts`
**State Management**: Zustand stores in `src/features/*/stores/`
**Form Validation**: Zod schemas with React Hook Form
**UI Components**: CVA variants in `src/shared/components/`

## Code Quality

- TypeScript strict mode
- React Hook Form + Zod for forms
- Error handling with toast notifications
- Follow Stitch design system

## Current Status

### 완료
- ✅ 예약 시스템 (3단계 프로세스)
- ✅ 관리자 대시보드
- ✅ 수의사 관리
- ✅ Stitch 디자인 적용

### 진행 예정
- ⏳ AI 진단서 연동 (Phase E)
- ⏳ Webhook 통합

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

---
**Version**: 4.0 | **Updated**: 2025-01-15
