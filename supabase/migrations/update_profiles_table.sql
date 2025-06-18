/*
  # Update profiles table with additional fields

  1. Changes
    - Add new columns to the profiles table:
      - `age` (integer, nullable)
      - `gender` (text, nullable)
      - `height` (decimal, nullable)
      - `activity_level` (text, default 'moderate')
      - `goal` (text, default 'maintain')
  
  2. Purpose
    - Store additional user profile information needed for calorie calculations
    - Support profile data persistence across sessions
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  -- Add age column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age INTEGER;
  END IF;

  -- Add gender column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender TEXT;
  END IF;

  -- Add height column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'height'
  ) THEN
    ALTER TABLE profiles ADD COLUMN height DECIMAL;
  END IF;

  -- Add activity_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'activity_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN activity_level TEXT DEFAULT 'moderate';
  END IF;

  -- Add goal column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'goal'
  ) THEN
    ALTER TABLE profiles ADD COLUMN goal TEXT DEFAULT 'maintain';
  END IF;
END $$;