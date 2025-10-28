-- Add is_24h column to business_hours and veterinarian_working_hours tables
-- 24시간 영업 여부를 표시하는 컬럼 추가

-- business_hours 테이블에 추가
ALTER TABLE business_hours
ADD COLUMN IF NOT EXISTS is_24h BOOLEAN DEFAULT false;

-- veterinarian_working_hours 테이블에 추가
ALTER TABLE veterinarian_working_hours
ADD COLUMN IF NOT EXISTS is_24h BOOLEAN DEFAULT false;

-- Add comments
COMMENT ON COLUMN business_hours.is_24h IS '24시간 영업 여부';
COMMENT ON COLUMN veterinarian_working_hours.is_24h IS '24시간 근무 여부';

-- Update logic: is_24h가 true면 open_time/close_time은 무시
-- 기존 데이터는 false로 유지 (기본값)
