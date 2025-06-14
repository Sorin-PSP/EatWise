import { useFood } from '../contexts/FoodContext'
import { useUser } from '../contexts/UserContext'
import { FaFire, FaDrumstickBite, FaBreadSlice, FaOilCan } from 'react-icons/fa'

function NutritionSummary({ date }) {
  const { getDailyNutrition } = useFood()
  const { user } = useUser()
  
  const nutrition = getDailyNutrition(date)
  
  const calculatePercentage = (value, goal) => {
    if (!goal) return 0
    const percentage = (value / goal) * 100
    return Math.min(percentage, 100)
  }
  
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Nutritional Summary</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              <span>Calories</span>
            </div>
            <span className="font-medium">{nutrition.calories} / {user.dailyCalorieGoal} kcal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-orange-500 h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(nutrition.calories, user.dailyCalorieGoal)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <FaDrumstickBite className="text-red-500 mr-2" />
              <span>Protein</span>
            </div>
            <span className="font-medium">{nutrition.protein} / {user.dailyProteinGoal} g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-red-500 h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(nutrition.protein, user.dailyProteinGoal)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <FaBreadSlice className="text-yellow-500 mr-2" />
              <span>Carbs</span>
            </div>
            <span className="font-medium">{nutrition.carbs} / {user.dailyCarbsGoal} g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(nutrition.carbs, user.dailyCarbsGoal)}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <FaOilCan className="text-blue-500 mr-2" />
              <span>Fat</span>
            </div>
            <span className="font-medium">{nutrition.fat} / {user.dailyFatGoal} g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(nutrition.fat, user.dailyFatGoal)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionSummary
