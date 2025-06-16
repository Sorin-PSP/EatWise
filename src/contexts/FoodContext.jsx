import { createContext, useContext, useState, useEffect } from 'react'

const FoodContext = createContext()

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

// Sample food database with images
const initialFoods = [
  {
    id: '1',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    serving: 100,
    unit: 'g',
    category: 'protein',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: '2',
    name: 'White Rice',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    serving: 100,
    unit: 'g',
    category: 'carbs',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: '3',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    fiber: 2.6,
    serving: 100,
    unit: 'g',
    category: 'vegetables',
    image: 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: '4',
    name: 'Olive Oil',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    serving: 100,
    unit: 'ml',
    category: 'fats',
    image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: '5',
    name: 'Apples',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    serving: 100,
    unit: 'g',
    category: 'fruits',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  }
]

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
  const [foods, setFoods] = useState([])
  const [dailyLog, setDailyLog] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load foods from localStorage on mount
  useEffect(() => {
    const loadFoodsFromStorage = () => {
      const savedFoods = localStorage.getItem('eatwise-foods')
      if (savedFoods) {
        try {
          const parsedFoods = JSON.parse(savedFoods)
          
          // Ensure all foods have images
          const foodsWithImages = parsedFoods.map(food => {
            if (!food.image) {
              return {
                ...food,
                image: getFoodImage(food)
              };
            }
            return food;
          });
          
          setFoods(foodsWithImages)
          console.log('Loaded foods from localStorage:', foodsWithImages.length)
        } catch (error) {
          console.error('Error parsing saved foods:', error)
          
          // Add images to initial foods
          const initialFoodsWithImages = initialFoods.map(food => {
            if (!food.image) {
              return {
                ...food,
                image: getFoodImage(food)
              };
            }
            return food;
          });
          
          setFoods(initialFoodsWithImages)
          localStorage.setItem('eatwise-foods', JSON.stringify(initialFoodsWithImages))
        }
      } else {
        console.log('No saved foods found, using initial foods')
        
        // Add images to initial foods
        const initialFoodsWithImages = initialFoods.map(food => {
          if (!food.image) {
            return {
              ...food,
              image: getFoodImage(food)
            };
          }
          return food;
        });
        
        setFoods(initialFoodsWithImages)
        localStorage.setItem('eatwise-foods', JSON.stringify(initialFoodsWithImages))
      }
      
      const savedDailyLog = localStorage.getItem('eatwise-dailyLog')
      if (savedDailyLog) {
        try {
          setDailyLog(JSON.parse(savedDailyLog))
        } catch (error) {
          console.error('Error parsing saved daily log:', error)
          setDailyLog({})
        }
      }
      
      setIsInitialized(true)
    }
    
    loadFoodsFromStorage()
    
    // Set up a storage event listener to sync data across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'eatwise-foods') {
        try {
          const updatedFoods = JSON.parse(e.newValue)
          setFoods(updatedFoods)
          console.log('Updated foods from storage event:', updatedFoods.length)
        } catch (error) {
          console.error('Error parsing foods from storage event:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Set up an interval to periodically check for new foods
    const intervalId = setInterval(() => {
      refreshFoods()
    }, 5000) // Check every 5 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  // Save to localStorage whenever foods changes
  useEffect(() => {
    if (isInitialized && foods.length > 0) {
      console.log('Saving foods to localStorage:', foods.length)
      localStorage.setItem('eatwise-foods', JSON.stringify(foods))
      
      // Dispatch a custom event to notify other components that foods have been updated
      window.dispatchEvent(new CustomEvent('foodsUpdated', { detail: { foods } }))
    }
  }, [foods, isInitialized])
  
  // Save to localStorage whenever dailyLog changes
  useEffect(() => {
    if (isInitialized && Object.keys(dailyLog).length > 0) {
      localStorage.setItem('eatwise-dailyLog', JSON.stringify(dailyLog))
    }
  }, [dailyLog, isInitialized])

  const addFood = async (newFood) => {
    return new Promise((resolve) => {
      // Generate a unique ID based on timestamp and a random number
      // This helps prevent collisions when adding multiple foods in quick succession
      const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Add an image to the food based on its name or category
      const foodWithImage = {
        ...newFood,
        image: newFood.image || getFoodImage(newFood)
      };
      
      const foodWithId = {
        ...foodWithImage,
        id: uniqueId
      };
      
      console.log('Adding new food:', foodWithId.name);
      
      // Create a new array with the new food to avoid state mutation issues
      const updatedFoods = [...foods, foodWithId];
      
      // Update state with the new food
      setFoods(updatedFoods);
      
      // Immediately save to localStorage for redundancy
      localStorage.setItem('eatwise-foods', JSON.stringify(updatedFoods));
      
      // Dispatch a custom event to notify other components that a food has been added
      window.dispatchEvent(new CustomEvent('foodAdded', { detail: { food: foodWithId } }));
      
      // Resolve the promise with the new food
      resolve(foodWithId);
    });
  };

  const updateFood = (id, updatedFood) => {
    // Ensure the food has an image
    const foodWithImage = {
      ...updatedFood,
      image: updatedFood.image || getFoodImage(updatedFood)
    };
    
    const updatedFoods = foods.map(food => 
      food.id === id ? { ...food, ...foodWithImage } : food
    )
    
    setFoods(updatedFoods)
    
    // Immediately save to localStorage
    localStorage.setItem('eatwise-foods', JSON.stringify(updatedFoods))
    
    // Dispatch a custom event to notify other components that a food has been updated
    window.dispatchEvent(new CustomEvent('foodUpdated', { detail: { id, updatedFood: foodWithImage } }))
  }

  const deleteFood = (id) => {
    const filteredFoods = foods.filter(food => food.id !== id)
    setFoods(filteredFoods)
    
    // Immediately save to localStorage
    localStorage.setItem('eatwise-foods', JSON.stringify(filteredFoods))
    
    // Dispatch a custom event to notify other components that a food has been deleted
    window.dispatchEvent(new CustomEvent('foodDeleted', { detail: { id } }))
  }

  const getFood = (id) => {
    return foods.find(food => food.id === id)
  }

  const addFoodToLog = (date, mealType, food, quantity) => {
    const dateLog = dailyLog[date] || { breakfast: [], lunch: [], dinner: [], snacks: [] }
    
    const updatedLog = {
      ...dailyLog,
      [date]: {
        ...dateLog,
        [mealType]: [
          ...dateLog[mealType],
          {
            id: Date.now().toString(),
            foodId: food.id,
            name: food.name,
            quantity,
            calories: Math.round((food.calories * quantity) / food.serving),
            protein: Math.round((food.protein * quantity) / food.serving * 10) / 10,
            carbs: Math.round((food.carbs * quantity) / food.serving * 10) / 10,
            fat: Math.round((food.fat * quantity) / food.serving * 10) / 10,
            fiber: Math.round((food.fiber * quantity) / food.serving * 10) / 10,
            image: food.image // Include the food image in the log
          }
        ]
      }
    }
    
    setDailyLog(updatedLog)
    
    // Immediately save to localStorage
    localStorage.setItem('eatwise-dailyLog', JSON.stringify(updatedLog))
  }

  const removeFoodFromLog = (date, mealType, logItemId) => {
    if (!dailyLog[date]) return
    
    const updatedMeal = dailyLog[date][mealType].filter(item => item.id !== logItemId)
    
    const updatedLog = {
      ...dailyLog,
      [date]: {
        ...dailyLog[date],
        [mealType]: updatedMeal
      }
    }
    
    setDailyLog(updatedLog)
    
    // Immediately save to localStorage
    localStorage.setItem('eatwise-dailyLog', JSON.stringify(updatedLog))
  }

  const getDailyNutrition = (date) => {
    if (!dailyLog[date]) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    }
    
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks']
    
    return meals.reduce((totals, meal) => {
      const mealItems = dailyLog[date][meal] || []
      
      mealItems.forEach(item => {
        totals.calories += item.calories
        totals.protein += item.protein
        totals.carbs += item.carbs
        totals.fat += item.fat
        totals.fiber += (item.fiber || 0)
      })
      
      return totals
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  }

  // Function to force refresh foods from localStorage
  const refreshFoods = async () => {
    return new Promise((resolve) => {
      const savedFoods = localStorage.getItem('eatwise-foods')
      if (savedFoods) {
        try {
          const parsedFoods = JSON.parse(savedFoods)
          
          // Only update if the foods have changed (different length or new items)
          if (parsedFoods.length !== foods.length) {
            console.log('Food count changed, refreshing foods from localStorage')
            setFoods(parsedFoods)
            resolve(true)
            return
          }
          
          // Check if there are any new foods by comparing IDs
          const currentIds = new Set(foods.map(food => food.id))
          const hasNewFoods = parsedFoods.some(food => !currentIds.has(food.id))
          
          if (hasNewFoods) {
            console.log('New foods detected, refreshing foods from localStorage')
            setFoods(parsedFoods)
            resolve(true)
            return
          }
          
          resolve(false)
        } catch (error) {
          console.error('Error parsing saved foods during refresh:', error)
          resolve(false)
        }
      } else {
        resolve(false)
      }
    });
  }

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
      getDailyNutrition
    }}>
      {children}
    </FoodContext.Provider>
  )
}

export function useFood() {
  return useContext(FoodContext)
}
