# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI펫닥터 병원 예약 관리 서비스**는 반려동물 헬스케어 통합 플랫폼의 병원 관리자용 시스템입니다. AI 기반 1차 진단과 연계된 스마트 예약 시스템으로, React 19 + Vite + Supabase 기반으로 완전 재개발되었습니다.

**Status**: ✅ Phase A-D Complete | 📋 Phase E Ready
**Previous Stack**: Next.js 14 + Drizzle ORM + NextAuth (deprecated)
**New Stack**: Vite + React 19 + Supabase + React Compiler 1.0
**Design System**: Clean Booking (Teal/Green) - See [DESIGN_GUIDE.md](DESIGN_GUIDE.md)
**Last Updated**: 2025-10-22 (Phase D Complete)

## Architecture Overview

### 서비스 구조
```
[AI펫닥터 앱] (고객용 모바일 앱)
      ↓
[AI 수의사 상담 + 1차 진단]
      ↓
[스마트 진단서 생성]
      ↓
[병원 예약 요청] → Webhook
      ↓
[AI펫닥터 병원 관리 시스템] (이 프로젝트)
      ↓
[예약 승인/수정/거절] → Webhook
      ↓
[AI펫닥터 앱] (예약 확정 알림)
```

### 핵심 기능
1. **직접 예약**: 고객이 직접 웹사이트에서 예약
2. **AI펫닥터 연동 예약**: AI 진단서와 함께 전달되는 예약
3. **스마트 진단서**: AI 진단 결과, 펫 히스토리, 긴급도 표시
4. **실시간 Webhook**: AI펫닥터 앱과 양방향 통신
5. **긴급도 기반 우선순위**: 응급/높음/보통/낮음 표시

## Development Commands

### Essential Commands
```bash
pnpm dev              # Start Vite dev server (HMR with React Compiler)
pnpm build            # Production build with React Compiler optimization
pnpm preview          # Preview production build
pnpm typecheck        # TypeScript type checking
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix ESLint issues
```

### Supabase Commands
```bash
pnpm supabase:types   # Generate TypeScript types from Supabase schema
pnpm supabase:start   # Start local Supabase instance (Docker required)
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:reset   # Reset local DB with migrations
pnpm supabase:studio  # Open Supabase Studio (local dashboard)
```

### Code Quality
```bash
pnpm prettier:format  # Format all TS/TSX/MDX files
pnpm prettier:check   # Check formatting
pnpm test             # Run Playwright E2E tests
```

## Tech Stack

### Frontend
```typescript
{
  "framework": "React 19.1.1",
  "bundler": "Vite 7.1.7",
  "language": "TypeScript 5.8.3",
  "compiler": "babel-plugin-react-compiler 1.0.0",
  "router": "React Router DOM 7.9.3",
  "state": "Zustand 5.0.8",
  "styling": "TailwindCSS 3.4.17 + CVA",
  "forms": "React Hook Form 7.54.2 + Zod 3.24.1",
  "icons": "Lucide React 0.544.0",
  "charts": "Recharts 3.2.1",
  "dnd": "@dnd-kit/core 6.3.1",
  "testing": "@playwright/test 1.55.1"
}
```

### Backend (Supabase)
```typescript
{
  "database": "PostgreSQL 15",
  "auth": "Supabase Auth (JWT)",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime (WebSocket)",
  "edge": "Supabase Edge Functions (Deno)",
  "client": "@supabase/supabase-js 2.58.0"
}
```

### Why This Stack?

| 구분 | 기존 (Next.js) | 신규 (React + Vite) |
|------|---------------|-------------------|
| **렌더링** | SSR/SSG | CSR (Admin 시스템) |
| **빌드 시간** | ~45초 | ~3초 |
| **HMR** | 느림 | 즉시 |
| **상태 관리** | Context + RHF | Zustand 중앙 집중 |
| **ORM** | Drizzle | Supabase (PostgreSQL) |
| **컴파일러** | 없음 | React Compiler 1.0 |

