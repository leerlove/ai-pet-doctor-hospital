-- admin@test.com 비밀번호 재설정
-- 새 비밀번호: Admin123!@#

-- 방법 1: Supabase Auth API 사용 (권장)
-- Dashboard → Authentication → Users → admin@test.com → Reset Password

-- 방법 2: SQL로 직접 변경 (비밀번호 해시 생성 필요)
-- 주의: 이 방법은 Supabase의 auth 스키마에 직접 접근하므로 권장하지 않습니다.

-- 방법 3: 비밀번호 재설정 이메일 발송
-- Supabase Dashboard에서:
-- 1. Authentication → Users
-- 2. admin@test.com 찾기
-- 3. "..." 메뉴 클릭
-- 4. "Send Password Reset Email" 클릭

-- 가장 안전한 방법: Dashboard에서 직접 변경
-- 1. Supabase Dashboard → Authentication → Users
-- 2. admin@test.com 행 클릭
-- 3. "Reset Password" 섹션에서 새 비밀번호 입력
-- 4. "Update User" 클릭

-- 또는 아래 방법으로 임시 비밀번호 설정 후 변경 요청
SELECT auth.update_user(
  (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
  jsonb_build_object('password', 'Admin123!@#')
);
