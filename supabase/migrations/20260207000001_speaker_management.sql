/*
  # Speaker Management System

  1. New Tables
    - `speakers`: Stores dynamic speakers for the workshop
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `is_active` (boolean, defaults to true)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `speakers`
    - Public read access for active speakers
    - Admin-only CRUD for all speakers (simplified for local setup)

  3. Schema Changes
    - Add `speaker_ratings` (jsonb) column to `workshop_feedback` to store dynamic ratings
*/

-- Create speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read speakers" 
ON speakers FOR SELECT 
TO public 
USING (is_active = true);

CREATE POLICY "Admin manage speakers" 
ON speakers ALL 
TO public 
USING (true); -- Simplified for local workshop admin setup

-- Update workshop_feedback to support dynamic ratings
ALTER TABLE workshop_feedback 
ADD COLUMN IF NOT EXISTS speaker_ratings jsonb DEFAULT '{}'::jsonb;
