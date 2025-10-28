-- ============================================================================
-- STEP 1: 모든 기존 정책 삭제
-- ============================================================================

-- 모든 정책을 하나씩 삭제
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

-- 현재 남은 정책 확인
SELECT
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles"
FROM pg_policies
WHERE tablename = 'veterinarians'
ORDER BY cmd;

-- 결과가 비어있어야 정상입니다!