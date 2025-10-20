# 관리자 계정 생성 가이드

## 방법 1: Supabase Dashboard 사용 (권장)

### Step 1: 사용자 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. **Authentication** > **Users** 메뉴로 이동
4. **Add user** 버튼 클릭
5. 다음 정보 입력:
   - **Email**: `admin@test.com`
   - **Password**: `Admin1234!@`
   - **Auto Confirm User**: ✅ 체크 (이메일 확인 없이 바로 로그인 가능)

### Step 2: Admin 역할 부여
1. **SQL Editor** 메뉴로 이동
2. 새 쿼리 생성
3. 다음 SQL 실행:

```sql
-- Admin 역할 부여
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@test.com';

-- users 테이블에 레코드 생성
INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT
  id,
  email,
  'admin' as role,
  '관리자' as full_name,
  now() as created_at,
  now() as updated_at
FROM auth.users
WHERE email = 'admin@test.com'
ON CONFLICT (id)
DO UPDATE SET
  role = 'admin',
  full_name = '관리자',
  updated_at = now();

-- 결과 확인
SELECT id, email, role, full_name
FROM public.users
WHERE email = 'admin@test.com';
```

### Step 3: 로그인 테스트
1. http://localhost:5174/login 접속
2. 다음 정보로 로그인:
   - **Email**: `admin@test.com`
   - **Password**: `Admin1234!@`
3. 로그인 성공 후 `/admin/dashboard`로 자동 리디렉션

---

## 방법 2: 이메일 확인 비활성화 (개발 환경)

개발 환경에서 이메일 확인을 비활성화하려면:

1. **Supabase Dashboard** > **Authentication** > **Settings**
2. **Email Auth** 섹션에서:
   - **Enable email confirmations**: ❌ 비활성화
   - **Enable email change confirmations**: ❌ 비활성화

이렇게 하면 이메일 확인 없이 바로 회원가입 및 로그인 가능합니다.

---

## 방법 3: 직접 회원가입 후 SQL로 Admin 승격

1. http://localhost:5174/signup 에서 회원가입
   - Email: 원하는 이메일
   - Password: 원하는 비밀번호

2. Supabase Dashboard > SQL Editor에서 실행:

```sql
-- 이메일을 본인이 가입한 이메일로 변경
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

3. 로그아웃 후 다시 로그인하면 관리자 권한 적용됨

---

## 테스트 데이터 생성

관리자 계정 생성 후, 테스트 예약 데이터를 생성하려면:

```bash
node scripts/create-test-data.js
```

이 스크립트는 5개의 테스트 예약을 생성합니다:
- 대기중 1개
- 승인됨 2개
- 완료 1개
- 취소됨 1개

---

## 로그인 정보

### 관리자 계정
- **Email**: `admin@test.com`
- **Password**: `Admin1234!@`
- **권한**: Admin (전체 관리)
- **접근 가능**:
  - `/admin/dashboard` - 대시보드
  - `/admin/bookings` - 예약 관리
  - `/admin/settings` - 설정

### 일반 사용자 계정
직접 회원가입하거나 Supabase Dashboard에서 생성
- **권한**: Customer (일반 사용자)
- **접근 가능**:
  - `/my-bookings` - 내 예약
  - `/booking` - 예약하기

---

## 문제 해결

### "Email address is invalid" 오류
- Supabase 프로젝트 설정에서 **Email confirmations**가 활성화되어 있을 수 있습니다
- **방법 1**을 사용하여 Dashboard에서 직접 생성하고 "Auto Confirm User"를 체크하세요

### 로그인 후 관리자 페이지 접근 불가
```sql
-- users 테이블에서 역할 확인
SELECT id, email, role FROM public.users WHERE email = 'your-email@example.com';

-- 역할이 'customer'로 되어 있다면:
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### RLS 정책 오류
```sql
-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'users';

-- is_admin() 함수 확인
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'is_admin';
```

---

## 보안 주의사항

⚠️ **프로덕션 환경에서는**:
- 강력한 비밀번호 사용 (최소 12자, 대소문자, 숫자, 특수문자 포함)
- 이메일 확인 활성화
- 2단계 인증 고려
- 관리자 이메일은 실제 사용 가능한 이메일로 설정
- 환경 변수로 관리자 정보 관리

---

**마지막 업데이트**: 2025-10-21
