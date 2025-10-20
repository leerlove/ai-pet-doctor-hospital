# AI펫닥터 병원 예약 관리 서비스

> React 19 + Vite + Supabase 기반 반려동물 병원 스마트 예약 관리 시스템

[![Status](https://img.shields.io/badge/Status-Phase%20A--C%20Complete-success)]()
[![React](https://img.shields.io/badge/React-19.1.1-blue)]()
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-green)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06b6d4)]()

## 📋 프로젝트 개요

AI 기반 1차 진단과 연계된 스마트 병원 예약 시스템입니다. AI펫닥터 앱에서 진단 받은 반려동물의 정보와 AI 진단 결과를 병원에 전달하여 더 정확하고 빠른 진료를 가능하게 합니다.

### 핵심 기능
- 🤖 **AI 진단 연동**: AI펫닥터 앱의 진단 결과와 함께 예약 정보 전달
- 📋 **스마트 진단서**: 증상, AI 분석, 펫 히스토리를 한눈에 확인
- ⚡ **긴급도 우선순위**: 응급/높음/보통/낮음 긴급도 기반 예약 관리
- 🔔 **실시간 알림**: Webhook 기반 양방향 통신
- 📊 **관리자 대시보드**: 예약 현황, 통계, 일정 관리

## 🚀 빠른 시작

### Prerequisites
- Node.js 18+
- pnpm 8+
- Supabase 계정

### 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 Supabase 정보 입력

# 3. 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:5174 접속
```

### 빌드
```bash
# Production 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# TypeScript 타입 체크
pnpm typecheck
```

## 🎨 디자인 시스템

**Clean Booking (Teal/Green)** 디자인 컨셉을 적용했습니다.

- **메인 컬러**: Teal (#14b8a6)
- **스타일**: 깔끔한 카드 기반 UI, 둥근 모서리, 부드러운 그림자
- **아이콘**: Lucide React
- **상세 가이드**: [DESIGN_GUIDE.md](DESIGN_GUIDE.md) 참고

### 디자인 미리보기
```bash
# 개발 서버 실행 후
# http://localhost:5174/design 접속하여 6가지 디자인 컨셉 비교
```

## 📚 문서

### 프로젝트 문서
- 📘 **[CLAUDE.md](CLAUDE.md)** - 전체 개발 가이드 (필독!)
- 🎨 **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - 디자인 시스템 가이드
- 📝 **README.md** (이 파일) - 프로젝트 개요

### 외부 문서
- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🛠️ 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.1.1 | UI 프레임워크 |
| Vite | 7.1.7 | 빌드 도구 |
| TypeScript | 5.8.3 | 타입 안정성 |
| React Compiler | 1.0.0 | 자동 최적화 |
| React Router | 7.9.3 | 라우팅 |
| Zustand | 5.0.8 | 상태 관리 |
| TailwindCSS | 4.x | 스타일링 |
| CVA | 0.7.1 | 컴포넌트 variants |
| React Hook Form | 7.54.2 | 폼 관리 |
| Zod | 3.24.1 | 스키마 검증 |
| Lucide React | 0.544.0 | 아이콘 |

### Backend (Supabase)
| 기술 | 용도 |
|------|------|
| PostgreSQL 15 | 데이터베이스 |
| Supabase Auth | 인증 (JWT) |
| Supabase Realtime | WebSocket 실시간 업데이트 |
| Supabase Storage | 파일 저장소 |
| Edge Functions | Webhook 처리 (Deno) |

## 📁 프로젝트 구조

```
ai-pet-doctor-hospital/
├── src/
│   ├── features/              # 기능별 모듈
│   │   ├── auth/              # 인증
│   │   ├── booking/           # 예약 관리
│   │   └── ai-integration/    # AI 연동
│   ├── shared/                # 공유 리소스
│   │   ├── api/               # API 함수
│   │   ├── components/        # UI 컴포넌트 (7개)
│   │   ├── hooks/             # 커스텀 훅
│   │   └── types/             # TypeScript 타입
│   ├── pages/                 # 페이지 컴포넌트
│   ├── layouts/               # 레이아웃
│   └── App.tsx                # 루트 + Router
├── supabase/
│   ├── migrations/            # DB 마이그레이션
│   └── functions/             # Edge Functions
├── CLAUDE.md                  # 개발 가이드 ⭐
├── DESIGN_GUIDE.md            # 디자인 가이드 ⭐
└── README.md                  # 이 파일
```

## ✅ 개발 진행 상황

### Phase A: Supabase Setup ✅
- [x] Supabase 프로젝트 생성 및 연결
- [x] 데이터베이스 스키마 (10개 테이블)
- [x] RLS 정책 설정
- [x] TypeScript 타입 자동 생성

### Phase B: Core Infrastructure ✅
- [x] 인증 시스템 (Supabase Auth)
- [x] React Router 설정
- [x] Zustand 상태 관리
- [x] API 함수 (bookings, clinics, services)

### Phase C: UI Components ✅
- [x] 7개 핵심 컴포넌트 (Button, Input, Card, Modal, Table, Badge, Toast)
- [x] TailwindCSS 4.x 설정
- [x] Lucide React 아이콘 통합

### Phase D: Design System ✅
- [x] 6개 디자인 컨셉 생성
- [x] Clean Booking 디자인 선택 및 적용
- [x] Home 페이지 재작성
- [x] DESIGN_GUIDE.md 작성

### Phase E: Feature Implementation 🚧
- [ ] 예약 관리 페이지
- [ ] 관리자 대시보드
- [ ] 내 예약 페이지
- [ ] 클리닉 설정 페이지

### Phase F: AI Integration 📋
- [ ] AI펫닥터 Webhook 수신
- [ ] 스마트 진단서 컴포넌트
- [ ] 긴급도 필터링
- [ ] Webhook 전송 (예약 응답)

## 🗃️ 데이터베이스 스키마

### 주요 테이블
- `users` - 사용자 (고객, 관리자)
- `bookings` - 예약 정보
- `smart_diagnoses` - AI 진단서 ⭐
- `booking_responses` - 예약 응답 (승인/수정/거절) ⭐
- `clinics` - 병원 정보
- `services` - 진료 서비스
- `pets` - 반려동물 정보
- `business_hours` - 영업 시간
- `closed_dates` - 휴무일
- `notifications` - 알림

자세한 스키마는 [supabase/migrations/](supabase/migrations/) 참고

## 🔐 환경 변수

`.env.local` 파일에 다음 변수를 설정하세요:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI펫닥터 연동 (Phase F에서 사용)
VITE_AI_PET_DOCTOR_WEBHOOK_URL=https://api.aipetdoctor.com/webhooks/booking-status
VITE_AI_PET_DOCTOR_API_KEY=your-api-key
```

## 📦 주요 명령어

### 개발
```bash
pnpm dev              # 개발 서버 (HMR)
pnpm build            # Production 빌드
pnpm preview          # 빌드 미리보기
pnpm typecheck        # TypeScript 체크
pnpm lint             # ESLint
pnpm lint:fix         # ESLint 자동 수정
```

### Supabase
```bash
pnpm supabase:types   # 타입 생성
pnpm supabase:start   # 로컬 Supabase (Docker 필요)
pnpm supabase:stop    # 로컬 Supabase 중지
pnpm supabase:reset   # DB 리셋
pnpm supabase:studio  # Supabase Studio 열기
```

### 포매팅
```bash
pnpm prettier:format  # 코드 포매팅
pnpm prettier:check   # 포매팅 체크
```

## 🎯 주요 컴포넌트

### UI 컴포넌트 (src/shared/components/)
1. **Button** - 6 variants (primary, secondary, outline, ghost, danger, success)
2. **Input** - Label, error, icon 지원
3. **Card** - 서브 컴포넌트 (Header, Body, Footer)
4. **Modal** - Portal 기반
5. **Table** - 정렬 가능, 반응형
6. **Badge** - 상태, 긴급도 표시
7. **Toast** - 글로벌 알림 (Zustand)

사용 예제는 [DESIGN_GUIDE.md](DESIGN_GUIDE.md) 참고

## 🔄 데이터 플로우

```
[AI펫닥터 앱]
      ↓ AI 진단 + 예약 요청 (Webhook)
[병원 관리 시스템] (이 프로젝트)
      ↓ 예약 승인/수정/거절 (Webhook)
[AI펫닥터 앱]
      ↓ 예약 확정 알림
[고객]
```

## 🤝 기여하기

1. 새로운 기능 추가 시 [CLAUDE.md](CLAUDE.md)의 "Development Workflow" 참고
2. 디자인 작업 시 [DESIGN_GUIDE.md](DESIGN_GUIDE.md)의 스타일 가이드 준수
3. 컴포넌트는 Clean Booking 디자인 컨셉 적용
4. TypeScript 타입 안정성 유지

## 📄 라이선스

MIT License

## 👥 팀

AI펫닥터 개발팀

---

**버전**: 2.2.0
**최종 업데이트**: 2025-10-21
**현재 단계**: Phase A-C Complete, Phase D In Progress
