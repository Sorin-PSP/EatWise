import React from 'react';
import { useFood } from '../contexts/FoodContext';

function NutritionSummary({ date }) {
  const { getDailyNutrition } = useFood();
  
  // Get nutrition data for the specified date
  const nutrition = getDailyNutrition(date);
  
  // Define nutrition goals
  const calorieGoal = 2000;
  const proteinGoal = 120;
  const carbsGoal = 250;
  const fatGoal = 70;
  
  // Calculate percentages
  const caloriePercentage = Math.min(Math.round((nutrition.calories / calorieGoal) * 100), 100);
  const proteinPercentage = Math.min(Math.round((nutrition.protein / proteinGoal) * 100), 100);
  const carbsPercentage = Math.min(Math.round((nutrition.carbs / carbsGoal) * 100), 100);
  const fatPercentage = Math.min(Math.round((nutrition.fat / fatGoal) * 100), 100);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <div className="text-sm opacity-80 mb-1">Calories</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{nutrition.calories}</span>
          <span className="ml-1 opacity-80">/ {calorieGoal}</span>
        </div>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full" 
            style={{ width: `${caloriePercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="text-sm opacity-80 mb-1">Protein</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{nutrition.protein}g</span>
          <span className="ml-1 opacity-80">/ {proteinGoal}g</span>
        </div>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full" 
            style={{ width: `${proteinPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="text-sm opacity-80 mb-1">Carbs</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{nutrition.carbs}g</span>
          <span className="ml-1 opacity-80">/ {carbsGoal}g</span>
        </div>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full" 
            style={{ width: `${carbsPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <div className="text-sm opacity-80 mb-1">Fat</div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">{nutrition.fat}g</span>
          <span className="ml-1 opacity-80">/ {fatGoal}g</span>
        </div>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full rounded-full" 
            style={{ width: `${fatPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default NutritionSummary;
