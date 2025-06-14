import React from 'react';
import { useUser } from '../contexts/UserContext';

// A reusable component to display measurements with the correct unit
function MeasurementDisplay({ 
  value, 
  type, 
  className = '', 
  showUnit = true,
  decimals = 1
}) {
  const { user, getWeightUnit, getHeightUnit } = useUser();
  
  if (!value) return null;
  
  let displayValue = value;
  let unit = '';
  
  if (type === 'weight') {
    unit = getWeightUnit();
    // Format with appropriate decimal places
    displayValue = Number(displayValue).toFixed(decimals);
  } else if (type === 'height') {
    unit = getHeightUnit();
    
    // For imperial height, optionally convert to feet and inches format
    if (user.measurementSystem === 'imperial' && showUnit) {
      const feet = Math.floor(value / 12);
      const inches = Math.round((value % 12) * 10) / 10;
      
      if (feet > 0) {
        return (
          <span className={className}>
            {feet}'{inches}" 
          </span>
        );
      }
    }
    
    // Format with appropriate decimal places
    displayValue = Number(displayValue).toFixed(decimals);
  }
  
  return (
    <span className={className}>
      {displayValue}{showUnit ? ` ${unit}` : ''}
    </span>
  );
}

export default MeasurementDisplay;
