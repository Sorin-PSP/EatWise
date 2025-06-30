/*
  # Create Foods Table

  1. New Tables
    - `foods`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Food name
      - `calories` (numeric) - Calories per serving
      - `protein` (numeric) - Protein in grams
      - `carbs` (numeric) - Carbohydrates in grams
      - `fat` (numeric) - Fat in grams
      - `fiber` (numeric) - Fiber in grams
      - `serving` (numeric) - Serving size
      - `unit` (text) - Unit of measurement (g, ml, etc.)
      - `category` (text) - Food category
      - `image` (text) - Image URL
      - `user_id` (uuid) - User who created the food
      - `approved` (boolean) - Admin approval status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `foods` table
    - Add policy for users to read approved foods and their own foods
    - Add policy for users to create their own foods
    - Add policy for users to update their own foods
    - Add policy for users to delete their own foods
*/

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  fiber numeric NOT NULL DEFAULT 0,
  serving numeric NOT NULL DEFAULT 100,
  unit text NOT NULL DEFAULT 'g',
  category text NOT NULL DEFAULT 'other',
  image text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Users can read approved foods and their own foods
CREATE POLICY "Users can read approved foods and own foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (approved = true OR auth.uid() = user_id);

-- Users can create their own foods
CREATE POLICY "Users can create own foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own foods
CREATE POLICY "Users can update own foods"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own foods
CREATE POLICY "Users can delete own foods"
  ON foods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS foods_user_id_idx ON foods(user_id);
CREATE INDEX IF NOT EXISTS foods_approved_idx ON foods(approved);
CREATE INDEX IF NOT EXISTS foods_category_idx ON foods(category);