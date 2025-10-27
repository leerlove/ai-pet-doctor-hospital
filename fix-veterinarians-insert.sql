-- 1. 먼저 클리닉 정보 확인
SELECT id, name FROM clinics;

-- 2. 기존 수의사 데이터 삭제
DELETE FROM veterinarians;

-- 3. 첫 번째 클리닉의 ID를 사용하여 수의사 직접 삽입
-- (클리닉 이름에 관계없이 첫 번째 클리닉 사용)
WITH first_clinic AS (
  SELECT id FROM clinics LIMIT 1
)
INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
VALUES
  ((SELECT id FROM first_clinic), '김수의', '원장', '일반진료, 외과', true),
  ((SELECT id FROM first_clinic), '이진료', '수의사', '내과, 피부과', true),
  ((SELECT id FROM first_clinic), '박전문', '전문의', '정형외과, 재활', true);

-- 4. 확인
SELECT
  v.id,
  v.name,
  v.title,
  v.specialization,
  v.is_active,
  c.name AS clinic_name
FROM veterinarians v
JOIN clinics c ON c.id = v.clinic_id
ORDER BY v.name;
