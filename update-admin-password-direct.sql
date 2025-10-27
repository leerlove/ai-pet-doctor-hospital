-- admin@test.com 비밀번호 직접 변경
-- 이 방법은 Supabase의 내부 auth 스키마를 사용합니다

-- 1. 먼저 사용자 ID 확인
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE email = 'admin@test.com';

-- 2. 비밀번호 해시 직접 업데이트
-- 주의: 이 방법은 권장하지 않습니다. Dashboard를 사용하세요.
-- 비밀번호: Admin123!@#
-- bcrypt 해시를 생성해야 하므로 SQL로는 불가능합니다.

-- 가장 안전한 방법:
-- Supabase Dashboard → Authentication → Users → admin@test.com 클릭 → Password 필드에 새 비밀번호 입력 → Update User
