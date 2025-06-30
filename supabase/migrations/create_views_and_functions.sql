/*
  # Create Views and Functions for Nutrition Calculations

  1. Views
    - `user_daily_totals` - Daily nutrition totals per user
    - `daily_nutrition_summary` - Nutrition summary by meal type

  2. Functions
    - Automatic calculation of daily totals
*/

-- View for daily nutrition totals per user
CREATE OR REPLACE VIEW user_daily_totals AS
SELECT 
  dl.user_id,
  dl.date,
  SUM((f.calories * dl.quantity) / f.serving) as calories,
  SUM((f.protein * dl.quantity) / f.serving) as protein,
  SUM((f.carbs * dl.quantity) / f.serving) as carbs,
  SUM((f.fat * dl.quantity) / f.serving) as fat,
  SUM((f.fiber * dl.quantity) / f.serving) as fiber
FROM daily_logs dl
JOIN foods f ON dl.food_id = f.id
GROUP BY dl.user_id, dl.date;

-- View for nutrition summary by meal type
CREATE OR REPLACE VIEW daily_nutrition_summary AS
SELECT 
  dl.user_id,
  dl.date,
  dl.meal_type,
  SUM((f.calories * dl.quantity) / f.serving) as total_calories,
  SUM((f.protein * dl.quantity) / f.serving) as total_protein,
  SUM((f.carbs * dl.quantity) / f.serving) as total_carbs,
  SUM((f.fat * dl.quantity) / f.serving) as total_fat,
  SUM((f.fiber * dl.quantity) / f.serving) as total_fiber
FROM daily_logs dl
JOIN foods f ON dl.food_id = f.id
GROUP BY dl.user_id, dl.date, dl.meal_type;

-- Enable RLS on views (they inherit from base tables)
ALTER VIEW user_daily_totals SET (security_invoker = true);
ALTER VIEW daily_nutrition_summary SET (security_invoker = true);