/*
  # Admin Features & Configuration

  1. Changes
    - Add UPDATE, DELETE, INSERT policies for authenticated users on `workshop_feedback`.
    - Create `app_config` table for key-value settings.
    - Set up RLS for `app_config`.

  2. New Tables
    - `app_config`
      - `key` (text, primary key)
      - `value` (text)
*/

-- Policies for workshop_feedback

CREATE POLICY "Authenticated users can insert feedback"
  ON workshop_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update feedback"
  ON workshop_feedback
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete feedback"
  ON workshop_feedback
  FOR DELETE
  TO authenticated
  USING (true);

-- App Config Table

CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read config"
  ON app_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage config"
  ON app_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Default Values (Insert if they don't exist)
INSERT INTO app_config (key, value) VALUES
  ('instagram_url', 'https://instagram.com'),
  ('linkedin_url', 'https://linkedin.com'),
  ('whatsapp_url', 'https://whatsapp.com')
ON CONFLICT (key) DO NOTHING;
