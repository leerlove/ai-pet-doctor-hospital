-- Create veterinarian_working_hours table (수의사 근무 시간 테이블)
CREATE TABLE IF NOT EXISTS veterinarian_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veterinarian_id UUID NOT NULL REFERENCES veterinarians(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0: 일요일, 6: 토요일
  is_working BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(veterinarian_id, day_of_week)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_vet_working_hours_vet_id ON veterinarian_working_hours(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_vet_working_hours_day ON veterinarian_working_hours(day_of_week);

-- Add comments
COMMENT ON TABLE veterinarian_working_hours IS '수의사 근무 시간';
COMMENT ON COLUMN veterinarian_working_hours.day_of_week IS '요일 (0: 일요일, 6: 토요일)';
COMMENT ON COLUMN veterinarian_working_hours.is_working IS '근무 여부';

-- Enable RLS
ALTER TABLE veterinarian_working_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "veterinarian_working_hours는 누구나 조회 가능" ON veterinarian_working_hours
  FOR SELECT USING (true);

CREATE POLICY "관리자만 veterinarian_working_hours 수정 가능" ON veterinarian_working_hours
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default working hours for existing veterinarians (월-금 09:00-18:00, 점심 12:00-13:00)
INSERT INTO veterinarian_working_hours (veterinarian_id, day_of_week, is_working, start_time, end_time, break_start, break_end)
SELECT
  v.id,
  day,
  CASE WHEN day BETWEEN 1 AND 5 THEN true ELSE false END, -- 월-금만 근무
  '09:00'::TIME,
  '18:00'::TIME,
  '12:00'::TIME,
  '13:00'::TIME
FROM veterinarians v
CROSS JOIN generate_series(0, 6) AS day
ON CONFLICT (veterinarian_id, day_of_week) DO NOTHING;
