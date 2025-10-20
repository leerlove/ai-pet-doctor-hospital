# AI펫닥터 병원 예약 관리 서비스 - 개발 플랜

## 프로젝트 개요

**목표**: Next.js 기반 레거시 시스템을 React 19 + Vite + Supabase로 완전 재개발
**기간**: 8주 (Phase 1-4)
**팀 구성**: Frontend 개발자 (+ Claude Code AI)

---

## Phase 1: 프로젝트 기반 구축 (Week 1-2)

### Week 1: 초기 설정 및 인프라 구축

#### 1.1 Supabase 프로젝트 생성 (Day 1)
```bash
# 작업 내용
1. Supabase 계정 생성 및 새 프로젝트 생성
2. 데이터베이스 URL 및 API Key 확인
3. .env.local 파일 설정

# 환경변수 설정
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

**Deliverables**:
- ✅ Supabase 프로젝트 생성 완료
- ✅ 환경변수 설정 완료

---

#### 1.2 데이터베이스 스키마 마이그레이션 (Day 1-2)
```sql
-- 작업 순서
1. Supabase Dashboard → SQL Editor 이동
2. PRD의 Database Schema 복사 (10개 테이블)
3. 순차적으로 실행:
   - users
   - clinics
   - services
   - business_hours
   - closed_dates
   - pets
   - bookings ⭐ (AI 연동 필드 포함)
   - smart_diagnoses ⭐ NEW
   - booking_responses ⭐ NEW
   - notifications

4. 인덱스 생성
5. 트리거 생성 (updated_at, booking_number)
6. RLS (Row Level Security) 정책 설정
```

**체크리스트**:
- [ ] 모든 테이블 생성 완료
- [ ] Foreign Key 제약조건 설정
- [ ] 인덱스 생성 완료
- [ ] 트리거 동작 테스트
- [ ] RLS 정책 적용 및 테스트

**Deliverables**:
- ✅ 완전한 데이터베이스 스키마
- ✅ 테스트 데이터 삽입 (clinics, services 등)

---

#### 1.3 React 프로젝트 초기화 (Day 2-3)
```bash
# Vite + React 19 프로젝트 생성
pnpm create vite ai-pet-doctor-hospital --template react-ts
cd ai-pet-doctor-hospital
pnpm install

# 핵심 의존성 설치
pnpm add @supabase/supabase-js@2.58.0
pnpm add react-router-dom@7.9.3
pnpm add zustand@5.0.8
pnpm add react-hook-form@7.54.2 @hookform/resolvers@2.9.14
pnpm add zod@3.24.1
pnpm add class-variance-authority@0.7.1
pnpm add clsx tailwind-merge
pnpm add lucide-react@0.544.0
pnpm add recharts@3.2.1
pnpm add @dnd-kit/core@6.3.1
pnpm add dayjs

# 개발 의존성
pnpm add -D tailwindcss@3.4.17 postcss autoprefixer
pnpm add -D @vitejs/plugin-react
pnpm add -D babel-plugin-react-compiler@1.0.0
pnpm add -D @playwright/test@1.55.1
pnpm add -D @types/node

# TailwindCSS 초기화
pnpm dlx tailwindcss init -p
```

**파일 생성**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            compilationMode: 'infer',
          }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        status: {
          pending: '#f59e0b',
          confirmed: '#10b981',
          cancelled: '#ef4444',
          completed: '#6b7280',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Deliverables**:
- ✅ Vite + React 19 프로젝트 구조
- ✅ TailwindCSS 설정 완료
- ✅ React Compiler 설정 완료
- ✅ Path alias (@/) 설정

---

### Week 2: 기본 인프라 및 공유 컴포넌트

#### 2.1 Supabase 클라이언트 설정 (Day 4)
```typescript
// src/shared/api/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
```

```bash
# Supabase 타입 생성
pnpm supabase login
pnpm supabase init
pnpm supabase link --project-ref xxxxx
pnpm supabase gen types typescript --local > src/shared/types/database.types.ts
```

**Deliverables**:
- ✅ Supabase 클라이언트 초기화
- ✅ TypeScript 타입 자동 생성

---

#### 2.2 기본 유틸리티 함수 (Day 4-5)
```typescript
// src/shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```typescript
// src/shared/utils/date.ts
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

export function formatDate(date: string | Date): string {
  return dayjs(date).format('YYYY년 MM월 DD일')
}

export function formatTime(time: string): string {
  return dayjs(time, 'HH:mm').format('A h:mm')
}

