-- AI펫닥터 병원 예약 관리 시스템 - 초기 스키마
-- Generated: 2025-01-20

-- Enable UUID extension (use gen_random_uuid() instead of uuid_generate_v4())
-- Supabase uses pgcrypto by default
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS TABLE (Extends Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 2. CLINICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  phone_1 TEXT,
  phone_2 TEXT,
  email TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinics indexes
CREATE INDEX idx_clinics_is_active ON clinics(is_active);

-- ============================================================================
-- 3. SERVICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services indexes
CREATE INDEX idx_services_clinic_id ON services(clinic_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- ============================================================================
-- 4. PETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,
  age INTEGER,
  weight NUMERIC(6, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets indexes
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_species ON pets(species);

-- ============================================================================
-- 5. BOOKINGS TABLE (핵심 테이블)
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,

  -- Relations
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,

  -- Booking details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')) DEFAULT 'pending',

  -- Customer info (for non-members)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- Pet info (for non-members)
  pet_name TEXT NOT NULL,
  pet_species TEXT NOT NULL,
  pet_breed TEXT,
  pet_age INTEGER,

  -- Additional info
  symptoms TEXT,
  admin_notes TEXT,

  -- AI펫닥터 연동 필드 ⭐
  source TEXT NOT NULL CHECK (source IN ('direct', 'ai_pet_doctor')) DEFAULT 'direct',
  ai_pet_doctor_request_id TEXT UNIQUE,
  ai_pet_doctor_user_id TEXT,
  ai_pet_doctor_pet_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings indexes
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX idx_bookings_clinic_id ON bookings(clinic_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_source ON bookings(source);
CREATE INDEX idx_bookings_ai_request_id ON bookings(ai_pet_doctor_request_id);

-- ============================================================================
-- 6. SMART_DIAGNOSES TABLE (AI 진단서) ⭐
-- ============================================================================
CREATE TABLE IF NOT EXISTS smart_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id TEXT UNIQUE NOT NULL,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',

  -- 1. 보호자 문의
  symptoms JSONB,
  duration TEXT,
  severity INTEGER CHECK (severity BETWEEN 1 AND 10),
  additional_notes TEXT,

  -- 2. AI 진단
  suspected_conditions JSONB,
  confidence NUMERIC(3, 2) CHECK (confidence BETWEEN 0 AND 1),
  hospital_visit_required BOOLEAN DEFAULT false,
  recommended_tests JSONB,
  ai_recommendations TEXT,

  -- 3. 펫 히스토리
  past_visits JSONB,
  allergies JSONB,
  current_medications JSONB,
  vaccinations JSONB,
  chronic_conditions JSONB,
  special_notes TEXT,

  diagnosis_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart diagnoses indexes
CREATE INDEX idx_smart_diagnoses_booking_id ON smart_diagnoses(booking_id);
CREATE INDEX idx_smart_diagnoses_diagnosis_id ON smart_diagnoses(diagnosis_id);
CREATE INDEX idx_smart_diagnoses_urgency ON smart_diagnoses(urgency);

-- ============================================================================
-- 7. BOOKING_RESPONSES TABLE (병원 응답) ⭐
-- ============================================================================
CREATE TABLE IF NOT EXISTS booking_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('confirmed', 'modified', 'rejected')),

  -- 수정 제안 시
  suggested_dates JSONB,
  modification_reason TEXT,

  -- 거절 시
  rejection_reason TEXT,
  alternative_clinics JSONB,

  -- 공통
  hospital_message TEXT,

  -- Webhook 전송 정보
  webhook_sent BOOLEAN DEFAULT false,
  webhook_sent_at TIMESTAMPTZ,
  webhook_response TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Booking responses indexes
CREATE INDEX idx_booking_responses_booking_id ON booking_responses(booking_id);
CREATE INDEX idx_booking_responses_response_type ON booking_responses(response_type);

-- ============================================================================
-- 8. BUSINESS_HOURS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_open BOOLEAN DEFAULT true,
  open_time TIME,
  close_time TIME,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, day_of_week)
);

-- Business hours indexes
CREATE INDEX idx_business_hours_clinic_id ON business_hours(clinic_id);

-- ============================================================================
-- 9. CLOSED_DATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS closed_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clinic_id, date)
);

-- Closed dates indexes
CREATE INDEX idx_closed_dates_clinic_id ON closed_dates(clinic_id);
CREATE INDEX idx_closed_dates_date ON closed_dates(date);

