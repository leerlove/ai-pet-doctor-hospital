-- ============================================================================
-- veterinarians 테이블 RLS 정책 완전 정리 및 재설정
-- ============================================================================
--
-- 현재 문제:
-- 1. 중복된 SELECT 정책 (veterinarians_select_policy + "veterinarians는 누구나 조회 가능")
-- 2. 잘못된 ALL 정책 ("관리자만 veterinarians 수정 가능")
-- 3. public role 사용 (잘못된 설정)
--
-- ============================================================================

-- 1. 먼저 모든 기존 정책 삭제 (하나씩 명시적으로)
DROP POLICY IF EXISTS "veterinarians_select_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_insert_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_update_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_delete_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians는 누구나 조회 가능" ON veterinarians;
DROP POLICY IF EXISTS "관리자만 veterinarians 수정 가능" ON veterinarians;
DROP POLICY IF EXISTS "Allow public read access on veterinarians" ON veterinarians;
DROP POLICY IF EXISTS "Allow admin insert on veterinarians" ON veterinarians;
DROP POLICY IF EXISTS "Allow admin update on veterinarians" ON veterinarians;
DROP POLICY IF EXISTS "Allow admin delete on veterinarians" ON veterinarians;

-- 2. RLS 활성화 확인
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- 3. 올바른 정책 하나씩 추가

-- 3-1. SELECT 정책: 모든 사용자가 조회 가능 (인증 여부 무관)
CREATE POLICY "Allow public read access on veterinarians"
ON veterinarians
FOR SELECT
TO public  -- public = anon + authenticated + 모든 사용자
USING (true);

-- 3-2. INSERT 정책: 관리자만 추가 가능
CREATE POLICY "Allow admin insert on veterinarians"
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

-- 3-3. UPDATE 정책: 관리자만 수정 가능
CREATE POLICY "Allow admin update on veterinarians"
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

-- 3-4. DELETE 정책: 관리자만 삭제 가능
CREATE POLICY "Allow admin delete on veterinarians"
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

-- RLS 상태 확인
SELECT
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'veterinarians';

-- 정책 목록 확인 (이제 깔끔해야 함)
SELECT
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles",
    permissive as "Permissive"
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