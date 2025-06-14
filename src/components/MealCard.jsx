import React from 'react';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

function MealCard({ 
  title, 
  time,
  calories = 0,
  foods = [],
  onAddFood,
  className = '' 
}) {
  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          {time && <p className="text-sm text-gray-500">{time}</p>}
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-4">{calories} kcal</span>
          <button className="text-gray-500 hover:text-gray-700 p-1">
            <FaEllipsisV />
          </button>
        </div>
      </div>
      
      {foods.length > 0 ? (
        <div className="space-y-3 mb-4">
          {foods.map((food, index) => (
            <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{food.name}</p>
                <p className="text-sm text-gray-500">{food.amount} {food.unit}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{food.calories} kcal</p>
                <div className="flex text-xs text-gray-500 space-x-2">
                  <span>P: {food.protein}g</span>
                  <span>C: {food.carbs}g</span>
                  <span>G: {food.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 mb-4">
          <p>Nu ai adăugat alimente pentru această masă</p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        icon={FaPlus} 
        onClick={onAddFood}
        fullWidth
      >
        Adaugă aliment
      </Button>
    </Card>
  );
}

export default MealCard;