## Project Structure

```
ai-pet-doctor-hospital/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── ai-integration/    # AI펫닥터 연동
│   │   │   ├── components/    # SmartDiagnosisCard, UrgencyBadge
│   │   │   ├── hooks/         # useSmartDiagnosis, useWebhook
│   │   │   ├── api/           # webhook.api.ts, ai-pet-doctor.api.ts
│   │   │   └── types/         # TypeScript interfaces
│   │   ├── auth/              # 인증 (Supabase Auth)
│   │   ├── booking/           # 예약 관리
│   │   ├── clinic/            # 클리닉 설정
│   │   └── dashboard/         # 대시보드 통계
│   │
│   ├── shared/                # 공유 리소스
│   │   ├── api/               # Supabase client, API functions
│   │   ├── components/        # Button, Input, Modal, Table
│   │   ├── hooks/             # useDebounce, useLocalStorage
│   │   ├── utils/             # date, format, validation, cn
│   │   └── types/             # database.types.ts (generated)
│   │
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Booking.tsx
│   │   ├── MyBookings.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Bookings.tsx
│   │       └── Settings.tsx
│   │
│   ├── layouts/               # MainLayout, AdminLayout
│   ├── main.tsx               # 진입점
│   └── App.tsx                # 루트 + Router 설정
│
├── public/
│   ├── images/
│   └── locales/               # 다국어 JSON (ko/en/pl)
│
├── supabase/
│   ├── migrations/            # SQL migration files
│   └── functions/             # Edge Functions (Webhook handlers)
│
├── .env.local                 # Environment variables
├── vite.config.ts             # Vite + React Compiler config
└── supabase.config.ts         # Supabase project config
```

## Database Schema

### Core Tables

#### 1. users
```sql
- id: UUID (Supabase Auth)
- email: TEXT
- role: 'customer' | 'admin'
- full_name, phone, created_at, updated_at
```

#### 2. bookings
```sql
- id, booking_number: 'A2025-0001'
- clinic_id, service_id, user_id, pet_id
- booking_date, booking_time
- status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show'
- customer_name, customer_phone, customer_email (비회원용)
- pet_name, pet_species, pet_breed, pet_age (비회원용)
- symptoms, admin_notes
- source: 'direct' | 'ai_pet_doctor' ⭐
- ai_pet_doctor_request_id ⭐
- ai_pet_doctor_user_id, ai_pet_doctor_pet_id ⭐
```

#### 3. smart_diagnoses ⭐ NEW
```sql
- id, diagnosis_id (AI펫닥터 진단서 ID)
- booking_id (FK)
- urgency: 'low' | 'medium' | 'high' | 'emergency'

-- 1. 보호자 문의
- symptoms: JSONB ['구토', '기력저하']
- duration: TEXT '2일'
- severity: INT 1-10
- additional_notes: TEXT

-- 2. AI 진단
- suspected_conditions: JSONB ['급성 위장염']
- confidence: NUMERIC 0.85
- hospital_visit_required: BOOLEAN
- recommended_tests: JSONB ['혈액검사', 'X-ray']
- ai_recommendations: TEXT

-- 3. 펫 히스토리
- past_visits: JSONB
- allergies: JSONB ['페니실린']
- current_medications: JSONB
- vaccinations: JSONB
- chronic_conditions: JSONB
- special_notes: TEXT

- diagnosis_created_at, created_at, updated_at
```

#### 4. booking_responses ⭐ NEW
```sql
- id, booking_id (FK)
- response_type: 'confirmed' | 'modified' | 'rejected'
- suggested_dates: JSONB (수정 제안시)
- modification_reason, rejection_reason
- alternative_clinics: JSONB
- hospital_message: TEXT
- webhook_sent, webhook_sent_at, webhook_response
- created_at, created_by
```

#### 5. clinics
```sql
- name, description, address, latitude, longitude
- phone_1, phone_2, email, logo_url
```

#### 6. services
```sql
- name, description, duration_minutes, price, is_active
```

