import { createContext, useContext, useState, useEffect } from 'react'

const FoodContext = createContext()

// Sample food database
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
    category: 'protein'
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
    category: 'carbs'
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
    category: 'vegetables'
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
    category: 'fats'
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
    category: 'fruits'
  }
]

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([])
  const [dailyLog, setDailyLog] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  // Load foods from localStorage on mount
  useEffect(() => {
    const savedFoods = localStorage.getItem('eatwise-foods')
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods))
    } else {
      setFoods(initialFoods)
      localStorage.setItem('eatwise-foods', JSON.stringify(initialFoods))
    }
    
    const savedDailyLog = localStorage.getItem('eatwise-dailyLog')
    if (savedDailyLog) {
      setDailyLog(JSON.parse(savedDailyLog))
    }
  }, [])

  // Save to localStorage whenever foods or dailyLog changes
  useEffect(() => {
    localStorage.setItem('eatwise-foods', JSON.stringify(foods))
  }, [foods])
  
  useEffect(() => {
    localStorage.setItem('eatwise-dailyLog', JSON.stringify(dailyLog))
  }, [dailyLog])

  const addFood = (newFood) => {
    const foodWithId = {
      ...newFood,
      id: Date.now().toString()
    }
    setFoods([...foods, foodWithId])
    return foodWithId
  }

  const updateFood = (id, updatedFood) => {
    setFoods(foods.map(food => food.id === id ? { ...food, ...updatedFood } : food))
  }

  const deleteFood = (id) => {
    setFoods(foods.filter(food => food.id !== id))
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
          }
        ]
      }
    }
    
    setDailyLog(updatedLog)
  }

  const removeFoodFromLog = (date, mealType, logItemId) => {
    if (!dailyLog[date]) return
    
    const updatedMeal = dailyLog[date][mealType].filter(item => item.id !== logItemId)
    
    setDailyLog({
      ...dailyLog,
      [date]: {
        ...dailyLog[date],
        [mealType]: updatedMeal
      }
    })
  }

  const getDailyNutrition = (date) => {
    if (!dailyLog[date]) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    }
    
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks']
    
    return meals.reduce((totals, meal) => {
      const mealItems = dailyLog[date][meal] || []
      
      mealItems.forEach(item => {
        totals.calories += item.calories
        totals.protein += item.protein
        totals.carbs += item.carbs
        totals.fat += item.fat
      })
      
      return totals
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  return (
    <FoodContext.Provider value={{
      foods,
      addFood,
      updateFood,
      deleteFood,
      getFood,
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
