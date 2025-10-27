-- 비회원 예약 막기: authenticated 사용자만 예약 가능
-- RLS 정책 간소화

-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- 새로운 INSERT 정책: 로그인 사용자만 자신의 ID로 예약 생성
CREATE POLICY "Authenticated users can create own bookings" ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 권한 정리
REVOKE INSERT ON bookings FROM anon;
REVOKE SELECT ON bookings FROM anon;
