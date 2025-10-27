-- ============================================================================
-- veterinarians 테이블 RLS 정책 수정 (보안 유지 + 정상 작동)
-- ============================================================================
--
-- 문제: RLS가 활성화되어 있지만 SELECT 정책이 없어서 데이터 조회 차단
-- 해결: 모든 사용자(인증 여부 무관)가 조회할 수 있도록 SELECT 정책 추가
--
-- ============================================================================

-- 1. RLS 활성화 (이미 활성화되어 있을 수 있음)
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- 2. 기존 정책 삭제 (충돌 방지)
DROP POLICY IF EXISTS "veterinarians_select_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_insert_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_update_policy" ON veterinarians;
DROP POLICY IF EXISTS "veterinarians_delete_policy" ON veterinarians;

-- 3. SELECT 정책: 모든 사용자 조회 가능 (인증 여부 무관)
-- 이유: 예약 시 고객도 수의사 목록을 볼 수 있어야 함
CREATE POLICY "veterinarians_select_policy"
ON veterinarians
FOR SELECT
TO authenticated, anon
USING (true);

-- 4. INSERT 정책: 관리자만 가능
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

-- 5. UPDATE 정책: 관리자만 가능
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

-- 6. DELETE 정책: 관리자만 가능
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

-- ============================================================================
-- 확인 쿼리
-- ============================================================================

-- RLS 상태 확인
SELECT
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'veterinarians';

-- 정책 목록 확인
SELECT
  policyname as "Policy Name",
  cmd as "Command",
  roles as "Roles"
FROM pg_policies
WHERE tablename = 'veterinarians'
ORDER BY cmd;

-- 데이터 조회 테스트 (이제 정상 작동해야 함)
SELECT
  id,
  name,
  title,
  specialization,
  is_active
FROM veterinarians
ORDER BY name;

-- 수의사 수 확인
SELECT COUNT(*) as "Total Veterinarians" FROM veterinarians;
