import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useFood } from '../contexts/FoodContext';
import { useUser } from '../contexts/UserContext';
import { convertFoodServing, convertQuantity } from '../utils/unitConversion';
import Button from './Button';

function AddFoodModal({ isOpen, onClose, editFood = null }) {
  // Ensure FoodContext is properly imported and used
  const foodContext = useFood();
  const { addFood, updateFood, refreshFoods } = foodContext || {};
  const { measurementSystem } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    serving: '100',
    unit: 'g',
    category: 'other'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [displayUnits, setDisplayUnits] = useState({
    serving: 'g'
  });
  
  // If editing, populate form with food data
  useEffect(() => {
    if (editFood) {
      // Always store in metric, but display in user's preferred system
      const metricFood = editFood;
      
      if (measurementSystem === 'imperial') {
        // Convert serving size for display
        const convertedServing = convertFoodServing(
          metricFood.serving,
          metricFood.unit,
          'metric',
          'imperial'
        );
        
        setFormData({
          name: metricFood.name || '',
          calories: metricFood.calories || '',
          protein: metricFood.protein || '',
          carbs: metricFood.carbs || '',
          fat: metricFood.fat || '',
          fiber: metricFood.fiber || '',
          serving: convertedServing.amount.toString(),
          unit: convertedServing.unit,
          category: metricFood.category || 'other'
        });
        
        setDisplayUnits({
          serving: convertedServing.unit
        });
      } else {
        // Use metric values directly
        setFormData({
          name: metricFood.name || '',
          calories: metricFood.calories || '',
          protein: metricFood.protein || '',
          carbs: metricFood.carbs || '',
          fat: metricFood.fat || '',
          fiber: metricFood.fiber || '',
          serving: metricFood.serving.toString() || '100',
          unit: metricFood.unit || 'g',
          category: metricFood.category || 'other'
        });
        
        setDisplayUnits({
          serving: metricFood.unit
        });
      }
    } else {
      // Reset form when not editing
      if (measurementSystem === 'imperial') {
        // Default to oz for imperial
        setFormData({
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
          serving: '3.5',  // ~100g in oz
          unit: 'oz',
          category: 'other'
        });
        
        setDisplayUnits({
          serving: 'oz'
        });
      } else {
        // Default to metric
        setFormData({
          name: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
          serving: '100',
          unit: 'g',
          category: 'other'
        });
        
        setDisplayUnits({
          serving: 'g'
        });
      }
    }
    
    // Reset errors and submission state when modal opens/closes
    setErrors({});
    setIsSubmitting(false);
    setSuccessMessage('');
  }, [editFood, isOpen, measurementSystem]);
  
  // Update display units when measurement system changes
  useEffect(() => {
    if (measurementSystem === 'imperial') {
      setDisplayUnits({
        serving: formData.unit === 'g' ? 'oz' : 
                 formData.unit === 'ml' ? 'fl oz' : 
                 formData.unit
      });
    } else {
      setDisplayUnits({
        serving: formData.unit === 'oz' ? 'g' : 
                 formData.unit === 'fl oz' ? 'ml' : 
                 formData.unit
      });
    }
  }, [measurementSystem, formData.unit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.calories || isNaN(formData.calories) || Number(formData.calories) < 0) {
      newErrors.calories = 'Valid calories are required';
    }
    
    if (!formData.protein || isNaN(formData.protein) || Number(formData.protein) < 0) {
      newErrors.protein = 'Valid protein amount is required';
    }
    
    if (!formData.carbs || isNaN(formData.carbs) || Number(formData.carbs) < 0) {
      newErrors.carbs = 'Valid carbs amount is required';
    }
    
    if (!formData.fat || isNaN(formData.fat) || Number(formData.fat) < 0) {
      newErrors.fat = 'Valid fat amount is required';
    }
    
    if (!formData.serving || isNaN(formData.serving) || Number(formData.serving) <= 0) {
      newErrors.serving = 'Valid serving size is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }
    
    // Check if food context functions are available
    if (!addFood || !updateFood) {
      setErrors({
        general: "Food context not available. Please try again later."
      });
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    // Convert values to metric for storage if needed
    let metricFoodData = { ...formData };
    
    if (measurementSystem === 'imperial') {
      // Convert serving size to metric
      const metricServing = convertQuantity(
        Number(formData.serving),
        formData.unit,
        formData.unit === 'oz' || formData.unit === 'lb' ? 'g' : 'ml'
      );
      
      metricFoodData = {
        ...formData,
        serving: metricServing,
        unit: formData.unit === 'oz' || formData.unit === 'lb' ? 'g' : 'ml'
      };
    }
    
    // Convert string values to numbers
    const foodData = {
      ...metricFoodData,
      calories: Number(metricFoodData.calories),
      protein: Number(metricFoodData.protein),
      carbs: Number(metricFoodData.carbs),
      fat: Number(metricFoodData.fat),
      fiber: Number(metricFoodData.fiber || 0),
      serving: Number(metricFoodData.serving)
    };
    
    try {
      if (editFood) {
        updateFood(editFood.id, foodData);
        console.log('Food updated successfully:', editFood.id);
        setSuccessMessage('Food updated successfully!');
      } else {
        const newFood = addFood(foodData);
        console.log('Food added successfully:', newFood.id);
        setSuccessMessage('Food added successfully!');
      }
      
      // Force a refresh of the food context
      if (refreshFoods) {
        refreshFoods();
      }
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving food:', error);
      setIsSubmitting(false);
      setSuccessMessage('');
      setErrors(prev => ({
        ...prev,
        general: `Error saving food: ${error.message || 'Unknown error'}`
      }));
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">{editFood ? 'Edit Food' : 'Add New Food'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        {successMessage && (
          <div className="bg-success/10 text-success p-3 m-4 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="bg-error/10 text-error p-3 m-4 rounded-md">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Food Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Food Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.name ? 'border-error' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="protein">Protein</option>
                <option value="carbs">Carbohydrates</option>
                <option value="fats">Fats</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="dairy">Dairy</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Serving Size */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="serving" className="block text-sm font-medium text-gray-700 mb-1">
                  Serving Size
                </label>
                <input
                  type="number"
                  id="serving"
                  name="serving"
                  value={formData.serving}
                  onChange={handleChange}
                  min="1"
                  step="0.1"
                  className={`w-full p-2 border rounded-md ${errors.serving ? 'border-error' : 'border-gray-300'}`}
                />
                {errors.serving && <p className="text-error text-xs mt-1">{errors.serving}</p>}
              </div>
              
              <div className="w-24">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {measurementSystem === 'metric' ? (
                    <>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                    </>
                  ) : (
                    <>
                      <option value="oz">oz</option>
                      <option value="lb">lb</option>
                      <option value="fl oz">fl oz</option>
                      <option value="cup">cup</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            {/* Nutritional Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Nutritional Information (per serving)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-2 border rounded-md ${errors.calories ? 'border-error' : 'border-gray-300'}`}
                  />
                  {errors.calories && <p className="text-error text-xs mt-1">{errors.calories}</p>}
                </div>
                
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-2 border rounded-md ${errors.protein ? 'border-error' : 'border-gray-300'}`}
                  />
                  {errors.protein && <p className="text-error text-xs mt-1">{errors.protein}</p>}
                </div>
                
                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-2 border rounded-md ${errors.carbs ? 'border-error' : 'border-gray-300'}`}
                  />
                  {errors.carbs && <p className="text-error text-xs mt-1">{errors.carbs}</p>}
                </div>
                
                <div>
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={formData.fat}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-full p-2 border rounded-md ${errors.fat ? 'border-error' : 'border-gray-300'}`}
                  />
                  {errors.fat && <p className="text-error text-xs mt-1">{errors.fat}</p>}
                </div>
                
                <div>
                  <label htmlFor="fiber" className="block text-sm font-medium text-gray-700 mb-1">
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    id="fiber"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (editFood ? 'Update Food' : 'Add Food')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFoodModal;
