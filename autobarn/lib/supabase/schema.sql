-- ============================================================
-- AutoBarn Database Schema
-- PostgreSQL via Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUM TYPES ──────────────────────────────────────────────

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE booking_type   AS ENUM ('test_drive', 'car_wash', 'detailing', 'enquiry');
CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'replied', 'closed');
CREATE TYPE fuel_type      AS ENUM ('petrol', 'diesel', 'hybrid', 'electric');
CREATE TYPE transmission   AS ENUM ('automatic', 'manual');

-- ─── BOOKINGS ─────────────────────────────────────────────────
-- Stores all booking form submissions (test drives, services, wash)

CREATE TABLE bookings (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  -- Contact
  first_name        text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name         text NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email             text NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone             text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 20),

  -- Booking details
  booking_type      booking_type NOT NULL,
  vehicle_interest  text,          -- Sanity vehicle _id or free text
  preferred_date    date NOT NULL,
  preferred_time    text,
  message           text CHECK (char_length(message) <= 2000),

  -- Status
  status            booking_status NOT NULL DEFAULT 'pending',
  staff_notes       text,

  -- Metadata
  source_url        text,          -- which page the form was on
  ip_address        inet,
  user_agent        text
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ENQUIRIES ────────────────────────────────────────────────
-- General contact form submissions not tied to a booking date

CREATE TABLE enquiries (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  first_name   text NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 80),
  last_name    text NOT NULL CHECK (char_length(last_name) BETWEEN 1 AND 80),
  email        text NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  phone        text CHECK (char_length(phone) <= 20),
  subject      text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 200),
  message      text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),

  status       enquiry_status NOT NULL DEFAULT 'new',
  staff_notes  text,
  source_url   text,
  ip_address   inet
);

CREATE TRIGGER enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── NEWSLETTER SUBSCRIBERS ───────────────────────────────────

CREATE TABLE newsletter_subscribers (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  email        text UNIQUE NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  is_active    boolean NOT NULL DEFAULT true,
  source       text   -- 'footer', 'blog', 'popup'
);

-- ─── VEHICLE ENQUIRY VIEWS ────────────────────────────────────
-- Tracks which Sanity vehicles get the most enquiry interest

CREATE TABLE vehicle_enquiry_events (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  sanity_id      text NOT NULL,   -- Sanity vehicle document _id
  event_type     text NOT NULL,   -- 'view', 'quote_click', 'test_drive_click'
  session_id     text,
  ip_address     inet
);

-- ─── INDEXES ──────────────────────────────────────────────────

CREATE INDEX idx_bookings_status      ON bookings (status);
CREATE INDEX idx_bookings_date        ON bookings (preferred_date);
CREATE INDEX idx_bookings_email       ON bookings (email);
CREATE INDEX idx_bookings_type        ON bookings (booking_type);
-- Composite index for the duplicate-booking guard query
-- (email + booking_type + preferred_date + status)
CREATE INDEX idx_bookings_dedup
  ON bookings (email, booking_type, preferred_date)
  WHERE status IN ('pending', 'confirmed');
CREATE INDEX idx_enquiries_status     ON enquiries (status);
CREATE INDEX idx_enquiries_created    ON enquiries (created_at DESC);
CREATE INDEX idx_vehicle_events       ON vehicle_enquiry_events (sanity_id, event_type);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
-- Public can INSERT; only authenticated staff can SELECT/UPDATE

ALTER TABLE bookings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries              ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_enquiry_events ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a booking
CREATE POLICY "public_insert_bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users (staff) can read/update bookings
CREATE POLICY "staff_read_bookings"
  ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff_update_bookings"
  ON bookings FOR UPDATE TO authenticated USING (true);

-- Same pattern for enquiries
CREATE POLICY "public_insert_enquiries"
  ON enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "staff_read_enquiries"
  ON enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff_update_enquiries"
  ON enquiries FOR UPDATE TO authenticated USING (true);

-- Newsletter: insert only for anon
CREATE POLICY "public_subscribe"
  ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);

-- Vehicle events: insert only
CREATE POLICY "public_insert_events"
  ON vehicle_enquiry_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "staff_read_events"
  ON vehicle_enquiry_events FOR SELECT TO authenticated USING (true);

-- ─── VIEWS ────────────────────────────────────────────────────

-- Quick dashboard summary for staff
CREATE OR REPLACE VIEW booking_summary AS
SELECT
  booking_type,
  status,
  COUNT(*)           AS total,
  MIN(preferred_date) AS earliest,
  MAX(preferred_date) AS latest
FROM bookings
GROUP BY booking_type, status
ORDER BY booking_type, status;
