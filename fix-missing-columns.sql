-- Fix missing columns in roasts table
-- Run this in Supabase SQL Editor

-- Add missing user_id column (optional for anonymous users)
ALTER TABLE roasts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add missing project_name column (required for leaderboard display)
ALTER TABLE roasts ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Update any existing records to have a default project name if needed
UPDATE roasts SET project_name = 'Anonymous Project' WHERE project_name IS NULL;

-- Make project_name NOT NULL after updating existing records
ALTER TABLE roasts ALTER COLUMN project_name SET NOT NULL;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_roasts_user_id ON roasts(user_id);

-- Create index on project_name for better performance
CREATE INDEX IF NOT EXISTS idx_roasts_project_name ON roasts(project_name);
