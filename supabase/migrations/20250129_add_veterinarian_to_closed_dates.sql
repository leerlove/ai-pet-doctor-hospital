-- Add veterinarian_id to closed_dates table
-- 휴무일을 수의사별로 관리할 수 있도록 veterinarian_id 추가

ALTER TABLE closed_dates
ADD COLUMN IF NOT EXISTS veterinarian_id UUID REFERENCES veterinarians(id) ON DELETE CASCADE;

-- Add index for veterinarian_id
CREATE INDEX IF NOT EXISTS idx_closed_dates_veterinarian_id ON closed_dates(veterinarian_id);

-- Modify unique constraint to include veterinarian_id
-- 기존: clinic_id + date만 unique
-- 변경: clinic_id + date + veterinarian_id unique (NULL 허용)
ALTER TABLE closed_dates
DROP CONSTRAINT IF EXISTS closed_dates_clinic_id_date_key;

-- veterinarian_id가 NULL인 경우 (클리닉 전체 휴무)
-- veterinarian_id가 있는 경우 (수의사 개인 휴무)
CREATE UNIQUE INDEX IF NOT EXISTS idx_closed_dates_clinic_date_vet ON closed_dates(clinic_id, date, COALESCE(veterinarian_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- Add comment
COMMENT ON COLUMN closed_dates.veterinarian_id IS '수의사 ID (NULL이면 클리닉 전체 휴무, 값이 있으면 해당 수의사만 휴무)';
