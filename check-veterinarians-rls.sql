-- veterinarians 테이블의 RLS 정책 확인

-- 1. RLS가 활성화되어 있는지 확인
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'veterinarians';

-- 2. veterinarians 테이블의 모든 정책 확인
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'veterinarians';

-- 3. 현재 사용자 권한 확인
SELECT current_user, current_role;

-- 4. 실제 데이터 조회 테스트 (RLS 적용됨)
SELECT * FROM veterinarians;

-- 5. RLS 우회 조회 (관리자만 가능)
-- SET ROLE postgres;
-- SELECT * FROM veterinarians;
