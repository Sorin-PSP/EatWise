import React from 'react';
import Card from './Card';
import NutrientProgressCircle from './NutrientProgressCircle';
import { formatNutrient } from '../utils/formatters';

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
          value={formatNutrient(protein)}
          max={proteinGoal}
          title="Protein"
          color="primary"
        />
        
        <NutrientProgressCircle
          value={formatNutrient(carbs)}
          max={carbsGoal}
          title="Carbs"
          color="secondary"
        />
        
        <NutrientProgressCircle
          value={formatNutrient(fat)}
          max={fatGoal}
          title="Fat"
          color="accent"
        />
      </div>
    </Card>
  );
}

export default NutrientsSummary;
