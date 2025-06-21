export default function NutrientsSummary({ protein, proteinGoal, carbs, carbsGoal, fat, fatGoal }) {
  // Calculate percentages
  const proteinPercentage = Math.min(Math.round((protein / proteinGoal) * 100), 100);
  const carbsPercentage = Math.min(Math.round((carbs / carbsGoal) * 100), 100);
  const fatPercentage = Math.min(Math.round((fat / fatGoal) * 100), 100);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-4">Macronutrients</h3>
      
      <div className="space-y-4">
        {/* Protein */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Protein</span>
            <span className="text-xs text-gray-500">{Math.round(protein)}g of {proteinGoal}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-blue-500" 
              style={{ width: `${proteinPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Carbs */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Carbs</span>
            <span className="text-xs text-gray-500">{Math.round(carbs)}g of {carbsGoal}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-purple-500" 
              style={{ width: `${carbsPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Fat */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Fat</span>
            <span className="text-xs text-gray-500">{Math.round(fat)}g of {fatGoal}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-yellow-500" 
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Macronutrient distribution */}
      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-500 mb-2">Calorie Distribution</h4>
        <div className="flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500" 
            style={{ width: `${Math.round((protein * 4) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%` }}
          ></div>
          <div 
            className="bg-purple-500" 
            style={{ width: `${Math.round((carbs * 4) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%` }}
          ></div>
          <div 
            className="bg-yellow-500" 
            style={{ width: `${Math.round((fat * 9) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%` }}
          ></div>
        </div>
        <div className="flex text-xs mt-1 justify-between">
          <span className="text-blue-500">{Math.round((protein * 4) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%</span>
          <span className="text-purple-500">{Math.round((carbs * 4) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%</span>
          <span className="text-yellow-500">{Math.round((fat * 9) / ((protein * 4) + (carbs * 4) + (fat * 9)) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
