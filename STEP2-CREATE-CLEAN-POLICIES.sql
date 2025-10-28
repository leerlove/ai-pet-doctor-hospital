-- ============================================================================
-- STEP 2: 깨끗한 정책 생성
-- ============================================================================

-- RLS 활성화
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- 1. SELECT 정책: 모든 사용자가 조회 가능
CREATE POLICY "public_read_veterinarians"
ON veterinarians
FOR SELECT
TO public
USING (true);

-- 2. INSERT 정책: 관리자만 추가 가능
CREATE POLICY "admin_insert_veterinarians"
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

-- 3. UPDATE 정책: 관리자만 수정 가능
CREATE POLICY "admin_update_veterinarians"
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

-- 4. DELETE 정책: 관리자만 삭제 가능
CREATE POLICY "admin_delete_veterinarians"
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

-- ============================================================================
-- 확인 쿼리
-- ============================================================================

-- 정책 목록 확인 (4개가 나와야 정상)
SELECT
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles"
FROM pg_policies
WHERE tablename = 'veterinarians'
ORDER BY cmd;

-- 데이터 조회 테스트
SELECT COUNT(*) as "Total Veterinarians" FROM veterinarians;

-- 상세 데이터 확인
SELECT
    id,
    name,
    title,
    specialization,
    is_active
FROM veterinarians
ORDER BY name;