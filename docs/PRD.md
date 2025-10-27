# AI펫닥터 수의과 예약 시스템 PRD
**Product Requirements Document - React + Supabase 완전 재개발**

---

## 📋 문서 정보
- **버전**: 2.3
- **최종 업데이트**: 2025-10-27 (수의사 선택 기능 및 버그 수정)
- **작성일**: 2025-10-20
- **프로젝트명**: AI펫닥터 수의과 클리닉 예약 및 관리 시스템
- **개발 방식**: 완전 재개발 (React 19 + Supabase)
- **목표**: 현대적이고 성능 최적화된 수의과 예약 관리 시스템 구축
- **현재 상태**: ✅ Phase 1-4 완료, 프로덕션 배포 완료
- **프로덕션 URL**: https://ai-pet-doctor-hospital.vercel.app
- **GitHub**: https://github.com/leerlove/ai-pet-doctor-hospital

---

## 목차
1. [제품 개요](#1-제품-개요)
2. [AI펫닥터 서비스 연동](#2-ai펫닥터-서비스-연동)
3. [비즈니스 목표](#3-비즈니스-목표)
4. [타겟 사용자](#4-타겟-사용자)
5. [핵심 기능](#5-핵심-기능)
6. [상세 기능 명세](#6-상세-기능-명세)
7. [기술 아키텍처](#7-기술-아키텍처)
8. [데이터베이스 설계](#8-데이터베이스-설계)
9. [UI/UX 디자인 시스템](#9-uiux-디자인-시스템)
10. [개발 로드맵](#10-개발-로드맵)
11. [성공 지표](#11-성공-지표)
12. [리스크 및 대응방안](#12-리스크-및-대응방안)

---

## 1. 제품 개요

### 1.1 제품 정의
**AI펫닥터 병원 예약 관리 서비스**는 수의과 클리닉을 위한 현대적인 예약 관리 시스템으로, 반려동물 보호자와 수의사를 연결하는 디지털 플랫폼입니다. AI 기반 1차 진단과 연계된 스마트 예약 시스템으로, 직관적인 웹 인터페이스를 통해 24시간 예약이 가능하며, 클리닉 관리자는 스마트 진단서와 함께 효율적으로 예약을 관리하고 운영 현황을 실시간으로 파악할 수 있습니다.

### 1.2 제품 비전
"모든 반려동물이 필요한 순간에 최적의 의료 서비스를 받을 수 있도록"

### 1.3 핵심 가치 제안

#### 보호자 (고객) 측면
- **24시간 예약**: 진료 시간 외에도 예약 가능
- **간편한 예약**: 3단계로 완료되는 직관적인 예약 프로세스
- **실시간 확인**: 예약 상태를 실시간으로 확인
- **다국어 지원**: 한국어, 영어, 폴란드어 지원

#### 클리닉 (관리자) 측면
- **효율적 관리**: 모든 예약을 한눈에 파악
- **자동화된 워크플로우**: 예약 승인/거부 자동 알림
- **데이터 기반 운영**: 실시간 통계 및 분석
- **유연한 운영**: 휴무일/영업시간 자유롭게 설정

### 1.4 기존 시스템 대비 개선사항

| 구분 | 기존 시스템 (Next.js) | 신규 시스템 (React) |
|------|---------------------|-------------------|
| **프레임워크** | Next.js 14 (SSR) | Vite + React 19 (CSR) |
| **상태 관리** | React Hook Form만 사용 | Zustand 중앙 집중 관리 |
| **데이터 접근** | Drizzle + Supabase 혼재 | Supabase 단일화 |
| **컴파일러** | 없음 | React Compiler 1.0 |
| **UI 라이브러리** | Radix UI (React 18) | 네이티브 + CVA |
| **번들러** | Next.js Webpack | Vite (esbuild) |
| **빌드 시간** | ~45초 | ~3초 |
| **HMR** | 느림 | 즉시 |
| **타입 안전성** | 부분적 | 완전한 타입 안전성 |
| **성능** | 보통 | 30-50% 향상 |

---

## 2. AI펫닥터 서비스 연동

### 2.1 AI펫닥터 서비스 개요

**AI펫닥터**는 반려동물 헬스케어 통합 플랫폼으로, AI 기반 1차 진단과 병원 예약을 연계하는 서비스입니다. AI펫닥터 병원 예약 관리 서비스는 AI펫닥터 앱에서 요청된 예약을 병원에서 효율적으로 관리할 수 있도록 하는 관리자 솔루션입니다.

#### 서비스 생태계
```
[AI펫닥터 앱]           →  AI 수의사 상담
      ↓                    1차 진단 (AI 스크리닝)
[스마트 진단서 생성]     →  증상, 진단 결과, 히스토리 요약
      ↓                    병원 진료 필요시 가까운 병원 추천
[병원 예약 요청]         →  예약 정보 + 진단서 전송
      ↓
[AI펫닥터 병원 관리 시스템]  →  예약 확인 및 승인/수정/거절
      ↓                          고객 및 펫 정보 조회
[예약 확정]                    →  AI펫닥터 앱으로 알림
```

#### 서비스 확장 로드맵
- **Phase 1** (현재): 병원 예약 연동
- **Phase 2**: 펫 미용 예약 연동
- **Phase 3**: 펫 유치원 예약 연동
- **Phase 4**: 통합 헬스케어 플랫폼

### 2.2 스마트 진단서 구조

스마트 진단서는 AI펫닥터 앱에서 생성되어 병원 예약 시 함께 전달됩니다.

#### 진단서 구성 요소
```
┌─────────────────────────────────────────┐
│      AI펫닥터 스마트 진단서              │
├─────────────────────────────────────────┤
│ 1. 보호자 문의 내용                      │
│    - 주요 증상 및 상태                   │
│    - 발생 시기 및 지속 기간              │
│    - 보호자의 우려사항                   │
│                                          │
│ 2. AI 1차 진단 결과                      │
│    - 예상 질병/상태                      │
│    - 긴급도 평가 (낮음/보통/높음/응급)   │
│    - 병원 진료 필요 여부                 │
│    - 추천 검사 항목                      │
│                                          │
│ 3. 펫 과거 히스토리                      │
│    - 과거 진료 이력 요약                 │
│    - 알레르기 및 주의사항                │
│    - 복용 중인 약물                      │
│    - 예방접종 이력                       │
│                                          │
│ 4. 추천 사항                             │
│    - 보호자 대응 가이드                  │
│    - 병원 방문 전 준비사항               │
└─────────────────────────────────────────┘
```

### 2.3 AI펫닥터 연동 예약 플로우

#### 고객 관점 (AI펫닥터 앱)
```
Step 1: AI 수의사 상담
└─→ 사용자: "우리 강아지가 계속 토하고 기력이 없어요"
    AI: 증상 질의응답 (5-10개 질문)

Step 2: AI 1차 진단
└─→ AI 분석: "위장 질환 의심, 병원 진료 권장"
    긴급도: 보통
    추천 병원 목록 표시 (거리순)

Step 3: 스마트 진단서 생성
└─→ 자동 생성: 문의 내용 + 진단 + 히스토리 통합
    PDF/JSON 형식으로 저장

Step 4: 병원 예약
└─→ AI펫닥터 파트너 병원 선택
    예약 날짜/시간 선택
    스마트 진단서 첨부하여 전송

Step 5: 예약 확인 대기
└─→ 병원 응답 대기 (푸시 알림)
    승인: 예약 확정 알림
    수정 요청: 다른 시간 제안
    거절: 사유 및 대안 제시
```

#### 병원 관점 (AI펫닥터 병원 관리 시스템)
```
Step 1: 예약 요청 알림
└─→ 실시간 알림: "AI펫닥터에서 예약 요청이 도착했습니다"
    긴급도 표시: 🔴 응급 / 🟠 높음 / 🟡 보통 / 🟢 낮음

Step 2: 예약 상세 확인
└─→ [기본 정보 탭]
    ├─ 예약 날짜/시간
    ├─ 서비스 종류
    └─ 보호자 연락처

    [펫 프로필 탭]
    ├─ 기본 정보 (이름, 종, 품종, 나이)
    ├─ 과거 진료 이력
    ├─ 알레르기/주의사항
    └─ 예방접종 기록

    [스마트 진단서 탭] ★ 핵심
    ├─ 보호자 문의 내용
    ├─ AI 진단 결과
    ├─ 긴급도 평가
    └─ 추천 검사 항목

Step 3: 예약 처리
└─→ [승인] → 즉시 확정, 고객에게 알림
    [시간 수정 제안] → 메시지와 함께 대안 제시
    [거절] → 사유 입력 후 거절
```

### 2.4 연동 데이터 모델

#### AI펫닥터 앱 → AI펫닥터 병원 관리 시스템 전송 데이터
```typescript
interface AIPetDoctorBookingRequest {
  // 예약 기본 정보
  service_type: string            // '일반진료', '응급', etc.
  preferred_date: string          // '2025-10-25'
  preferred_time: string          // '10:00'

  // 고객 정보
  customer: {
    name: string
    phone: string
    email: string
    ai_pet_doctor_user_id: string  // AI펫닥터 사용자 ID
  }

  // 펫 정보
  pet: {
    name: string
    species: string
    breed: string
    age: number
    weight?: number
    ai_pet_doctor_pet_id: string   // AI펫닥터 펫 ID
  }

  // 스마트 진단서
  smart_diagnosis: {
    id: string                      // 진단서 고유 ID
    created_at: string              // 진단 시각
    urgency: 'low' | 'medium' | 'high' | 'emergency'

    // 1. 보호자 문의
    inquiry: {
      symptoms: string[]            // ['구토', '기력저하', '식욕부진']
      duration: string              // '2일'
      severity: number              // 1-10
      additional_notes: string      // 추가 메모
    }

    // 2. AI 진단
    diagnosis: {
      suspected_conditions: string[]  // ['급성 위장염', '이물 섭취']
      confidence: number              // 0.85
      hospital_visit_required: boolean
      recommended_tests: string[]     // ['혈액검사', '복부 X-ray']
      ai_recommendations: string      // AI 조언
    }

    // 3. 펫 히스토리
    history: {
      past_visits: PastVisit[]      // 과거 진료 이력
      allergies: string[]            // ['페니실린', '닭고기']
      medications: Medication[]      // 현재 복용 약물
      vaccinations: Vaccination[]    // 예방접종 기록
      special_notes: string          // 특이사항
    }
  }

  // 메타데이터
  source: 'ai_pet_doctor'
  request_id: string                // 요청 추적 ID
  created_at: string
}
```

### 2.5 관리자 화면 개선사항

#### 기존 예약 상세 모달 확장
```
┌─────────────────────────────────────────────────┐
│ 예약 상세 정보 (#A2025-0012) 🔄 AI펫닥터 연동   │
├─────────────────────────────────────────────────┤
│ [탭] 기본정보 | 펫 프로필 | 스마트진단서 ★      │
├─────────────────────────────────────────────────┤
│                                                  │
│ ┌─ 스마트 진단서 ────────────────────────────┐ │
│ │                                              │ │
│ │ 📋 진단서 ID: DX-2025-1234                  │ │
│ │ 📅 작성일시: 2025-10-20 14:30               │ │
│ │ 🚨 긴급도: 🟠 높음 (병원 진료 필요)         │ │
│ │                                              │ │
│ │ [1️⃣ 보호자 문의 내용]                       │ │
│ │ 증상: 구토, 기력저하, 식욕부진               │ │
│ │ 지속기간: 2일                                │ │
│ │ 심각도: 7/10                                 │ │
│ │ "어제 저녁부터 토하기 시작했고, 오늘은       │ │
│ │  밥도 안 먹고 계속 누워만 있어요..."         │ │
│ │                                              │ │
│ │ [2️⃣ AI 진단 결과]                           │ │
│ │ 예상 질환: 급성 위장염 (85% 신뢰도)         │ │
│ │ 추천 검사: 혈액검사, 복부 X-ray              │ │
│ │ AI 조언: "24시간 이내 병원 방문 권장.        │ │
│ │          이물 섭취 가능성도 배제 불가"       │ │
│ │                                              │ │
│ │ [3️⃣ 펫 과거 히스토리]                       │ │
│ │ ├─ 과거 진료 (최근 3건)                     │ │
│ │ │   • 2025-08-15: 예방접종 (DHPPL)          │ │
│ │ │   • 2025-06-10: 피부 질환 치료            │ │
│ │ │   • 2025-03-05: 건강검진 (정상)           │ │
│ │ ├─ 알레르기: 페니실린, 닭고기               │ │
│ │ ├─ 현재 복용약: 없음                        │ │
│ │ └─ 특이사항: 차멀미 심함                    │ │
│ │                                              │ │
│ │ [📄 PDF 다운로드] [🖨️ 인쇄]                │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ 💬 병원 메시지 (선택사항)                       │
│ ┌──────────────────────────────────────────────┐ │
│ │ "진단서 확인했습니다. 응급 케이스로          │ │
│ │  우선 배정하겠습니다."                       │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│     [✅ 승인하기]  [✏️ 시간 수정 제안]  [❌ 거절]  │
└─────────────────────────────────────────────────┘
```

### 2.6 API 연동 명세

#### Webhook 엔드포인트 (AI펫닥터 병원 관리 시스템 → AI펫닥터 앱)
```typescript
// AI펫닥터 병원 관리 시스템에서 AI펫닥터 앱으로 예약 상태 변경 알림
POST https://api.aipetdoctor.com/webhooks/booking-status

Body:
{
  request_id: string              // 원본 요청 ID
  booking_id: string              // ARKA 예약 ID
  booking_number: string          // A2025-0012
  status: 'confirmed' | 'modified' | 'rejected'

  // 승인시
  confirmed_date: string
  confirmed_time: string

  // 수정 제안시
  suggested_dates: Array<{
    date: string
    available_times: string[]
  }>
  modification_reason: string

  // 거절시
  rejection_reason: string
  alternative_clinics?: Array<{
    name: string
    distance: number
    available_date: string
  }>

  hospital_message?: string       // 병원의 추가 메시지
  updated_at: string
}
```

#### REST API (AI펫닥터 병원 관리 시스템 → AI펫닥터 앱 데이터 조회)
```typescript
// 펫 과거 히스토리 상세 조회
GET /api/ai-pet-doctor/pets/{pet_id}/history
Authorization: Bearer {token}

Response:
{
  pet_id: string
  history: {
    visits: Visit[]
    medications: Medication[]
    vaccinations: Vaccination[]
    allergies: string[]
    chronic_conditions: string[]
  }
}

// 스마트 진단서 전체 내용 조회
GET /api/ai-pet-doctor/diagnoses/{diagnosis_id}
Authorization: Bearer {token}

Response: SmartDiagnosisReport
```

---

## 3. 비즈니스 목표

### 2.1 단기 목표 (1-2개월)
- [x] React + Supabase 기반 MVP 개발 완료
- [x] Phase A: Supabase 설정 및 데이터베이스 스키마 완료
- [x] Phase B: 핵심 인프라 구축 (인증, 라우팅, 스토어) 완료
- [x] Phase C: UI 컴포넌트 라이브러리 구축 완료
- [x] Phase D: 기능 구현 (대시보드, 예약 관리, 내 예약) 완료
- [ ] Phase E: AI펫닥터 연동 기능 구현
- [ ] Phase F: 클리닉 설정 및 고급 기능
- [ ] 성능 최적화 완료 (Lighthouse 90점 이상)
- [ ] 1개 클리닉 파일럿 테스트 완료

### 2.2 중기 목표 (3-6개월)
- [ ] 5개 클리닉 확장
- [ ] 모바일 앱 (React Native) 개발
- [ ] 결제 시스템 통합
- [ ] 리뷰/평가 시스템 구축

### 2.3 장기 목표 (6-12개월)
- [ ] 50개 클리닉 확장
- [ ] SaaS 모델로 전환
- [ ] AI 기반 예약 추천 시스템
- [ ] 원격 진료 기능 추가

### 2.4 비즈니스 모델

#### Phase 1: 단일 클리닉 (현재)
- **비용 구조**: 개발 및 운영 비용
- **수익 모델**: 없음 (클라이언트 프로젝트)

#### Phase 2: 멀티 클리닉 SaaS
- **무료 플랜**: 월 50건 예약까지
- **스타터** (월 49,000원): 월 200건 예약
- **프로** (월 99,000원): 월 500건 예약, 고급 통계
- **엔터프라이즈** (맞춤 견적): 무제한 예약, 전담 지원

---

## 3. 타겟 사용자

### 3.1 Primary Persona: 김보호자 (35세, 반려동물 보호자)
- **배경**: 골든 리트리버 "행복이" 양육 중, 맞벌이 부부
- **니즈**:
  - 퇴근 후에도 예약 가능
  - 빠르고 간편한 예약 프로세스
  - 예약 상태 실시간 확인
- **Pain Points**:
  - 전화 예약 시 대기 시간 길음
  - 진료 시간에만 예약 가능
  - 예약 확인을 위해 다시 전화해야 함
- **사용 시나리오**:
  1. 퇴근 후 자정에 예약
  2. 다음날 오전 10시 예약 승인 알림 수신
  3. 진료 1시간 전 리마인더 알림 수신

### 3.2 Secondary Persona: 박수의사 (42세, 수의과 원장)
- **배경**: AI펫닥터 파트너 수의과 클리닉 운영 12년차
- **니즈**:
  - 예약 현황을 한눈에 파악
  - 효율적인 스케줄 관리
  - 고객 데이터 분석
- **Pain Points**:
  - 전화 예약 관리의 어려움
  - 노쇼(no-show) 문제
  - 수기 기록의 번거로움
- **사용 시나리오**:
  1. 아침 출근 후 대시보드에서 오늘 예약 확인
  2. 예약 승인/거부 원터치 처리
  3. 주간 통계로 성수기/비수기 파악

### 3.3 Tertiary Persona: 이직원 (28세, 수의 보조)
- **배경**: 클리닉 접수 및 고객 응대 담당
- **니즈**:
  - 간편한 예약 입력
  - 고객 정보 빠른 조회
  - 예약 변경/취소 처리
- **사용 시나리오**:
  1. 전화로 들어온 예약 직접 입력
  2. 워크인(walk-in) 고객 현장 등록
  3. 예약 변경 요청 처리

---

## 4. 핵심 기능

### 4.1 고객용 기능 (Public)

#### 4.1.1 랜딩 페이지
- ✅ 클리닉 소개 (이미지, 설명, 특징)
- ✅ 실시간 영업 상태 표시
- ✅ 위치 정보 (Google Maps 통합)
- ✅ 연락처 정보 (전화, 이메일)
- ✅ 다국어 전환 (한국어/English/Polski)
- ✅ 예약하기 버튼 (CTA)

#### 4.1.2 예약 시스템
- 🔄 3단계 예약 프로세스 (UI 구현 예정)
  1. 서비스 선택 (진료, 예방접종, 수술 등)
  2. 날짜 및 시간 선택
  3. 반려동물 정보 입력
- 🔄 실시간 예약 가능 시간 표시
- 🔄 휴무일 자동 차단
- 🔄 예약 즉시 확인
- 🔄 예약 완료 이메일 발송

#### 4.1.3 내 예약 관리
- ✅ 예약 내역 조회 (탭 필터: 전체/예정/과거)
- ✅ 예약 상태 확인 (대기/승인/거부/완료/취소)
- ✅ 예약 상세 정보 표시 (카드 뷰)
- 🔄 예약 취소 기능
- 🔄 예약 변경 (날짜/시간 변경)
- 🔄 리마인더 설정

### 4.2 관리자 기능 (Admin)

#### 4.2.1 대시보드
- ✅ 오늘의 예약 현황 (Stats Cards)
- ✅ 상태별 예약 카운트 (Total, Pending, Today, Completed)
- ✅ 긴급 예약 알림 배너 (Pending > 0일 때 표시)
- ✅ 오늘 일정 섹션 (Today's Schedule)
- ✅ 최근 예약 목록 (Recent Bookings)
- ✅ 빠른 액션 카드 (Quick Actions)
- 🔄 실시간 알림
- 🔄 주간/월간 통계 차트

#### 4.2.2 예약 관리
- ✅ 전체 예약 목록 (테이블 뷰)
- ✅ 6가지 상태별 Stats Cards
- ✅ 예약 검색 기능 (보호자명, 펫명, 연락처, 예약번호)
- ✅ 필터링 (상태별, 예약 소스별)
- ✅ 실시간 데이터 업데이트 (Supabase Realtime)
- ✅ 토스트 알림 (새 예약 알림)
- 🔄 예약 상태 변경 (승인/거부)
- 🔄 예약 상세 정보 모달
- 🔄 AI펫닥터 연동 예약 표시 및 관리
- 🔄 스마트 진단서 조회 및 PDF 다운로드
- 🔄 긴급도별 필터링 및 우선순위 표시
- 🔄 시간 수정 제안 기능
- 🔄 캘린더 뷰
- 🔄 일괄 승인/거부
- 🔄 예약 삭제

#### 4.2.3 클리닉 설정
- 🔄 클리닉 기본 정보 수정
- 🔄 영업시간 설정 (요일별)
- 🔄 휴무일 설정 (특정 날짜)
- 🔄 서비스 종류 관리
- 🔄 가격 정보 관리
- 🔄 알림 설정

#### 4.2.4 통계 및 분석
- 🔄 예약 추이 그래프
- 🔄 서비스별 통계
- 🔄 시간대별 예약 분포
- 🔄 고객 재방문율
- 🔄 노쇼율 분석
- 🔄 매출 통계

### 4.3 인증 시스템
- ✅ Supabase Auth 연동 완료
- ✅ 이메일/비밀번호 로그인
- ✅ 회원가입 (자동 customer 역할 부여)
- ✅ 로그인 상태 유지 (AuthStore with persist)
- ✅ 보호된 라우트 (ProtectedRoute 컴포넌트)
- ✅ 역할 기반 접근 제어 (admin/customer)
- 🔄 비밀번호 재설정
- 🔄 이메일 인증
- 🔄 소셜 로그인 (Google, Kakao, Naver)
- 🔄 2단계 인증 (2FA)

**범례**
- ✅ 구현 완료
- 🔄 개발 예정
- ❌ 제외됨

---

## 5. 상세 기능 명세

### 5.1 고객 예약 플로우

#### Step 1: 서비스 선택
```
화면 구성:
┌─────────────────────────────────────┐
│ 어떤 서비스가 필요하신가요?          │
├─────────────────────────────────────┤
│ [🏥] 일반 진료                       │
│ [💉] 예방접종                         │
│ [🔬] 건강검진                         │
│ [🩺] 수술                             │
│ [✂️] 미용                             │
│ [🚑] 응급                             │
└─────────────────────────────────────┘

기능:
- 서비스 카드 클릭으로 선택
- 서비스별 간단한 설명 툴팁
- 선택 시 하이라이트 효과
```

#### Step 2: 날짜 및 시간 선택
```
화면 구성:
┌─────────────────────────────────────┐
│ 📅 예약 날짜를 선택하세요            │
├─────────────────────────────────────┤
│   [달력 컴포넌트]                     │
│                                      │
│ 🕐 예약 시간을 선택하세요            │
├─────────────────────────────────────┤
│ 09:00  09:30  10:00  10:30 ...      │
│  [O]    [O]    [X]    [O]           │
└─────────────────────────────────────┘

기능:
- 휴무일 자동 비활성화
- 예약 불가 시간 비활성화
- 영업시간 외 자동 숨김
- 실시간 가용성 체크
```

#### Step 3: 반려동물 정보 입력
```
화면 구성:
┌─────────────────────────────────────┐
│ 🐕 반려동물 정보를 입력하세요        │
├─────────────────────────────────────┤
│ 보호자 이름: [___________]           │
│ 연락처:     [___________]           │
│ 이메일:     [___________]           │
│                                      │
│ 반려동물 이름: [___________]         │
│ 종류:         [강아지 ▼]            │
│ 품종:         [___________]         │
│ 나이:         [___________]         │
│                                      │
│ 증상/메모:                           │
│ [____________________________]       │
│                                      │
│           [예약하기]                  │
└─────────────────────────────────────┘

유효성 검증:
- 보호자 이름: 필수, 2-20자
- 연락처: 필수, 010-XXXX-XXXX 형식
- 이메일: 필수, 유효한 이메일 형식
- 반려동물 이름: 필수
- 종류: 필수 (강아지/고양이/기타)
```

#### Step 4: 예약 완료
```
화면 구성:
┌─────────────────────────────────────┐
│        ✅ 예약이 완료되었습니다!      │
├─────────────────────────────────────┤
│ 예약 번호: #A2025-0001               │
│ 서비스:    일반 진료                  │
│ 날짜:      2025년 10월 25일          │
│ 시간:      오전 10:00                │
│ 반려동물:   행복이 (골든 리트리버)    │
│                                      │
│ 📧 확인 이메일이 발송되었습니다.      │
│                                      │
│ ⚠️ 예약은 클리닉 확인 후 최종 승인됩니다. │
│                                      │
│      [내 예약 보기]  [홈으로]        │
└─────────────────────────────────────┘

기능:
- 예약 정보 요약 표시
- 이메일 자동 발송
- SNS 공유 버튼
- QR 코드 생성 (선택사항)
```

### 5.2 관리자 예약 관리 플로우

#### 대시보드
```
화면 구성:
┌─────────────────────────────────────────────────────────┐
│ AI펫닥터 병원 관리 시스템 - 관리자 대시보드              │
├─────────────────────────────────────────────────────────┤
│ [📊 오늘]  [📅 주간]  [📆 월간]                        │
├────────────┬────────────┬────────────┬────────────────┤
│ 오늘 예약   │ 대기 중     │ 이번 주     │ 이번 달        │
│    12건    │    3건     │    45건    │    180건       │
└────────────┴────────────┴────────────┴────────────────┘

최근 예약 (실시간 업데이트)
┌─────────────────────────────────────────────────────────┐
│ #A2025-0012 | 김보호자 | 행복이 | 10:00 | [승인] [거부] │
│ #A2025-0011 | 이보호자 | 나비   | 11:00 | [승인] [거부] │
│ #A2025-0010 | 박보호자 | 초코   | 14:00 | [승인] [거부] │
└─────────────────────────────────────────────────────────┘

예약 추이 그래프
┌─────────────────────────────────────────────────────────┐
│  │                                                       │
│50│           ╱╲                                         │
│  │         ╱    ╲      ╱╲                               │
│25│       ╱        ╲  ╱    ╲                             │
│  │    ╱             ╲         ╲                         │
│ 0└────────────────────────────────────                 │
│   월   화   수   목   금   토   일                       │
└─────────────────────────────────────────────────────────┘
```

#### 예약 목록 (테이블 뷰)
```
기능:
- 실시간 데이터 동기화 (Supabase Realtime)
- 정렬: 날짜, 시간, 상태, 서비스별
- 필터: 상태별, 날짜 범위, 서비스별
- 검색: 보호자 이름, 연락처, 반려동물 이름
- 일괄 작업: 체크박스로 다중 선택 후 일괄 승인/거부
- 엑셀 내보내기
- 인쇄 기능

테이블 컬럼:
| 예약번호 | 날짜 | 시간 | 보호자 | 반려동물 | 서비스 | 상태 | 액션 |
```

#### 예약 상세 모달
```
┌─────────────────────────────────────┐
│ 예약 상세 정보                        │
├─────────────────────────────────────┤
│ 예약 번호: #A2025-0012               │
│ 상태: [대기 중 ▼]                    │
│                                      │
│ [고객 정보]                          │
│ 보호자: 김보호자                      │
│ 연락처: 010-1234-5678                │
│ 이메일: customer@example.com        │
│                                      │
│ [반려동물 정보]                      │
│ 이름: 행복이                          │
│ 종류: 강아지 (골든 리트리버)          │
│ 나이: 3세                            │
│                                      │
│ [예약 정보]                          │
│ 서비스: 일반 진료                     │
│ 날짜: 2025년 10월 25일               │
│ 시간: 오전 10:00                     │
│ 생성일: 2025년 10월 20일 23:45       │
│                                      │
│ [메모]                               │
│ 최근 식욕 감소, 기력 저하 증상        │
│                                      │
│ [관리자 메모]                        │
│ [____________________________]       │
│                                      │
│     [승인]  [거부]  [삭제]  [닫기]  │
└─────────────────────────────────────┘

기능:
- 상태 변경 드롭다운
- 관리자 메모 추가
- 이메일/SMS 재발송
- 예약 취소
- 히스토리 로그 표시
```

### 5.3 클리닉 설정 플로우

#### 영업시간 설정
```
┌─────────────────────────────────────┐
│ 영업시간 설정                         │
├─────────────────────────────────────┤
│ 월요일  [09:00 ▼] - [18:00 ▼]  [✓] │
│ 화요일  [09:00 ▼] - [18:00 ▼]  [✓] │
│ 수요일  [09:00 ▼] - [18:00 ▼]  [✓] │
│ 목요일  [09:00 ▼] - [18:00 ▼]  [✓] │
│ 금요일  [09:00 ▼] - [18:00 ▼]  [✓] │
│ 토요일  [09:00 ▼] - [15:00 ▼]  [✓] │
│ 일요일  [ 휴무 ]                [  ] │
│                                      │
│ 점심시간  [12:00 ▼] - [13:00 ▼]     │
│ 예약 간격 [30분 ▼]                   │
│                                      │
│           [저장]  [취소]              │
└─────────────────────────────────────┘

기능:
- 요일별 개별 설정
- 일괄 적용 버튼
- 점심시간 설정
- 예약 간격 설정 (15/30/60분)
- 휴무일 토글
```

#### 휴무일 설정
```
┌─────────────────────────────────────┐
│ 휴무일 설정                           │
├─────────────────────────────────────┤
│ 📅 날짜 선택: [________] [추가]      │
│                                      │
│ 등록된 휴무일:                       │
│ ┌───────────────────────────────┐   │
│ │ 2025-10-25  설립기념일  [삭제] │   │
│ │ 2025-12-25  크리스마스  [삭제] │   │
│ │ 2026-01-01  신년 연휴   [삭제] │   │
│ └───────────────────────────────┘   │
│                                      │
│ 기간 설정:                           │
│ 시작일: [________]                   │
│ 종료일: [________]                   │
│ 사유: [____________________]         │
│              [추가]                  │
└─────────────────────────────────────┘

기능:
- 단일 날짜 추가
- 기간 설정 (예: 여름 휴가)
- 사유 입력
- 캘린더 뷰에서 시각적 확인
- 과거 휴무일 자동 정리
```

---

## 6. 기술 아키텍처

### 6.1 기술 스택

#### Frontend
```javascript
{
  "framework": "React 19.1.1",
  "bundler": "Vite 7.1.7",
  "language": "TypeScript 5.8.3",
  "compiler": "babel-plugin-react-compiler 1.0.0",
  "router": "React Router DOM 7.9.3",
  "state": "Zustand 5.0.8",
  "styling": "TailwindCSS 3.4.17 + CVA",
  "icons": "Lucide React 0.544.0",
  "charts": "Recharts 3.2.1",
  "dnd": "@dnd-kit/core 6.3.1",
  "testing": "@playwright/test 1.55.1"
}
```

#### Backend (Supabase)
```javascript
{
  "database": "PostgreSQL 15",
  "auth": "Supabase Auth (JWT)",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime (WebSocket)",
  "edge": "Supabase Edge Functions (Deno)",
  "client": "@supabase/supabase-js 2.58.0"
}
```

#### DevOps
```javascript
{
  "hosting": "Vercel / Netlify",
  "ci": "GitHub Actions",
  "monitoring": "Sentry",
  "analytics": "Google Analytics 4"
}
```

### 6.2 프로젝트 구조

```
ai-pet-doctor-hospital/
├── public/
│   ├── images/
│   ├── icons/
│   └── locales/           # 다국어 JSON
│       ├── ko.json
│       ├── en.json
│       └── pl.json
│
├── src/
│   ├── main.tsx           # 진입점
│   ├── App.tsx            # 루트 컴포넌트
│   │
│   ├── features/          # 기능별 모듈 (Feature-Sliced Design)
│   │   ├── ai-integration/  # AI펫닥터 연동
│   │   │   ├── components/
│   │   │   │   ├── SmartDiagnosisCard.tsx
│   │   │   │   ├── UrgencyBadge.tsx
│   │   │   │   ├── PetHistoryTimeline.tsx
│   │   │   │   └── DiagnosisDetailModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSmartDiagnosis.ts
│   │   │   │   ├── useWebhook.ts
│   │   │   │   └── usePetHistory.ts
│   │   │   ├── api/
│   │   │   │   ├── webhook.api.ts
│   │   │   │   └── ai-pet-doctor.api.ts
│   │   │   └── types/
│   │   │       └── ai-integration.types.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── PasswordReset.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useSession.ts
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   │
│   │   ├── booking/
│   │   │   ├── components/
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   ├── BookingList.tsx
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   └── BookingStatus.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBookings.ts
│   │   │   │   ├── useCreateBooking.ts
│   │   │   │   └── useUpdateBooking.ts
│   │   │   ├── stores/
│   │   │   │   └── bookingStore.ts
│   │   │   └── types/
│   │   │       └── booking.types.ts
│   │   │
│   │   ├── clinic/
│   │   │   ├── components/
│   │   │   │   ├── ClinicInfo.tsx
│   │   │   │   ├── BusinessHours.tsx
│   │   │   │   └── ClosedDates.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useClinic.ts
│   │   │   │   └── useUpdateClinic.ts
│   │   │   └── stores/
│   │   │       └── clinicStore.ts
│   │   │
│   │   └── dashboard/
│   │       ├── components/
│   │       │   ├── StatsCards.tsx
│   │       │   ├── RecentBookings.tsx
│   │       │   └── Charts.tsx
│   │       └── hooks/
│   │           └── useStats.ts
│   │
│   ├── shared/            # 공유 리소스
│   │   ├── api/
│   │   │   ├── supabase.ts          # Supabase 클라이언트
│   │   │   ├── bookings.api.ts
│   │   │   ├── clinic.api.ts
│   │   │   └── auth.api.ts
│   │   │
│   │   ├── components/    # 재사용 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   ├── hooks/         # 공통 훅
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useMediaQuery.ts
│   │   │
│   │   ├── utils/         # 유틸리티 함수
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── cn.ts      # Tailwind merge
│   │   │
│   │   ├── types/         # 공통 타입
│   │   │   ├── database.types.ts  # Supabase 생성
│   │   │   └── common.types.ts
│   │   │
│   │   └── constants/
│   │       ├── routes.ts
│   │       ├── config.ts
│   │       └── status.ts
│   │
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Booking.tsx
│   │   ├── MyBookings.tsx
│   │   ├── Login.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Bookings.tsx
│   │   │   ├── Clinic.tsx
│   │   │   └── Settings.tsx
│   │   └── NotFound.tsx
│   │
│   ├── layouts/           # 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   └── styles/
│       ├── index.css      # Tailwind imports
│       └── variables.css  # CSS 변수
│
├── .env.local
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 6.3 상태 관리 전략 (Zustand)

#### Auth Store
```typescript
// src/features/auth/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (data: SignupData) => Promise<void>
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

      signup: async (data) => {
        // ... implementation
      },
    }),
    { name: 'auth-storage' }
  )
)
```

#### Booking Store
```typescript
// src/features/booking/stores/bookingStore.ts
import { create } from 'zustand'

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
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  filters: { status: 'all', dateFrom: null, dateTo: null },
  isLoading: false,

  setBookings: (bookings) => set({ bookings }),

  addBooking: (booking) =>
    set((state) => ({ bookings: [booking, ...state.bookings] })),

  updateBooking: (id, data) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...data } : b
      ),
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  selectBooking: (booking) => set({ selectedBooking: booking }),
}))
```

### 6.4 Supabase 통합

#### Supabase Client 설정
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

// Type-safe helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
```

#### API 함수 예시
```typescript
// src/shared/api/bookings.api.ts
import { supabase } from './supabase'
import type { Tables } from './supabase'

export type Booking = Tables<'bookings'>
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// 모든 예약 조회
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (error) throw error
  return data
}

// 예약 생성
export async function createBooking(booking: BookingInsert): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data
}

// 예약 업데이트
export async function updateBooking(
  id: string,
  updates: BookingUpdate
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

// 예약 삭제
export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw error
}

// 실시간 구독
export function subscribeToBookings(
  callback: (booking: Booking) => void
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
      (payload) => {
        callback(payload.new as Booking)
      }
    )
    .subscribe()
}
```

#### Custom Hook 예시
```typescript
// src/features/booking/hooks/useBookings.ts
import { useEffect } from 'react'
import { useBookingStore } from '../stores/bookingStore'
import { getAllBookings, subscribeToBookings } from '@/shared/api/bookings.api'

export function useBookings() {
  const { bookings, setBookings, addBooking, updateBooking, isLoading } =
    useBookingStore()

  useEffect(() => {
    // 초기 데이터 로드
    getAllBookings().then(setBookings)

    // 실시간 구독
    const channel = subscribeToBookings((booking) => {
      if (payload.eventType === 'INSERT') {
        addBooking(booking)
      } else if (payload.eventType === 'UPDATE') {
        updateBooking(booking.id, booking)
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { bookings, isLoading }
}
```

### 6.5 React Compiler 최적화

#### vite.config.ts
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
            compilationMode: 'infer', // 또는 'all'
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
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'recharts'],
        },
      },
    },
  },
})
```

#### React Compiler 최적화 가이드
```typescript
// ✅ 자동 최적화됨 - React Compiler가 메모이제이션 처리
function BookingCard({ booking }: { booking: Booking }) {
  // 컴파일러가 자동으로 최적화
  const formattedDate = new Date(booking.date).toLocaleDateString('ko-KR')
  const statusColor = getStatusColor(booking.status)

  return (
    <div className={`card ${statusColor}`}>
      <h3>{booking.petName}</h3>
      <p>{formattedDate}</p>
      <p>{booking.time}</p>
    </div>
  )
}

