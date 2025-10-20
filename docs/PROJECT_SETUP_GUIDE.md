# AI펫닥터 병원 예약 관리 서비스 - 프로젝트 세팅 가이드

> 이 가이드는 기존 Next.js 프로젝트를 완전히 삭제하고 React 19 + Vite + Supabase로 새로 시작하는 과정을 안내합니다.

---

## 📋 준비물

### 필수 계정
- [x] **Supabase 계정** - https://supabase.com
- [x] **GitHub 계정** - https://github.com
- [ ] **Vercel 계정** (배포용) - https://vercel.com

### 설치 필요
- [x] **Node.js 20+** - https://nodejs.org
- [x] **pnpm** - `npm install -g pnpm`
- [x] **Git** - https://git-scm.com

---

## 🚀 Step 1: 기존 프로젝트 정리

### 1.1 기존 디렉토리 완전 삭제
```bash
# 현재 위치 확인
cd c:\Users\bamboo

# 기존 프로젝트 삭제 (주의: 복구 불가)
rm -rf "ARKA-Veterinary-Clinic-Page-and-Appointment-Booking-System"

# 백업 확인
ls ai-pet-doctor-docs-backup
# 출력: ARKA_PRD_REACT_SUPABASE.md  CLAUDE.md  DEVELOPMENT_PLAN.md
```

**⚠️ 주의**: 이 단계 이후 기존 코드는 완전히 삭제됩니다!

---

## 🏗️ Step 2: 새 React 프로젝트 생성

### 2.1 Vite로 React 프로젝트 초기화
```bash
cd c:\Users\bamboo

# Vite + React 19 + TypeScript 프로젝트 생성
pnpm create vite ai-pet-doctor-hospital --template react-ts

# 프로젝트 디렉토리로 이동
cd ai-pet-doctor-hospital

# 의존성 설치
pnpm install
```

### 2.2 핵심 패키지 설치
```bash
# Supabase
pnpm add @supabase/supabase-js@2.58.0

# Router & State
pnpm add react-router-dom@7.9.3
pnpm add zustand@5.0.8

# Forms & Validation
pnpm add react-hook-form@7.54.2 @hookform/resolvers@2.9.14
pnpm add zod@3.24.1

# Styling
pnpm add class-variance-authority@0.7.1 clsx tailwind-merge
pnpm add lucide-react@0.544.0

# Utilities
pnpm add dayjs
pnpm add recharts@3.2.1
pnpm add @dnd-kit/core@6.3.1

# Dev Dependencies
pnpm add -D tailwindcss@3.4.17 postcss autoprefixer
pnpm add -D @vitejs/plugin-react
pnpm add -D babel-plugin-react-compiler@1.0.0
pnpm add -D @playwright/test@1.55.1
pnpm add -D @types/node
```

### 2.3 TailwindCSS 초기화
```bash
pnpm dlx tailwindcss init -p
```

---

## 📁 Step 3: 프로젝트 구조 생성

### 3.1 기본 디렉토리 생성
```bash
# src 하위 디렉토리 생성
mkdir -p src/features/{ai-integration,auth,booking,clinic,dashboard}/{components,hooks,api,stores,types}
mkdir -p src/shared/{api,components,hooks,utils,types}
mkdir -p src/{pages,layouts}
mkdir -p public/{images,locales}
mkdir -p supabase/{migrations,functions}
mkdir -p docs
```

### 3.2 백업한 문서 복사
```bash
# 백업 위치에서 새 프로젝트로 복사
cp ~/ai-pet-doctor-docs-backup/ARKA_PRD_REACT_SUPABASE.md ./docs/PRD.md
cp ~/ai-pet-doctor-docs-backup/CLAUDE.md ./CLAUDE.md
cp ~/ai-pet-doctor-docs-backup/DEVELOPMENT_PLAN.md ./docs/DEVELOPMENT_PLAN.md
```

---

## 🗄️ Step 4: Supabase 프로젝트 생성

### 4.1 Supabase 대시보드에서 새 프로젝트 생성
1. https://supabase.com/dashboard 접속
2. **"New Project"** 클릭
3. 프로젝트 설정:
   - **Name**: `ai-pet-doctor-hospital`
   - **Database Password**: 안전한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: Free 선택

4. 프로젝트 생성 대기 (약 2분)

### 4.2 환경변수 복사
프로젝트 생성 완료 후:
1. **Settings** → **API** 메뉴
2. 다음 값 복사:
   - `Project URL`
   - `anon public` API Key

### 4.3 .env.local 파일 생성
```bash
# 프로젝트 루트에 .env.local 생성
cat > .env.local << 'EOF'
# App
VITE_APP_URL=http://localhost:5173

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...

# AI펫닥터 연동 (나중에 추가)
VITE_AI_PET_DOCTOR_WEBHOOK_URL=
VITE_AI_PET_DOCTOR_API_KEY=

# Optional
VITE_GOOGLE_MAPS_API_KEY=
EOF
```

**⚠️ 중요**: 실제 값으로 교체하세요!

---

## 🗃️ Step 5: 데이터베이스 스키마 생성