#### 7. business_hours
```sql
- clinic_id, day_of_week (0-6)
- is_open, open_time, close_time
- break_start, break_end
```

#### 8. closed_dates
```sql
- clinic_id, date, reason
```

#### 9. pets
```sql
- owner_id, name, species, breed, age, weight, notes
```

#### 10. notifications
```sql
- user_id, booking_id, type, title, message, is_read
```

### Type Generation
```bash
pnpm supabase:types
# Generates: src/shared/types/database.types.ts
```

Usage:
```typescript
import type { Database } from '@/shared/types/database.types'

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
```

## Authentication (Supabase Auth)

### Setup
```typescript
// src/shared/api/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)
```

### Auth Flow
1. **Sign Up**: `supabase.auth.signUp({ email, password })`
2. **Sign In**: `supabase.auth.signInWithPassword({ email, password })`
3. **Sign Out**: `supabase.auth.signOut()`
4. **Session**: `supabase.auth.getSession()`
5. **User**: `supabase.auth.getUser()`

### Protected Routes (React Router)
```typescript
// src/App.tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" />
  return children
}

<Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route path="/admin/dashboard" element={<Dashboard />} />
</Route>
```

## State Management (Zustand)

### Pattern
```typescript
// src/features/auth/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  session: Session | null

  // Actions
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,

      setUser: (user) => set({ user }),

      login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        set({ user: data.user, session: data.session })
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
      },
    }),
    { name: 'auth-storage' }
  )
)
```

### Stores
- `authStore.ts` - Authentication state
- `bookingStore.ts` - Bookings, filters, selected booking
- `clinicStore.ts` - Clinic settings
- No global store - feature-based isolation

## API Layer

### Pattern
```typescript
// src/shared/api/bookings.api.ts
import { supabase } from './supabase'
import type { Booking, BookingInsert } from '@/shared/types/database.types'

export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false })

  if (error) throw error
  return data
}

export async function createBooking(booking: BookingInsert): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBooking(
  id: string,
  updates: Partial<Booking>
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Custom Hooks
```typescript
// src/features/booking/hooks/useBookings.ts
import { useEffect } from 'react'
import { useBookingStore } from '../stores/bookingStore'
import { getAllBookings, subscribeToBookings } from '@/shared/api/bookings.api'

