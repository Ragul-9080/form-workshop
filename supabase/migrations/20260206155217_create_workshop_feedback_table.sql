/*
  # Workshop Feedback System

  1. New Tables
    - `workshop_feedback`
      - `id` (uuid, primary key) - Unique identifier for each feedback entry
      - `name` (text) - Name of the workshop participant
      - `department` (text) - Department of the participant
      - `feedback` (text) - Detailed feedback about the workshop
      - `rating` (integer, nullable) - Overall rating from 1-5 (optional)
      - `created_at` (timestamptz) - Timestamp when feedback was submitted
  
  2. Security
    - Enable RLS on `workshop_feedback` table
    - Add policy to allow anyone to insert feedback (public form)
    - Add policy to allow authenticated users to read all feedback
*/

CREATE TABLE IF NOT EXISTS workshop_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  feedback text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workshop_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON workshop_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view feedback"
  ON workshop_feedback
  FOR SELECT
  TO authenticated
  USING (true);