// ❌ 수동 메모이제이션 불필요 - 제거 가능
// const BookingCard = memo(({ booking }) => { ... })

// ✅ 컴파일러가 자동으로 deps 추론
function BookingList({ bookings }: { bookings: Booking[] }) {
  // useCallback, useMemo 불필요
  const filteredBookings = bookings.filter(b => b.status === 'confirmed')
  const handleClick = (id: string) => console.log(id)

  return (
    <div>
      {filteredBookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}
```

---

## 7. 데이터베이스 설계

### 7.1 Supabase 스키마

#### 테이블 구조 (8개 테이블)

```sql
-- 1. users (Supabase Auth 기본 테이블 확장)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. clinics (클리닉 정보 - 싱글톤)
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  phone_1 TEXT NOT NULL,
  phone_2 TEXT,
  email TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. business_hours (영업시간)
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=일요일, 6=토요일
  is_open BOOLEAN DEFAULT true,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '18:00',
  break_start TIME DEFAULT '12:00',
  break_end TIME DEFAULT '13:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, day_of_week)
);

-- 4. closed_dates (휴무일)
CREATE TABLE closed_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, date)
);

-- 5. services (서비스 종류)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. pets (반려동물 정보)
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL, -- 'dog', 'cat', 'other'
  breed TEXT,
  age INT,
  weight NUMERIC(5, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. bookings (예약)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL, -- 'A2025-0001' 형식

  -- 관계
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,

  -- 예약 정보
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')
  ),

  -- 고객 정보 (비회원 예약용)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- 반려동물 정보 (비회원 예약용)
  pet_name TEXT NOT NULL,
  pet_species TEXT NOT NULL,
  pet_breed TEXT,
  pet_age INT,

  -- 추가 정보
  symptoms TEXT,
  admin_notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- AI펫닥터 연동
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'ai_pet_doctor')),
  ai_pet_doctor_request_id TEXT,
  ai_pet_doctor_user_id TEXT,
  ai_pet_doctor_pet_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_booking_slot UNIQUE (clinic_id, booking_date, booking_time)
);

