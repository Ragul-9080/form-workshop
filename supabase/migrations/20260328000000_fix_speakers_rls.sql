-- Fix RLS policies for speakers table to be more explicit
-- This matches the pattern used for other tables in the project

-- Drop existing policies on speakers table
DROP POLICY IF EXISTS "Public read speakers" ON speakers;
DROP POLICY IF EXISTS "Admin manage speakers" ON speakers;

-- Re-create policies using TO anon, authenticated
-- 1. Anyone (including anonymous users) can read active speakers
CREATE POLICY "Anyone can read active speakers" 
ON speakers FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- 2. Full access for all operations (for our simple dashboard setup)
CREATE POLICY "Anyone can manage speakers" 
ON speakers FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);