export function formatDateTime(datetime: string | Date): string {
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

export function isToday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), 'day')
}
```

```typescript
// src/shared/utils/format.ts
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}
```

**Deliverables**:
- ✅ 날짜/시간 포맷 유틸리티
- ✅ 클래스네임 병합 유틸리티
- ✅ 포맷팅 유틸리티

---

#### 2.3 기본 UI 컴포넌트 라이브러리 (Day 5-7)
```typescript
// src/shared/components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'hover:bg-gray-100 text-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
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
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  variant,
  size,
  fullWidth,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner className="mr-2" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}
```

**컴포넌트 목록**:
- [ ] Button (variants, sizes, loading)
- [ ] Input (label, error, icons)
- [ ] Select (options, placeholder)
- [ ] Textarea
- [ ] Checkbox
- [ ] Radio
- [ ] Modal (overlay, close button)
- [ ] Card (header, body, footer)
- [ ] Badge (status colors)
- [ ] Alert (success, error, warning)
- [ ] Loading (spinner)
- [ ] Table (sortable, paginated)
- [ ] Toast (notifications)

**Deliverables**:
- ✅ 13개 기본 UI 컴포넌트
- ✅ CVA 기반 variant 시스템
- ✅ 스토리북 또는 테스트 페이지

---

#### 2.4 레이아웃 컴포넌트 (Day 7)
```typescript
// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/nav/Header'
import { Footer } from '@/components/nav/Footer'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

```typescript
// src/layouts/AdminLayout.tsx
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/nav/AdminSidebar'
import { AdminHeader } from '@/components/nav/AdminHeader'

export function AdminLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

**Deliverables**:
- ✅ MainLayout (Header + Footer)
- ✅ AdminLayout (Sidebar + Header)
- ✅ AuthLayout (Centered card)

---

## Phase 2: 핵심 기능 구현 (Week 3-5)

### Week 3: 인증 시스템

#### 3.1 Zustand Auth Store (Day 8)
```typescript
// src/features/auth/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/shared/api/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          set({ user: data.user, session: data.session })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
      },

      signup: async (email, password, fullName) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
          if (error) throw error
          // Supabase sends email verification
        } finally {
          set({ isLoading: false })
        }
      },

      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
        })
        if (error) throw error
      },

      updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (error) throw error
      },

      initialize: async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          set({ user: data.session.user, session: data.session })
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null, session })
        })
      },
    }),
    { name: 'auth-storage' }
  )
)
```

**Deliverables**:
- ✅ Zustand Auth Store
- ✅ Login/Signup/Logout 기능
- ✅ Password Reset 기능

---

#### 3.2 인증 UI 컴포넌트 (Day 9-10)
```typescript
// src/features/auth/components/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

type LoginInput = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuthStore()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password)
      toast({ title: '로그인 성공!' })
    } catch (error) {
      toast({ title: '로그인 실패', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        label="이메일"
        type="email"
        {...form.register('email')}
        error={form.formState.errors.email?.message}
      />
      <Input
        label="비밀번호"
        type="password"
        {...form.register('password')}
        error={form.formState.errors.password?.message}
      />
      <Button type="submit" fullWidth>
        로그인
      </Button>
    </form>
  )
}
```

**페이지 목록**:
- [ ] Login Page (`/login`)
- [ ] Signup Page (`/signup`)
- [ ] Password Reset Request (`/forgot-password`)
- [ ] Password Reset Form (`/reset-password`)

**Deliverables**:
- ✅ 인증 관련 모든 UI
- ✅ Zod 스키마 기반 폼 검증
- ✅ Toast 알림

---

#### 3.3 Protected Routes (Day 10)
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { MainLayout } from '@/layouts/MainLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

**Deliverables**:
- ✅ React Router 설정
- ✅ Protected Routes
- ✅ Auth State 초기화

---

### Week 4: 예약 시스템 (고객용)

#### 4.1 예약 API 레이어 (Day 11)
```typescript
// src/shared/api/bookings.api.ts
import { supabase } from './supabase'
import type { Tables } from './supabase'

export type Booking = Tables<'bookings'>
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']

export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false })

  if (error) throw error
  return data
}

export async function getBookingById(id: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

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

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw error
}

