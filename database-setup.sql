-- RoastMyIdea.AI Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Note: Supabase Auth automatically creates the auth.users table
-- We'll reference it for authenticated users

-- Create roasts table
CREATE TABLE IF NOT EXISTS roasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional - null if anonymous
  project_name TEXT NOT NULL, -- Required - for leaderboard display
  idea_text TEXT NOT NULL,
  tone_humor REAL,
  tone_sarcasm REAL,
  judges_data JSONB,
  final_verdict TEXT,
  scores JSONB,
  error_log JSONB,
  processed_files JSONB
);

-- Create roast_files table
CREATE TABLE IF NOT EXISTS roast_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roast_id UUID REFERENCES roasts(id) ON DELETE CASCADE,
  file_type TEXT,
  file_url TEXT,
  processed_content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roast_id UUID REFERENCES roasts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional - null if anonymous
  project_name TEXT NOT NULL, -- Display name on leaderboard
  idea_text TEXT NOT NULL,
  total_score REAL NOT NULL,
  originality REAL NOT NULL,
  feasibility REAL NOT NULL,
  wow_factor REAL NOT NULL,
  market_potential REAL NOT NULL,
  verdict TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roast_files_roast_id ON roast_files(roast_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated and anonymous users
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create policies for public access (hackathon mode - works for everyone)
CREATE POLICY "Allow public read access on roasts" ON roasts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on roasts" ON roasts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on roast_files" ON roast_files
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on roast_files" ON roast_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on leaderboard" ON leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on leaderboard" ON leaderboard
  FOR INSERT WITH CHECK (true);

-- Create a function to automatically update leaderboard
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate total score
  DECLARE
    total_score_val REAL;
  BEGIN
    total_score_val := (
      (NEW.scores->>'originality')::REAL +
      (NEW.scores->>'feasibility')::REAL +
      (NEW.scores->>'wow_factor')::REAL +
      (NEW.scores->>'market_potential')::REAL
    ) / 4.0;

    -- Insert into leaderboard
    INSERT INTO leaderboard (
      roast_id,
      user_id,
      project_name,
      idea_text,
      total_score,
      originality,
      feasibility,
      wow_factor,
      market_potential,
      verdict
    ) VALUES (
      NEW.id,
      NEW.user_id,
      NEW.project_name,
      NEW.idea_text,
      total_score_val,
      (NEW.scores->>'originality')::REAL,
      (NEW.scores->>'feasibility')::REAL,
      (NEW.scores->>'wow_factor')::REAL,
      (NEW.scores->>'market_potential')::REAL,
      NEW.final_verdict
    );

    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update leaderboard on roast insert
DROP TRIGGER IF EXISTS trg_update_leaderboard ON roasts;
CREATE TRIGGER trg_update_leaderboard
AFTER INSERT ON roasts
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard();
