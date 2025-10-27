-- Direct SQL execution to fix RLS for anonymous users

-- Clinics 정책 수정
DROP POLICY IF EXISTS "Anyone can view active clinics" ON clinics;

CREATE POLICY "Anyone can view active clinics" ON clinics
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

-- Services 정책 수정
DROP POLICY IF EXISTS "Anyone can view active services" ON services;

CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

-- anon 역할에 SELECT 권한 부여
GRANT SELECT ON clinics TO anon;
GRANT SELECT ON services TO anon;
GRANT SELECT ON business_hours TO anon;
GRANT SELECT ON closed_dates TO anon;
