import React from 'react';

function ProgressBar({ 
  value, 
  max = 100, 
  variant = 'primary', 
  size = 'md', 
  showLabel = false,
  labelPosition = 'right',
  className = '',
  ...props 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'accent':
        return 'bg-accent';
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      default:
        return 'bg-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'h-1';
      case 'sm':
        return 'h-1.5';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      case 'xl':
        return 'h-4';
      default:
        return 'h-2';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center mb-1">
        {showLabel && labelPosition === 'top' && (
          <div className="text-sm text-gray-700 mb-1">
            {value} / {max} ({Math.round(percentage)}%)
          </div>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`${getVariantClasses()} ${getSizeClasses()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        ></div>
      </div>
      
      {showLabel && labelPosition === 'right' && (
        <div className="ml-2 text-sm text-gray-700">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
