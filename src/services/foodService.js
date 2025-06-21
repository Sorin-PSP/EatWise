import { supabase } from '../lib/supabaseClient';

// Food-related services
export const fetchFoods = async () => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

export const addFoodToDatabase = async (food) => {
  try {
    // Make sure user_id is set to the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const newFood = {
      ...food,
      user_id: user.id,
      // Set approved to false if the user is not an admin
      approved: user.user_metadata?.is_admin === true
    };
    
    const { data, error } = await supabase
      .from('foods')
      .insert(newFood)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding food:', error);
    throw error;
  }
};

export const updateFoodInDatabase = async (id, food) => {
  try {
    const { data, error } = await supabase
      .from('foods')
      .update(food)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating food:', error);
    throw error;
  }
};

export const deleteFoodFromDatabase = async (id) => {
  try {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting food:', error);
    throw error;
  }
};

// Daily log services
export const fetchDailyLogs = async (date) => {
  try {
    const { data, error } = await supabase
      .from('daily_logs')
      .select(`
        id,
        date,
        meal_type,
        quantity,
        foods (
          id,
          name,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          serving,
          unit,
          category,
          image
        )
      `)
      .eq('date', date);
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    const transformedData = data.map(log => ({
      id: log.id,
      foodId: log.foods.id,
      name: log.foods.name,
      quantity: log.quantity,
      calories: Math.round((log.foods.calories * log.quantity) / log.foods.serving),
      protein: Math.round((log.foods.protein * log.quantity) / log.foods.serving * 10) / 10,
      carbs: Math.round((log.foods.carbs * log.quantity) / log.foods.serving * 10) / 10,
      fat: Math.round((log.foods.fat * log.quantity) / log.foods.serving * 10) / 10,
      fiber: Math.round((log.foods.fiber * log.quantity) / log.foods.serving * 10) / 10,
      image: log.foods.image,
      mealType: log.meal_type
    }));
    
    // Group by meal type
    const groupedByMealType = transformedData.reduce((acc, item) => {
      if (!acc[item.mealType]) {
        acc[item.mealType] = [];
      }
      acc[item.mealType].push(item);
      return acc;
    }, { breakfast: [], lunch: [], dinner: [], snacks: [] });
    
    return groupedByMealType;
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    throw error;
  }
};

export const addFoodToLog = async (date, mealType, foodId, quantity) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const newLogEntry = {
      user_id: user.id,
      date,
      food_id: foodId,
      meal_type: mealType,
      quantity
    };
    
    const { data, error } = await supabase
      .from('daily_logs')
      .insert(newLogEntry)
      .select(`
        id,
        date,
        meal_type,
        quantity,
        foods (
          id,
          name,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          serving,
          unit,
          category,
          image
        )
      `)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      foodId: data.foods.id,
      name: data.foods.name,
      quantity: data.quantity,
      calories: Math.round((data.foods.calories * data.quantity) / data.foods.serving),
      protein: Math.round((data.foods.protein * data.quantity) / data.foods.serving * 10) / 10,
      carbs: Math.round((data.foods.carbs * data.quantity) / data.foods.serving * 10) / 10,
      fat: Math.round((data.foods.fat * data.quantity) / data.foods.serving * 10) / 10,
      fiber: Math.round((data.foods.fiber * data.quantity) / data.foods.serving * 10) / 10,
      image: data.foods.image,
      mealType: data.meal_type
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error adding food to log:', error);
    throw error;
  }
};

export const removeFoodFromLog = async (logId) => {
  try {
    const { error } = await supabase
      .from('daily_logs')
      .delete()
      .eq('id', logId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing food from log:', error);
    throw error;
  }
};

export const getDailyNutritionSummary = async (date) => {
  try {
    const { data, error } = await supabase
      .from('user_daily_totals')
      .select('*')
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
      throw error;
    }
    
    // If no data, return zeros
    if (!data) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }
    
    return {
      calories: Math.round(data.calories || 0),
      protein: Math.round((data.protein || 0) * 10) / 10,
      carbs: Math.round((data.carbs || 0) * 10) / 10,
      fat: Math.round((data.fat || 0) * 10) / 10,
      fiber: Math.round((data.fiber || 0) * 10) / 10
    };
  } catch (error) {
    console.error('Error getting daily nutrition summary:', error);
    throw error;
  }
};

// Get nutrition summary by meal type
export const getNutritionByMealType = async (date) => {
  try {
    const { data, error } = await supabase
      .from('daily_nutrition_summary')
      .select('*')
      .eq('date', date);
    
    if (error) throw error;
    
    // Transform the data to match the expected format
    const mealTypeSummary = data.reduce((acc, item) => {
      acc[item.meal_type] = {
        calories: Math.round(item.total_calories || 0),
        protein: Math.round((item.total_protein || 0) * 10) / 10,
        carbs: Math.round((item.total_carbs || 0) * 10) / 10,
        fat: Math.round((item.total_fat || 0) * 10) / 10,
        fiber: Math.round((item.total_fiber || 0) * 10) / 10
      };
      return acc;
    }, { breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }, 
         lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
         dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
         snacks: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 } });
    
    return mealTypeSummary;
  } catch (error) {
    console.error('Error getting nutrition by meal type:', error);
    throw error;
  }
};
