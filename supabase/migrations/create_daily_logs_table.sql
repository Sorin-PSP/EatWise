/*
  # Create daily logs table

  1. New Tables
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date, not null)
      - `total_calories` (integer, default 0)
      - `total_protein` (decimal, default 0)
      - `total_carbs` (decimal, default 0)
      - `total_fat` (decimal, default 0)
      - `total_fiber` (decimal, default 0)
      - `water_consumed` (integer, default 0)
      - `notes` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `daily_logs` table
    - Add policy for users to read their own logs
    - Add policy for users to create/update their own logs
    - Add policy for admins to read all logs
*/

CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_protein DECIMAL DEFAULT 0,
  total_carbs DECIMAL DEFAULT 0,
  total_fat DECIMAL DEFAULT 0,
  total_fiber DECIMAL DEFAULT 0,
  water_consumed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX daily_logs_user_id_idx ON daily_logs(user_id);
CREATE INDEX daily_logs_date_idx ON daily_logs(date);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own logs
CREATE POLICY "Users can read own daily logs"
  ON daily_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to create their own logs
CREATE POLICY "Users can create own daily logs"
  ON daily_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own logs
CREATE POLICY "Users can update own daily logs"
  ON daily_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for admins to read all logs
CREATE POLICY "Admins can read all daily logs"
  ON daily_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Trigger to update updated_at on update
CREATE TRIGGER update_daily_logs_updated_at
BEFORE UPDATE ON daily_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();