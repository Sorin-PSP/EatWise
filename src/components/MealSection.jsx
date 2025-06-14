import { useState } from 'react'
import { useFood } from '../contexts/FoodContext'
import { FaPlus, FaTrash } from 'react-icons/fa'
import FoodSelector from './FoodSelector'

function MealSection({ date, mealType, title, icon }) {
  const { dailyLog, removeFoodFromLog } = useFood()
  const [showFoodSelector, setShowFoodSelector] = useState(false)
  
  const mealItems = dailyLog[date]?.[mealType] || []
  
  const totalCalories = mealItems.reduce((sum, item) => sum + item.calories, 0)
  
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-medium ml-2">{title}</h3>
        </div>
        <span className="text-gray-600 font-medium">{totalCalories} kcal</span>
      </div>
      
      {mealItems.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {mealItems.map(item => (
            <li key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.quantity}g • {item.calories} kcal</p>
              </div>
              <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-3">
                  P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                </p>
                <button 
                  onClick={() => removeFoodFromLog(date, mealType, item.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete food"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">You haven't added any food to {title.toLowerCase()}</p>
      )}
      
      <button 
        onClick={() => setShowFoodSelector(true)}
        className="mt-4 flex items-center justify-center w-full py-2 border border-dashed border-gray-300 rounded-lg text-primary hover:bg-gray-50 transition-colors"
      >
        <FaPlus className="mr-2" />
        <span>Add food</span>
      </button>
      
      {showFoodSelector && (
        <FoodSelector 
          date={date}
          mealType={mealType}
          onClose={() => setShowFoodSelector(false)}
        />
      )}
    </div>
  )
}

export default MealSection
