-- admin@inervet.com 계정을 관리자로 변경

-- 1. 먼저 해당 사용자가 users 테이블에 존재하는지 확인
SELECT id, email, role, full_name
FROM users
WHERE email = 'admin@inervet.com';

-- 2. admin@inervet.com의 role을 'admin'으로 변경
UPDATE users
SET role = 'admin'
WHERE email = 'admin@inervet.com';

-- 3. 변경 결과 확인
SELECT id, email, role, full_name, created_at
FROM users
WHERE email = 'admin@inervet.com';
