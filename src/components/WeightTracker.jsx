import { useState } from 'react';

export default function WeightTracker({ currentWeight, startWeight, goalWeight, onUpdateWeight }) {
  const [weight, setWeight] = useState(currentWeight || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!startWeight || !goalWeight || startWeight === goalWeight) return 0;
    
    const totalChange = startWeight - goalWeight;
    const currentChange = startWeight - (currentWeight || startWeight);
    
    return Math.min(Math.max(Math.round((currentChange / totalChange) * 100), 0), 100);
  };
  
  const progress = calculateProgress();
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (weight && !isNaN(weight)) {
      onUpdateWeight(parseFloat(weight));
      setIsEditing(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Weight Tracker</h3>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-green-600 hover:text-green-700"
          >
            Update
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              step="0.1"
              min="0"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your weight"
              required
            />
            <span className="ml-2 text-gray-500">kg</span>
          </div>
          
          <div className="mt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold">{currentWeight || '—'}</span>
              <span className="text-gray-500 ml-1">kg</span>
            </div>
            
            <div className="text-sm text-gray-500">
              {progress}% to goal
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full bg-green-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Start: {startWeight || '—'} kg</span>
            <span>Goal: {goalWeight || '—'} kg</span>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {currentWeight ? (
          <p>Last updated: Today</p>
        ) : (
          <p>No weight data recorded yet.</p>
        )}
      </div>
    </div>
  );
}
