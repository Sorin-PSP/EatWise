import React from 'react';
import Card from './Card';
import NutrientProgressCircle from './NutrientProgressCircle';

function NutrientsSummary({ 
  protein = 0, 
  proteinGoal = 150,
  carbs = 0, 
  carbsGoal = 250,
  fat = 0, 
  fatGoal = 70,
  className = '' 
}) {
  return (
    <Card className={`${className}`}>
      <h3 className="font-medium mb-4">Macronutrients</h3>
      
      <div className="flex flex-wrap justify-around">
        <NutrientProgressCircle
          value={protein}
          max={proteinGoal}
          title="Protein"
          color="primary"
        />
        
        <NutrientProgressCircle
          value={carbs}
          max={carbsGoal}
          title="Carbs"
          color="secondary"
        />
        
        <NutrientProgressCircle
          value={fat}
          max={fatGoal}
          title="Fat"
          color="accent"
        />
      </div>
    </Card>
  );
}

export default NutrientsSummary;