export function useBookings() {
  const { bookings, setBookings, addBooking, updateBooking } = useBookingStore()

  useEffect(() => {
    // Initial load
    getAllBookings().then(setBookings)

    // Realtime subscription
    const channel = subscribeToBookings((payload) => {
      if (payload.eventType === 'INSERT') {
        addBooking(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        updateBooking(payload.new.id, payload.new)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { bookings }
}
```

## Realtime Subscriptions

### Pattern
```typescript
// src/shared/api/bookings.api.ts
export function subscribeToBookings(
  callback: (payload: RealtimePayload) => void
) {
  return supabase
    .channel('bookings-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
      },
      callback
    )
    .subscribe()
}
```

### Usage
- **Admin Dashboard**: Real-time booking updates
- **Booking List**: Live status changes
- **Notifications**: New booking alerts

## AI펫닥터 연동 (Webhook)

### Incoming Webhook (AI펫닥터 앱 → 병원 관리 시스템)
```typescript
// supabase/functions/ai-pet-doctor-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload: AIPetDoctorBookingRequest = await req.json()

  // 1. Create booking
  const booking = await createBooking({
    source: 'ai_pet_doctor',
    ai_pet_doctor_request_id: payload.request_id,
    customer_name: payload.customer.name,
    // ... map fields
  })

  // 2. Create smart diagnosis
  await createSmartDiagnosis({
    booking_id: booking.id,
    diagnosis_id: payload.smart_diagnosis.id,
    urgency: payload.smart_diagnosis.urgency,
    symptoms: payload.smart_diagnosis.inquiry.symptoms,
    // ... map fields
  })

  return new Response(JSON.stringify({ booking_id: booking.id }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Outgoing Webhook (병원 관리 시스템 → AI펫닥터 앱)
```typescript
// src/features/ai-integration/api/webhook.api.ts
export async function sendBookingResponse(
  requestId: string,
  response: BookingResponse
) {
  const webhookUrl = import.meta.env.VITE_AI_PET_DOCTOR_WEBHOOK_URL

  const payload = {
    request_id: requestId,
    booking_id: response.booking_id,
    booking_number: response.booking_number,
    status: response.status, // 'confirmed' | 'modified' | 'rejected'
    confirmed_date: response.confirmed_date,
    confirmed_time: response.confirmed_time,
    hospital_message: response.hospital_message,
    updated_at: new Date().toISOString(),
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_AI_PET_DOCTOR_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error('Webhook failed')

  // Log response
  await createBookingResponse({
    booking_id: response.booking_id,
    response_type: response.status,
    webhook_sent: true,
    webhook_sent_at: new Date().toISOString(),
    webhook_response: await res.text(),
  })
}
```

## Form Handling (React Hook Form + Zod)

### Pattern
```typescript
// src/features/booking/components/BookingForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const bookingSchema = z.object({
  customer_name: z.string().min(2, '이름을 입력해주세요'),
  customer_phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호를 입력해주세요'),
  pet_name: z.string().min(1, '펫 이름을 입력해주세요'),
  booking_date: z.string(),
  booking_time: z.string(),
})

type BookingInput = z.infer<typeof bookingSchema>

export function BookingForm() {
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      pet_name: '',
    },
  })

  const onSubmit = async (data: BookingInput) => {
    try {
      await createBooking(data)
      toast({ title: '예약이 완료되었습니다!' })
    } catch (error) {
      toast({ title: '오류가 발생했습니다', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('customer_name')} />
      {/* ... */}
    </form>
  )
}
```

## Component Library (CVA)

### Button Example
```typescript
// src/shared/components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-primary-600 text-primary-600',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export function Button({ variant, size, isLoading, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading}
      {...props}
    />
  )
}
```

## React Compiler 1.0

### Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            compilationMode: 'infer', // Auto-optimize
          }],
        ],
      },
    }),
  ],
})
```

### Benefits
- **자동 메모이제이션**: `useMemo`, `useCallback` 불필요
- **컴포넌트 최적화**: 자동 `memo()` 적용
- **성능 향상**: 30-50% 렌더링 개선

### Best Practices
```typescript
// ✅ 컴파일러가 자동 최적화
function BookingCard({ booking }: { booking: Booking }) {
  const formattedDate = formatDate(booking.date)
  const statusColor = getStatusColor(booking.status)

  return <div className={statusColor}>{formattedDate}</div>
}

// ❌ 수동 메모이제이션 불필요 (제거 가능)
// const BookingCard = memo(({ booking }) => { ... })
// const formattedDate = useMemo(() => formatDate(booking.date), [booking.date])
```

## Environment Variables

```env
# .env.local

# App
VITE_APP_URL=http://localhost:5173

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# AI펫닥터 연동
VITE_AI_PET_DOCTOR_WEBHOOK_URL=https://api.aipetdoctor.com/webhooks/booking-status
VITE_AI_PET_DOCTOR_API_KEY=apd_xxx

# Optional
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

## Development Workflow

### Adding a New Feature
1. Create feature folder in `src/features/[feature-name]/`
2. Add components, hooks, api, types, stores
3. Define Zod schemas for forms
4. Create API functions in `src/shared/api/`
5. Add routes in `src/App.tsx`
6. Update database schema if needed (Supabase migrations)

### Modifying Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Write migration SQL
3. Run migration
4. Regenerate types: `pnpm supabase:types`
5. Update API functions and components

### Creating a Form
1. Define Zod schema in component or `src/validations/`
2. Use `useForm` with `zodResolver`
3. Create form UI with CVA components
4. Handle submit with try/catch + toast
5. Call API function from `src/shared/api/`