### 5.1 Supabase SQL Editor 열기
1. Supabase Dashboard → **SQL Editor**
2. **"New query"** 클릭

### 5.2 스키마 SQL 실행
`docs/PRD.md`에서 **"7. 데이터베이스 설계"** 섹션의 SQL 복사하여 실행:

```sql
-- 순서대로 실행:
1. users 테이블
2. clinics 테이블
3. services 테이블
4. business_hours 테이블
5. closed_dates 테이블
6. pets 테이블
7. bookings 테이블 ⭐ (AI 연동 필드 포함)
8. smart_diagnoses 테이블 ⭐ NEW
9. booking_responses 테이블 ⭐ NEW
10. notifications 테이블

11. 인덱스 생성
12. 트리거 생성
```

### 5.3 테스트 데이터 삽입
```sql
-- 테스트 클리닉 생성
INSERT INTO clinics (name, description, address, phone_1, email) VALUES
('AI펫닥터 테스트 병원', '테스트용 수의과 병원', '서울시 강남구', '02-1234-5678', 'test@aipetdoctor.com');

-- 테스트 서비스 생성
INSERT INTO services (clinic_id, name, duration_minutes, price, is_active)
SELECT id, '일반 진료', 30, 50000, true FROM clinics LIMIT 1;
```

### 5.4 TypeScript 타입 생성
```bash
# Supabase CLI 설치
pnpm add -D supabase

# Supabase 로그인
pnpm supabase login

# 프로젝트 연결
pnpm supabase link --project-ref [YOUR_PROJECT_REF]

# 타입 생성
pnpm supabase gen types typescript --linked > src/shared/types/database.types.ts
```

---

## ⚙️ Step 6: 기본 설정 파일 생성

### 6.1 vite.config.ts
```typescript
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

### 6.2 tsconfig.json 수정
```json
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

### 6.3 tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
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

### 6.4 package.json scripts 추가
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "supabase:types": "supabase gen types typescript --linked > src/shared/types/database.types.ts",
    "test": "playwright test"
  }
}
```

---

## 🎨 Step 7: 기본 파일 생성

### 7.1 Supabase 클라이언트
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
})

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
```

### 7.2 유틸리티 함수
```typescript
// src/shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 7.3 기본 App 구조
```typescript
// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>AI펫닥터 병원 관리 시스템</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## 🐙 Step 8: Git 저장소 초기화

### 8.1 .gitignore 생성
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
/coverage
playwright-report/
test-results/

# Production
dist
dist-ssr
*.local

# Environment
.env
.env.local
.env.*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Supabase
.supabase
EOF
```

### 8.2 Git 초기화
```bash
git init
git add .
git commit -m "Initial commit: React 19 + Supabase + AI펫닥터 연동 시스템"
```

### 8.3 GitHub 저장소 생성 및 연결
```bash
# GitHub에서 새 저장소 생성 후:
git remote add origin https://github.com/[your-username]/ai-pet-doctor-hospital.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 9: 개발 서버 시작

### 9.1 로컬 서버 실행
```bash
pnpm dev
```

브라우저에서 http://localhost:5173 접속

### 9.2 Supabase 연결 테스트
```typescript
// src/App.tsx에 추가
import { useEffect } from 'react'
import { supabase } from '@/shared/api/supabase'

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('clinics').select('*').limit(1)

      if (error) {
        console.error('Supabase 연결 오류:', error)
      } else {
        console.log('✅ Supabase 연결 성공!', data)
      }
    }

    testConnection()
  }, [])

  return <div>AI펫닥터 병원 관리 시스템</div>
}
```

---

## 🎯 다음 단계

### Phase 1: 기본 인프라 구축 (Week 1-2)
`docs/DEVELOPMENT_PLAN.md`의 Phase 1 참조:
- [ ] 13개 기본 UI 컴포넌트 라이브러리 구축
- [ ] 레이아웃 컴포넌트 (Main, Admin, Auth)
- [ ] Supabase Auth 설정

### 개발 시작
```bash
# DEVELOPMENT_PLAN.md 참조
cat docs/DEVELOPMENT_PLAN.md

# 또는 CLAUDE.md 참조
cat CLAUDE.md
```

---

## 📚 참고 자료

### 문서
- **PRD**: `docs/PRD.md`
- **개발 가이드**: `CLAUDE.md`
- **개발 플랜**: `docs/DEVELOPMENT_PLAN.md`

### 링크
- [Supabase 문서](https://supabase.com/docs)
- [React 19 문서](https://react.dev/)
- [Vite 문서](https://vitejs.dev/)
- [TailwindCSS 문서](https://tailwindcss.com/)

---

## ⚠️ 트러블슈팅

### pnpm이 없는 경우
```bash
npm install -g pnpm
```

### Supabase CLI 오류
```bash
# Supabase CLI 재설치
pnpm remove -D supabase
pnpm add -D supabase
pnpm supabase login
```

### TypeScript 타입 오류
```bash
# 타입 재생성
pnpm supabase:types
```

### 빌드 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
pnpm install
```

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-10-20
**예상 소요 시간**: 30-60분

🎉 **이제 개발을 시작할 준비가 완료되었습니다!**
