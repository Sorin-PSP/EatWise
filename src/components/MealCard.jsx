import React from 'react';
import { FaPlus, FaTrash, FaUtensils } from 'react-icons/fa';
import Button from './Button';

function MealCard({ 
  title, 
  time, 
  calories, 
  foods = [], 
  onAddFood, 
  onRemoveFood,
  target = 500,
  className = "" 
}) {
  const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
  const completion = Math.min((totalCalories / target) * 100, 100);
  
  const totalNutrition = foods.reduce((totals, food) => {
    totals.protein += food.protein || 0;
    totals.carbs += food.carbs || 0;
    totals.fat += food.fat || 0;
    totals.fiber += food.fiber || 0;
    return totals;
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center mr-3">
            <FaUtensils className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            {time && <p className="text-sm text-gray-500">{time}</p>}
          </div>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onAddFood}
          icon={FaPlus}
        >
          Add Food
        </Button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Calories: {Math.round(totalCalories)} / {target}</span>
          <span>{Math.round(completion)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>
      
      {/* Food Items */}
      <div className="space-y-2 mb-4">
        {foods.length > 0 ? (
          foods.map((food, index) => (
            <div key={food.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {food.image && (
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-8 h-8 rounded object-cover mr-3"
                  />
                )}
                <div>
                  <div className="font-medium text-sm">{food.name}</div>
                  <div className="text-xs text-gray-500">
                    {food.amount || food.quantity}g • {food.calories} kcal
                  </div>
                </div>
              </div>
              
              {onRemoveFood && (
                <button
                  onClick={() => onRemoveFood(food.id || index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaUtensils className="mx-auto mb-2 text-2xl opacity-50" />
            <p>No foods added yet</p>
            <p className="text-sm">Click "Add Food" to start</p>
          </div>
        )}
      </div>
      
      {/* Nutrition Summary */}
      {foods.length > 0 && (
        <div className="pt-4 border-t">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <div className="font-medium">{Math.round(totalNutrition.protein)}g</div>
              <div className="text-gray-500">Protein</div>
            </div>
            <div>
              <div className="font-medium">{Math.round(totalNutrition.carbs)}g</div>
              <div className="text-gray-500">Carbs</div>
            </div>
            <div>
              <div className="font-medium">{Math.round(totalNutrition.fat)}g</div>
              <div className="text-gray-500">Fat</div>
            </div>
            <div>
              <div className="font-medium">{Math.round(totalNutrition.fiber)}g</div>
              <div className="text-gray-500">Fiber</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealCard;
