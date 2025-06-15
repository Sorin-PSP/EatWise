import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { convertFoodServing } from '../utils/unitConversion';

function MealLogItem({ logEntry, onDelete, onEdit }) {
  const { food, quantity, mealType } = logEntry;
  const { measurementSystem } = useUser();
  const [displayQuantity, setDisplayQuantity] = useState(quantity);
  const [displayUnit, setDisplayUnit] = useState(food.unit);
  
  // Convert quantity to the current measurement system
  useEffect(() => {
    if (food && quantity) {
      // Convert food serving to the current measurement system
      const convertedServing = convertFoodServing(
        quantity,
        food.unit,
        'metric', // Food is always stored in metric
        measurementSystem
      );
      
      setDisplayQuantity(convertedServing.amount);
      setDisplayUnit(convertedServing.unit);
    }
  }, [food, quantity, measurementSystem]);
  
  // Calculate nutrition values based on quantity
  const calculateNutrition = (nutrientValue) => {
    if (!food) return 0;
    
    const ratio = quantity / food.serving;
    return (nutrientValue * ratio).toFixed(1);
  };
  
  const calories = Math.round(food.calories * (quantity / food.serving));
  const protein = calculateNutrition(food.protein);
  const carbs = calculateNutrition(food.carbs);
  const fat = calculateNutrition(food.fat);
  const fiber = calculateNutrition(food.fiber || 0);
  const netCarbs = Math.max(0, parseFloat(carbs) - parseFloat(fiber)).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{food.name}</div>
          <div className="text-sm text-gray-500">
            {displayQuantity} {displayUnit} • {calories} kcal
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(logEntry)}
            className="p-1.5 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100"
            title="Edit entry"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(logEntry.id)}
            className="p-1.5 text-gray-400 hover:text-error rounded-full hover:bg-gray-100"
            title="Remove from meal"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
        <div className="bg-blue-50 p-1.5 rounded text-center">
          <div className="font-semibold text-blue-700">{protein}g</div>
          <div className="text-blue-600">Protein</div>
        </div>
        <div className="bg-amber-50 p-1.5 rounded text-center">
          <div className="font-semibold text-amber-700">{carbs}g</div>
          <div className="text-amber-600">Carbs</div>
        </div>
        <div className="bg-green-50 p-1.5 rounded text-center">
          <div className="font-semibold text-green-700">{fiber}g</div>
          <div className="text-green-600">Fiber</div>
        </div>
        <div className="bg-pink-50 p-1.5 rounded text-center">
          <div className="font-semibold text-pink-700">{fat}g</div>
          <div className="text-pink-600">Fat</div>
        </div>
      </div>
    </div>
  );
}

export default MealLogItem;
