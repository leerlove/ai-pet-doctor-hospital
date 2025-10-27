-- Add is_first_visit column to bookings table
ALTER TABLE bookings
ADD COLUMN is_first_visit BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN bookings.is_first_visit IS 'Whether this is the customer''s first visit to the clinic';
