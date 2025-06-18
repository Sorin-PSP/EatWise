/*
  # Create foods table

  1. New Tables
    - `foods`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `calories` (integer, not null)
      - `protein` (decimal, not null)
      - `carbs` (decimal, not null)
      - `fat` (decimal, not null)
      - `fiber` (decimal, default 0)
      - `serving` (decimal, not null)
      - `unit` (text, not null)
      - `category` (text, references food_categories)
      - `image` (text, nullable)
      - `approved` (boolean, default true)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `foods` table
    - Add policy for all users to read approved foods
    - Add policy for users to read their own unapproved foods
    - Add policy for users to create foods
    - Add policy for users to update their own foods
    - Add policy for admins to update any food
    - Add policy for admins to delete any food
*/

CREATE TABLE IF NOT EXISTS foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL NOT NULL,
  carbs DECIMAL NOT NULL,
  fat DECIMAL NOT NULL,
  fiber DECIMAL DEFAULT 0,
  serving DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  category TEXT REFERENCES food_categories(name),
  image TEXT,
  approved BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX foods_category_idx ON foods(category);
CREATE INDEX foods_created_by_idx ON foods(created_by);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Policy for all users to read approved foods
CREATE POLICY "Anyone can read approved foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (approved = true);

-- Policy for users to read their own unapproved foods
CREATE POLICY "Users can read their own unapproved foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() AND approved = false);

-- Policy for users to create foods
CREATE POLICY "Users can create foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for users to update their own foods
CREATE POLICY "Users can update their own foods"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Policy for admins to update any food
CREATE POLICY "Admins can update any food"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Policy for admins to delete any food
CREATE POLICY "Admins can delete any food"
  ON foods
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Trigger to update updated_at on update
CREATE TRIGGER update_foods_updated_at
BEFORE UPDATE ON foods
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample foods
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving, unit, category, image, approved)
VALUES 
  ('Chicken Breast', 165, 31, 0, 3.6, 0, 100, 'g', 'protein', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('White Rice', 130, 2.7, 28, 0.3, 0.4, 100, 'g', 'carbs', 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Broccoli', 34, 2.8, 6.6, 0.4, 2.6, 100, 'g', 'vegetables', 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Olive Oil', 884, 0, 0, 100, 0, 100, 'ml', 'fats', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
  ('Apples', 52, 0.3, 14, 0.2, 2.4, 100, 'g', 'fruits', 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true)
ON CONFLICT DO NOTHING;