// Realtime subscription
export function subscribeToBookings(callback: (payload: any) => void) {
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

**Deliverables**:
- ✅ Booking CRUD API 함수
- ✅ Realtime subscription 함수

---

#### 4.2 Booking Store (Day 11)
```typescript
// src/features/booking/stores/bookingStore.ts
import { create } from 'zustand'
import type { Booking } from '@/shared/api/bookings.api'

interface BookingFilters {
  status: 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'
  dateFrom: string | null
  dateTo: string | null
  searchQuery: string
}

interface BookingState {
  bookings: Booking[]
  selectedBooking: Booking | null
  filters: BookingFilters
  isLoading: boolean

  // Actions
  setBookings: (bookings: Booking[]) => void
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, data: Partial<Booking>) => void
  deleteBooking: (id: string) => void
  setFilters: (filters: Partial<BookingFilters>) => void
  selectBooking: (booking: Booking | null) => void
  setLoading: (isLoading: boolean) => void

  // Computed
  filteredBookings: () => Booking[]
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  filters: {
    status: 'all',
    dateFrom: null,
    dateTo: null,
    searchQuery: '',
  },
  isLoading: false,

  setBookings: (bookings) => set({ bookings }),

  addBooking: (booking) =>
    set((state) => ({ bookings: [booking, ...state.bookings] })),

  updateBooking: (id, data) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  selectBooking: (booking) => set({ selectedBooking: booking }),

  setLoading: (isLoading) => set({ isLoading }),

  filteredBookings: () => {
    const { bookings, filters } = get()
    return bookings.filter((booking) => {
      if (filters.status !== 'all' && booking.status !== filters.status) return false
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        return (
          booking.customer_name.toLowerCase().includes(query) ||
          booking.pet_name.toLowerCase().includes(query) ||
          booking.customer_phone.includes(query)
        )
      }
      return true
    })
  },
}))
```

**Deliverables**:
- ✅ Booking Zustand Store
- ✅ 필터링 로직
- ✅ CRUD 액션

---

#### 4.3 예약 폼 (Day 12-13)
```typescript
// src/features/booking/components/BookingForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const bookingSchema = z.object({
  service_id: z.string().uuid('서비스를 선택해주세요'),
  booking_date: z.string().min(1, '날짜를 선택해주세요'),
  booking_time: z.string().min(1, '시간을 선택해주세요'),
  customer_name: z.string().min(2, '이름을 입력해주세요'),
  customer_phone: z.string().regex(/^010-?\d{4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  customer_email: z.string().email('올바른 이메일을 입력해주세요').optional(),
  pet_name: z.string().min(1, '반려동물 이름을 입력해주세요'),
  pet_species: z.enum(['dog', 'cat', 'other']),
  pet_breed: z.string().optional(),
  pet_age: z.number().min(0).max(30).optional(),
  symptoms: z.string().optional(),
})

type BookingInput = z.infer<typeof bookingSchema>

export function BookingForm() {
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pet_species: 'dog',
    },
  })

  const onSubmit = async (data: BookingInput) => {
    try {
      await createBooking({
        ...data,
        source: 'direct',
        status: 'pending',
      })
      toast({ title: '예약이 완료되었습니다!' })
    } catch (error) {
      toast({ title: '예약 중 오류가 발생했습니다', variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1: Service Selection */}
      <ServiceSelect {...form.register('service_id')} />

      {/* Step 2: Date & Time */}
      <DateTimePicker
        date={form.watch('booking_date')}
        time={form.watch('booking_time')}
        onDateChange={(date) => form.setValue('booking_date', date)}
        onTimeChange={(time) => form.setValue('booking_time', time)}
      />

      {/* Step 3: Customer & Pet Info */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="보호자 이름" {...form.register('customer_name')} />
        <Input label="전화번호" {...form.register('customer_phone')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="반려동물 이름" {...form.register('pet_name')} />
        <Select label="종류" {...form.register('pet_species')}>
          <option value="dog">강아지</option>
          <option value="cat">고양이</option>
          <option value="other">기타</option>
        </Select>
      </div>

      <Textarea label="증상 (선택)" {...form.register('symptoms')} />

      <Button type="submit" fullWidth>
        예약하기
      </Button>
    </form>
  )
}
```

**Deliverables**:
- ✅ 3단계 예약 폼
- ✅ 날짜/시간 선택 컴포넌트
- ✅ 실시간 가용성 체크 (business_hours, closed_dates 기반)

---

### Week 5: 관리자 대시보드

#### 5.1 대시보드 통계 (Day 14)
```typescript
// src/features/dashboard/hooks/useStats.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/shared/api/supabase'

interface Stats {
  todayBookings: number
  pendingBookings: number
  weeklyBookings: number
  monthlyBookings: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    todayBookings: 0,
    pendingBookings: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const [todayRes, pendingRes, weeklyRes, monthlyRes] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact' }).eq('booking_date', today),
        supabase.from('bookings').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('bookings').select('*', { count: 'exact' }).gte('booking_date', weekAgo),
        supabase.from('bookings').select('*', { count: 'exact' }).gte('booking_date', monthAgo),
      ])

      setStats({
        todayBookings: todayRes.count ?? 0,
        pendingBookings: pendingRes.count ?? 0,
        weeklyBookings: weeklyRes.count ?? 0,
        monthlyBookings: monthlyRes.count ?? 0,
      })
    }

    fetchStats()
  }, [])

  return stats
}
```

```typescript
// src/features/dashboard/components/StatsCards.tsx
export function StatsCards() {
  const stats = useStats()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="오늘 예약" value={stats.todayBookings} />
      <StatCard title="대기 중" value={stats.pendingBookings} variant="warning" />
      <StatCard title="이번 주" value={stats.weeklyBookings} />
      <StatCard title="이번 달" value={stats.monthlyBookings} />
    </div>
  )
}
```

**Deliverables**:
- ✅ 통계 API 호출 훅
- ✅ 통계 카드 UI

---

#### 5.2 예약 테이블 (Day 15-16)
```typescript
// src/features/booking/components/BookingsTable.tsx
import { useEffect } from 'react'
import { useBookingStore } from '../stores/bookingStore'
import { getAllBookings, subscribeToBookings } from '@/shared/api/bookings.api'

export function BookingsTable() {
  const { bookings, filteredBookings, setBookings, updateBooking, selectBooking } =
    useBookingStore()

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

  return (
    <div>
      {/* Filters */}
      <BookingFilters />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>예약번호</TableHead>
            <TableHead>날짜/시간</TableHead>
            <TableHead>보호자</TableHead>
            <TableHead>반려동물</TableHead>
            <TableHead>서비스</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings().map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.booking_number}</TableCell>
              <TableCell>
                {formatDate(booking.booking_date)} {formatTime(booking.booking_time)}
              </TableCell>
              <TableCell>{booking.customer_name}</TableCell>
              <TableCell>{booking.pet_name}</TableCell>
              <TableCell>{booking.service_id}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" onClick={() => selectBooking(booking)}>
                  상세
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Detail Modal */}
      <BookingDetailModal />
    </div>
  )
}
```

**Deliverables**:
- ✅ 예약 테이블 (정렬, 필터)
- ✅ 실시간 업데이트
- ✅ 상세 모달

---

#### 5.3 예약 상세 모달 (Day 17)
```typescript
// src/features/booking/components/BookingDetailModal.tsx
export function BookingDetailModal() {
  const { selectedBooking, selectBooking, updateBooking } = useBookingStore()

  if (!selectedBooking) return null

  const handleStatusChange = async (newStatus: string) => {
    await updateBooking(selectedBooking.id, { status: newStatus })
    toast({ title: '예약 상태가 변경되었습니다' })
  }

  return (
    <Modal open={!!selectedBooking} onClose={() => selectBooking(null)}>
      <ModalHeader>
        <h2>예약 상세 정보</h2>
        <Badge variant={getStatusVariant(selectedBooking.status)}>
          {selectedBooking.status}
        </Badge>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          {/* Basic Info */}
          <Section title="예약 정보">
            <InfoRow label="예약번호" value={selectedBooking.booking_number} />
            <InfoRow label="날짜" value={formatDate(selectedBooking.booking_date)} />
            <InfoRow label="시간" value={formatTime(selectedBooking.booking_time)} />
          </Section>

          {/* Customer Info */}
          <Section title="고객 정보">
            <InfoRow label="이름" value={selectedBooking.customer_name} />
            <InfoRow label="전화번호" value={selectedBooking.customer_phone} />
            <InfoRow label="이메일" value={selectedBooking.customer_email} />
          </Section>

          {/* Pet Info */}
          <Section title="반려동물 정보">
            <InfoRow label="이름" value={selectedBooking.pet_name} />
            <InfoRow label="종류" value={selectedBooking.pet_species} />
            <InfoRow label="품종" value={selectedBooking.pet_breed} />
            <InfoRow label="나이" value={`${selectedBooking.pet_age}세`} />
          </Section>

          {/* Symptoms */}
          {selectedBooking.symptoms && (
            <Section title="증상">
              <p className="text-gray-700">{selectedBooking.symptoms}</p>
            </Section>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={() => selectBooking(null)}>
          닫기
        </Button>
        {selectedBooking.status === 'pending' && (
          <>
            <Button variant="success" onClick={() => handleStatusChange('confirmed')}>
              승인
            </Button>
            <Button variant="danger" onClick={() => handleStatusChange('rejected')}>
              거절
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  )
}
```

**Deliverables**:
- ✅ 예약 상세 모달
- ✅ 상태 변경 기능

---

## Phase 3: AI펫닥터 연동 (Week 6-7)

### Week 6: Webhook 및 스마트 진단서

#### 6.1 Supabase Edge Function (Incoming Webhook) (Day 18-19)
```typescript
// supabase/functions/ai-pet-doctor-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface AIPetDoctorWebhookPayload {
  request_id: string
  customer: {
    name: string
    phone: string
    email: string
    ai_pet_doctor_user_id: string
  }
  pet: {
    name: string
    species: string
    breed: string
    age: number
    weight?: number
    ai_pet_doctor_pet_id: string
  }
  service_type: string
  preferred_date: string
  preferred_time: string
  smart_diagnosis: {
    id: string
    created_at: string
    urgency: 'low' | 'medium' | 'high' | 'emergency'
    inquiry: {
      symptoms: string[]
      duration: string
      severity: number
      additional_notes: string
    }
    diagnosis: {
      suspected_conditions: string[]
      confidence: number
      hospital_visit_required: boolean
      recommended_tests: string[]
      ai_recommendations: string
    }
    history: {
      past_visits: any[]
      allergies: string[]
      medications: any[]
      vaccinations: any[]
      special_notes: string
    }
  }
}

serve(async (req) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    })
  }

  try {
    // Verify API Key
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 })
    }

    const payload: AIPetDoctorWebhookPayload = await req.json()

    // 1. Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        source: 'ai_pet_doctor',
        ai_pet_doctor_request_id: payload.request_id,
        ai_pet_doctor_user_id: payload.customer.ai_pet_doctor_user_id,
        ai_pet_doctor_pet_id: payload.pet.ai_pet_doctor_pet_id,
        customer_name: payload.customer.name,
        customer_phone: payload.customer.phone,
        customer_email: payload.customer.email,
        pet_name: payload.pet.name,
        pet_species: payload.pet.species,
        pet_breed: payload.pet.breed,
        pet_age: payload.pet.age,
        booking_date: payload.preferred_date,
        booking_time: payload.preferred_time,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // 2. Create smart diagnosis
    const { error: diagnosisError } = await supabase
      .from('smart_diagnoses')
      .insert({
        diagnosis_id: payload.smart_diagnosis.id,
        booking_id: booking.id,
        urgency: payload.smart_diagnosis.urgency,
        symptoms: payload.smart_diagnosis.inquiry.symptoms,
        duration: payload.smart_diagnosis.inquiry.duration,
        severity: payload.smart_diagnosis.inquiry.severity,
        additional_notes: payload.smart_diagnosis.inquiry.additional_notes,
        suspected_conditions: payload.smart_diagnosis.diagnosis.suspected_conditions,
        confidence: payload.smart_diagnosis.diagnosis.confidence,
        hospital_visit_required: payload.smart_diagnosis.diagnosis.hospital_visit_required,
        recommended_tests: payload.smart_diagnosis.diagnosis.recommended_tests,
        ai_recommendations: payload.smart_diagnosis.diagnosis.ai_recommendations,
        past_visits: payload.smart_diagnosis.history.past_visits,
        allergies: payload.smart_diagnosis.history.allergies,
        current_medications: payload.smart_diagnosis.history.medications,
        vaccinations: payload.smart_diagnosis.history.vaccinations,
        special_notes: payload.smart_diagnosis.history.special_notes,
        diagnosis_created_at: payload.smart_diagnosis.created_at,
      })

    if (diagnosisError) throw diagnosisError

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: booking.id,
        booking_number: booking.booking_number,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    )
  }
})
```

**배포**:
```bash
# Supabase Edge Function 배포
supabase functions deploy ai-pet-doctor-webhook

# Webhook URL 확인
# https://xxxxx.supabase.co/functions/v1/ai-pet-doctor-webhook
```

**Deliverables**:
- ✅ Supabase Edge Function 생성
- ✅ Webhook 수신 및 데이터 저장

---

#### 6.2 스마트 진단서 UI (Day 19-21)
```typescript
// src/features/ai-integration/components/SmartDiagnosisCard.tsx
export function SmartDiagnosisCard({ diagnosisId }: { diagnosisId: string }) {
  const [diagnosis, setDiagnosis] = useState<SmartDiagnosis | null>(null)

  useEffect(() => {
    async function fetchDiagnosis() {
      const { data, error } = await supabase
        .from('smart_diagnoses')
        .select('*')
        .eq('id', diagnosisId)
        .single()

      if (!error) setDiagnosis(data)
    }
    fetchDiagnosis()
  }, [diagnosisId])

  if (!diagnosis) return <Loading />

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">AI펫닥터 스마트 진단서</h3>
        <UrgencyBadge urgency={diagnosis.urgency} />
      </CardHeader>

      <CardBody className="space-y-6">
        {/* 1. 보호자 문의 */}
        <Section title="1️⃣ 보호자 문의 내용">
          <div className="space-y-2">
            <InfoRow label="증상" value={diagnosis.symptoms.join(', ')} />
            <InfoRow label="지속기간" value={diagnosis.duration} />
            <InfoRow label="심각도" value={`${diagnosis.severity}/10`} />
            {diagnosis.additional_notes && (
              <div>
                <p className="text-sm font-medium text-gray-700">추가 메모</p>
                <p className="text-gray-600">{diagnosis.additional_notes}</p>
              </div>
            )}
          </div>
        </Section>

        {/* 2. AI 진단 결과 */}
        <Section title="2️⃣ AI 진단 결과">
          <div className="space-y-2">
            <InfoRow
              label="예상 질환"
              value={diagnosis.suspected_conditions.join(', ')}
            />
            <InfoRow label="신뢰도" value={`${(diagnosis.confidence * 100).toFixed(0)}%`} />
            <InfoRow
              label="병원 진료"
              value={diagnosis.hospital_visit_required ? '필요' : '불필요'}
            />
            <InfoRow
              label="추천 검사"
              value={diagnosis.recommended_tests.join(', ')}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">AI 조언</p>
              <p className="text-gray-600">{diagnosis.ai_recommendations}</p>
            </div>
          </div>
        </Section>

        {/* 3. 펫 히스토리 */}
        <Section title="3️⃣ 펫 과거 히스토리">
          <PetHistoryTimeline
            pastVisits={diagnosis.past_visits}
            allergies={diagnosis.allergies}
            medications={diagnosis.current_medications}
            vaccinations={diagnosis.vaccinations}
            specialNotes={diagnosis.special_notes}
          />
        </Section>
      </CardBody>

      <CardFooter>
        <Button variant="outline" onClick={() => downloadPDF(diagnosis)}>
          📄 PDF 다운로드
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          🖨️ 인쇄
        </Button>
      </CardFooter>
    </Card>
  )
}
```

```typescript
// src/features/ai-integration/components/UrgencyBadge.tsx
export function UrgencyBadge({ urgency }: { urgency: 'low' | 'medium' | 'high' | 'emergency' }) {
  const config = {
    low: { emoji: '🟢', label: '낮음', color: 'bg-green-100 text-green-800' },
    medium: { emoji: '🟡', label: '보통', color: 'bg-yellow-100 text-yellow-800' },
    high: { emoji: '🟠', label: '높음', color: 'bg-orange-100 text-orange-800' },
    emergency: { emoji: '🔴', label: '응급', color: 'bg-red-100 text-red-800' },
  }

  const { emoji, label, color } = config[urgency]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
```

**Deliverables**:
- ✅ 스마트 진단서 카드 UI
- ✅ 긴급도 배지
- ✅ 펫 히스토리 타임라인
- ✅ PDF 다운로드 기능

---

### Week 7: Outgoing Webhook 및 예약 응답

#### 7.1 Webhook 전송 함수 (Day 22)
```typescript
// src/features/ai-integration/api/webhook.api.ts
interface BookingResponse {
  booking_id: string
  booking_number: string
  status: 'confirmed' | 'modified' | 'rejected'
  confirmed_date?: string
  confirmed_time?: string
  suggested_dates?: Array<{ date: string; times: string[] }>
  modification_reason?: string
  rejection_reason?: string
  alternative_clinics?: Array<{ name: string; distance: number; available_date: string }>
  hospital_message?: string
}

export async function sendBookingResponse(
  requestId: string,
  response: BookingResponse
): Promise<void> {
  const webhookUrl = import.meta.env.VITE_AI_PET_DOCTOR_WEBHOOK_URL
  const apiKey = import.meta.env.VITE_AI_PET_DOCTOR_API_KEY

  const payload = {
    request_id: requestId,
    ...response,
    updated_at: new Date().toISOString(),
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`Webhook failed: ${res.statusText}`)
  }

  // Log response
  await supabase.from('booking_responses').insert({
    booking_id: response.booking_id,
    response_type: response.status,
    suggested_dates: response.suggested_dates ?? null,
    modification_reason: response.modification_reason ?? null,
    rejection_reason: response.rejection_reason ?? null,
    alternative_clinics: response.alternative_clinics ?? null,
    hospital_message: response.hospital_message ?? null,
    webhook_sent: true,
    webhook_sent_at: new Date().toISOString(),
    webhook_response: await res.text(),
  })
}
```

**Deliverables**:
- ✅ Webhook 전송 함수
- ✅ 응답 로깅

---

#### 7.2 예약 응답 UI (Day 22-23)
```typescript
// src/features/booking/components/BookingResponseModal.tsx
export function BookingResponseModal() {
  const { selectedBooking, updateBooking } = useBookingStore()
  const [responseType, setResponseType] = useState<'confirmed' | 'modified' | 'rejected'>('confirmed')
  const [message, setMessage] = useState('')

  if (!selectedBooking || selectedBooking.source !== 'ai_pet_doctor') return null

  const handleConfirm = async () => {
    await updateBooking(selectedBooking.id, { status: 'confirmed' })

    await sendBookingResponse(selectedBooking.ai_pet_doctor_request_id!, {
      booking_id: selectedBooking.id,
      booking_number: selectedBooking.booking_number,
      status: 'confirmed',
      confirmed_date: selectedBooking.booking_date,
      confirmed_time: selectedBooking.booking_time,
      hospital_message: message,
    })

    toast({ title: '예약이 승인되었습니다' })
  }

  const handleReject = async () => {
    await updateBooking(selectedBooking.id, { status: 'rejected' })

    await sendBookingResponse(selectedBooking.ai_pet_doctor_request_id!, {
      booking_id: selectedBooking.id,
      booking_number: selectedBooking.booking_number,
      status: 'rejected',
      rejection_reason: message,
    })

    toast({ title: '예약이 거절되었습니다' })
  }

  return (
    <Modal>
      <ModalHeader>예약 응답</ModalHeader>

      <ModalBody>
        <RadioGroup value={responseType} onValueChange={setResponseType}>
          <Radio value="confirmed">승인</Radio>
          <Radio value="modified">시간 수정 제안</Radio>
          <Radio value="rejected">거절</Radio>
        </RadioGroup>

        <Textarea
          label="병원 메시지 (선택)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="고객에게 전달할 메시지를 입력하세요"
        />

        {responseType === 'modified' && <DateTimeModificationForm />}
      </ModalBody>

      <ModalFooter>
        <Button variant="outline">취소</Button>
        {responseType === 'confirmed' && (
          <Button variant="success" onClick={handleConfirm}>
            승인하기
          </Button>
        )}
        {responseType === 'rejected' && (
          <Button variant="danger" onClick={handleReject}>
            거절하기
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}
```

**Deliverables**:
- ✅ 예약 응답 모달
- ✅ 승인/수정/거절 UI
- ✅ Webhook 전송 통합

---

## Phase 4: 마무리 및 최적화 (Week 8)

### Week 8: 다국어, 테스트, 배포

#### 8.1 다국어 지원 (Day 24-25)
```typescript
// public/locales/ko.json
{
  "common": {
    "login": "로그인",
    "logout": "로그아웃",
    "signup": "회원가입",
    "submit": "제출",
    "cancel": "취소",
    "delete": "삭제",
    "edit": "수정",
    "save": "저장"
  },
  "booking": {
    "title": "예약하기",
    "service": "서비스 선택",
    "date": "날짜 선택",
    "time": "시간 선택",
    "customer_name": "보호자 이름",
    "pet_name": "반려동물 이름"
  }
}
```

```typescript
// src/shared/hooks/useTranslation.ts
import { useState, useEffect } from 'react'

type Locale = 'ko' | 'en' | 'pl'

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('ko')
  const [translations, setTranslations] = useState<Record<string, any>>({})

  useEffect(() => {
    fetch(`/locales/${locale}.json`)
      .then((res) => res.json())
      .then(setTranslations)
  }, [locale])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value = translations

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === 'string' ? value : key
  }

  return { t, setLocale, locale }
}
```

**Deliverables**:
- ✅ 한국어/영어/폴란드어 JSON
- ✅ useTranslation 훅
- ✅ 언어 전환 UI

---

#### 8.2 Playwright E2E 테스트 (Day 25-26)
```typescript
// tests/booking-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('예약 플로우', () => {
  test('사용자가 예약을 생성할 수 있다', async ({ page }) => {
    await page.goto('http://localhost:5173/booking')

    // Step 1: Service
    await page.click('text=일반 진료')

    // Step 2: Date & Time
    await page.click('[data-testid="date-picker"]')
    await page.click('text=25')
    await page.click('[data-testid="time-10:00"]')

    // Step 3: Info
    await page.fill('[name="customer_name"]', '김철수')
    await page.fill('[name="customer_phone"]', '010-1234-5678')
    await page.fill('[name="customer_email"]', 'test@example.com')
    await page.fill('[name="pet_name"]', '행복이')
    await page.selectOption('[name="pet_species"]', 'dog')

    // Submit
    await page.click('text=예약하기')

    // Verify
    await expect(page.locator('text=예약이 완료되었습니다')).toBeVisible()
  })

  test('관리자가 예약을 승인할 수 있다', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:5173/login')
    await page.fill('[name="email"]', 'admin@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('text=로그인')

    // Go to bookings
    await page.goto('http://localhost:5173/admin/bookings')

    // Click first pending booking
    await page.click('text=상세', { first: true })

    // Approve
    await page.click('text=승인')

    // Verify
    await expect(page.locator('text=예약이 승인되었습니다')).toBeVisible()
  })
})
```

**테스트 실행**:
```bash
pnpm playwright test
pnpm playwright test --ui  # UI 모드
pnpm playwright test --debug  # 디버그 모드
```

**Deliverables**:
- ✅ 예약 플로우 E2E 테스트
- ✅ 관리자 플로우 E2E 테스트
- ✅ AI연동 플로우 테스트

---

#### 8.3 성능 최적화 (Day 26-27)
```typescript
// vite.config.ts - Code Splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'recharts', '@dnd-kit/core'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
  },
})
```

```typescript
// src/shared/components/LazyImage.tsx
import { useState, useEffect, useRef } from 'react'

export function LazyImage({ src, alt, className }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    })

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      style={{ opacity: isLoaded ? 1 : 0 }}
    />
  )
}
```

**최적화 체크리스트**:
- [ ] Code Splitting (React.lazy)
- [ ] Image Lazy Loading
- [ ] Lighthouse 점수 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] Bundle Size < 500KB (gzipped)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

