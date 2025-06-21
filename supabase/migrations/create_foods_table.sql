/*
  # Creare tabel pentru alimente
  
  1. New Tables
    - `foods`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `calories` (integer, not null)
      - `protein` (numeric, not null)
      - `carbs` (numeric, not null)
      - `fat` (numeric, not null)
      - `fiber` (numeric)
      - `serving` (numeric, not null)
      - `unit` (text, not null)
      - `category` (text, not null)
      - `image` (text)
      - `approved` (boolean, default true)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `foods` table
    - Add policies for authenticated users to read all approved foods
    - Add policies for users to manage their own foods
    - Add policies for admins to manage all foods
*/

-- Create foods table
CREATE TABLE IF NOT EXISTS public.foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  fiber numeric DEFAULT 0,
  serving numeric NOT NULL,
  unit text NOT NULL,
  category text NOT NULL,
  image text,
  approved boolean DEFAULT true,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS foods_name_idx ON public.foods USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS foods_category_idx ON public.foods (category);
CREATE INDEX IF NOT EXISTS foods_user_id_idx ON public.foods (user_id);

-- Enable row level security
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can read approved foods
CREATE POLICY "Anyone can read approved foods"
  ON public.foods
  FOR SELECT
  USING (approved = true);

-- Users can read their own unapproved foods
CREATE POLICY "Users can read their own unapproved foods"
  ON public.foods
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND approved = false);

-- Users can insert their own foods
CREATE POLICY "Users can insert their own foods"
  ON public.foods
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own foods
CREATE POLICY "Users can update their own foods"
  ON public.foods
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own foods
CREATE POLICY "Users can delete their own foods"
  ON public.foods
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all foods
CREATE POLICY "Admins can manage all foods"
  ON public.foods
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
  );
$$;

-- Add initial foods data
INSERT INTO public.foods (name, calories, protein, carbs, fat, fiber, serving, unit, category, image, approved)
VALUES
  ('Chicken Breast', 165, 31, 0, 3.6, 0, 100, 'g', 'protein', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('White Rice', 130, 2.7, 28, 0.3, 0.4, 100, 'g', 'carbs', 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Broccoli', 34, 2.8, 6.6, 0.4, 2.6, 100, 'g', 'vegetables', 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Olive Oil', 884, 0, 0, 100, 0, 100, 'ml', 'fats', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Apples', 52, 0.3, 14, 0.2, 2.4, 100, 'g', 'fruits', 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true)
ON CONFLICT (id) DO NOTHING;