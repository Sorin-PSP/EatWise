import React from 'react';
import { FaWater, FaMinus, FaPlus } from 'react-icons/fa';
import Card from './Card';

function DailyWaterTracker({ 
  current = 0, 
  goal = 8,
  onIncrement,
  onDecrement,
  className = '' 
}) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <FaWater className="text-blue-500 text-xl mr-2" />
        <h3 className="font-medium">Water Intake</h3>
      </div>
      
      <div className="flex items-end mb-4">
        <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500 ease-out"
            style={{ height: `${percentage}%`, opacity: 0.7 }}
          ></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{current}</span>
            <span className="text-sm text-gray-600">of {goal} glasses</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onDecrement}
          disabled={current <= 0}
          className="flex-1 mr-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <FaMinus className="text-gray-700" />
        </button>
        
        <button
          onClick={onIncrement}
          className="flex-1 ml-2 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
        >
          <FaPlus className="text-blue-700" />
        </button>
      </div>
    </Card>
  );
}

export default DailyWaterTracker;
