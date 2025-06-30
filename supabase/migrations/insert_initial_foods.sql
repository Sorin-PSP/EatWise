/*
  # Insert Initial Foods Data

  1. Initial Foods
    - Add basic food items with proper nutrition data
    - Set as approved for all users to access
    - Use system user ID (will be updated to actual admin user)
*/

-- Insert initial foods (these will be approved and available to all users)
INSERT INTO foods (name, calories, protein, carbs, fat, fiber, serving, unit, category, image, approved) VALUES
('Chicken Breast', 165, 31, 0, 3.6, 0, 100, 'g', 'protein', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('White Rice', 130, 2.7, 28, 0.3, 0.4, 100, 'g', 'carbs', 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Broccoli', 34, 2.8, 6.6, 0.4, 2.6, 100, 'g', 'vegetables', 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Olive Oil', 884, 0, 0, 100, 0, 100, 'ml', 'fats', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Apples', 52, 0.3, 14, 0.2, 2.4, 100, 'g', 'fruits', 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Avocado', 160, 2, 9, 15, 7, 100, 'g', 'fats', 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Almonds', 579, 21, 22, 50, 12, 100, 'g', 'fats', 'https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Eggs', 155, 13, 1.1, 11, 0, 100, 'g', 'protein', 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Salmon', 208, 20, 0, 13, 0, 100, 'g', 'protein', 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true),
('Sweet Potato', 86, 1.6, 20, 0.1, 3, 100, 'g', 'carbs', 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750', true)
ON CONFLICT (name) DO NOTHING;