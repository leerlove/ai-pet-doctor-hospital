-- 1. 클리닉 확인
SELECT id, name FROM clinics;

-- 2. 수의사 데이터 확인
SELECT
  v.id,
  v.name,
  v.title,
  v.specialization,
  v.is_active,
  v.clinic_id,
  c.name AS clinic_name
FROM veterinarians v
JOIN clinics c ON c.id = v.clinic_id
ORDER BY v.name;

-- 3. 수의사 수 확인
SELECT COUNT(*) as veterinarian_count FROM veterinarians WHERE is_active = true;
