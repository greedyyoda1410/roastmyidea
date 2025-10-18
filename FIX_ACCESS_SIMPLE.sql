-- ========================================
-- SIMPLE ACCESS FIX - Run this in Supabase SQL Editor
-- ========================================
-- This fixes "Access Required" error for all users
-- ========================================

-- Step 1: Drop all existing restrictive policies
DO $$ 
BEGIN
    -- Drop policies if they exist (won't error if they don't)
    DROP POLICY IF EXISTS "Allow public read access on roasts" ON roasts;
    DROP POLICY IF EXISTS "Allow public insert on roasts" ON roasts;
    DROP POLICY IF EXISTS "Allow authenticated users to insert roasts" ON roasts;
    DROP POLICY IF EXISTS "Allow authenticated users to update their own roasts" ON roasts;
    DROP POLICY IF EXISTS "Allow authenticated users to delete their own roasts" ON roasts;
    DROP POLICY IF EXISTS "Public can read all roasts" ON roasts;
    DROP POLICY IF EXISTS "Anyone can insert roasts" ON roasts;
    DROP POLICY IF EXISTS "Users can update own roasts" ON roasts;
    DROP POLICY IF EXISTS "Users can delete own roasts" ON roasts;

    DROP POLICY IF EXISTS "Allow public read access on roast_files" ON roast_files;
    DROP POLICY IF EXISTS "Allow public insert on roast_files" ON roast_files;
    DROP POLICY IF EXISTS "Public can read all roast files" ON roast_files;
    DROP POLICY IF EXISTS "Anyone can insert roast files" ON roast_files;

    DROP POLICY IF EXISTS "Allow public read access on leaderboard" ON leaderboard;
    DROP POLICY IF EXISTS "Allow public insert on leaderboard" ON leaderboard;
    DROP POLICY IF EXISTS "Public can read leaderboard" ON leaderboard;
    DROP POLICY IF EXISTS "Service role can insert leaderboard" ON leaderboard;
END $$;

-- Step 2: Grant permissions to everyone (anon = not logged in)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Step 3: Enable RLS (if not already enabled)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Step 4: Create super permissive policies (allows EVERYONE)
CREATE POLICY "allow_all_roasts" ON roasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_roast_files" ON roast_files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_leaderboard" ON leaderboard FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- SUCCESS! 
-- ========================================
-- Run this query to verify policies are active:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('roasts', 'roast_files', 'leaderboard');

-- Test access (should return 0 or more rows, not an error):
-- SELECT COUNT(*) FROM roasts;
-- SELECT COUNT(*) FROM leaderboard;

