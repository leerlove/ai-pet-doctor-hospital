-- ============================================
-- 관리자 설정 페이지 개선을 위한 데이터베이스 마이그레이션
-- 실행 방법: Supabase Dashboard → SQL Editor에서 이 파일 전체를 복사하여 실행
-- ============================================

-- STEP 1: veterinarians 테이블 생성 (없는 경우에만)
CREATE TABLE IF NOT EXISTS veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  specialization TEXT,
  license_number TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_veterinarians_clinic_id ON veterinarians(clinic_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_is_active ON veterinarians(is_active);

-- RLS 활성화
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- RLS 정책
DROP POLICY IF EXISTS "veterinarians는 누구나 조회 가능" ON veterinarians;
CREATE POLICY "veterinarians는 누구나 조회 가능" ON veterinarians
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "관리자만 veterinarians 수정 가능" ON veterinarians;
CREATE POLICY "관리자만 veterinarians 수정 가능" ON veterinarians
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 샘플 데이터 삽입 (이미 있으면 무시)
DO $$
DECLARE
  clinic_uuid UUID;
BEGIN
  SELECT id INTO clinic_uuid FROM clinics WHERE name = '행복동물병원' LIMIT 1;

  IF clinic_uuid IS NOT NULL THEN
    INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
    VALUES
      (clinic_uuid, '김수의', '원장', '일반진료, 외과', true),
      (clinic_uuid, '이진료', '수의사', '내과, 피부과', true),
      (clinic_uuid, '박전문', '전문의', '정형외과, 재활', true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- STEP 2: veterinarian_working_hours 테이블 생성
CREATE TABLE IF NOT EXISTS veterinarian_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinarian_id UUID NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_working BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME,
  is_24h BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(veterinarian_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_vet_working_hours_vet_id ON veterinarian_working_hours(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_vet_working_hours_day ON veterinarian_working_hours(day_of_week);

ALTER TABLE veterinarian_working_hours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "veterinarian_working_hours는 누구나 조회 가능" ON veterinarian_working_hours;
CREATE POLICY "veterinarian_working_hours는 누구나 조회 가능" ON veterinarian_working_hours
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "관리자만 veterinarian_working_hours 수정 가능" ON veterinarian_working_hours;
CREATE POLICY "관리자만 veterinarian_working_hours 수정 가능" ON veterinarian_working_hours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 기본 근무 시간 삽입 (월-금 09:00-18:00, 점심 12:00-13:00)
INSERT INTO veterinarian_working_hours (veterinarian_id, day_of_week, is_working, start_time, end_time, break_start, break_end, is_24h)
SELECT
  v.id,
  day,
  CASE WHEN day BETWEEN 1 AND 5 THEN true ELSE false END,
  '09:00'::TIME,
  '18:00'::TIME,
  '12:00'::TIME,
  '13:00'::TIME,
  false
FROM veterinarians v
CROSS JOIN generate_series(0, 6) AS day
ON CONFLICT (veterinarian_id, day_of_week) DO NOTHING;

-- STEP 3: closed_dates 테이블에 veterinarian_id 추가
ALTER TABLE closed_dates
ADD COLUMN IF NOT EXISTS veterinarian_id UUID REFERENCES veterinarians(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_closed_dates_veterinarian_id ON closed_dates(veterinarian_id);

-- 기존 unique constraint 제거
ALTER TABLE closed_dates
DROP CONSTRAINT IF EXISTS closed_dates_clinic_id_date_key;

-- 새로운 unique index 생성
DROP INDEX IF EXISTS idx_closed_dates_clinic_date_vet;
CREATE UNIQUE INDEX idx_closed_dates_clinic_date_vet
ON closed_dates(clinic_id, date, COALESCE(veterinarian_id, '00000000-0000-0000-0000-000000000000'::UUID));

COMMENT ON COLUMN closed_dates.veterinarian_id IS '수의사 ID (NULL이면 클리닉 전체 휴무, 값이 있으면 해당 수의사만 휴무)';

-- STEP 4: business_hours에 24시간 영업 지원 추가
ALTER TABLE business_hours
ADD COLUMN IF NOT EXISTS is_24h BOOLEAN DEFAULT false;

COMMENT ON COLUMN business_hours.is_24h IS '24시간 영업 여부 (true면 open_time/close_time 무시)';
COMMENT ON COLUMN veterinarian_working_hours.is_24h IS '24시간 근무 여부 (true면 start_time/end_time 무시)';

-- STEP 5: bookings 테이블에 veterinarian_id 추가 (없는 경우)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS veterinarian_id UUID REFERENCES veterinarians(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_veterinarian_id ON bookings(veterinarian_id);

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ 마이그레이션이 성공적으로 완료되었습니다!';
  RAISE NOTICE '   - veterinarians 테이블 생성/확인 완료';
  RAISE NOTICE '   - veterinarian_working_hours 테이블 생성 완료 (is_24h 포함)';
  RAISE NOTICE '   - closed_dates.veterinarian_id 추가 완료';
  RAISE NOTICE '   - business_hours.is_24h 추가 완료';
  RAISE NOTICE '   - bookings.veterinarian_id 추가 완료';
  RAISE NOTICE '';
  RAISE NOTICE '이제 프론트엔드 코드를 수정할 수 있습니다.';
END $$;
