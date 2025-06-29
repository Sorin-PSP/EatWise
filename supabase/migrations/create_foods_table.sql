/*
  # Create Foods Table

  1. New Tables
    - `foods`
      - `id` (uuid, primary key)
      - `name` (text, unique) - numele alimentului
      - `calories` (numeric) - calorii per porție
      - `protein` (numeric) - proteine în grame
      - `carbs` (numeric) - carbohidrați în grame
      - `fat` (numeric) - grăsimi în grame
      - `fiber` (numeric) - fibre în grame
      - `serving` (numeric) - mărimea porției
      - `unit` (text) - unitatea de măsură (g, ml, etc.)
      - `category` (text) - categoria alimentului
      - `image` (text) - URL imagine
      - `approved` (boolean) - dacă alimentul este aprobat
      - `user_id` (uuid) - utilizatorul care a adăugat alimentul
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `foods` table
    - Add policies for reading approved foods
    - Add policies for users to manage their own foods
    - Add policies for admins to manage all foods

  3. Indexes
    - Index on name for fast searching
    - Index on category for filtering
    - Index on approved status
*/

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories numeric NOT NULL CHECK (calories >= 0),
  protein numeric NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs numeric NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat numeric NOT NULL DEFAULT 0 CHECK (fat >= 0),
  fiber numeric DEFAULT 0 CHECK (fiber >= 0),
  serving numeric NOT NULL DEFAULT 100 CHECK (serving > 0),
  unit text NOT NULL DEFAULT 'g',
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy', 'other')),
  image text,
  approved boolean NOT NULL DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint on name (case insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS foods_name_unique_idx ON foods (LOWER(name));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS foods_category_idx ON foods (category);
CREATE INDEX IF NOT EXISTS foods_approved_idx ON foods (approved);
CREATE INDEX IF NOT EXISTS foods_user_id_idx ON foods (user_id);
CREATE INDEX IF NOT EXISTS foods_name_search_idx ON foods USING gin (to_tsvector('english', name));

-- Enable RLS
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read approved foods
CREATE POLICY "Anyone can read approved foods"
  ON foods
  FOR SELECT
  USING (approved = true);

-- Policy: Users can read their own foods (approved or not)
CREATE POLICY "Users can read own foods"
  ON foods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own foods
CREATE POLICY "Users can insert own foods"
  ON foods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own foods
CREATE POLICY "Users can update own foods"
  ON foods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own foods
CREATE POLICY "Users can delete own foods"
  ON foods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can manage all foods
CREATE POLICY "Admins can manage all foods"
  ON foods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON foods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();