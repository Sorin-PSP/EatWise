// Unit conversion utilities for different measurement systems

// Weight conversions
export const convertWeight = (value, fromUnit, toUnit) => {
  // Convert to grams first
  let grams;
  switch (fromUnit.toLowerCase()) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      grams = value * 1000;
      break;
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      grams = value * 453.592;
      break;
    case 'oz':
    case 'ounce':
    case 'ounces':
      grams = value * 28.3495;
      break;
    case 'g':
    case 'gram':
    case 'grams':
    default:
      grams = value;
      break;
  }
  
  // Convert from grams to target unit
  switch (toUnit.toLowerCase()) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return grams / 1000;
    case 'lb':
    case 'lbs':
    case 'pound':
    case 'pounds':
      return grams / 453.592;
    case 'oz':
    case 'ounce':
    case 'ounces':
      return grams / 28.3495;
    case 'g':
    case 'gram':
    case 'grams':
    default:
      return grams;
  }
};

// Volume conversions
export const convertVolume = (value, fromUnit, toUnit) => {
  // Convert to milliliters first
  let milliliters;
  switch (fromUnit.toLowerCase()) {
    case 'l':
    case 'liter':
    case 'liters':
      milliliters = value * 1000;
      break;
    case 'fl oz':
    case 'fluid ounce':
    case 'fluid ounces':
      milliliters = value * 29.5735;
      break;
    case 'cup':
    case 'cups':
      milliliters = value * 236.588;
      break;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      milliliters = value * 14.7868;
      break;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      milliliters = value * 4.92892;
      break;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
    default:
      milliliters = value;
      break;
  }
  
  // Convert from milliliters to target unit
  switch (toUnit.toLowerCase()) {
    case 'l':
    case 'liter':
    case 'liters':
      return milliliters / 1000;
    case 'fl oz':
    case 'fluid ounce':
    case 'fluid ounces':
      return milliliters / 29.5735;
    case 'cup':
    case 'cups':
      return milliliters / 236.588;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      return milliliters / 14.7868;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      return milliliters / 4.92892;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
    default:
      return milliliters;
  }
};

// General quantity conversion
export const convertQuantity = (value, fromUnit, toUnit) => {
  // Handle piece/count units
  if (fromUnit === toUnit) return value;
  
  // Handle weight conversions
  if (['g', 'kg', 'lb', 'oz'].includes(fromUnit) && ['g', 'kg', 'lb', 'oz'].includes(toUnit)) {
    return convertWeight(value, fromUnit, toUnit);
  }
  
  // Handle volume conversions
  if (['ml', 'l', 'fl oz', 'cup', 'tbsp', 'tsp'].includes(fromUnit) && 
      ['ml', 'l', 'fl oz', 'cup', 'tbsp', 'tsp'].includes(toUnit)) {
    return convertVolume(value, fromUnit, toUnit);
  }
  
  // If no conversion available, return original value
  return value;
};

// Convert food serving based on measurement system
export const convertFoodServing = (serving, unit, fromSystem, toSystem) => {
  if (fromSystem === toSystem) {
    return { amount: serving, unit };
  }
  
  // Metric to Imperial conversions
  if (fromSystem === 'metric' && toSystem === 'imperial') {
    switch (unit) {
      case 'g':
        if (serving >= 453.592) {
          return { amount: Math.round((serving / 453.592) * 10) / 10, unit: 'lb' };
        } else {
          return { amount: Math.round((serving / 28.3495) * 10) / 10, unit: 'oz' };
        }
      case 'kg':
        return { amount: Math.round((serving * 2.20462) * 10) / 10, unit: 'lb' };
      case 'ml':
        if (serving >= 236.588) {
          return { amount: Math.round((serving / 236.588) * 10) / 10, unit: 'cup' };
        } else {
          return { amount: Math.round((serving / 29.5735) * 10) / 10, unit: 'fl oz' };
        }
      case 'l':
        return { amount: Math.round((serving / 0.236588) * 10) / 10, unit: 'cup' };
      default:
        return { amount: serving, unit };
    }
  }
  
  // Imperial to Metric conversions
  if (fromSystem === 'imperial' && toSystem === 'metric') {
    switch (unit) {
      case 'lb':
        return { amount: Math.round((serving * 453.592)), unit: 'g' };
      case 'oz':
        return { amount: Math.round((serving * 28.3495)), unit: 'g' };
      case 'cup':
        return { amount: Math.round((serving * 236.588)), unit: 'ml' };
      case 'fl oz':
        return { amount: Math.round((serving * 29.5735)), unit: 'ml' };
      case 'tbsp':
        return { amount: Math.round((serving * 14.7868)), unit: 'ml' };
      case 'tsp':
        return { amount: Math.round((serving * 4.92892)), unit: 'ml' };
      default:
        return { amount: serving, unit };
    }
  }
  
  return { amount: serving, unit };
};

// Get appropriate unit for measurement system
export const getPreferredUnit = (originalUnit, measurementSystem) => {
  if (measurementSystem === 'metric') {
    switch (originalUnit) {
      case 'lb':
      case 'oz':
        return 'g';
      case 'cup':
      case 'fl oz':
      case 'tbsp':
      case 'tsp':
        return 'ml';
      default:
        return originalUnit;
    }
  } else { // imperial
    switch (originalUnit) {
      case 'g':
      case 'kg':
        return 'oz';
      case 'ml':
      case 'l':
        return 'fl oz';
      default:
        return originalUnit;
    }
  }
};

// Format display value with appropriate precision
export const formatDisplayValue = (value, unit) => {
  if (value < 1) {
    return value.toFixed(2);
  } else if (value < 10) {
    return value.toFixed(1);
  } else {
    return Math.round(value).toString();
  }
};
