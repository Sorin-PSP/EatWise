/*
  # Creare tabel pentru jurnalul zilnic de alimentație
  
  1. New Tables
    - `daily_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, not null)
      - `date` (date, not null)
      - `food_id` (uuid, references foods, not null)
      - `meal_type` (text, not null) - breakfast, lunch, dinner, snacks
      - `quantity` (numeric, not null)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `daily_logs` table
    - Add policies for users to manage only their own logs
    - Add policies for admins to view all logs
*/

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  food_id uuid NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS daily_logs_user_id_idx ON public.daily_logs (user_id);
CREATE INDEX IF NOT EXISTS daily_logs_date_idx ON public.daily_logs (date);
CREATE INDEX IF NOT EXISTS daily_logs_food_id_idx ON public.daily_logs (food_id);
CREATE INDEX IF NOT EXISTS daily_logs_user_date_idx ON public.daily_logs (user_id, date);

-- Enable row level security
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own logs
CREATE POLICY "Users can read their own logs"
  ON public.daily_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own logs
CREATE POLICY "Users can insert their own logs"
  ON public.daily_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own logs
CREATE POLICY "Users can update their own logs"
  ON public.daily_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own logs
CREATE POLICY "Users can delete their own logs"
  ON public.daily_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all logs
CREATE POLICY "Admins can view all logs"
  ON public.daily_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Create view for daily nutrition summary
CREATE OR REPLACE VIEW public.daily_nutrition_summary AS
SELECT
  dl.user_id,
  dl.date,
  dl.meal_type,
  SUM((f.calories * dl.quantity) / f.serving) AS total_calories,
  SUM((f.protein * dl.quantity) / f.serving) AS total_protein,
  SUM((f.carbs * dl.quantity) / f.serving) AS total_carbs,
  SUM((f.fat * dl.quantity) / f.serving) AS total_fat,
  SUM((f.fiber * dl.quantity) / f.serving) AS total_fiber
FROM
  public.daily_logs dl
JOIN
  public.foods f ON dl.food_id = f.id
GROUP BY
  dl.user_id, dl.date, dl.meal_type;

-- Create view for user's daily totals
CREATE OR REPLACE VIEW public.user_daily_totals AS
SELECT
  user_id,
  date,
  SUM(total_calories) AS calories,
  SUM(total_protein) AS protein,
  SUM(total_carbs) AS carbs,
  SUM(total_fat) AS fat,
  SUM(total_fiber) AS fiber
FROM
  public.daily_nutrition_summary
GROUP BY
  user_id, date;