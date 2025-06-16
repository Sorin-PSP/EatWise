import { useState, useEffect } from 'react'
import DateSelector from '../components/DateSelector'
import NutritionSummary from '../components/NutritionSummary'
import MealSection from '../components/MealSection'
import NutritionChart from '../components/NutritionChart'
import { useFood } from '../contexts/FoodContext'
import { useUser } from '../contexts/UserContext'
import CalorieProgressCard from '../components/CalorieProgressCard'
import NutrientsSummary from '../components/NutrientsSummary'
import DailyWaterTracker from '../components/DailyWaterTracker'
import WeightTracker from '../components/WeightTracker'

function DashboardPage() {
  const { currentDate, setCurrentDate, getDailyNutrition } = useFood()
  const { user, updateUser } = useUser()
  const [waterIntake, setWaterIntake] = useState(0)
  
  // Use user profile data for goals if available
  const calorieGoal = user.dailyCalorieGoal || 2000
  const proteinGoal = user.proteinGoal || 120
  const carbsGoal = user.carbsGoal || 250
  const fatGoal = user.fatGoal || 70
  const waterGoal = user.waterGoal || 8
  
  // Get daily nutrition data
  const dailyNutrition = getDailyNutrition(currentDate)
  
  // Load water data from localStorage on component mount
  useEffect(() => {
    const loadWaterData = () => {
      const savedWaterData = localStorage.getItem('eatwise-water')
      if (savedWaterData) {
        try {
          const parsedData = JSON.parse(savedWaterData)
          if (parsedData[currentDate]) {
            setWaterIntake(parsedData[currentDate])
          } else {
            setWaterIntake(0)
          }
        } catch (error) {
          console.error('Error parsing water data:', error)
          setWaterIntake(0)
        }
      }
    }
    
    loadWaterData()
  }, [currentDate])
  
  // Handle water intake changes
  const handleWaterIncrement = () => {
    const newValue = waterIntake + 1
    setWaterIntake(newValue)
    saveWaterData(newValue)
  }
  
  const handleWaterDecrement = () => {
    if (waterIntake > 0) {
      const newValue = waterIntake - 1
      setWaterIntake(newValue)
      saveWaterData(newValue)
    }
  }
  
  const saveWaterData = (value) => {
    try {
      const savedWaterData = localStorage.getItem('eatwise-water')
      const waterData = savedWaterData ? JSON.parse(savedWaterData) : {}
      
      waterData[currentDate] = value
      
      localStorage.setItem('eatwise-water', JSON.stringify(waterData))
    } catch (error) {
      console.error('Error saving water data:', error)
    }
  }
  
  // Handle weight update
  const handleUpdateWeight = (weight) => {
    // Update user profile with new weight
    const userData = {
      weight: weight
    }
    
    // If this is the first weight entry, set it as both current and start weight
    if (!user.weight) {
      userData.startWeight = weight
    }
    
    // If no goal weight is set, default to 10% less than current weight
    if (!user.goalWeight) {
      userData.goalWeight = Math.round(weight * 0.9 * 10) / 10 // Round to 1 decimal place
    }
    
    updateUser(userData)
    
    // Also save to localStorage for backward compatibility
    try {
      const weightData = {
        current: weight,
        start: user.startWeight || weight,
        goal: user.goalWeight || userData.goalWeight,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem('eatwise-weight', JSON.stringify(weightData))
    } catch (error) {
      console.error('Error saving weight data:', error)
    }
  }
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - dailyNutrition.calories
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        
        <DateSelector 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Meals</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <MealSection 
            date={currentDate}
            mealType="all"
            title="All Meals"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CalorieProgressCard 
          consumed={dailyNutrition.calories} 
          goal={calorieGoal} 
          remaining={remainingCalories}
        />
        
        <NutrientsSummary 
          protein={dailyNutrition.protein} 
          proteinGoal={proteinGoal}
          carbs={dailyNutrition.carbs} 
          carbsGoal={carbsGoal}
          fat={dailyNutrition.fat} 
          fatGoal={fatGoal}
        />
        
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center opacity-10" 
               style={{backgroundImage: "url('https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
          <h3 className="font-medium mb-4 relative z-10">Tip of the Day</h3>
          <div className="relative z-10">
            <p className="text-gray-700 mb-3">
              <span className="font-medium text-primary">Did you know?</span> Consuming protein helps you feel full for longer and reduces cravings for snacks.
            </p>
            <p className="text-gray-700">
              Try to include a source of protein with each meal to maintain your energy levels throughout the day.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DailyWaterTracker 
          current={waterIntake} 
          goal={waterGoal}
          onIncrement={handleWaterIncrement}
          onDecrement={handleWaterDecrement}
        />
        
        <WeightTracker 
          currentWeight={user.weight} 
          startWeight={user.startWeight}
          goalWeight={user.goalWeight}
          onUpdateWeight={handleUpdateWeight}
        />
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80"></div>
        <div className="relative z-10 p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
          <p className="mb-4">Keep maintaining healthy habits!</p>
          <NutritionSummary date={currentDate} />
        </div>
      </div>
      
      <div className="card">
        <h3 className="font-medium mb-4">Nutrient Evolution</h3>
        <NutritionChart />
      </div>
    </div>
  )
}

export default DashboardPage
