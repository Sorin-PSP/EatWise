import React, { useState, useEffect } from 'react';
import { FaWeight } from 'react-icons/fa';
import Card from './Card';
import { useUser } from '../contexts/UserContext';

function WeightTracker({ 
  currentWeight: propCurrentWeight, 
  startWeight: propStartWeight,
  goalWeight: propGoalWeight,
  onUpdateWeight,
  className = '' 
}) {
  const { user, getWeightUnit, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use weight from user profile if available, otherwise use props
  const currentWeight = user.weight ? parseFloat(user.weight) : propCurrentWeight;
  const startWeight = user.startWeight ? parseFloat(user.startWeight) : propStartWeight;
  const goalWeight = user.goalWeight ? parseFloat(user.goalWeight) : propGoalWeight;
  
  const [weightInput, setWeightInput] = useState(currentWeight);
  
  // Update weightInput when currentWeight changes
  useEffect(() => {
    setWeightInput(currentWeight);
  }, [currentWeight]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newWeight = parseFloat(weightInput);
    
    // Update local state via props callback
    if (onUpdateWeight) {
      onUpdateWeight(newWeight);
    }
    
    // Update user profile
    updateUser({
      weight: newWeight,
      // If start weight isn't set yet, use this as the start weight
      startWeight: user.startWeight || newWeight
    });
    
    setIsEditing(false);
  };
  
  // Calculate progress percentage
  const totalWeightToLose = startWeight - goalWeight;
  const weightLost = startWeight - currentWeight;
  const progressPercentage = Math.min(Math.max((weightLost / totalWeightToLose) * 100, 0), 100);
  
  // Get the appropriate weight unit
  const weightUnit = getWeightUnit();
  
  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <FaWeight className="text-primary text-xl mr-2" />
        <h3 className="font-medium">Weight Tracker</h3>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-20 p-1 border border-gray-300 rounded mr-2"
                autoFocus
              />
              <span className="mr-2">{weightUnit}</span>
              <button 
                type="submit"
                className="bg-primary text-white text-sm py-1 px-2 rounded"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{currentWeight}</span>
              <span className="text-gray-600 ml-1">{weightUnit}</span>
              <button 
                onClick={() => setIsEditing(true)}
                className="ml-2 text-sm text-primary hover:text-primary-dark"
              >
                Update
              </button>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Goal</div>
          <div className="font-medium">{goalWeight} {weightUnit}</div>
        </div>
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-primary">
              {progressPercentage.toFixed(0)}% Complete
            </span>
          </div>
        </div>
        <div className="flex h-2 mb-4 overflow-hidden text-xs bg-primary-light rounded">
          <div 
            style={{ width: `${progressPercentage}%` }} 
            className="flex flex-col justify-center text-center text-white bg-primary transition-all duration-500 ease-out"
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Start: {startWeight} {weightUnit}</span>
          <span>Current: {currentWeight} {weightUnit}</span>
          <span>Goal: {goalWeight} {weightUnit}</span>
        </div>
      </div>
    </Card>
  );
}

export default WeightTracker;
