-- veterinarians 테이블 RLS 비활성화 (임시 테스트용)
-- 이렇게 하면 쿼리가 즉시 성공할 것입니다.

ALTER TABLE veterinarians DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'veterinarians';

-- 테스트
SELECT COUNT(*) FROM veterinarians;
