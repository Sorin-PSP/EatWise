/*
  # Create weight logs table

  1. New Tables
    - `weight_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date, not null)
      - `weight` (decimal, not null)
      - `notes` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `weight_logs` table
    - Add policy for users to read their own weight logs
    - Add policy for users to create/update/delete their own weight logs
    - Add policy for admins to read all weight logs
*/

CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight DECIMAL NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX weight_logs_user_id_idx ON weight_logs(user_id);
CREATE INDEX weight_logs_date_idx ON weight_logs(date);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own weight logs
CREATE POLICY "Users can read own weight logs"
  ON weight_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to create their own weight logs
CREATE POLICY "Users can create own weight logs"
  ON weight_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own weight logs
CREATE POLICY "Users can update own weight logs"
  ON weight_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to delete their own weight logs
CREATE POLICY "Users can delete own weight logs"
  ON weight_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for admins to read all weight logs
CREATE POLICY "Admins can read all weight logs"
  ON weight_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Trigger to update updated_at on update
CREATE TRIGGER update_weight_logs_updated_at
BEFORE UPDATE ON weight_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();