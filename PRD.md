# PRD.md

Product Requirements Document - AI펫닥터 대학동물병원

## 제품 개요

**AI펫닥터 대학동물병원**은 AI 기반 1차 진단과 연계된 스마트 예약 시스템입니다.

### 핵심 가치
- AI 진단 연계 예약으로 효율적인 진료
- 대학병원 수준의 전문 의료 서비스
- 24시간 응급 진료 지원

## 타겟 사용자

### Primary: 반려동물 보호자
- 반려동물 건강 관리에 관심 있는 보호자
- 온라인 예약 및 AI 진단에 익숙한 사용자

### Secondary: 병원 관리자
- 예약 관리 및 스케줄 최적화 필요
- 의료진 일정 관리

## 핵심 기능

### 1. 예약 시스템
- 3단계 예약 프로세스 (날짜 → 시간 → 정보)
- 당일 예약 가능
- 비회원 예약 지원
- 예약 상세/수정/취소

### 2. 의료진 관리
- 수의사별 영업시간 설정
- 수의사별 휴무일 관리
- 전문분야 표시

### 3. 관리자 대시보드
- 예약 통계 및 차트
- 실시간 예약 현황
- 서비스 관리

### 4. AI 연동 (Phase E)
- AI 진단서 연동
- 스마트 예약 요청
- 긴급도 기반 우선순위

## 페이지 구성

| 페이지 | 설명 | 접근 권한 |
|--------|------|----------|
| 홈 | 병원 소개, CTA | Public |
| 진료안내 | 의료진 목록/상세 | Public |
| 예약 | 예약 프로세스 | Public |
| 내 예약 | 예약 내역 | Auth |
| 관리자 | 대시보드, 설정 | Admin |

## 디자인 시스템

**Stitch Veterinary** 디자인 적용
- 전문적이고 신뢰감 있는 의료 UI
- Material Symbols 아이콘
- 반응형 레이아웃

**Color Palette**:
- Primary: Teal (#2d6a7b)
- Accent: Sage Green (#A3D9B5)
- Alert: Red (#ef4444)
- Dark: (#22262a)

## 기술 요구사항

### Frontend
- React 19 + Vite
- TypeScript strict mode
- TailwindCSS

### Backend
- Supabase (PostgreSQL)
- Supabase Auth (JWT)
- RLS 정책 적용

### 배포
- Vercel (Frontend)
- Supabase Cloud (Backend)

## 로드맵

### Phase A-D (완료)
- ✅ Supabase 설정
- ✅ 인증 시스템
- ✅ 예약 시스템
- ✅ 관리자 기능
- ✅ Stitch 디자인

### Phase E (예정)
- ⏳ AI 진단서 연동
- ⏳ Webhook 통합
- ⏳ 실시간 알림

## 성공 지표

- 예약 전환율: 목표 30%+
- 페이지 로드 시간: < 3초
- 모바일 사용률: 60%+

---
**Version**: 2.0 | **Updated**: 2025-01-15
