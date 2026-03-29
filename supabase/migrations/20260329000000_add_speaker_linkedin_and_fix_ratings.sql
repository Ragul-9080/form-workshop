-- Ensure speakers have linkedin_url
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS linkedin_url text;

-- Ensure workshop_feedback has all required columns (fixes 400 Bad Request error)
ALTER TABLE workshop_feedback ADD COLUMN IF NOT EXISTS speaker_ratings jsonb DEFAULT '{}'::jsonb;
ALTER TABLE workshop_feedback ADD COLUMN IF NOT EXISTS rating_ragul integer;
ALTER TABLE workshop_feedback ADD COLUMN IF NOT EXISTS rating_ashvini integer;

-- Ensure the policies are correct (idempotent)
DO $$ 
BEGIN
    -- Policy for speakers
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'speakers' AND policyname = 'Public read speakers') THEN
        CREATE POLICY "Public read speakers" ON speakers FOR SELECT TO anon, authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'speakers' AND policyname = 'Admin manage speakers') THEN
        CREATE POLICY "Admin manage speakers" ON speakers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
    END IF;

    -- Policy for workshop_feedback
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workshop_feedback' AND policyname = 'Public manageable feedback') THEN
        CREATE POLICY "Public manageable feedback" ON workshop_feedback FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
