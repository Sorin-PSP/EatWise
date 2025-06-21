import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  fetchFoods, 
  addFoodToDatabase, 
  updateFoodInDatabase, 
  deleteFoodFromDatabase,
  fetchDailyLogs,
  addFoodToLog as addFoodToLogService,
  removeFoodFromLog as removeFoodFromLogService,
  getDailyNutritionSummary,
  getNutritionByMealType
} from '../services/foodService';

const FoodContext = createContext();

// Platform leaf logo (fallback image)
const platformLogo = 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';

// Default food images by category
const defaultImages = {
  protein: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  carbs: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  fats: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  vegetables: 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  fruits: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  dairy: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  other: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
};

// Specific food images mapping
const specificFoodImages = {
  'chicken breast': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'white rice': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'broccoli': 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'olive oil': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'apples': 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'avocado': 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'almonds': 'https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'eggs': 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'salmon': 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'beef': 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'pork': 'https://images.pexels.com/photos/8308126/pexels-photo-8308126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
};

// Function to get the best image for a food
const getFoodImage = (food) => {
  // First try to find a specific image for this food by name
  const foodNameLower = food.name.toLowerCase();
  
  // Check if we have an exact match
  if (specificFoodImages[foodNameLower]) {
    return specificFoodImages[foodNameLower];
  }
  
  // Check if we have a partial match (food name contains one of our keys)
  for (const [key, imageUrl] of Object.entries(specificFoodImages)) {
    if (foodNameLower.includes(key)) {
      return imageUrl;
    }
  }
  
  // If no specific image, use category image
  if (defaultImages[food.category]) {
    return defaultImages[food.category];
  }
  
  // If all else fails, use platform logo
  return platformLogo;
};

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [dailyLog, setDailyLog] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load foods from Supabase on mount
  useEffect(() => {
    const loadFoods = async () => {
      setIsLoading(true);
      try {
        // Try to load from Supabase first
        if (isOnline && user) {
          const foodsData = await fetchFoods();
          
          // Ensure all foods have images
          const foodsWithImages = foodsData.map(food => {
            if (!food.image) {
              return {
                ...food,
                image: getFoodImage(food)
              };
            }
            return food;
          });
          
          setFoods(foodsWithImages);
          localStorage.setItem('eatwise-foods', JSON.stringify(foodsWithImages));
          console.log('Loaded foods from Supabase:', foodsWithImages.length);
        } else {
          // Fall back to localStorage if offline or not authenticated
          const savedFoods = localStorage.getItem('eatwise-foods');
          if (savedFoods) {
            try {
              const parsedFoods = JSON.parse(savedFoods);
              setFoods(parsedFoods);
              console.log('Loaded foods from localStorage:', parsedFoods.length);
            } catch (error) {
              console.error('Error parsing saved foods:', error);
              setFoods([]);
            }
          } else {
            console.log('No saved foods found');
            setFoods([]);
          }
        }
      } catch (error) {
        console.error('Error loading foods:', error);
        
        // Fall back to localStorage if there's an error
        const savedFoods = localStorage.getItem('eatwise-foods');
        if (savedFoods) {
          try {
            const parsedFoods = JSON.parse(savedFoods);
            setFoods(parsedFoods);
          } catch (error) {
            console.error('Error parsing saved foods:', error);
            setFoods([]);
          }
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    loadFoods();
  }, [user, isOnline]);

  // Load daily logs for the current date
  useEffect(() => {
    const loadDailyLogs = async () => {
      if (!user || !isOnline) {
        // If offline or not authenticated, use localStorage
        const savedDailyLog = localStorage.getItem('eatwise-dailyLog');
        if (savedDailyLog) {
          try {
            setDailyLog(JSON.parse(savedDailyLog));
          } catch (error) {
            console.error('Error parsing saved daily log:', error);
            setDailyLog({});
          }
        }
        return;
      }
      
      try {
        const logsData = await fetchDailyLogs(currentDate);
        
        // Update the dailyLog state with the fetched data for the current date
        setDailyLog(prevLogs => ({
          ...prevLogs,
          [currentDate]: logsData
        }));
        
        // Also update localStorage for offline access
        localStorage.setItem('eatwise-dailyLog', JSON.stringify({
          ...JSON.parse(localStorage.getItem('eatwise-dailyLog') || '{}'),
          [currentDate]: logsData
        }));
      } catch (error) {
        console.error('Error loading daily logs:', error);
      }
    };
    
    if (user && isInitialized) {
      loadDailyLogs();
    }
  }, [currentDate, user, isInitialized, isOnline]);

  // Save to localStorage whenever foods changes
  useEffect(() => {
    if (isInitialized && foods.length > 0) {
      localStorage.setItem('eatwise-foods', JSON.stringify(foods));
    }
  }, [foods, isInitialized]);
  
  // Save to localStorage whenever dailyLog changes
  useEffect(() => {
    if (isInitialized && Object.keys(dailyLog).length > 0) {
      localStorage.setItem('eatwise-dailyLog', JSON.stringify(dailyLog));
    }
  }, [dailyLog, isInitialized]);

  const addFood = async (newFood) => {
    try {
      // Add an image to the food based on its name or category if not provided
      const foodWithImage = {
        ...newFood,
        image: newFood.image || getFoodImage(newFood)
      };
      
      if (user && isOnline) {
        // Add to Supabase if online and authenticated
        const addedFood = await addFoodToDatabase(foodWithImage);
        
        // Update local state
        setFoods(prevFoods => [...prevFoods, addedFood]);
        return addedFood;
      } else {
        // Add locally if offline or not authenticated
        const uniqueId = `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        
        const foodWithId = {
          ...foodWithImage,
          id: uniqueId
        };
        
        // Update state with the new food
        setFoods(prevFoods => [...prevFoods, foodWithId]);
        
        return foodWithId;
      }
    } catch (error) {
      console.error('Error adding food:', error);
      throw error;
    }
  };

  const updateFood = async (id, updatedFood) => {
    try {
      // Ensure the food has an image
      const foodWithImage = {
        ...updatedFood,
        image: updatedFood.image || getFoodImage(updatedFood)
      };
      
      if (user && isOnline && !id.startsWith('local-')) {
        // Update in Supabase if online and authenticated
        await updateFoodInDatabase(id, foodWithImage);
      }
      
      // Update local state
      const updatedFoods = foods.map(food => 
        food.id === id ? { ...food, ...foodWithImage } : food
      );
      
      setFoods(updatedFoods);
      
      return { ...foodWithImage, id };
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  };

  const deleteFood = async (id) => {
    try {
      if (user && isOnline && !id.startsWith('local-')) {
        // Delete from Supabase if online and authenticated
        await deleteFoodFromDatabase(id);
      }
      
      // Update local state
      const filteredFoods = foods.filter(food => food.id !== id);
      setFoods(filteredFoods);
      
      return true;
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  };

  const getFood = (id) => {
    return foods.find(food => food.id === id);
  };

  const addFoodToLog = async (date, mealType, food, quantity) => {
    try {
      // Handle "all" meal type by using "breakfast" as default
      const actualMealType = mealType === "all" ? "breakfast" : mealType;
      
      if (user && isOnline) {
        // Add to Supabase if online and authenticated
        const addedLogItem = await addFoodToLogService(date, actualMealType, food.id, quantity);
        
        // Update local state
        setDailyLog(prevLog => {
          const dateLog = prevLog[date] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
          
          return {
            ...prevLog,
            [date]: {
              ...dateLog,
              [actualMealType]: [
                ...dateLog[actualMealType],
                addedLogItem
              ]
            }
          };
        });
        
        return addedLogItem;
      } else {
        // Add locally if offline or not authenticated
        const dateLog = dailyLog[date] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
        
        // Create the food log item
        const foodLogItem = {
          id: `local-${Date.now().toString()}`,
          foodId: food.id,
          name: food.name,
          quantity,
          calories: Math.round((food.calories * quantity) / food.serving),
          protein: Math.round((food.protein * quantity) / food.serving * 10) / 10,
          carbs: Math.round((food.carbs * quantity) / food.serving * 10) / 10,
          fat: Math.round((food.fat * quantity) / food.serving * 10) / 10,
          fiber: Math.round((food.fiber * quantity) / food.serving * 10) / 10,
          image: food.image,
          mealType: actualMealType
        };
        
        const updatedLog = {
          ...dailyLog,
          [date]: {
            ...dateLog,
            [actualMealType]: [
              ...dateLog[actualMealType],
              foodLogItem
            ]
          }
        };
        
        setDailyLog(updatedLog);
        
        return foodLogItem;
      }
    } catch (error) {
      console.error('Error adding food to log:', error);
      throw error;
    }
  };

  const removeFoodFromLog = async (date, mealType, logItemId) => {
    try {
      if (!dailyLog[date]) return false;
      
      if (user && isOnline && !logItemId.startsWith('local-')) {
        // Remove from Supabase if online and authenticated
        await removeFoodFromLogService(logItemId);
      }
      
      // If mealType is "all", we need to search in all meal types
      if (mealType === "all") {
        const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];
        let found = false;
        
        const updatedDateLog = { ...dailyLog[date] };
        
        // Search through all meal types to find and remove the item
        mealTypes.forEach(type => {
          if (updatedDateLog[type] && !found) {
            const itemIndex = updatedDateLog[type].findIndex(item => item.id === logItemId);
            if (itemIndex !== -1) {
              updatedDateLog[type] = updatedDateLog[type].filter(item => item.id !== logItemId);
              found = true;
            }
          }
        });
        
        if (found) {
          const updatedLog = {
            ...dailyLog,
            [date]: updatedDateLog
          };
          
          setDailyLog(updatedLog);
          return true;
        }
      } else {
        // Original behavior for specific meal types
        if (!dailyLog[date][mealType]) return false;
        
        const updatedMeal = dailyLog[date][mealType].filter(item => item.id !== logItemId);
        
        const updatedLog = {
          ...dailyLog,
          [date]: {
            ...dailyLog[date],
            [mealType]: updatedMeal
          }
        };
        
        setDailyLog(updatedLog);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error removing food from log:', error);
      throw error;
    }
  };

  const getDailyNutrition = async (date) => {
    try {
      if (user && isOnline) {
        // Get from Supabase if online and authenticated
        return await getDailyNutritionSummary(date);
      } else {
        // Calculate locally if offline or not authenticated
        if (!dailyLog[date]) {
          return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        }
        
        const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
        
        return meals.reduce((totals, meal) => {
          const mealItems = dailyLog[date][meal] || [];
          
          mealItems.forEach(item => {
            totals.calories += item.calories;
            totals.protein += item.protein;
            totals.carbs += item.carbs;
            totals.fat += item.fat;
            totals.fiber += (item.fiber || 0);
          });
          
          return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
      }
    } catch (error) {
      console.error('Error getting daily nutrition:', error);
      
      // Fall back to local calculation
      if (!dailyLog[date]) {
        return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
      }
      
      const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
      
      return meals.reduce((totals, meal) => {
        const mealItems = dailyLog[date][meal] || [];
        
        mealItems.forEach(item => {
          totals.calories += item.calories;
          totals.protein += item.protein;
          totals.carbs += item.carbs;
          totals.fat += item.fat;
          totals.fiber += (item.fiber || 0);
        });
        
        return totals;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    }
  };

  // Function to force refresh foods from Supabase
  const refreshFoods = async () => {
    if (!user || !isOnline) return false;
    
    try {
      setIsLoading(true);
      const foodsData = await fetchFoods();
      
      // Ensure all foods have images
      const foodsWithImages = foodsData.map(food => {
        if (!food.image) {
          return {
            ...food,
            image: getFoodImage(food)
          };
        }
        return food;
      });
      
      setFoods(foodsWithImages);
      localStorage.setItem('eatwise-foods', JSON.stringify(foodsWithImages));
      
      return true;
    } catch (error) {
      console.error('Error refreshing foods:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh daily logs for the current date
  const refreshDailyLogs = async () => {
    if (!user || !isOnline) return false;
    
    try {
      const logsData = await fetchDailyLogs(currentDate);
      
      // Update the dailyLog state with the fetched data for the current date
      setDailyLog(prevLogs => ({
        ...prevLogs,
        [currentDate]: logsData
      }));
      
      // Also update localStorage for offline access
      localStorage.setItem('eatwise-dailyLog', JSON.stringify({
        ...JSON.parse(localStorage.getItem('eatwise-dailyLog') || '{}'),
        [currentDate]: logsData
      }));
      
      return true;
    } catch (error) {
      console.error('Error refreshing daily logs:', error);
      return false;
    }
  };

  return (
    <FoodContext.Provider value={{
      foods,
      addFood,
      updateFood,
      deleteFood,
      getFood,
      refreshFoods,
      dailyLog,
      currentDate,
      setCurrentDate,
      addFoodToLog,
      removeFoodFromLog,
      getDailyNutrition,
      refreshDailyLogs,
      isLoading,
      user,
      isOnline
    }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  return useContext(FoodContext);
}
