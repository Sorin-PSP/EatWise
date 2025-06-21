import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFood } from '../contexts/FoodContext';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MealSection({ date, mealType, title }) {
  const { getMealEntries, removeFoodFromLog } = useFood();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(mealType === 'all');
  
  // Get meal entries for this meal type
  const entries = getMealEntries(date, mealType);
  
  // Calculate total nutrition for this meal
  const totalNutrition = entries.reduce(
    (total, entry) => {
      return {
        calories: total.calories + (entry.food.calories * entry.servings),
        protein: total.protein + (entry.food.protein * entry.servings),
        carbs: total.carbs + (entry.food.carbs * entry.servings),
        fat: total.fat + (entry.food.fat * entry.servings)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
  // Format number to have at most 1 decimal place
  const formatNumber = (num) => {
    return Math.round(num * 10) / 10;
  };
  
  // Handle removing a food entry
  const handleRemove = (entryId) => {
    if (window.confirm('Are you sure you want to remove this food from your log?')) {
      removeFoodFromLog(date, entryId);
    }
  };
  
  // Navigate to add food page
  const handleAddFood = () => {
    navigate('/log', { state: { date, mealType } });
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="px-4 py-3 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {entries.length > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({formatNumber(totalNutrition.calories)} kcal)
            </span>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddFood();
          }}
          className="p-1 rounded-full hover:bg-gray-200"
          aria-label="Add food"
        >
          <PlusIcon className="h-5 w-5 text-green-600" />
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-4 py-2">
          {entries.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">No foods logged for this meal yet.</p>
          ) : (
            <div className="divide-y">
              {entries.map((entry) => (
                <div key={entry.id} className="py-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{entry.food.name}</div>
                    <div className="text-sm text-gray-500">
                      {entry.servings} {entry.servings === 1 ? 'serving' : 'servings'} ({entry.food.servingSize} {entry.food.servingUnit})
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(entry.food.calories * entry.servings)} kcal</div>
                      <div className="text-xs text-gray-500">
                        P: {formatNumber(entry.food.protein * entry.servings)}g | 
                        C: {formatNumber(entry.food.carbs * entry.servings)}g | 
                        F: {formatNumber(entry.food.fat * entry.servings)}g
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleRemove(entry.id)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-600"
                        aria-label="Remove food"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Summary row */}
              <div className="py-2 flex justify-between items-center font-medium">
                <div>Total</div>
                <div className="text-right">
                  <div>{formatNumber(totalNutrition.calories)} kcal</div>
                  <div className="text-xs text-gray-600">
                    P: {formatNumber(totalNutrition.protein)}g | 
                    C: {formatNumber(totalNutrition.carbs)}g | 
                    F: {formatNumber(totalNutrition.fat)}g
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