### Adding Realtime
1. Create subscription function in API layer
2. Use in custom hook with `useEffect`
3. Update Zustand store on events
4. Clean up subscription in return function

## Testing (Playwright)

```typescript
// tests/booking.spec.ts
import { test, expect } from '@playwright/test'

test('사용자가 예약을 생성할 수 있다', async ({ page }) => {
  await page.goto('http://localhost:5173/booking')

  await page.fill('[name="customer_name"]', '김철수')
  await page.fill('[name="customer_phone"]', '010-1234-5678')
  await page.fill('[name="pet_name"]', '행복이')
  await page.click('text=예약하기')

  await expect(page.locator('text=예약이 완료되었습니다')).toBeVisible()
})
```

## Development Progress

### ✅ Phase A: Supabase Setup (Completed)
- [x] Supabase 프로젝트 생성 및 연결
- [x] 데이터베이스 스키마 마이그레이션 (10개 테이블)
  - [x] users, bookings, smart_diagnoses, booking_responses
  - [x] clinics, services, business_hours, closed_dates
  - [x] pets, notifications
- [x] RLS (Row Level Security) 정책 설정
- [x] TypeScript 타입 자동 생성 설정
- [x] Supabase 클라이언트 설정 (src/shared/api/supabase.ts)
- [x] 연결 테스트 완료 (행복동물병원 데이터 확인)

### ✅ Phase B: Core Infrastructure (Completed)
- [x] 인증 시스템 (Supabase Auth)
  - [x] authStore (Zustand + persist)
  - [x] auth.api.ts (signUp, signIn, signOut)
  - [x] useAuth hook
  - [x] Login/Signup 페이지
  - [x] ProtectedRoute 컴포넌트
