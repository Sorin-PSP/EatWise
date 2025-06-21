import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function DailyWaterTracker({ current, goal, onIncrement, onDecrement }) {
  // Calculate percentage
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Water Intake</h3>
        <span className="text-sm text-gray-500">{current} of {goal} glasses</span>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex-1 mr-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full bg-blue-500" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onDecrement}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Decrease water intake"
            disabled={current === 0}
          >
            <MinusIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={onIncrement}
            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200"
            aria-label="Increase water intake"
          >
            <PlusIcon className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex">
          {Array.from({ length: goal }).map((_, index) => (
            <div 
              key={index}
              className={`w-5 h-8 mx-0.5 rounded-b-lg ${
                index < current ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        
        <div className="text-sm text-gray-500">
          {percentage}% of daily goal
        </div>
      </div>
    </div>
  );
}
