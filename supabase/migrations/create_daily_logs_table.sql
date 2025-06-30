/*
  # Create Daily Logs Table

  1. New Tables
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User who logged the food
      - `food_id` (uuid) - Reference to foods table
      - `date` (date) - Date of consumption
      - `meal_type` (text) - breakfast, lunch, dinner, snacks
      - `quantity` (numeric) - Amount consumed
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `daily_logs` table
    - Add policy for users to manage their own logs
*/

CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  quantity numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Users can manage their own daily logs
CREATE POLICY "Users can manage own daily logs"
  ON daily_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS daily_logs_user_id_idx ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS daily_logs_date_idx ON daily_logs(date);
CREATE INDEX IF NOT EXISTS daily_logs_user_date_idx ON daily_logs(user_id, date);
CREATE INDEX IF NOT EXISTS daily_logs_food_id_idx ON daily_logs(food_id);