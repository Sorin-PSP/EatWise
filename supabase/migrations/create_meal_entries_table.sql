/*
  # Create meal entries table

  1. New Tables
    - `meal_entries`
      - `id` (uuid, primary key)
      - `daily_log_id` (uuid, references daily_logs)
      - `food_id` (uuid, references foods)
      - `meal_type` (text, not null)
      - `quantity` (decimal, not null)
      - `calories` (integer, not null)
      - `protein` (decimal, not null)
      - `carbs` (decimal, not null)
      - `fat` (decimal, not null)
      - `fiber` (decimal, default 0)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `meal_entries` table
    - Add policy for users to read their own meal entries
    - Add policy for users to create/update/delete their own meal entries
    - Add policy for admins to read all meal entries
*/

CREATE TABLE IF NOT EXISTS meal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id),
  meal_type TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  fiber DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX meal_entries_daily_log_id_idx ON meal_entries(daily_log_id);
CREATE INDEX meal_entries_food_id_idx ON meal_entries(food_id);
CREATE INDEX meal_entries_meal_type_idx ON meal_entries(meal_type);

ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own meal entries
CREATE POLICY "Users can read own meal entries"
  ON meal_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = meal_entries.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Policy for users to create their own meal entries
CREATE POLICY "Users can create own meal entries"
  ON meal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = meal_entries.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Policy for users to update their own meal entries
CREATE POLICY "Users can update own meal entries"
  ON meal_entries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = meal_entries.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Policy for users to delete their own meal entries
CREATE POLICY "Users can delete own meal entries"
  ON meal_entries
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = meal_entries.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- Policy for admins to read all meal entries
CREATE POLICY "Admins can read all meal entries"
  ON meal_entries
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Trigger to update updated_at on update
CREATE TRIGGER update_meal_entries_updated_at
BEFORE UPDATE ON meal_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to update daily log totals when meal entries are modified
CREATE OR REPLACE FUNCTION update_daily_log_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the daily log totals
  IF TG_OP = 'INSERT' THEN
    UPDATE daily_logs
    SET 
      total_calories = total_calories + NEW.calories,
      total_protein = total_protein + NEW.protein,
      total_carbs = total_carbs + NEW.carbs,
      total_fat = total_fat + NEW.fat,
      total_fiber = total_fiber + NEW.fiber
    WHERE id = NEW.daily_log_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE daily_logs
    SET 
      total_calories = total_calories - OLD.calories + NEW.calories,
      total_protein = total_protein - OLD.protein + NEW.protein,
      total_carbs = total_carbs - OLD.carbs + NEW.carbs,
      total_fat = total_fat - OLD.fat + NEW.fat,
      total_fiber = total_fiber - OLD.fiber + NEW.fiber
    WHERE id = NEW.daily_log_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE daily_logs
    SET 
      total_calories = total_calories - OLD.calories,
      total_protein = total_protein - OLD.protein,
      total_carbs = total_carbs - OLD.carbs,
      total_fat = total_fat - OLD.fat,
      total_fiber = total_fiber - OLD.fiber
    WHERE id = OLD.daily_log_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update daily log totals
CREATE TRIGGER update_daily_log_totals_insert
AFTER INSERT ON meal_entries
FOR EACH ROW
EXECUTE FUNCTION update_daily_log_totals();

CREATE TRIGGER update_daily_log_totals_update
AFTER UPDATE ON meal_entries
FOR EACH ROW
EXECUTE FUNCTION update_daily_log_totals();

CREATE TRIGGER update_daily_log_totals_delete
AFTER DELETE ON meal_entries
FOR EACH ROW
EXECUTE FUNCTION update_daily_log_totals();