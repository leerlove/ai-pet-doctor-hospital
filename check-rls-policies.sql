-- 현재 bookings 테이블의 RLS 정책 확인

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
WHERE tablename = 'bookings'
ORDER BY policyname;

-- 권한 확인
SELECT
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'bookings'
ORDER BY grantee, privilege_type;
