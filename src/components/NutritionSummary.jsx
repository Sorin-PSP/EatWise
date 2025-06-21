import { useFood } from '../contexts/FoodContext';

export default function NutritionSummary({ date }) {
  const { getDailyNutrition } = useFood();
  const nutrition = getDailyNutrition(date);
  
  // Format number to have at most 1 decimal place
  const formatNumber = (num) => {
    return Math.round(num * 10) / 10;
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <h4 className="text-sm font-medium opacity-80">Calories</h4>
        <p className="text-lg font-bold">{formatNumber(nutrition.calories)} kcal</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium opacity-80">Protein</h4>
        <p className="text-lg font-bold">{formatNumber(nutrition.protein)} g</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium opacity-80">Carbs</h4>
        <p className="text-lg font-bold">{formatNumber(nutrition.carbs)} g</p>
      </div>
      
      <div>
        <h4 className="text-sm font-medium opacity-80">Fat</h4>
        <p className="text-lg font-bold">{formatNumber(nutrition.fat)} g</p>
      </div>
    </div>
  );
}