-- 8. smart_diagnoses (AI펫닥터 스마트 진단서)
CREATE TABLE smart_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id TEXT UNIQUE NOT NULL, -- AI펫닥터 진단서 ID
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

  -- 긴급도
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),

  -- 1. 보호자 문의
  symptoms JSONB NOT NULL, -- ['구토', '기력저하']
  duration TEXT,
  severity INT CHECK (severity BETWEEN 1 AND 10),
  additional_notes TEXT,

  -- 2. AI 진단
  suspected_conditions JSONB, -- ['급성 위장염', '이물 섭취']
  confidence NUMERIC(3, 2), -- 0.85
  hospital_visit_required BOOLEAN DEFAULT true,
  recommended_tests JSONB, -- ['혈액검사', '복부 X-ray']
  ai_recommendations TEXT,

  -- 3. 펫 히스토리 (AI펫닥터에서 가져온 데이터)
  past_visits JSONB, -- 과거 진료 이력
  allergies JSONB, -- ['페니실린', '닭고기']
  current_medications JSONB, -- 현재 복용 약물
  vaccinations JSONB, -- 예방접종 기록
  chronic_conditions JSONB, -- 만성 질환
  special_notes TEXT,

  -- 메타데이터
  diagnosis_created_at TIMESTAMPTZ NOT NULL, -- AI 진단 생성 시각
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. booking_responses (예약 응답 이력)
CREATE TABLE booking_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,

  response_type TEXT NOT NULL CHECK (response_type IN ('confirmed', 'modified', 'rejected')),

  -- 수정 제안시
  suggested_dates JSONB, -- [{date: '2025-10-25', times: ['10:00', '11:00']}]
  modification_reason TEXT,

  -- 거절시
  rejection_reason TEXT,
  alternative_clinics JSONB, -- 대안 병원 제시

  -- 병원 메시지
  hospital_message TEXT,

  -- Webhook 전송 상태
  webhook_sent BOOLEAN DEFAULT false,
  webhook_sent_at TIMESTAMPTZ,
  webhook_response TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- 10. notifications (알림)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking_created', 'booking_confirmed', 'booking_cancelled', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_clinic ON bookings(clinic_id);
