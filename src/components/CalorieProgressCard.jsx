import React from 'react';
import { FaFire } from 'react-icons/fa';
import Card from './Card';
import ProgressBar from './ProgressBar';

function CalorieProgressCard({ 
  consumed = 0, 
  goal = 2000, 
  remaining = 2000,
  className = '' 
}) {
  const percentage = Math.min(Math.max((consumed / goal) * 100, 0), 100);
  
  // Determine color based on percentage
  const getProgressVariant = () => {
    if (percentage > 100) return 'error';
    if (percentage > 90) return 'warning';
    return 'primary';
  };

  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <FaFire className="text-primary text-xl mr-2" />
        <h3 className="font-medium">Calories</h3>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Consumed</span>
        <span className="font-medium">{consumed} kcal</span>
      </div>
      
      <ProgressBar 
        value={consumed} 
        max={goal} 
        variant={getProgressVariant()} 
        size="lg"
        className="mb-4"
      />
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Goal</div>
          <div className="font-medium text-lg">{goal} kcal</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Remaining</div>
          <div className={`font-medium text-lg ${remaining < 0 ? 'text-error' : ''}`}>
            {remaining} kcal
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CalorieProgressCard;
