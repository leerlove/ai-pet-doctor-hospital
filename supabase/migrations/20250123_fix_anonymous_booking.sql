-- Fix anonymous booking creation
-- RLS 정책 수정: 익명 사용자도 예약 생성 가능하도록

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- 새로운 정책: 익명(anon) 역할도 INSERT 가능
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- anon 역할에 bookings 테이블 INSERT 권한 부여
GRANT INSERT ON bookings TO anon;
GRANT SELECT ON bookings TO anon;
