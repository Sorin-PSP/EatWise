import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { convertFoodServing } from '../utils/unitConversion';
import AddToMealModal from './AddToMealModal';

function FoodCard({ food, onEdit, onDelete }) {
  const { isAdmin, measurementSystem } = useUser();
  const [isAddToMealModalOpen, setIsAddToMealModalOpen] = useState(false);
  const [displayFood, setDisplayFood] = useState(food);
  
  // Convert food serving to the current measurement system
  useEffect(() => {
    if (food) {
      // Convert food serving to the current measurement system
      const convertedServing = convertFoodServing(
        food.serving,
        food.unit,
        'metric', // Food is always stored in metric
        measurementSystem
      );
      
      // Create a display version of the food with converted units
      setDisplayFood({
        ...food,
        serving: convertedServing.amount,
        unit: convertedServing.unit
      });
    }
  }, [food, measurementSystem]);
  
  const handleAddToMeal = () => {
    setIsAddToMealModalOpen(true);
  };
  
  const closeAddToMealModal = () => {
    setIsAddToMealModalOpen(false);
  };
  
  if (!displayFood) return null;
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 mb-1">{displayFood.name}</h3>
            <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
              {Math.round(displayFood.calories)} kcal
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mb-3">
            Per {displayFood.serving} {displayFood.unit} serving
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs mb-4">
            <div className="bg-blue-50 p-1.5 rounded text-center">
              <div className="font-semibold text-blue-700">{displayFood.protein}g</div>
              <div className="text-blue-600">Protein</div>
            </div>
            <div className="bg-amber-50 p-1.5 rounded text-center">
              <div className="font-semibold text-amber-700">{displayFood.carbs}g</div>
              <div className="text-amber-600">Carbs</div>
            </div>
            <div className="bg-pink-50 p-1.5 rounded text-center">
              <div className="font-semibold text-pink-700">{displayFood.fat}g</div>
              <div className="text-pink-600">Fat</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {displayFood.fiber > 0 && (
                <span className="mr-2">Fiber: {displayFood.fiber}g</span>
              )}
              <span>Net carbs: {Math.max(0, displayFood.carbs - displayFood.fiber)}g</span>
            </div>
            
            <div className="flex space-x-1">
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit(food)}
                    className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                    title="Edit food"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(food.id)}
                    className="p-1.5 text-gray-500 hover:text-error rounded-full hover:bg-gray-100"
                    title="Delete food"
                  >
                    <FaTrash size={14} />
                  </button>
                </>
              )}
              <button
                onClick={handleAddToMeal}
                className="p-1.5 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                title="Add to meal"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AddToMealModal
        isOpen={isAddToMealModalOpen}
        onClose={closeAddToMealModal}
        food={food}
      />
    </>
  );
}

export default FoodCard;
