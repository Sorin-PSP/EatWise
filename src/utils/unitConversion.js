// Utility functions for unit conversion

/**
 * Convert weight between metric and imperial systems
 * @param {number} weight - The weight value to convert
 * @param {string} fromSystem - The system to convert from ('metric' or 'imperial')
 * @param {string} toSystem - The system to convert to ('metric' or 'imperial')
 * @param {number} decimals - Number of decimal places for the result
 * @returns {number} - The converted weight
 */
export function convertWeight(weight, fromSystem, toSystem, decimals = 1) {
  if (fromSystem === toSystem) return Number(weight);
  
  if (fromSystem === 'metric' && toSystem === 'imperial') {
    // Convert kg to lb
    return Number((weight * 2.20462).toFixed(decimals));
  } else {
    // Convert lb to kg
    return Number((weight * 0.453592).toFixed(decimals));
  }
}

/**
 * Convert height between metric and imperial systems
 * @param {number} height - The height value to convert
 * @param {string} fromSystem - The system to convert from ('metric' or 'imperial')
 * @param {string} toSystem - The system to convert to ('metric' or 'imperial')
 * @param {number} decimals - Number of decimal places for the result
 * @returns {number} - The converted height
 */
export function convertHeight(height, fromSystem, toSystem, decimals = 1) {
  if (fromSystem === toSystem) return Number(height);
  
  if (fromSystem === 'metric' && toSystem === 'imperial') {
    // Convert cm to inches
    return Number((height / 2.54).toFixed(decimals));
  } else {
    // Convert inches to cm
    return Number((height * 2.54).toFixed(decimals));
  }
}

/**
 * Format height in imperial system to feet and inches
 * @param {number} inches - Height in inches
 * @returns {string} - Formatted height (e.g., "5'10"")
 */
export function formatImperialHeight(inches) {
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round((inches % 12) * 10) / 10;
  
  return `${feet}'${remainingInches}"`;
}

/**
 * Get the appropriate unit for a measurement type based on the measurement system
 * @param {string} type - The type of measurement ('weight' or 'height')
 * @param {string} system - The measurement system ('metric' or 'imperial')
 * @returns {string} - The appropriate unit
 */
export function getUnit(type, system) {
  if (type === 'weight') {
    return system === 'metric' ? 'kg' : 'lb';
  } else if (type === 'height') {
    return system === 'metric' ? 'cm' : 'in';
  } else if (type === 'volume') {
    return system === 'metric' ? 'ml' : 'fl oz';
  } else if (type === 'distance') {
    return system === 'metric' ? 'km' : 'mi';
  }
  
  return '';
}

/**
 * Convert volume between metric and imperial systems
 * @param {number} volume - The volume value to convert
 * @param {string} fromSystem - The system to convert from ('metric' or 'imperial')
 * @param {string} toSystem - The system to convert to ('metric' or 'imperial')
 * @param {number} decimals - Number of decimal places for the result
 * @returns {number} - The converted volume
 */
export function convertVolume(volume, fromSystem, toSystem, decimals = 1) {
  if (fromSystem === toSystem) return Number(volume);
  
  if (fromSystem === 'metric' && toSystem === 'imperial') {
    // Convert ml to fl oz
    return Number((volume * 0.033814).toFixed(decimals));
  } else {
    // Convert fl oz to ml
    return Number((volume * 29.5735).toFixed(decimals));
  }
}
