/*
  # Create food categories table

  1. New Tables
    - `food_categories`
      - `name` (text, primary key)
      - `description` (text, nullable)
      - `image` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on `food_categories` table
    - Add policy for all users to read categories
    - Add policy for admins to create/update/delete categories
*/

CREATE TABLE IF NOT EXISTS food_categories (
  name TEXT PRIMARY KEY,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;

-- Policy for all users to read categories
CREATE POLICY "Anyone can read food categories"
  ON food_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for admins to create categories
CREATE POLICY "Admins can create food categories"
  ON food_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Policy for admins to update categories
CREATE POLICY "Admins can update food categories"
  ON food_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Policy for admins to delete categories
CREATE POLICY "Admins can delete food categories"
  ON food_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND email = 'AdminEatWise@gmail.com'
    )
  );

-- Trigger to update updated_at on update
CREATE TRIGGER update_food_categories_updated_at
BEFORE UPDATE ON food_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default food categories
INSERT INTO food_categories (name, description, image)
VALUES 
  ('protein', 'High-protein foods like meat, fish, eggs, and legumes', 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('carbs', 'Carbohydrate-rich foods like rice, pasta, bread, and potatoes', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('vegetables', 'Nutrient-dense vegetables of all varieties', 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('fruits', 'Sweet and nutritious fruits', 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('dairy', 'Dairy products like milk, cheese, and yogurt', 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('fats', 'Healthy fats like oils, nuts, and avocados', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('beverages', 'Drinks including water, tea, coffee, and juices', 'https://images.pexels.com/photos/1292862/pexels-photo-1292862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('snacks', 'Quick bites and snack foods', 'https://images.pexels.com/photos/1028598/pexels-photo-1028598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('desserts', 'Sweet treats and desserts', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
  ('other', 'Miscellaneous food items', 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')
ON CONFLICT (name) DO NOTHING;