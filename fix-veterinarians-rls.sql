-- veterinarians 테이블 RLS 정책 수정
-- 문제: RLS가 활성화되어 있지만 SELECT 정책이 없거나 잘못 설정됨

-- 1. 기존 RLS 정책 확인
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

-- 2. RLS 비활성화 (임시 확인용)
-- ALTER TABLE veterinarians DISABLE ROW LEVEL SECURITY;

-- 3. 또는 올바른 RLS 정책 생성

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "veterinarians_select_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_insert_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_update_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_delete_policy" ON veterinarians;

-- SELECT: 모든 인증된 사용자가 조회 가능
CREATE POLICY "veterinarians_select_policy"
ON veterinarians
FOR SELECT
TO authenticated, anon
USING (true);

-- INSERT: 관리자만 가능
CREATE POLICY "veterinarians_insert_policy"
ON veterinarians
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: 관리자만 가능
CREATE POLICY "veterinarians_update_policy"
ON veterinarians
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- DELETE: 관리자만 가능
CREATE POLICY "veterinarians_delete_policy"
ON veterinarians
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 4. RLS 활성화 확인
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- 5. 테스트 쿼리
SELECT * FROM veterinarians LIMIT 1;
