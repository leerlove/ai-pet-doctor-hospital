-- 회원가입 시 users 테이블에 프로필 자동 생성
-- Supabase Auth의 auth.users 테이블에 사용자가 추가되면
-- public.users 테이블에도 자동으로 프로필을 생성

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- 이미 존재하는 경우 무시
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 기존 사용자들에 대해서도 프로필 생성 (없는 경우만)
INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT
  au.id,
  au.email,
  'customer',
  au.raw_user_meta_data->>'full_name',
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
