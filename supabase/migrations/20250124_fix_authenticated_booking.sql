-- Fix authenticated user booking creation
-- RLS 정책 수정: 로그인 사용자도 자신의 user_id로 예약 생성 가능

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;

-- 1. INSERT 정책: 누구나 예약 생성 가능
--    - anon: user_id null로 비회원 예약
--    - authenticated: user_id가 자신의 ID이거나 null
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- anon 사용자: user_id가 null이어야 함
    (auth.role() = 'anon' AND user_id IS NULL)
    OR
    -- authenticated 사용자: user_id가 자신의 ID이거나 null
    (auth.role() = 'authenticated' AND (user_id = auth.uid() OR user_id IS NULL))
  );

-- 2. SELECT 정책: 자신의 예약 조회
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    -- 관리자는 모든 예약 조회 가능
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- 3. SELECT 정책: 비회원은 booking_number로만 조회 (추후 구현)
CREATE POLICY "Anonymous can view by booking number" ON bookings
  FOR SELECT
  TO anon
  USING (false); -- 일단 비활성화 (추후 booking_number 검증 추가)

-- 4. UPDATE 정책: 자신의 예약만 수정 가능
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. DELETE 정책: 자신의 예약만 삭제 가능
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 관리자는 모든 작업 가능
CREATE POLICY "Admins can do everything" ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- 권한 부여
GRANT INSERT, SELECT ON bookings TO anon;
GRANT ALL ON bookings TO authenticated;
