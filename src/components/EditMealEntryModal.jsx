import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useFood } from '../contexts/FoodContext';
import { useUser } from '../contexts/UserContext';
import { convertFoodServing, convertQuantity } from '../utils/unitConversion';
import Button from './Button';

function EditMealEntryModal({ isOpen, onClose, mealEntry }) {
  const { updateMealEntry } = useFood();
  const { measurementSystem } = useUser();
  
  const [formData, setFormData] = useState({
    mealType: '',
    quantity: '',
    unit: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [displayFood, setDisplayFood] = useState(null);
  
  // Update form data when meal entry changes
  useEffect(() => {
    if (mealEntry && mealEntry.food) {
      // Convert quantity to the current measurement system
      const convertedServing = convertFoodServing(
        mealEntry.quantity,
        mealEntry.food.unit,
        'metric', // Food is always stored in metric
        measurementSystem
      );
      
      setFormData({
        mealType: mealEntry.mealType,
        quantity: convertedServing.amount.toString(),
        unit: convertedServing.unit
      });
      
      // Create a display version of the food with converted units
      setDisplayFood({
        ...mealEntry.food,
        serving: convertedServing.amount,
        unit: convertedServing.unit
      });
    }
  }, [mealEntry, measurementSystem]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting || !mealEntry) return;
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // Convert quantity back to metric for storage if needed
      let quantityInMetric = formData.quantity;
      if (measurementSystem === 'imperial' && mealEntry.food) {
        // Convert from imperial to metric
        const metricEquivalent = convertQuantity(
          Number(formData.quantity),
          formData.unit,
          mealEntry.food.unit // Original metric unit
        );
        quantityInMetric = metricEquivalent;
      }
      
      // Update the meal entry
      updateMealEntry(
        mealEntry.id,
        {
          mealType: formData.mealType,
          quantity: Number(quantityInMetric)
        }
      );
      
      setSuccessMessage('Meal entry updated successfully');
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating meal entry:', error);
      setIsSubmitting(false);
      setSuccessMessage('');
      alert('Failed to update meal entry. Please try again.');
    }
  };
  
  // Calculate nutrition values based on selected quantity
  const calculateNutrition = (nutrientValue) => {
    if (!mealEntry || !mealEntry.food || !displayFood) return 0;
    
    const ratio = Number(formData.quantity) / displayFood.serving;
    return (nutrientValue * ratio).toFixed(1);
  };
  
  if (!isOpen || !mealEntry || !mealEntry.food || !displayFood) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Meal Entry</h3>
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
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-2">{mealEntry.food.name}</div>
              <div className="text-sm text-gray-500 mb-4">
                {mealEntry.date}
              </div>
            </div>
            
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                Meal
              </label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity ({formData.unit})
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Nutrition for {formData.quantity} {formData.unit}:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">
                    {Math.round(mealEntry.food.calories * (Number(formData.quantity) / displayFood.serving))} kcal
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{calculateNutrition(mealEntry.food.protein)}g protein</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{calculateNutrition(mealEntry.food.carbs)}g carbs</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{calculateNutrition(mealEntry.food.fat)}g fat</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{calculateNutrition(mealEntry.food.fiber)}g fiber</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">
                    {Math.max(0, calculateNutrition(mealEntry.food.carbs - mealEntry.food.fiber))}g net carbs
                  </span>
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
                {isSubmitting ? 'Updating...' : 'Update Entry'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMealEntryModal;