CREATE INDEX idx_bookings_source ON bookings(source);
CREATE INDEX idx_bookings_ai_request ON bookings(ai_pet_doctor_request_id);
CREATE INDEX idx_smart_diagnoses_booking ON smart_diagnoses(booking_id);
CREATE INDEX idx_smart_diagnoses_urgency ON smart_diagnoses(urgency);
CREATE INDEX idx_booking_responses_booking ON booking_responses(booking_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_smart_diagnoses_updated_at BEFORE UPDATE ON smart_diagnoses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 예약 번호 자동 생성
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  seq_num INT;
BEGIN
  year_prefix := 'A' || TO_CHAR(NEW.created_at, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(booking_number FROM 7) AS INT)), 0) + 1
  INTO seq_num
  FROM bookings
  WHERE booking_number LIKE year_prefix || '%';

  NEW.booking_number := year_prefix || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_booking_number_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_number IS NULL)
  EXECUTE FUNCTION generate_booking_number();
```

### 7.2 Row Level Security (RLS) 정책

```sql
-- users 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- bookings 테이블 RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    user_id = auth.uid() OR
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can cancel own bookings"
  ON bookings FOR UPDATE
  USING (
    user_id = auth.uid() AND
    status IN ('pending', 'confirmed')
  )
  WITH CHECK (
    status = 'cancelled'
  );

