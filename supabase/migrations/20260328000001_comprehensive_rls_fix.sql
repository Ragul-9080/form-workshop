-- COMPREHENSIVE RLS FIX
-- This migration resets and correctly configures RLS for all tables to support the Anon Admin setup.

-- 1. Reset app_config policies
DROP POLICY IF EXISTS "Anyone can read config" ON app_config;
DROP POLICY IF EXISTS "Authenticated users can manage config" ON app_config;
DROP POLICY IF EXISTS "Anyone can manage config" ON app_config;
DROP POLICY IF EXISTS "Public read config" ON app_config;
DROP POLICY IF EXISTS "Admin manage config" ON app_config;

-- Create explicit policies for app_config using TO anon, authenticated
CREATE POLICY "Public read config" 
ON app_config FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admin manage config" 
ON app_config FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);


-- 2. Reset speakers policies
DROP POLICY IF EXISTS "Public read speakers" ON speakers;
DROP POLICY IF EXISTS "Admin manage speakers" ON speakers;
DROP POLICY IF EXISTS "Anyone can read active speakers" ON speakers;
DROP POLICY IF EXISTS "Anyone can manage speakers" ON speakers;

-- Create explicit policies for speakers using TO anon, authenticated
CREATE POLICY "Public read speakers" 
ON speakers FOR SELECT 
TO anon, authenticated 
USING (true); -- Allow admin to see all, including inactive

CREATE POLICY "Admin manage speakers" 
ON speakers FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);


-- 3. Reset workshop_feedback policies
DROP POLICY IF EXISTS "Anyone can view feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Anyone can update feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Anyone can delete feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can update feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Authenticated users can delete feedback" ON workshop_feedback;
DROP POLICY IF EXISTS "Public manageable feedback" ON workshop_feedback;

-- Create explicit policies for workshop_feedback using TO anon, authenticated
CREATE POLICY "Public manageable feedback" 
ON workshop_feedback FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);