-- ============================================================================
-- 10. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_diagnoses_updated_at BEFORE UPDATE ON smart_diagnoses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  year_month TEXT;
  next_seq INTEGER;
BEGIN
  -- Format: A2025-0001
  year_month := 'A' || TO_CHAR(NOW(), 'YYYY');

  -- Get next sequence number for this year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(booking_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM bookings
  WHERE booking_number LIKE year_month || '-%';

  NEW.booking_number := year_month || '-' || LPAD(next_seq::TEXT, 4, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply booking number trigger
CREATE TRIGGER generate_bookings_number BEFORE INSERT ON bookings FOR EACH ROW WHEN (NEW.booking_number IS NULL) EXECUTE FUNCTION generate_booking_number();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE closed_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Clinics policies (public read)
CREATE POLICY "Anyone can view active clinics" ON clinics FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage clinics" ON clinics FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Services policies (public read)
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Pets policies
CREATE POLICY "Users can view own pets" ON pets FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own pets" ON pets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all pets" ON pets FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Smart diagnoses policies
CREATE POLICY "Users can view own diagnoses" ON smart_diagnoses FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = smart_diagnoses.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Admins can view all diagnoses" ON smart_diagnoses FOR SELECT USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage diagnoses" ON smart_diagnoses FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Booking responses policies
CREATE POLICY "Admins can manage booking responses" ON booking_responses FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Business hours policies (public read)
CREATE POLICY "Anyone can view business hours" ON business_hours FOR SELECT USING (true);
CREATE POLICY "Admins can manage business hours" ON business_hours FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Closed dates policies (public read)
CREATE POLICY "Anyone can view closed dates" ON closed_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage closed dates" ON closed_dates FOR ALL USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON notifications FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- SEED DATA (초기 테스트 데이터)
-- ============================================================================

-- Insert default clinic
INSERT INTO clinics (name, description, address, phone_1, email)
VALUES (
  '행복동물병원',
  'AI펫닥터와 연동된 스마트 동물병원입니다.',
  '서울특별시 강남구 테헤란로 123',
  '02-1234-5678',
  'info@happyvet.com'
) ON CONFLICT DO NOTHING;

-- Insert default services
INSERT INTO services (clinic_id, name, description, duration_minutes, price)
SELECT
  id,
  service_name,
  service_desc,
  duration,
  service_price
FROM clinics, (VALUES
  ('일반 진료', '기본적인 건강 검진 및 진료', 30, 30000),
  ('예방 접종', '각종 백신 접종 서비스', 20, 25000),
  ('응급 진료', '24시간 응급 진료 서비스', 60, 80000),
  ('건강 검진', '종합 건강 검진 (혈액검사 포함)', 90, 120000),
  ('치과 진료', '스케일링 및 치과 치료', 60, 100000),
  ('수술', '각종 수술 (중성화, 종양 제거 등)', 120, 300000)
) AS services(service_name, service_desc, duration, service_price)
WHERE clinics.name = '행복동물병원'
ON CONFLICT DO NOTHING;

-- Insert business hours (Monday to Friday: 09:00-18:00, Break: 12:00-13:00)
INSERT INTO business_hours (clinic_id, day_of_week, is_open, open_time, close_time, break_start, break_end)
SELECT
  id,
  day,
  CASE WHEN day BETWEEN 1 AND 5 THEN true ELSE false END,
  CASE WHEN day BETWEEN 1 AND 5 THEN '09:00:00'::TIME ELSE NULL END,
  CASE WHEN day BETWEEN 1 AND 5 THEN '18:00:00'::TIME ELSE NULL END,
  CASE WHEN day BETWEEN 1 AND 5 THEN '12:00:00'::TIME ELSE NULL END,
  CASE WHEN day BETWEEN 1 AND 5 THEN '13:00:00'::TIME ELSE NULL END
FROM clinics, generate_series(0, 6) AS day
WHERE clinics.name = '행복동물병원'
ON CONFLICT DO NOTHING;

-- Migration completed
COMMENT ON TABLE bookings IS 'AI펫닥터 병원 예약 관리 시스템 - 예약 테이블';
COMMENT ON TABLE smart_diagnoses IS 'AI 진단서 정보';
COMMENT ON TABLE booking_responses IS '병원의 예약 응답 (승인/수정/거절)';
