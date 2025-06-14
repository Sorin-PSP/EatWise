import React from 'react';
import { FaGlassWaterDroplet, FaPlus, FaMinus } from 'react-icons/fa6';
import Card from './Card';
import Button from './Button';

function DailyWaterTracker({ 
  current = 0, 
  goal = 8,
  onIncrement,
  onDecrement,
  className = '' 
}) {
  // Calculate percentage for visual representation
  const percentage = Math.min(Math.max((current / goal) * 100, 0), 100);
  
  // Generate water glasses display
  const renderWaterGlasses = () => {
    const glasses = [];
    
    for (let i = 0; i < goal; i++) {
      glasses.push(
        <div 
          key={i} 
          className={`w-8 h-10 flex items-center justify-center rounded-b-lg ${
            i < current ? 'bg-accent text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <FaGlassWaterDroplet />
        </div>
      );
    }
    
    return glasses;
  };

  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <FaGlassWaterDroplet className="text-accent text-xl mr-2" />
        <h3 className="font-medium">Hidratare</h3>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Pahare de apă</span>
        <span className="font-medium">{current} din {goal}</span>
      </div>
      
      <div className="flex justify-center space-x-2 mb-6 overflow-x-auto py-2">
        {renderWaterGlasses()}
      </div>
      
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          icon={FaMinus} 
          onClick={onDecrement}
          disabled={current <= 0}
          className="flex-1"
        >
          Elimină
        </Button>
        
        <Button 
          variant="accent" 
          icon={FaPlus} 
          onClick={onIncrement}
          disabled={current >= goal}
          className="flex-1"
        >
          Adaugă
        </Button>
      </div>
    </Card>
  );
}

export default DailyWaterTracker;
