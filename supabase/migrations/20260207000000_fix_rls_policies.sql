-- Policies for workshop_feedback
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can update feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can delete feedback" ON workshop_feedback;

-- Create new policies allowing anon access (since frontend handles admin auth via password)
CREATE POLICY "Anyone can view feedback"
  ON workshop_feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update feedback"
  ON workshop_feedback
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete feedback"
  ON workshop_feedback
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Policies for app_config
DROP POLICY IF EXISTS "Anyone can read config" ON app_config;
DROP POLICY IF EXISTS "Authenticated users can manage config" ON app_config;

CREATE POLICY "Anyone can read config"
  ON app_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can manage config"
  ON app_config
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
