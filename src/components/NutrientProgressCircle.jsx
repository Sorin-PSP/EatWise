import React from 'react';
import { formatNutrient, formatPercentage } from '../utils/formatters';

function NutrientProgressCircle({ 
  value, 
  max, 
  title, 
  unit = 'g',
  color = 'primary',
  size = 'md',
  className = ''
}) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const percentage = Math.min(Math.max((numericValue / max) * 100, 0), 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary stroke-primary';
      case 'secondary':
        return 'text-secondary stroke-secondary';
      case 'accent':
        return 'text-accent stroke-accent';
      case 'success':
        return 'text-success stroke-success';
      case 'warning':
        return 'text-warning stroke-warning';
      case 'error':
        return 'text-error stroke-error';
      default:
        return 'text-primary stroke-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-20 h-20';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${getSizeClasses()} flex items-center justify-center`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className={getColorClasses()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${getColorClasses().split(' ')[0]}`}>
            {formatNutrient(numericValue)}
          </span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      
      <h4 className="mt-2 text-sm font-medium text-gray-700">{title}</h4>
      <div className="text-xs text-gray-500 mt-1">
        {formatPercentage(percentage)}% din {max}{unit}
      </div>
    </div>
  );
}

export default NutrientProgressCircle;
