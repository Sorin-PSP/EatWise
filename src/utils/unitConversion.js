/**
 * Unit conversion utilities for the EatWise application
 * Handles conversions between metric and imperial measurement systems
 */

// Conversion factors
const CONVERSION_FACTORS = {
  // Weight conversions
  g_to_oz: 0.03527396, // 1 gram = 0.03527396 ounces
  oz_to_g: 28.3495,    // 1 ounce = 28.3495 grams
  g_to_lb: 0.00220462, // 1 gram = 0.00220462 pounds
  lb_to_g: 453.592,    // 1 pound = 453.592 grams
  
  // Volume conversions
  ml_to_floz: 0.033814, // 1 milliliter = 0.033814 fluid ounces
  floz_to_ml: 29.5735,  // 1 fluid ounce = 29.5735 milliliters
  ml_to_cup: 0.00422675, // 1 milliliter = 0.00422675 cups
  cup_to_ml: 236.588,   // 1 cup = 236.588 milliliters
};

/**
 * Convert a quantity from one unit to another
 * @param {number} amount - The amount to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @returns {number} - The converted amount
 */
export function convertQuantity(amount, fromUnit, toUnit) {
  // If units are the same, return the original amount
  if (fromUnit === toUnit) {
    return amount;
  }
  
  // Handle weight conversions
  if (fromUnit === 'g' && toUnit === 'oz') {
    return amount * CONVERSION_FACTORS.g_to_oz;
  } else if (fromUnit === 'oz' && toUnit === 'g') {
    return amount * CONVERSION_FACTORS.oz_to_g;
  } else if (fromUnit === 'g' && toUnit === 'lb') {
    return amount * CONVERSION_FACTORS.g_to_lb;
  } else if (fromUnit === 'lb' && toUnit === 'g') {
    return amount * CONVERSION_FACTORS.lb_to_g;
  }
  
  // Handle volume conversions
  if (fromUnit === 'ml' && toUnit === 'fl oz') {
    return amount * CONVERSION_FACTORS.ml_to_floz;
  } else if (fromUnit === 'fl oz' && toUnit === 'ml') {
    return amount * CONVERSION_FACTORS.floz_to_ml;
  } else if (fromUnit === 'ml' && toUnit === 'cup') {
    return amount * CONVERSION_FACTORS.ml_to_cup;
  } else if (fromUnit === 'cup' && toUnit === 'ml') {
    return amount * CONVERSION_FACTORS.cup_to_ml;
  }
  
  // If no conversion is found, return the original amount
  console.warn(`No conversion found from ${fromUnit} to ${toUnit}`);
  return amount;
}

/**
 * Convert a food serving between measurement systems
 * @param {number} amount - The serving amount
 * @param {string} unit - The serving unit
 * @param {string} fromSystem - The system to convert from ('metric' or 'imperial')
 * @param {string} toSystem - The system to convert to ('metric' or 'imperial')
 * @returns {object} - Object with converted amount and unit
 */
export function convertFoodServing(amount, unit, fromSystem, toSystem) {
  // If systems are the same, return the original serving
  if (fromSystem === toSystem) {
    return { amount, unit };
  }
  
  // Convert from metric to imperial
  if (fromSystem === 'metric' && toSystem === 'imperial') {
    if (unit === 'g') {
      // Convert grams to ounces
      return {
        amount: Number((amount * CONVERSION_FACTORS.g_to_oz).toFixed(1)),
        unit: 'oz'
      };
    } else if (unit === 'ml') {
      // Convert milliliters to fluid ounces
      return {
        amount: Number((amount * CONVERSION_FACTORS.ml_to_floz).toFixed(1)),
        unit: 'fl oz'
      };
    }
  }
  
  // Convert from imperial to metric
  if (fromSystem === 'imperial' && toSystem === 'metric') {
    if (unit === 'oz') {
      // Convert ounces to grams
      return {
        amount: Number((amount * CONVERSION_FACTORS.oz_to_g).toFixed(1)),
        unit: 'g'
      };
    } else if (unit === 'fl oz') {
      // Convert fluid ounces to milliliters
      return {
        amount: Number((amount * CONVERSION_FACTORS.floz_to_ml).toFixed(1)),
        unit: 'ml'
      };
    } else if (unit === 'lb') {
      // Convert pounds to grams
      return {
        amount: Number((amount * CONVERSION_FACTORS.lb_to_g).toFixed(1)),
        unit: 'g'
      };
    } else if (unit === 'cup') {
      // Convert cups to milliliters
      return {
        amount: Number((amount * CONVERSION_FACTORS.cup_to_ml).toFixed(1)),
        unit: 'ml'
      };
    }
  }
  
  // If no conversion is found, return the original serving
  return { amount, unit };
}

/**
 * Format a quantity with its unit for display
 * @param {number} amount - The amount to format
 * @param {string} unit - The unit of measurement
 * @returns {string} - Formatted string (e.g., "100 g" or "3.5 oz")
 */
export function formatQuantity(amount, unit) {
  // Round to 1 decimal place if not a whole number
  const formattedAmount = Number.isInteger(amount) ? amount : amount.toFixed(1);
  return `${formattedAmount} ${unit}`;
}
