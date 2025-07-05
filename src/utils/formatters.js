// Formatting utilities for consistent number display

/**
 * Format number to maximum 1 decimal place
 * @param {number} value - The number to format
 * @param {boolean} forceDecimal - Whether to always show decimal (e.g., 5.0 instead of 5)
 * @returns {string} Formatted number string
 */
export const formatToOneDecimal = (value, forceDecimal = false) => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  
  const rounded = Math.round(value * 10) / 10;
  
  if (forceDecimal) {
    return rounded.toFixed(1);
  }
  
  // Show decimal only if needed (e.g., 5.5 but not 5.0)
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
};

/**
 * Format calories with maximum 1 decimal place
 * @param {number} calories - Calorie value
 * @returns {string} Formatted calories
 */
export const formatCalories = (calories) => {
  return formatToOneDecimal(calories);
};

/**
 * Format macronutrients (protein, carbs, fat) with maximum 1 decimal place
 * @param {number} grams - Nutrient value in grams
 * @returns {string} Formatted nutrient value
 */
export const formatNutrient = (grams) => {
  return formatToOneDecimal(grams);
};

/**
 * Format percentage with maximum 1 decimal place
 * @param {number} percentage - Percentage value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (percentage) => {
  return formatToOneDecimal(percentage);
};

/**
 * Format weight with appropriate precision
 * @param {number} weight - Weight value
 * @param {string} unit - Weight unit (kg, g, lb, oz)
 * @returns {string} Formatted weight
 */
export const formatWeight = (weight, unit = 'kg') => {
  if (unit === 'g' && weight >= 1000) {
    return formatToOneDecimal(weight / 1000) + ' kg';
  }
  return formatToOneDecimal(weight) + ' ' + unit;
};

/**
 * Format serving size with appropriate precision
 * @param {number} serving - Serving size
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted serving size
 */
export const formatServing = (serving, unit) => {
  return formatToOneDecimal(serving) + unit;
};

/**
 * Format nutrition summary object
 * @param {Object} nutrition - Nutrition object with calories, protein, carbs, fat, fiber
 * @returns {Object} Formatted nutrition object
 */
export const formatNutritionSummary = (nutrition) => {
  return {
    calories: formatCalories(nutrition.calories || 0),
    protein: formatNutrient(nutrition.protein || 0),
    carbs: formatNutrient(nutrition.carbs || 0),
    fat: formatNutrient(nutrition.fat || 0),
    fiber: formatNutrient(nutrition.fiber || 0)
  };
};
