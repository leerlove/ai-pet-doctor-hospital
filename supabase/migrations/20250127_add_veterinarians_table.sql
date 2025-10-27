-- Create veterinarians table (수의사 테이블)
CREATE TABLE IF NOT EXISTS veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT, -- 직급 (예: 원장, 수의사, 전문의)
  specialization TEXT, -- 전문 분야
  license_number TEXT, -- 면허번호
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add veterinarian_id to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS veterinarian_id UUID REFERENCES veterinarians(id) ON DELETE SET NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_veterinarians_clinic_id ON veterinarians(clinic_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_is_active ON veterinarians(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_veterinarian_id ON bookings(veterinarian_id);

-- Add comments
COMMENT ON TABLE veterinarians IS '수의사 정보';
COMMENT ON COLUMN veterinarians.title IS '직급 (예: 원장, 수의사, 전문의)';
COMMENT ON COLUMN veterinarians.specialization IS '전문 분야';
COMMENT ON COLUMN bookings.veterinarian_id IS '담당 수의사 ID';

-- Enable RLS
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;

-- RLS Policies for veterinarians
CREATE POLICY "veterinarians는 누구나 조회 가능" ON veterinarians
  FOR SELECT USING (true);

CREATE POLICY "관리자만 veterinarians 수정 가능" ON veterinarians
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert sample data (행복동물병원 수의사들)
INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '김수의',
  '원장',
  '일반진료, 외과',
  true
FROM clinics c
WHERE c.name = '행복동물병원'
LIMIT 1;

INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '이진료',
  '수의사',
  '내과, 피부과',
  true
FROM clinics c
WHERE c.name = '행복동물병원'
LIMIT 1;

INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '박전문',
  '전문의',
  '정형외과, 재활',
  true
FROM clinics c
WHERE c.name = '행복동물병원'
LIMIT 1;
