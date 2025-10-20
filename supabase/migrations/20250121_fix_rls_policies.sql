-- Fix RLS policies - 무한 재귀 문제 해결
-- Generated: 2025-01-21

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Anyone can view active clinics" ON clinics;
DROP POLICY IF EXISTS "Admins can manage clinics" ON clinics;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Users can view own pets" ON pets;
DROP POLICY IF EXISTS "Users can manage own pets" ON pets;
DROP POLICY IF EXISTS "Admins can view all pets" ON pets;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own diagnoses" ON smart_diagnoses;
DROP POLICY IF EXISTS "Admins can view all diagnoses" ON smart_diagnoses;
DROP POLICY IF EXISTS "Admins can manage diagnoses" ON smart_diagnoses;
DROP POLICY IF EXISTS "Admins can manage booking responses" ON booking_responses;
DROP POLICY IF EXISTS "Anyone can view business hours" ON business_hours;
DROP POLICY IF EXISTS "Admins can manage business hours" ON business_hours;
DROP POLICY IF EXISTS "Anyone can view closed dates" ON closed_dates;
DROP POLICY IF EXISTS "Admins can manage closed dates" ON closed_dates;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can create notifications" ON notifications;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies (fix recursion)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());

-- Clinics policies (public read, admin write)
CREATE POLICY "Anyone can view active clinics" ON clinics FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can manage clinics" ON clinics FOR ALL USING (is_admin());

-- Services policies (public read, admin write)
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (is_admin());

-- Pets policies
CREATE POLICY "Users can view own pets" ON pets FOR SELECT USING (auth.uid() = owner_id OR is_admin());
CREATE POLICY "Users can manage own pets" ON pets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all pets" ON pets FOR SELECT USING (is_admin());

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (is_admin());

-- Smart diagnoses policies
CREATE POLICY "Users can view own diagnoses" ON smart_diagnoses FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = smart_diagnoses.booking_id AND bookings.user_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "Admins can manage diagnoses" ON smart_diagnoses FOR ALL USING (is_admin());

-- Booking responses policies
CREATE POLICY "Admins can manage booking responses" ON booking_responses FOR ALL USING (is_admin());

-- Business hours policies (public read, admin write)
CREATE POLICY "Anyone can view business hours" ON business_hours FOR SELECT USING (true);
CREATE POLICY "Admins can manage business hours" ON business_hours FOR ALL USING (is_admin());

-- Closed dates policies (public read, admin write)
CREATE POLICY "Anyone can view closed dates" ON closed_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage closed dates" ON closed_dates FOR ALL USING (is_admin());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON notifications FOR INSERT WITH CHECK (is_admin());

-- Grant execute permission on is_admin function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, anon;
