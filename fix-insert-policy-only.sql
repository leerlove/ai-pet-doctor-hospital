-- 최소한의 수정: INSERT 정책만 수정
-- 기존 다른 정책들은 건드리지 않음

-- 1. 기존 INSERT 정책만 삭제
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- 2. 새로운 INSERT 정책 생성
--    - anon: user_id null로 비회원 예약
--    - authenticated: user_id가 자신의 ID만 허용 (null 불가)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- anon 사용자: user_id가 null이어야 함
    (auth.role() = 'anon' AND user_id IS NULL)
    OR
    -- authenticated 사용자: user_id가 자신의 ID여야 함
    (auth.role() = 'authenticated' AND user_id = auth.uid())
  );

-- 3. 권한 확인 (이미 있으면 무시됨)
DO $$
BEGIN
  -- anon 권한
  GRANT INSERT ON bookings TO anon;
  GRANT SELECT ON bookings TO anon;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  -- authenticated 권한
  GRANT ALL ON bookings TO authenticated;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
