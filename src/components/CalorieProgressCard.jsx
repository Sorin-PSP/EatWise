export default function CalorieProgressCard({ consumed, goal, remaining }) {
  // Calculate percentage
  const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
  
  // Determine color based on percentage
  let progressColor = 'bg-green-500';
  
  if (percentage > 100) {
    progressColor = 'bg-red-500';
  } else if (percentage > 85) {
    progressColor = 'bg-yellow-500';
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-2">Calories</h3>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold">{Math.round(consumed)}</span>
        <span className="text-gray-500">of {goal} kcal</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${progressColor}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{percentage}% consumed</span>
        <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
          {remaining < 0 ? `${Math.abs(Math.round(remaining))} over` : `${Math.round(remaining)} remaining`}
        </span>
      </div>
    </div>
  );
}
