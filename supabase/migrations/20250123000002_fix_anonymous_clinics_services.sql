-- Fix anonymous access to clinics and services
-- 익명 사용자도 클리닉과 서비스 정보를 조회할 수 있도록

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

-- business_hours와 closed_dates도 anon이 조회 가능하도록
GRANT SELECT ON business_hours TO anon;
GRANT SELECT ON closed_dates TO anon;