**Deliverables**:
- ✅ Code splitting 적용
- ✅ Lazy loading 구현
- ✅ Lighthouse 최적화

---

#### 8.4 배포 준비 (Day 27-28)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

```bash
# Vercel 배포
pnpm add -g vercel
vercel login
vercel  # 초기 설정
vercel --prod  # 프로덕션 배포

# Supabase Edge Function 배포
supabase functions deploy ai-pet-doctor-webhook
```

**환경변수 설정 (Vercel)**:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_AI_PET_DOCTOR_WEBHOOK_URL=https://api.aipetdoctor.com/webhooks/booking-status
VITE_AI_PET_DOCTOR_API_KEY=apd_xxx
VITE_APP_URL=https://ai-pet-doctor-hospital.vercel.app
```

**Deliverables**:
- ✅ Vercel 배포 설정
- ✅ GitHub Actions CI/CD
- ✅ 환경변수 설정
- ✅ 프로덕션 배포 완료

---

## 마일스톤 체크리스트

### Phase 1 완료 조건
- [x] Supabase 프로젝트 생성 및 스키마 마이그레이션
- [x] React + Vite 프로젝트 초기화
- [x] TailwindCSS + React Compiler 설정
- [x] 13개 기본 UI 컴포넌트 라이브러리
- [x] 레이아웃 컴포넌트 (Main, Admin, Auth)

### Phase 2 완료 조건
- [ ] Supabase Auth 연동 및 인증 UI
- [ ] Protected Routes 구현
- [ ] 예약 CRUD API 및 Zustand Store
- [ ] 고객용 예약 폼 (3단계)
- [ ] 관리자 대시보드 (통계 + 예약 테이블)
- [ ] 예약 상세 모달 및 상태 변경

### Phase 3 완료 조건
- [ ] Supabase Edge Function (Incoming Webhook)
- [ ] 스마트 진단서 UI (카드, 배지, 타임라인)
- [ ] Outgoing Webhook 전송 함수
- [ ] 예약 응답 UI (승인/수정/거절)
- [ ] AI연동 예약 플로우 완전 동작

### Phase 4 완료 조건
- [ ] 다국어 지원 (한국어/영어/폴란드어)
- [ ] Playwright E2E 테스트 작성
- [ ] 성능 최적화 (Lighthouse 90+)
- [ ] Vercel 배포 및 CI/CD 설정

---

## 리스크 및 대응 방안

### 기술적 리스크
1. **React Compiler 1.0 안정성**
   - **리스크**: 신기술로 버그 가능성
   - **대응**: 프로덕션에서 컴파일러 비활성화 옵션 준비

2. **Supabase Realtime 성능**
   - **리스크**: 동시 접속자 많을 때 지연
   - **대응**: Realtime 대신 Polling으로 전환 가능하도록 설계

3. **Webhook 신뢰성**
   - **리스크**: 네트워크 오류로 Webhook 실패
   - **대응**: 재시도 로직 및 수동 재전송 UI 구현

### 일정 리스크
1. **Phase 3 지연 가능성**
   - **원인**: AI연동 복잡도 높음
   - **대응**: Phase 2까지만 먼저 완료 후 Phase 3를 별도 스프린트로

---

## 성공 지표

### 기술 지표
- ✅ Lighthouse 점수: Performance 95+, Accessibility 100
- ✅ 빌드 시간: < 5초
- ✅ 초기 로드: < 200KB (gzipped)
- ✅ E2E 테스트 커버리지: 80%+

### 비즈니스 지표
- ✅ 예약 완료율: > 85%
- ✅ 평균 예약 시간: < 2분
- ✅ 관리자 평균 처리 시간: < 30초

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-10-20
**작성자**: Claude Code AI Assistant
