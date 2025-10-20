-- 관리자 계정 생성 SQL
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 먼저 Supabase Auth에서 사용자를 생성해야 합니다
-- Dashboard > Authentication > Users > Invite user 또는 Add user
-- Email: admin@test.com
-- Password: Admin1234!@

-- 2. 생성된 사용자의 ID를 확인한 후, 아래 쿼리에서 USER_ID를 교체하세요
-- 또는 이메일로 자동으로 찾아서 업데이트합니다

-- 이메일로 사용자 찾아서 admin 역할 부여
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@test.com';

-- users 테이블에 레코드 삽입 또는 업데이트
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
SELECT id, email, role, full_name, created_at
FROM public.users
WHERE email = 'admin@test.com';
