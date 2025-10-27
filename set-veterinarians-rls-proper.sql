-- veterinarians 테이블 RLS 정책 올바르게 설정
-- 보안을 유지하면서 정상 작동하도록 설정

-- 1. RLS 활성화
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "veterinarians_select_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_insert_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_update_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_delete_policy" ON veterinarians;

-- 3. SELECT: 모든 사용자 조회 가능 (인증 여부 무관)
-- 이유: 예약 시 고객도 수의사 목록을 볼 수 있어야 함
CREATE POLICY "veterinarians_select_policy"
ON veterinarians
FOR SELECT
TO authenticated, anon
USING (true);

-- 4. INSERT: 관리자만 가능
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

-- 5. UPDATE: 관리자만 가능
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
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- 6. DELETE: 관리자만 가능
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

-- 7. 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'veterinarians';

-- 8. 정책 목록 확인
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'veterinarians';

-- 9. 테스트 쿼리
SELECT COUNT(*) FROM veterinarians;