CREATE POLICY "Admins have full access to bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- clinics 테이블 RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clinic info"
  ON clinics FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update clinic info"
  ON clinics FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 나머지 테이블도 유사하게 설정...
```

### 7.3 Supabase Storage 버킷

```sql
-- 클리닉 로고/이미지 저장
INSERT INTO storage.buckets (id, name, public) VALUES ('clinic-images', 'clinic-images', true);

-- 반려동물 사진 저장 (선택사항)
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', false);

-- Storage RLS 정책
CREATE POLICY "Anyone can view clinic images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clinic-images');

CREATE POLICY "Admins can upload clinic images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clinic-images' AND
    (storage.foldername(name))[1] = auth.uid()::TEXT
  );
```

---

## 8. UI/UX 디자인 시스템

### 8.1 디자인 토큰

#### 색상 팔레트
```css
/* tailwind.config.ts에서 확장 */
{
  colors: {
    // Primary - 수의과 테마
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',  // 메인
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    // Accent - 강조색
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',  // 메인
      600: '#dc2626',
    },

    // Status - 상태별
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Booking Status
    status: {
      pending: '#f59e0b',    // 주황색
      confirmed: '#10b981',  // 녹색
      cancelled: '#ef4444',  // 빨간색
      completed: '#6b7280',  // 회색
      'no-show': '#dc2626',  // 진한 빨강
    },
  },
}
```

#### 타이포그래피
```css
{
  fontFamily: {
    sans: ['Pretendard', 'system-ui', 'sans-serif'],
    mono: [''JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
}
```

#### 간격 및 레이아웃
```css
{
  spacing: {
    // Tailwind 기본 스케일 사용 (4px 단위)
    // 추가 커스텀
    'safe-top': 'env(safe-area-inset-top)',
    'safe-bottom': 'env(safe-area-inset-bottom)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
}
```

### 8.2 컴포넌트 라이브러리 (CVA 기반)

#### Button 컴포넌트
```typescript
// src/shared/components/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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

#### Input 컴포넌트
```typescript
// src/shared/components/Input.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:ring-primary-600',
        error: 'border-red-500 focus-visible:ring-red-600',
      },
      inputSize: {
        sm: 'h-9 text-sm',
        md: 'h-10',
        lg: 'h-11 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({
  variant,
  inputSize,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          className={cn(
            inputVariants({ variant: error ? 'error' : variant, inputSize }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
```

### 8.3 반응형 디자인

#### 브레이크포인트
```typescript
// Mobile First 접근
{
  screens: {
    sm: '640px',   // 스마트폰 (가로)
    md: '768px',   // 태블릿
    lg: '1024px',  // 노트북
    xl: '1280px',  // 데스크톱
    '2xl': '1536px', // 대형 모니터
  },
}
```

#### 반응형 예시
```tsx
// 모바일: 세로 스택, 데스크톱: 가로 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {bookings.map(booking => (
    <BookingCard key={booking.id} booking={booking} />
  ))}
</div>

// 모바일: 햄버거 메뉴, 데스크톱: 풀 네비게이션
<nav className="block md:hidden">
  <HamburgerMenu />
</nav>
<nav className="hidden md:block">
  <FullNavigation />
</nav>
```

---

## 9. 개발 로드맵

### Phase 1: 기반 구축 (1-2주) ✅ 완료

#### Week 1: 프로젝트 셋업 ✅
- [x] Vite + React 19 프로젝트 초기화
- [x] TailwindCSS 4.x + CVA 설정
- [x] React Router 7 설정
- [x] Zustand 스토어 구조 설계
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 구현 (10개 테이블)
- [x] RLS 정책 설정
- [x] TypeScript 타입 생성 (database.types.ts)

#### Week 2: 기본 UI 컴포넌트 ✅
- [x] 디자인 시스템 구축 (Clean Booking 컨셉)
- [x] Button, Input 컴포넌트 (CVA 기반)
- [x] Modal, Card, Badge, Table 컴포넌트
- [x] Layout 컴포넌트 (MainLayout, AdminLayout)
- [x] 네비게이션 컴포넌트 (헤더, 사이드바)
- [x] Toast 알림 시스템

### Phase 2: 핵심 기능 구현 (2-3주) ✅ 완료

#### Week 3: 인증 시스템 ✅
- [x] Supabase Auth 연동
- [x] 로그인/회원가입 UI (Login.tsx, Signup.tsx)
- [x] AuthStore with Zustand persist
- [x] 보호된 라우트 구현 (ProtectedRoute)
- [x] 역할 기반 권한 체크 (admin/customer)
- [x] 세션 관리 및 자동 로그아웃

#### Week 4: 고객 예약 시스템 ✅
- [x] 랜딩 페이지 구현 (Home.tsx)
- [x] 내 예약 페이지 (MyBookings.tsx) - 탭 필터, 카드 뷰
- [x] 예약 폼 (3단계) - BookingForm.tsx
- [x] 날짜/시간 선택 컴포넌트 (BookingCalendar, TimeSlotPicker)
- [x] 실시간 가용성 체크
- [x] 예약 생성 API 연동
- [x] 예약 상세/수정/취소 모달 (BookingDetailModal)
- [x] useBookingActions 훅 구현

#### Week 5: 관리자 대시보드 ✅
- [x] 관리자 레이아웃 (AdminLayout with sidebar)
- [x] 대시보드 통계 카드 (Dashboard.tsx)
- [x] 오늘 일정 섹션
- [x] 최근 예약 목록
- [x] 긴급 예약 알림 배너
- [x] 예약 목록 테이블 (Bookings.tsx)
- [x] 6가지 상태별 Stats Cards
- [x] 검색 및 필터링 기능
- [x] 실시간 업데이트 (Supabase Realtime)
- [x] BookingStore with useMemo 최적화
- [x] 예약 상세 모달 (BookingDetailModal)
- [x] 예약 상태 변경 (취소, 완료, 노쇼)

### Phase 3: 고급 기능 (1-2주) ✅

#### Week 6: 클리닉 설정 ✅
- [x] 클리닉 정보 수정 (Settings.tsx)
- [x] 영업시간 설정 UI
- [x] 휴무일 관리 UI
- [x] 서비스 관리 UI
- [ ] 이미지 업로드 (Storage) - 향후 구현

#### Week 7: 통계 및 알림
- [ ] Recharts 통계 그래프
- [ ] 이메일 알림 (Edge Functions)
- [ ] 브라우저 알림
- [ ] 알림 설정 페이지
- [ ] 엑셀 내보내기

### Phase 4: 코드 최적화 및 배포 (1주) ✅ 완료

#### Week 7-8: 최적화 및 배포 ✅
- [x] 코드 최적화 (2025-10-27)
  - [x] 보안 취약점 수정 (.gitignore 환경변수 노출 제거)
  - [x] Supabase 프로젝트 URL 수정 및 타입 재생성
  - [x] useLogout 커스텀 훅 생성 (코드 중복 제거)
  - [x] React 19 useId() 적용
  - [x] 프로덕션 안전 logger 유틸리티 생성
  - [x] 전화번호 검증 개선 (모든 한국 번호 지원)
  - [x] ErrorBoundary 컴포넌트 추가
  - [x] 미사용 imports/variables 제거 (15개)
  - [x] TypeScript 타입 안전성 개선
  - [x] 환경변수 타입 정의 (vite-env.d.ts)
- [x] React Compiler 최적화 ✅ (이미 적용됨)
- [x] 프로덕션 배포 ✅ (Vercel)
  - [x] Vercel 설정 파일 생성 (vercel.json)
  - [x] GitHub 연동 및 푸시
  - [x] 환경변수 설정 (Supabase URL, Anon Key)
  - [x] 프로덕션 배포 완료
  - [x] 배포 URL: https://ai-pet-doctor-hospital.vercel.app
- [ ] 다국어 지원 (i18n) - Phase 5
- [ ] Lighthouse 성능 최적화 - Phase 5
- [ ] E2E 테스트 (Playwright) - Phase 5

### Phase 5: AI펫닥터 연동 (예정)
- [ ] Webhook 수신 (Supabase Edge Function)
- [ ] 스마트 진단서 컴포넌트
- [ ] 긴급도 기반 필터링
- [ ] Webhook 전송 (예약 응답)

### Phase 6: 통계 및 고급 기능 (예정)
- [ ] Recharts 통계 그래프
- [ ] 이메일 알림 (Edge Functions)
- [ ] 브라우저 알림
- [ ] 알림 설정 페이지
- [ ] 엑셀 내보내기

---

## 10. 성공 지표

### 10.1 기술적 지표

#### 성능 (Lighthouse)
- **목표**: 모든 지표 90점 이상
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 90+

#### 빌드 시간
- **개발 빌드**: < 3초 ✅ (실제: ~3초)
- **프로덕션 빌드**: < 30초 ✅ (실제: ~20초, Vercel)
- **HMR**: < 100ms ✅

#### 번들 크기
- **초기 로드**: < 200KB (gzipped) ✅ (실제: 192.79 KB)
- **총 JS**: < 500KB (gzipped) ⚠️ (실제: 698.40 KB, 최적화 필요)
- **총 CSS**: < 50KB (gzipped) ✅ (실제: 10.88 KB)

### 10.2 사용자 지표

#### 예약 프로세스
- **예약 완료율**: > 85%
- **평균 예약 시간**: < 2분
- **취소율**: < 10%
- **재예약율**: > 30%

#### 관리자 효율성
- **평균 처리 시간**: < 30초/예약
- **일일 처리 건수**: > 50건
- **노쇼율**: < 5%

---

## 11. 리스크 및 대응방안

### 11.1 기술적 리스크

#### React Compiler 안정성
- **리스크**: React Compiler 1.0이 신기술로 버그 가능성
- **대응**:
  - 주요 컴포넌트는 수동 최적화 병행
  - Production에서 컴파일러 비활성화 옵션 준비
  - 정기적인 React 업데이트 모니터링

#### Supabase 의존성
- **리스크**: 단일 벤더 종속(vendor lock-in)
- **대응**:
  - PostgreSQL 표준 SQL 사용
  - 데이터 백업 자동화
  - 마이그레이션 스크립트 준비

#### 타입 안전성
- **리스크**: Supabase 타입 생성 오류
- **대응**:
  - 수동 타입 검증 레이어
  - Zod를 이용한 런타임 검증
  - E2E 테스트로 타입 오류 검출

### 11.2 비즈니스 리스크

#### 사용자 채택
- **리스크**: 기존 전화 예약 선호
- **대응**:
  - 전화 예약과 병행 운영
  - 간단한 UI/UX로 진입장벽 낮춤
  - 인센티브 제공 (할인, 포인트)

#### 노쇼 문제
- **리스크**: 예약 후 미방문
- **대응**:
  - 리마인더 알림 (24시간 전, 3시간 전)
  - 보증금 시스템 (추후 도입)
  - 노쇼 이력 관리

---

## 12. 배포 및 운영

### 12.1 프로덕션 배포 정보

#### 배포 플랫폼
- **호스팅**: Vercel
- **배포 방식**: GitHub 연동 자동 배포
- **배포 URL**: https://ai-pet-doctor-hospital.vercel.app
- **대체 URL**:
  - https://ai-pet-doctor-hospital-inervetdevs-projects.vercel.app
  - https://ai-pet-doctor-hospital-dslee-7581-inervetdevs-projects.vercel.app

#### 배포 구성
```json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

#### 환경변수
- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 익명 키
- `VITE_AI_PET_DOCTOR_WEBHOOK_URL`: AI펫닥터 Webhook URL (Phase 5)
- `VITE_AI_PET_DOCTOR_API_KEY`: AI펫닥터 API 키 (Phase 5)

#### 배포 이력
- **2025-10-27**: 초기 프로덕션 배포
  - Phase 1-4 완료 (인프라, 인증, 예약, 관리자, 클리닉 설정)
  - 코드 최적화 완료 (보안, 타입 안전성, 성능)
  - 빌드 시간: ~20초
  - 번들 크기: 698.40 KB (gzip: 192.79 KB)

### 12.2 로컬 개발 환경

#### 개발 서버
- **URL**: http://localhost:5175
- **포트**: 5175 (vite.config.ts에서 고정)
- **HMR**: 활성화
- **React Compiler**: 개발 모드에서도 활성화

#### 개발 환경 설정
```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 타입 체크
pnpm typecheck

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

### 12.3 코드 최적화 완료 항목 (2025-10-27)

#### 보안
- ✅ .gitignore 환경변수 노출 취약점 수정
- ✅ .env.example 템플릿 생성
- ✅ Supabase 프로젝트 URL/Key 검증 및 수정

#### 코드 품질
- ✅ useLogout 커스텀 훅 생성 (3개 파일에서 중복 코드 제거)
- ✅ React 19 useId() 적용 (SSR 안전)
- ✅ logger.ts 유틸리티 생성 (프로덕션 안전 로깅)
- ✅ ErrorBoundary 컴포넌트 추가
- ✅ 미사용 imports 10개 제거
- ✅ 미사용 state variables 5개 제거
- ✅ 미사용 type definitions 2개 제거

#### 타입 안전성
- ✅ any → unknown 타입 변경
- ✅ vite-env.d.ts 환경변수 타입 정의
- ✅ useEffect 의존성 배열 수정
- ✅ Null 안전성 체크 추가
- ✅ database.types.ts 재생성 (올바른 Supabase 프로젝트)
- ✅ booking_number optional 타입 수정 (DB 트리거 대응)
- ✅ 40+ 타입 별칭 추가 (하위 호환성)

#### 기능 개선
- ✅ 전화번호 검증 개선 (010, 011, 016, 017, 018, 019 지원)
- ✅ 예약 폼 자동 포맷팅
- ✅ 에러 로깅 강화

### 12.4 배포 자동화

#### GitHub Actions (향후 구현)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm build
      - uses: amondnet/vercel-action@v20
```

#### CI/CD 파이프라인
1. **코드 푸시** → GitHub main 브랜치
2. **자동 빌드** → Vercel 자동 감지
3. **타입 체크** → TypeScript 검증
4. **빌드** → Vite 프로덕션 빌드
5. **배포** → Vercel CDN 배포
6. **알림** → Slack/Discord 알림 (향후)

### 12.5 모니터링 및 분석

#### Vercel Analytics (향후)
- 페이지 뷰
- 사용자 세션
- 성능 지표 (Core Web Vitals)
- 에러 추적

#### Supabase Dashboard
- 데이터베이스 쿼리 성능
- API 요청 수
- 인증 통계
- 스토리지 사용량

---

## 13. 부록

### 13.1 참고 문서
- [CLAUDE.md](../CLAUDE.md) - Claude Code 개발 가이드
- [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) - Clean Booking 디자인 시스템
- [ADMIN_SETUP.md](../ADMIN_SETUP.md) - 관리자 설정 가이드
- [기존 FUNCTIONAL_SPECIFICATION.md](./FUNCTIONAL_SPECIFICATION.md)
- [Supabase 공식 문서](https://supabase.com/docs)
- [React 19 문서](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Vercel 문서](https://vercel.com/docs)
- [Vite 문서](https://vitejs.dev/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

### 12.2 용어 정의
- **MVA**: 최소 기능 제품 (Minimum Viable Product)
- **RLS**: 행 수준 보안 (Row Level Security)
- **HMR**: 핫 모듈 리플레이스먼트 (Hot Module Replacement)
- **CVA**: 클래스 변형 권한 (Class Variance Authority)
- **E2E**: 엔드 투 엔드 (End-to-End)

### 12.3 변경 이력
| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2.3 | 2025-10-27 | 수의사 선택 기능 및 로그아웃 이슈 수정 완료 | AI Assistant |
| 2.2 | 2025-10-21 | Phase A-D 완료 상태 업데이트, 구현된 기능 체크 | AI Assistant |
| 2.1 | 2025-10-20 | AI펫닥터 통합 시스템으로 명칭 변경 및 연동 기능 추가 | AI Assistant |
| 2.0 | 2025-10-20 | React + Supabase 재개발 PRD 작성 | AI Assistant |
| 1.0 | 2025-10-19 | Next.js 기반 초기 명세서 | System Analysis |

---

## 13. 최신 업데이트 (2025-10-27)

### 13.1 신규 기능 구현

#### ✅ 수의사 선택 기능 (Veterinarian Selection)
**구현 내용:**
- `veterinarians` 테이블 추가 (수의사 정보 관리)
- 예약 시 담당 수의사 선택 기능
- 시간대별 예약 가능한 수의사 필터링
- 중복 예약 방지 (승인된 예약과 시간 중복 체크)

**데이터베이스 스키마:**
```sql
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id),
  name TEXT NOT NULL,
  title TEXT,  -- 원장, 수의사, 전문의
  specialization TEXT,  -- 일반진료, 외과, 내과, 피부과 등
  license_number TEXT,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE bookings
ADD COLUMN veterinarian_id UUID REFERENCES veterinarians(id);
```

**API 함수:**
- `getAllVeterinarians()`: 모든 수의사 조회
- `getAvailableVeterinarians(clinicId, date, time)`: 특정 시간대 예약 가능 수의사 조회
- `createVeterinarian()`, `updateVeterinarian()`, `deleteVeterinarian()`

**UI 컴포넌트:**
- [BookingForm.tsx](../src/features/booking/components/BookingForm.tsx): 수의사 선택 UI 추가
- [Booking.tsx](../src/pages/Booking.tsx): 수의사 데이터 로딩 및 전달

**샘플 데이터:**
- 김수의 (원장 - 일반진료, 외과)
- 이진료 (수의사 - 내과, 피부과)
- 박전문 (전문의 - 정형외과, 재활)

---

### 13.2 버그 수정

#### ✅ 로그아웃 타이밍 이슈 해결
**문제:**
- 로그아웃 버튼 클릭 시 헤더만 새로고침되고 실제 로그아웃 안되는 현상
- Zustand persist middleware가 localStorage에서 자동 복원
- `window.location.href`가 `logout()` 완료 전에 실행되어 프로세스 중단

**해결 방법:**
1. `authStore.ts`: `reset()` 함수에서 `localStorage.removeItem('auth-storage')` 추가
2. `MainLayout.tsx`: 로그아웃 후 100ms 딜레이 추가, `window.location.replace()` 사용
3. `useLogout.ts`: 동일한 타이밍 수정 적용

**수정된 코드:**
```typescript
// authStore.ts
reset: () => {
  localStorage.removeItem('auth-storage')  // localStorage 완전 제거
  set(initialState)
}

// MainLayout.tsx & useLogout.ts
await logout()
await new Promise(resolve => setTimeout(resolve, 100))  // 100ms 대기
window.location.replace('/')  // 강제 새로고침
```

**영향받은 파일:**
- [src/features/auth/stores/authStore.ts](../src/features/auth/stores/authStore.ts)
- [src/layouts/MainLayout.tsx](../src/layouts/MainLayout.tsx)
- [src/shared/hooks/useLogout.ts](../src/shared/hooks/useLogout.ts)

---

#### ✅ 대시보드 로딩 화면 무한 루프 수정
**문제:**
- 대시보드 초기 로딩 시 백엔드 작업은 완료되었으나 프론트엔드 반영 안됨
- 로컬 state(`isInitialLoad`)와 Zustand store state(`isLoading`) 혼용으로 타이밍 이슈

**해결 방법:**
- 로컬 `isLoading` state만 사용하도록 단순화
- `setTimeout` 제거, 즉시 false 설정

**수정 전:**
```typescript
const [isInitialLoad, setIsInitialLoad] = useState(true)
const isLoading = useBookingLoading()  // Store에서 가져옴

if (isInitialLoad && isLoading) {  // 복잡한 조건
  return <LoadingScreen />
}
```

**수정 후:**
```typescript
const [isLoading, setIsLoading] = useState(true)  // 로컬 state만 사용

if (isLoading) {  // 단순 조건
  return <LoadingScreen />
}
```

**영향받은 파일:**
- [src/pages/admin/Dashboard.tsx](../src/pages/admin/Dashboard.tsx)

---

### 13.3 디버깅 개선

#### 콘솔 로깅 강화
**추가된 로그:**
- `getAvailableVeterinarians()`: 수의사 조회 전 과정 로깅
  - 입력 파라미터 (clinicId, date, time)
  - 예약된 수의사 ID
  - 전체 수의사 수
  - 예약 가능한 수의사 수

**예시:**
```
🔍 [수의사 조회] 시작 ---
  - clinicId: xxx-xxx-xxx
  - date: 2025-10-28
  - time: 14:00
  - 예약된 수의사 ID: []
  - 조회된 전체 수의사 수: 3
  - 예약 가능한 수의사 수: 3
🔍 [수의사 조회] 완료 ---
```

---

### 13.4 데이터베이스 이슈 해결

#### Veterinarians 테이블 데이터 삽입 실패
**문제:**
- 마이그레이션 SQL에서 `WHERE c.name = '행복동물병원'`이 매칭 안됨
- 실제 클리닉 이름: '행복동물클리닉병원'

**해결:**
- 정확한 클리닉 이름으로 INSERT SQL 재작성 및 실행
- [insert-vets-correct-name.sql](../insert-vets-correct-name.sql) 파일 생성

**실행 SQL:**
```sql
INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT c.id, '김수의', '원장', '일반진료, 외과', true
FROM clinics c
WHERE c.name = '행복동물클리닉병원'
LIMIT 1;
-- (이진료, 박전문도 동일하게 삽입)
```

---

### 13.5 작업 요약

| 작업 | 상태 | 파일 수 | 비고 |
|------|------|---------|------|
| 수의사 선택 기능 구현 | ✅ 완료 | 5개 | DB 마이그레이션, API, UI |
| 로그아웃 이슈 수정 | ✅ 완료 | 3개 | localStorage 완전 제거 |
| 로딩 화면 무한 루프 수정 | ✅ 완료 | 1개 | State 관리 단순화 |
| 디버깅 로그 추가 | ✅ 완료 | 2개 | 수의사 API, 대시보드 |
| 데이터베이스 데이터 삽입 | ✅ 완료 | - | 수의사 3명 추가 |

**생성된 파일:**
- `supabase/migrations/20250127_add_veterinarians_table.sql`
- `src/shared/api/veterinarians.api.ts`
- `insert-vets-correct-name.sql`
- `verify-veterinarians.sql`
- `fix-veterinarians-insert.sql`

**수정된 파일:**
- `src/pages/Booking.tsx`
- `src/features/booking/components/BookingForm.tsx`
- `src/features/auth/stores/authStore.ts`
- `src/layouts/MainLayout.tsx`
- `src/shared/hooks/useLogout.ts`
- `src/pages/admin/Dashboard.tsx`

---

### 13.6 알려진 이슈 및 향후 작업

#### 미해결 이슈
- 없음 (현재까지 보고된 이슈 모두 해결)

#### 다음 단계
- [ ] Vercel 프로덕션 배포
- [ ] 수의사 관리 페이지 (관리자용)
- [ ] 수의사별 예약 통계
- [ ] 수의사 근무 시간 설정
- [ ] Phase E: AI펫닥터 연동

---

**문서 종료**

*이 문서는 AI펫닥터 병원 예약 관리 서비스의 완전한 재개발을 위한 제품 요구사항 명세서입니다.*
*React 19 + Supabase + React Compiler 1.0 기반의 최신 기술 스택을 사용하여 성능과 개발 경험을 대폭 향상시키는 것을 목표로 합니다.*
*AI 기반 스마트 진단서 연동을 통해 병원의 진료 효율성을 극대화하고, 반려동물의 건강관리를 혁신합니다.*
