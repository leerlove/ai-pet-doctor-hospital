-- 기존 수의사 데이터 삭제
DELETE FROM veterinarians;

-- 행복동물클리닉병원 수의사 3명 추가 (정확한 이름 사용)
INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '김수의',
  '원장',
  '일반진료, 외과',
  true
FROM clinics c
WHERE c.name = '행복동물클리닉병원'
LIMIT 1;

INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '이진료',
  '수의사',
  '내과, 피부과',
  true
FROM clinics c
WHERE c.name = '행복동물클리닉병원'
LIMIT 1;

INSERT INTO veterinarians (clinic_id, name, title, specialization, is_active)
SELECT
  c.id,
  '박전문',
  '전문의',
  '정형외과, 재활',
  true
FROM clinics c
WHERE c.name = '행복동물클리닉병원'
LIMIT 1;

-- 확인
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
