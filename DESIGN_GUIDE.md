# AI펫닥터 병원 관리 시스템 - 디자인 가이드

> **Design Concept**: Clean Booking System (Teal/Green)
> **Version**: 1.0
> **Last Updated**: 2025-10-21

## 목차
1. [디자인 철학](#디자인-철학)
2. [색상 시스템](#색상-시스템)
3. [타이포그래피](#타이포그래피)
4. [간격 및 레이아웃](#간격-및-레이아웃)
5. [컴포넌트 스타일](#컴포넌트-스타일)
6. [아이콘 시스템](#아이콘-시스템)
7. [인터랙션 및 애니메이션](#인터랙션-및-애니메이션)
8. [반응형 디자인](#반응형-디자인)
9. [접근성](#접근성)
10. [코드 예제](#코드-예제)

---

## 디자인 철학

### 핵심 가치
- **깔끔함 (Clean)**: 불필요한 요소 제거, 명확한 시각적 계층 구조
- **실용성 (Practical)**: 사용자 경험 우선, 직관적인 인터페이스
- **신뢰감 (Trust)**: 의료 서비스에 적합한 전문적인 느낌
- **친근함 (Friendly)**: 반려동물 케어의 따뜻함 표현

### 디자인 원칙
1. **일관성**: 모든 페이지와 컴포넌트에서 동일한 스타일 적용
2. **명확성**: 사용자가 무엇을 해야 하는지 명확하게 표시
3. **피드백**: 모든 인터랙션에 시각적 피드백 제공
4. **단순성**: 복잡한 기능도 단순하게 표현

---

## 색상 시스템

### Primary Colors (Teal)
```css
/* Main Brand Colors */
teal-50:  #f0fdfa  /* 배경, 미세한 강조 */
teal-100: #ccfbf1  /* 배지, 하이라이트 배경 */
teal-200: #99f6e4  /* 장식 요소 */
teal-300: #5eead4  /* 보조 강조 */
teal-400: #2dd4bf  /* hover 상태 */
teal-500: #14b8a6  /* 메인 버튼, 링크, CTA */
teal-600: #0d9488  /* hover 상태 (진한) */
teal-700: #0f766e  /* active 상태 */
teal-800: #115e59  /* 진한 텍스트 */
teal-900: #134e4a  /* 매우 진한 텍스트 */
```

### Secondary Colors (Emerald)
```css
/* Supporting Colors */
emerald-50:  #ecfdf5  /* 성공 메시지 배경 */
emerald-100: #d1fae5  /* 성공 배지 */
emerald-500: #10b981  /* 성공 상태, 완료 */
emerald-600: #059669  /* 성공 hover */
```

### Neutral Colors (Gray)
```css
/* Text & Backgrounds */
white:     #ffffff  /* 카드, 모달 배경 */
gray-50:   #f9fafb  /* 페이지 배경 */
gray-100:  #f3f4f6  /* 비활성 배경 */
gray-200:  #e5e7eb  /* 테두리, divider */
gray-300:  #d1d5db  /* 비활성 테두리 */
gray-400:  #9ca3af  /* placeholder 텍스트 */
gray-500:  #6b7280  /* 보조 텍스트 */
gray-600:  #4b5563  /* 본문 텍스트 */
gray-700:  #374151  /* 강조 텍스트 */
gray-800:  #1f2937  /* 헤딩 텍스트 */
gray-900:  #111827  /* 메인 헤딩 */
```

### Status Colors
```css
/* Booking Status */
pending:   #f59e0b (amber-500)   /* 대기 중 */
confirmed: #14b8a6 (teal-500)    /* 승인됨 */
cancelled: #6b7280 (gray-500)    /* 취소됨 */
completed: #10b981 (emerald-500) /* 완료됨 */
no-show:   #ef4444 (red-500)     /* 노쇼 */

/* Urgency Levels */
emergency: #ef4444 (red-500)     /* 응급 - 펄스 애니메이션 */
high:      #f97316 (orange-500)  /* 높음 */
medium:    #f59e0b (amber-500)   /* 보통 */
low:       #10b981 (emerald-500) /* 낮음 */
```

### Semantic Colors
```css
/* Success, Error, Warning, Info */
success:   #10b981 (emerald-500)
error:     #ef4444 (red-500)
warning:   #f59e0b (amber-500)
info:      #3b82f6 (blue-500)
```

### 색상 사용 가이드

#### Primary Action (teal-500)
- 메인 CTA 버튼
- 중요한 링크
- 활성화된 탭/메뉴
- 선택된 날짜/시간

#### Secondary Action (white + border)
- 보조 버튼
- 취소 버튼
- 덜 중요한 액션

#### Text Hierarchy
```css
/* 타이틀 */     gray-900 (font-bold)
/* 헤딩 */       gray-800 (font-semibold)
/* 본문 */       gray-700 (font-medium)
/* 보조 텍스트 */ gray-600 (font-normal)
/* 비활성 */     gray-400
```

---

## 타이포그래피

### Font Family
```css
/* 기본 폰트 스택 (TailwindCSS 기본) */
font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"
```

한글 최적화를 위해 필요시 추가:
```css
font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
```

### Font Sizes
```css
text-xs:   0.75rem (12px)  /* 캡션, 작은 라벨 */
text-sm:   0.875rem (14px) /* 보조 텍스트, 설명 */
text-base: 1rem (16px)     /* 기본 본문 */
text-lg:   1.125rem (18px) /* 강조 본문, 작은 헤딩 */
text-xl:   1.25rem (20px)  /* 섹션 헤딩 */
text-2xl:  1.5rem (24px)   /* 카드 타이틀 */
text-3xl:  1.875rem (30px) /* 페이지 서브 타이틀 */
text-4xl:  2.25rem (36px)  /* 페이지 타이틀 */
text-5xl:  3rem (48px)     /* 히어로 타이틀 */
text-6xl:  3.75rem (60px)  /* 메인 히어로 */
```

### Font Weights
```css
font-normal:    400  /* 본문, 설명 */
font-medium:    500  /* 강조 텍스트, 라벨 */
font-semibold:  600  /* 서브 헤딩, 버튼 */
font-bold:      700  /* 헤딩, 타이틀 */
font-extrabold: 800  /* 히어로 타이틀 (선택적) */
```

### Line Heights
```css
leading-tight:   1.25   /* 타이틀 */
leading-snug:    1.375  /* 헤딩 */
leading-normal:  1.5    /* 본문 */
leading-relaxed: 1.625  /* 긴 본문 */
leading-loose:   2      /* 여유로운 간격 */
```

### 타이포그래피 컴포넌트

#### Page Title (Hero)
```tsx
<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
  반려동물 건강
</h1>
```

#### Section Heading
```tsx
<h2 className="text-4xl font-bold text-gray-900 mb-4">
  왜 AI펫닥터 병원인가요?
</h2>
```

#### Card Title
```tsx
<h3 className="text-xl font-bold text-gray-900 mb-3">
  AI 1차 진단
</h3>
```

#### Body Text
```tsx
<p className="text-gray-600 leading-relaxed">
  설명 텍스트가 들어갑니다.
</p>
```

#### Small Text
```tsx
<p className="text-sm text-gray-500">
  보조 정보
</p>
```

---

## 간격 및 레이아웃

### Spacing Scale
```css
/* TailwindCSS Spacing */
0:   0px
1:   0.25rem (4px)   /* 미세한 간격 */
2:   0.5rem (8px)    /* 아이콘-텍스트 간격 */
3:   0.75rem (12px)  /* 작은 요소 간격 */
4:   1rem (16px)     /* 기본 간격 */
6:   1.5rem (24px)   /* 섹션 내부 간격 */
8:   2rem (32px)     /* 컴포넌트 간격 */
12:  3rem (48px)     /* 섹션 간격 */
16:  4rem (64px)     /* 큰 섹션 간격 */
20:  5rem (80px)     /* 메인 섹션 간격 */
```

### Container & Max Width
```tsx
/* 페이지 컨테이너 */
<div className="max-w-7xl mx-auto px-6">
  {/* 1280px max-width, 좌우 24px 패딩 */}
</div>

/* 섹션 간격 */
<section className="max-w-7xl mx-auto px-6 py-20">
  {/* 상하 80px 패딩 */}
</section>
```

### Grid Layouts
```tsx
/* 2열 그리드 (태블릿), 3열 그리드 (데스크탑) */
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* 32px 간격 */}
</div>

/* 4열 그리드 */
<div className="grid md:grid-cols-4 gap-8">
  {/* ... */}
</div>

/* 반반 나누기 */
<div className="grid lg:grid-cols-2 gap-12">
  {/* 48px 간격 */}
</div>
```

### Card Padding
```css
/* 작은 카드 */   p-6 (24px)
/* 중간 카드 */   p-8 (32px)
/* 큰 카드 */     p-12 (48px)
```

---

## 컴포넌트 스타일

### Buttons

#### Primary Button
```tsx
<button className="px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl font-medium text-lg">
  지금 예약하기
</button>
```

#### Secondary Button
```tsx
<button className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-medium text-lg">
  취소
</button>
```

#### Small Button
```tsx
<button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
  확인
</button>
```

#### Icon Button
```tsx
<button className="flex items-center space-x-2 px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors">
  <Calendar className="w-5 h-5" />
  <span>예약하기</span>
</button>
```

#### Danger Button
```tsx
<button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
  삭제
</button>
```

#### Ghost Button
```tsx
<button className="px-6 py-3 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors font-medium">
  더 보기
</button>
```

### Cards

#### Basic Card
```tsx
<div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50">
  {/* 내용 */}
</div>
```

#### Hover Card
```tsx
<div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-teal-50">
  {/* hover 시 shadow 증가 */}
</div>
```

#### Card with Header
```tsx
<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  <div className="px-8 py-6 bg-teal-50 border-b border-teal-100">
    <h3 className="text-xl font-bold text-gray-900">카드 헤더</h3>
  </div>
  <div className="p-8">
    {/* 본문 */}
  </div>
</div>
```

### Input Fields

#### Text Input
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    이름
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
    placeholder="이름을 입력하세요"
  />
</div>
```

#### Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="text"
    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
    placeholder="검색..."
  />
</div>
```

#### Error State
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none"
/>
<p className="text-sm text-red-600 mt-1">오류 메시지</p>
```

### Badges

#### Status Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
  승인됨
</span>
```

#### Urgency Badge (Emergency with Pulse)
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
  <span className="relative flex h-2 w-2 mr-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
  </span>
  응급
</span>
```

#### Badge with Dot
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
  완료
</span>
```

### Modals

#### Modal Structure
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <div className="px-8 py-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">모달 제목</h2>
    </div>

    {/* Body */}
    <div className="p-8">
      {/* 내용 */}
    </div>

    {/* Footer */}
    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
      <button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50">
        취소
      </button>
      <button className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600">
        확인
      </button>
    </div>
  </div>
</div>
```

### Tables

#### Table Structure
```tsx
<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  <table className="w-full">
    <thead className="bg-teal-50 border-b-2 border-teal-100">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
          예약 번호
        </th>
        {/* ... */}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-900">
          A2025-0001
        </td>
        {/* ... */}
      </tr>
    </tbody>
  </table>
</div>
```

### Navigation

#### Top Navigation
```tsx
<nav className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Heart className="w-8 h-8 text-teal-500" />
        <span className="text-2xl font-bold text-gray-900">
          AI펫닥터 병원
        </span>
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-4">
        <a href="#" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
          예약하기
        </a>
        {/* ... */}
      </div>
    </div>
  </div>
</nav>
```

#### Tab Navigation
```tsx
<div className="flex space-x-2 border-b border-gray-200">
  <button className="px-6 py-3 font-medium text-teal-600 border-b-2 border-teal-500">
    전체
  </button>
  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors">
    대기중
  </button>
  <button className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors">
    승인됨
  </button>
</div>
```

---

## 아이콘 시스템

### Lucide React Icons
프로젝트에서 사용하는 아이콘 라이브러리: `lucide-react`

```tsx
import {
  Calendar,      // 예약, 날짜
  Clock,         // 시간
  Stethoscope,   // 진료, 병원
  Heart,         // 로고, 좋아요
  Shield,        // 보안, 우선순위
  Sparkles,      // AI, 특별
  ArrowRight,    // 다음, 이동
  CheckCircle,   // 완료, 성공
  AlertCircle,   // 경고
  XCircle,       // 오류, 삭제
  Info,          // 정보
  Search,        // 검색
  Filter,        // 필터
  Download,      // 다운로드
  Upload,        // 업로드
  Edit,          // 수정
  Trash,         // 삭제
  Plus,          // 추가
  Minus,         // 제거
  X,             // 닫기
  ChevronRight,  // 다음 (화살표)
  ChevronLeft,   // 이전 (화살표)
  ChevronDown,   // 펼치기
  ChevronUp,     // 접기
  Menu,          // 메뉴 (햄버거)
  User,          // 사용자
  Settings,      // 설정
  LogOut,        // 로그아웃
} from 'lucide-react'
```

### 아이콘 크기
```tsx
/* 작은 아이콘 (텍스트 내부) */
<Icon className="w-4 h-4" />

/* 기본 아이콘 (버튼, 입력) */
<Icon className="w-5 h-5" />

/* 중간 아이콘 (헤더, 카드) */
<Icon className="w-6 h-6" />

/* 큰 아이콘 (장식, 강조) */
<Icon className="w-8 h-8" />

/* 아주 큰 아이콘 (히어로, 빈 상태) */
<Icon className="w-16 h-16" />
```

### 아이콘 색상
```tsx
/* Primary */
<Icon className="w-6 h-6 text-teal-500" />

/* Success */
<Icon className="w-6 h-6 text-emerald-500" />

/* Warning */
<Icon className="w-6 h-6 text-amber-500" />

/* Error */
<Icon className="w-6 h-6 text-red-500" />

/* Neutral */
<Icon className="w-6 h-6 text-gray-500" />
```

### 아이콘 배경
```tsx
/* 원형 배경 */
<div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
  <Stethoscope className="w-6 h-6 text-teal-600" />
</div>

/* 사각형 배경 (rounded) */
<div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
  <Calendar className="w-7 h-7 text-teal-600" />
</div>
```

---

## 인터랙션 및 애니메이션

### Hover Effects

#### Scale (버튼, 카드)
```tsx
<div className="hover:scale-105 transition-transform duration-200">
  {/* ... */}
</div>
```

#### Shadow (카드, 버튼)
```tsx
<div className="shadow-lg hover:shadow-xl transition-shadow duration-300">
  {/* ... */}
</div>
```

#### Color (버튼, 링크)
```tsx
<button className="bg-teal-500 hover:bg-teal-600 transition-colors duration-200">
  {/* ... */}
</button>
```

#### Opacity (이미지, 오버레이)
```tsx
<div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
  {/* ... */}
</div>
```

### Focus States

#### Input Focus
```tsx
<input className="focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all" />
```

#### Button Focus
```tsx
<button className="focus:ring-4 focus:ring-teal-200 outline-none">
  {/* ... */}
</button>
```

### Loading States

#### Spinner
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-200 border-t-teal-500"></div>
```

#### Pulse (긴급 상태)
```tsx
<span className="animate-pulse bg-red-500 rounded-full h-3 w-3"></span>
```

#### Ping (알림)
```tsx
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
</span>
```

### Skeleton Loading
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

### Transitions
```css
/* 기본 transition */
transition-all duration-200

/* Color transition */
transition-colors duration-200

/* Transform transition */
transition-transform duration-300

/* Shadow transition */
transition-shadow duration-300
```

---

## 반응형 디자인

### Breakpoints
```css
/* Mobile First */
sm:  640px   /* 작은 태블릿 */
md:  768px   /* 태블릿 */
lg:  1024px  /* 데스크탑 */
xl:  1280px  /* 큰 데스크탑 */
2xl: 1536px  /* 매우 큰 화면 */
```

### 반응형 패턴

#### Grid Columns
```tsx
/* 모바일: 1열, 태블릿: 2열, 데스크탑: 3열 */
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* ... */}
</div>
```

#### Text Size
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
  반응형 타이틀
</h1>
```

#### Padding/Margin
```tsx
<section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
  {/* 화면 크기에 따라 패딩 증가 */}
</section>
```

#### Hide/Show
```tsx
/* 모바일에서 숨김 */
<div className="hidden md:block">
  {/* 태블릿 이상에서만 표시 */}
</div>

/* 데스크탑에서 숨김 */
<div className="md:hidden">
  {/* 모바일에서만 표시 */}
</div>
```

#### Flex Direction
```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* 모바일: 세로, 태블릿 이상: 가로 */}
</div>
```

---

## 접근성

### ARIA Labels
```tsx
<button aria-label="예약 삭제">
  <Trash className="w-5 h-5" />
</button>
```

### Focus Visible
```tsx
<button className="focus-visible:ring-4 focus-visible:ring-teal-200 outline-none">
  {/* 키보드 포커스 시에만 링 표시 */}
</button>
```

### Color Contrast
- 본문 텍스트: 최소 4.5:1 (WCAG AA)
- 큰 텍스트: 최소 3:1
- teal-500 (#14b8a6) on white: 3.7:1 (큰 텍스트 OK)
- gray-700 (#374151) on white: 10.7:1 (모든 텍스트 OK)

### Semantic HTML
```tsx
/* 올바른 사용 */
<button onClick={handleClick}>클릭</button>
<a href="/page">링크</a>

/* 잘못된 사용 (피하기) */
<div onClick={handleClick}>클릭</div>
```

---

## 코드 예제

### 전체 페이지 구조
```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Nav content */}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            페이지 타이틀
          </h1>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cards */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  )
}
```

### 예약 카드 예제
```tsx
function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-teal-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{booking.booking_number}</h3>
            <p className="text-sm text-gray-500">{booking.customer_name}</p>
          </div>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
          {booking.status}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{booking.booking_date} {booking.booking_time}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Stethoscope className="w-4 h-4" />
          <span className="text-sm">{booking.service_name}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex space-x-3">
        <button className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors font-medium">
          상세보기
        </button>
        <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Edit className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
```

### 폼 예제
```tsx
function BookingForm() {
  return (
    <form className="space-y-6">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          고객 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
          placeholder="이름을 입력하세요"
        />
      </div>

      {/* Pet Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          반려동물 이름 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
            placeholder="반려동물 이름"
          />
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          예약 날짜 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
        />
      </div>

      {/* Submit */}
      <div className="flex space-x-4">
        <button
          type="button"
          className="flex-1 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-200 font-medium"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          예약하기
        </button>
      </div>
    </form>
  )
}
```

### 통계 카드 예제
```tsx
function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-teal-50">
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-teal-600" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-emerald-600">
            +{trend}%
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  )
}

// Usage
<StatsCard
  title="총 예약"
  value="248"
  icon={Calendar}
  trend={12}
/>
```

---

## 배경 패턴

### Gradient Background
```tsx
/* 메인 배경 */
<div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
  {/* ... */}
</div>

/* CTA 섹션 배경 */
<div className="bg-gradient-to-r from-teal-500 to-emerald-500">
  {/* ... */}
</div>
```

### Decorative Blurs
```tsx
/* 장식 요소 */
<div className="relative">
  {/* 메인 콘텐츠 */}
  <div className="relative z-10">
    {/* ... */}
  </div>

  {/* 블러 원형 */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-200 rounded-full blur-2xl opacity-50"></div>
  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-50"></div>
</div>
```

---

## 다크 모드 (선택적)

현재는 라이트 모드만 지원하지만, 향후 다크 모드 지원 시:

```tsx
/* TailwindCSS dark: prefix 사용 */
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* ... */}
</div>
```

다크 모드 색상 팔레트:
- Background: gray-900, gray-800
- Cards: gray-800, gray-700
- Text: white, gray-100, gray-300
- Primary: teal-400 (밝게 조정)
- Border: gray-700

---

## 체크리스트

새로운 페이지나 컴포넌트를 만들 때 확인:

- [ ] Teal/Green 색상 스킴 사용
- [ ] rounded-xl 또는 rounded-2xl 적용
- [ ] shadow-lg 카드 스타일
- [ ] hover 효과 추가 (shadow-xl, bg 변경)
- [ ] transition-all 또는 specific transition 적용
- [ ] 적절한 간격 (p-8, space-y-6 등)
- [ ] Lucide React 아이콘 사용
- [ ] 반응형 클래스 적용 (md:, lg:)
- [ ] 접근성 고려 (aria-label, focus states)
- [ ] 타이포그래피 계층 구조 준수

---

## 참고 파일

프로젝트 내 참고할 파일들:

1. **[src/pages/Home.tsx](src/pages/Home.tsx)** - 메인 페이지 (전체 구조 참고)
2. **[src/pages/design-concepts/Concept6_CleanBooking.tsx](src/pages/design-concepts/Concept6_CleanBooking.tsx)** - 예약 UI 참고
3. **[src/shared/components/Button.tsx](src/shared/components/Button.tsx)** - 버튼 컴포넌트
4. **[src/shared/components/Card.tsx](src/shared/components/Card.tsx)** - 카드 컴포넌트
5. **[src/shared/components/Badge.tsx](src/shared/components/Badge.tsx)** - 배지 컴포넌트
6. **[tailwind.config.js](tailwind.config.js)** - TailwindCSS 설정

---

## 버전 히스토리

- **v1.0** (2025-10-21): 초기 디자인 가이드 작성 (Clean Booking 컨셉 기반)

---

**문의**: 디자인 가이드 관련 질문이나 개선 사항은 팀에 공유해주세요.