- [x] React Router 설정
  - [x] Public routes (/, /login, /signup)
  - [x] Protected routes (/booking, /my-bookings, /admin/*)
  - [x] Design concept routes (/design/*)
- [x] Layouts
  - [x] MainLayout
  - [x] AdminLayout
- [x] API Functions
  - [x] bookings.api.ts (CRUD + realtime subscriptions)
  - [x] clinics.api.ts (CRUD)
  - [x] services.api.ts (CRUD)

### ✅ Phase C: UI Components (Completed)
- [x] 7개 핵심 컴포넌트 (CVA 기반)
  - [x] Button (6 variants, 4 sizes)
  - [x] Input (with label, error, icons)
  - [x] Card (with sub-components)
  - [x] Modal (portal-based)
  - [x] Table (sortable, responsive)
  - [x] Badge (status, urgency)
  - [x] Toast (Zustand global state)
- [x] TailwindCSS 4.x 설정
- [x] Lucide React 아이콘 통합

### ✅ Design System (Completed)
- [x] 6개 디자인 컨셉 생성
  1. Modern Minimal
  2. Warm Pet Care
  3. Professional Medical
  4. Glassmorphism
  5. Dark Mode Tech
  6. **Clean Booking (선택됨)** ⭐
- [x] Clean Booking 디자인으로 Home 페이지 재작성
  - [x] Teal/Green 색상 스킴
  - [x] 깔끔한 카드 기반 UI
  - [x] Hero section with 2-column layout
  - [x] Features section (6 cards)
  - [x] How It Works (4 steps)
  - [x] CTA section
  - [x] Footer
- [x] **[DESIGN_GUIDE.md](DESIGN_GUIDE.md) 작성** ⭐
  - [x] 색상 시스템 (Primary, Secondary, Status)
  - [x] 타이포그래피 가이드
  - [x] 간격 및 레이아웃
  - [x] 컴포넌트 스타일 (버튼, 카드, 입력, 배지 등)
  - [x] 아이콘 시스템 (Lucide React)
  - [x] 인터랙션 및 애니메이션
  - [x] 반응형 디자인
  - [x] 접근성 가이드
  - [x] 코드 예제

### ✅ Phase D: Feature Implementation (Completed - 2025-10-22)
- [x] **예약 생성 페이지** (/booking)
  - [x] 3단계 예약 프로세스 (날짜 → 시간 → 정보)
  - [x] BookingCalendar 컴포넌트 (월간 캘린더, 주말 색상, 오늘 표시)
  - [x] TimeSlotPicker 컴포넌트 (30분 단위, 점심시간 비활성화)
  - [x] BookingForm 컴포넌트 (React Hook Form + Zod)
  - [x] 실시간 clinic/service ID 조회
  - [x] 비회원 예약 지원
  - [x] 예약 생성 API 연동
  - [x] Toast 알림 통합

- [x] **예약 상세/수정/취소**
  - [x] BookingDetailModal 컴포넌트
  - [x] useBookingActions 훅 (취소, 상태변경, 일정변경, 메모)
  - [x] MyBookings 페이지에 모달 통합
  - [x] 예약 취소 확인 다이얼로그

- [x] **관리자 대시보드**
  - [x] Dashboard.tsx (통계 카드, 차트, 최근 예약)
  - [x] Bookings.tsx (예약 목록, 필터링)

- [x] **내 예약 페이지** (고객용)
  - [x] MyBookings.tsx (탭 필터, 상태 배지, 상세보기)

- [x] **클리닉 설정 페이지** (/admin/settings)
  - [x] 4개 탭 구조 (기본정보, 영업시간, 휴무일, 서비스)
  - [x] 기본 정보 폼 (React Hook Form + Zod)
  - [x] 영업 시간 설정 UI
  - [x] 휴무일 관리 UI
  - [x] 서비스 관리 UI

**Phase D 추가 수정사항**:
- [x] Toast showToast 함수 export 추가
- [x] Foreign Key 제약 해결 (user_id null 허용)
- [x] 회원가입 시 users 프로필 자동 생성 (Supabase 트리거)
- [x] pet_age INTEGER 변환
- [x] 에러 로깅 강화

### 📋 Phase E: AI Integration (Planned)
- [ ] AI펫닥터 Webhook 수신 (Supabase Edge Function)
- [ ] 스마트 진단서 컴포넌트
  - [ ] SmartDiagnosisCard
  - [ ] UrgencyBadge with pulse animation
  - [ ] PetHistorySection
- [ ] 긴급도 기반 필터링 및 정렬
- [ ] Webhook 전송 (예약 응답)
  - [ ] 예약 승인
  - [ ] 예약 수정 제안
  - [ ] 예약 거절

## Critical Files

### Configuration
- `vite.config.ts` - Vite + React Compiler config
- `tailwind.config.js` - TailwindCSS 4.x config
- `postcss.config.js` - PostCSS with @tailwindcss/postcss
- `.env.local` - Environment variables
- `tsconfig.json` - TypeScript config with path aliases

### Entry Points
- `src/main.tsx` - App entry point
- `src/App.tsx` - Router setup with all routes
- `src/index.css` - TailwindCSS import (@import "tailwindcss")

### Backend
- `src/shared/api/supabase.ts` - Supabase client initialization
- `supabase/migrations/` - Database migrations
  - `20250120_initial_schema.sql` - Initial 10 tables
  - `20250121_fix_rls_policies.sql` - RLS policy fixes

### Design System
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Complete design system documentation
- `src/pages/Home.tsx` - Reference implementation (Clean Booking design)
- `src/pages/design-concepts/Concept6_CleanBooking.tsx` - Design concept reference

### Shared Components
- `src/shared/components/` - 7 core UI components
  - `Button.tsx`, `Input.tsx`, `Card.tsx`, `Modal.tsx`
  - `Table.tsx`, `Badge.tsx`, `Toast.tsx`
  - `index.ts` - Centralized exports

### Authentication
- `src/features/auth/stores/authStore.ts` - Auth state (Zustand)
- `src/features/auth/api/auth.api.ts` - Auth API functions
- `src/features/auth/hooks/useAuth.ts` - Auth hook
- `src/pages/Login.tsx`, `src/pages/Signup.tsx` - Auth pages

### Types
- `src/shared/types/database.types.ts` - Auto-generated from Supabase

## Migration from Next.js

### What Changed
| Old | New | Reason |
|-----|-----|--------|
| Next.js App Router | React Router 7 | Admin system doesn't need SSR |
| Drizzle ORM | Supabase Client | Simplified stack, built-in auth/realtime |
| NextAuth v5 | Supabase Auth | Native integration, easier setup |
| Server Actions | API Functions | Direct Supabase client calls |
| Webpack | Vite | 10x faster builds |

### Data Migration
```sql
-- Export from old DB (Drizzle)
pg_dump old_db > backup.sql

-- Import to Supabase (adjust schema as needed)
psql supabase_db < backup_adjusted.sql
```

## Resources

### Documentation
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Complete design system guide ⭐
- [PRD Document](./ARKA_PRD_REACT_SUPABASE.md) - Full product requirements

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Vite Docs](https://vitejs.dev/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [CVA Docs](https://cva.style/)
- [Lucide React Icons](https://lucide.dev/icons/)

---

## Phase D Implementation Summary (2025-10-22)

### 📦 Created Files (10개)
**Booking Components**:
- `src/features/booking/components/BookingCalendar.tsx` - 월간 캘린더 (195 lines)
- `src/features/booking/components/TimeSlotPicker.tsx` - 시간 선택 (133 lines)
- `src/features/booking/components/BookingForm.tsx` - 예약 정보 폼 (228 lines)
- `src/features/booking/components/BookingDetailModal.tsx` - 상세 모달 (195 lines)
- `src/features/booking/components/index.ts` - Exports

**Booking Hooks**:
- `src/features/booking/hooks/useBookingActions.ts` - 예약 액션 (168 lines)

**Pages**:
- `src/pages/Booking.tsx` - 예약 생성 페이지 (338 lines)
- `src/pages/admin/Settings.tsx` - 클리닉 설정 (519 lines)

**Database**:
- `supabase/migrations/20250122_auto_create_user_profile.sql` - 자동 프로필 생성
- `test-booking.js` - 테스트 스크립트

### ✏️ Modified Files (5개)
- `src/App.tsx` - 라우트 추가 (Booking, Settings)
- `src/pages/MyBookings.tsx` - 모달 통합
- `src/shared/components/Toast.tsx` - showToast 함수 추가
- `src/features/booking/components/index.ts` - exports 업데이트
- `vite.config.ts` - 포트 5175 고정

### 📊 Implementation Stats
- **총 코드 라인**: ~2,000+ lines
- **컴포넌트**: 7개 (Calendar, TimePicker, Form, Modal 등)
- **페이지**: 2개 (Booking, Settings)
- **Hooks**: 1개 (useBookingActions)
- **마이그레이션**: 1개 (user profile trigger)
- **타입 에러**: 0개 ✅
- **빌드 시간**: ~3초 (Vite)

### 🐛 Resolved Issues
1. **Toast export 에러** - showToast 함수 추가
2. **400 에러** - clinic_id/service_id 동적 조회
3. **409 Foreign Key 에러** - user_id null 허용 + 자동 프로필 생성
4. **pet_age 타입** - parseInt() 변환

### 🎯 Key Features Delivered
- ✅ 3단계 예약 프로세스 (UX 최적화)
- ✅ 비회원 예약 지원
- ✅ 실시간 데이터 조회
- ✅ 폼 검증 (React Hook Form + Zod)
- ✅ 에러 핸들링 & 로깅
- ✅ 반응형 디자인
- ✅ Clean Booking 디자인 시스템 일관성

### 🚀 Ready for Phase E
- Database schema 준비 완료 (smart_diagnoses, booking_responses)
- API layer 구조화 완료
- UI 컴포넌트 재사용 가능
- Webhook 엔드포인트 설계 완료

---

**Last Updated**: 2025-10-22
**Version**: 3.0 (Phase A-D Complete - Full Booking System)
