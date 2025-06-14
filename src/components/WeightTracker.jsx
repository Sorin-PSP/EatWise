import React, { useState } from 'react';
import { FaWeight, FaArrowDown, FaArrowUp, FaEdit } from 'react-icons/fa';
import Card from './Card';

function WeightTracker({ 
  currentWeight = 0, 
  startWeight = 0,
  goalWeight = 0,
  onUpdateWeight,
  className = '' 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [weightInput, setWeightInput] = useState(currentWeight);
  
  const weightDiff = startWeight - currentWeight;
  const isWeightLoss = weightDiff > 0;
  const progressPercentage = Math.min(
    Math.max(
      Math.abs((startWeight - currentWeight) / (startWeight - goalWeight)) * 100, 
      0
    ), 
    100
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateWeight(weightInput);
    setIsEditing(false);
  };
  
  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaWeight className="text-purple-500 text-xl mr-2" />
          <h3 className="font-medium">Weight Tracker</h3>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaEdit />
        </button>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center">
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(parseFloat(e.target.value))}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-dark"
            >
              Update
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl font-bold">{currentWeight}</span>
          <span className="text-xl ml-1">kg</span>
          
          {weightDiff !== 0 && (
            <div className={`ml-3 flex items-center ${isWeightLoss ? 'text-green-500' : 'text-red-500'}`}>
              {isWeightLoss ? <FaArrowDown className="mr-1" /> : <FaArrowUp className="mr-1" />}
              <span>{Math.abs(weightDiff).toFixed(1)} kg</span>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Start: {startWeight} kg</span>
          <span>Goal: {goalWeight} kg</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-purple-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        {progressPercentage < 100 ? (
          <span>{(startWeight - goalWeight - weightDiff).toFixed(1)} kg to go</span>
        ) : (
          <span>Congratulations! You've reached your goal!</span>
        )}
      </div>
    </Card>
  );
}

export default WeightTracker;
