import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useFood } from '../contexts/FoodContext';
import Button from './Button';

function BulkFoodAddModal({ isOpen, onClose }) {
  const foodContext = useFood();
  const { addFood, refreshFoods, foods } = foodContext || {};
  const [bulkText, setBulkText] = useState('');
  const [parseResults, setParseResults] = useState({ success: [], errors: [], duplicates: [] });
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTextChange = (e) => {
    setBulkText(e.target.value);
    setShowResults(false);
  };

  const parseFood = (line) => {
    // Trim the line to remove any leading or trailing whitespace
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      return { success: false, error: 'Empty line' };
    }
    
    // Updated regex to match the pattern: "Food name kcal / g prot / g carb / g fat / g fiber"
    // More flexible regex that can handle variations in spacing and formatting
    const regex = /^(.+?)\s+(\d+(?:\.\d+)?)\s*kcal\s*\/\s*(\d+(?:\.\d+)?)\s*g\s*prot\s*\/\s*(\d+(?:\.\d+)?)\s*g\s*carb\s*\/\s*(\d+(?:\.\d+)?)\s*g\s*fat(?:\s*\/\s*(\d+(?:\.\d+)?)\s*g\s*fiber)?$/i;
    
    const match = trimmedLine.match(regex);
    
    if (!match) {
      return { 
        success: false, 
        error: `Could not parse line: "${trimmedLine}". Format should be "Food name kcal / g prot / g carb / g fat / g fiber"` 
      };
    }
    
    const [, name, calories, protein, carbs, fat, fiber = "0"] = match;
    
    return {
      success: true,
      food: {
        name: name.trim(),
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        fiber: parseFloat(fiber),
        serving: 100,
        unit: 'g',
        category: determineCategory(parseFloat(protein), parseFloat(carbs), parseFloat(fat)),
        approved: true // Auto-approve all foods added through bulk process
      }
    };
  };

  // Helper function to determine the most likely category based on macros
  const determineCategory = (protein, carbs, fat) => {
    if (protein > carbs && protein > fat) return 'protein';
    if (carbs > protein && carbs > fat) return 'carbs';
    if (fat > protein && fat > carbs) return 'fats';
    return 'other';
  };

  // Check if a food with the same name already exists
  const isDuplicate = (foodName) => {
    if (!foods || !Array.isArray(foods)) return false;
    
    // Normalize the food name for comparison (lowercase, trim)
    const normalizedName = foodName.toLowerCase().trim();
    
    // Check if any existing food has the same name (case-insensitive)
    return foods.some(food => food.name.toLowerCase().trim() === normalizedName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    if (!addFood || !foods) {
      setErrors({
        general: "Food context not available. Please try again later."
      });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    // Split by newlines and filter out empty lines
    const lines = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    console.log("Processing lines:", lines.length, "lines");
    
    const results = { success: [], errors: [], duplicates: [] };
    
    // Create a local copy of the foods array to check for duplicates
    // This helps prevent race conditions when checking for duplicates
    let localFoodsList = [...foods];
    
    // Process each line one by one
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(`Processing line ${i+1}/${lines.length}: ${line}`);
      
      const result = parseFood(line);
      
      if (result.success) {
        // Check if this food already exists in the database
        if (isDuplicate(result.food.name)) {
          console.log(`Skipping duplicate food: ${result.food.name}`);
          results.duplicates.push({
            name: result.food.name,
            line
          });
          continue; // Skip to the next food
        }
        
        try {
          // Create a copy of the food object to avoid reference issues
          const foodToAdd = { ...result.food };
          
          // Add the food to the database (already approved)
          const newFood = addFood(foodToAdd);
          
          console.log(`Successfully added and approved food: ${foodToAdd.name} with ID: ${newFood.id}`);
          
          // Add to local foods list to check for duplicates in subsequent iterations
          localFoodsList.push(newFood);
          
          results.success.push({
            name: foodToAdd.name,
            id: newFood.id
          });
          
        } catch (error) {
          console.error("Error adding food:", error);
          results.errors.push({
            line,
            error: `Error adding food: ${error?.message || 'Unknown error'}`
          });
        }
      } else if (result.error !== 'Empty line') {
        results.errors.push({
          line,
          error: result.error
        });
      }
    }
    
    console.log("Final results:", results);
    
    // Final refresh to ensure all foods are visible
    if (refreshFoods) {
      refreshFoods();
    }
    
    setParseResults(results);
    setShowResults(true);
    setIsSubmitting(false);
    
    // If all foods were added successfully (or were duplicates), clear the text area
    if (results.errors.length === 0 && (results.success.length > 0 || results.duplicates.length > 0)) {
      setBulkText('');
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setBulkText('');
    setParseResults({ success: [], errors: [], duplicates: [] });
    setShowResults(false);
    setIsSubmitting(false);
    setErrors({});
    
    // Force a final refresh before closing to ensure all clients see the new foods
    if (refreshFoods) {
      refreshFoods();
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Bulk Add Foods</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {errors.general && (
            <div className="bg-error/10 text-error p-3 mb-4 rounded-md">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="bulkText" className="block text-sm font-medium text-gray-700 mb-1">
                Enter foods (one per line)
              </label>
              <div className="text-xs text-gray-500 mb-2">
                Format: "Food name kcal / g prot / g carb / g fat / g fiber"
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Example: Apple 52kcal / 0.3g prot / 14g carb / 0.2g fat / 2.4g fiber
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Note: Fiber is optional. If not provided, it will default to 0g.
              </div>
              <div className="text-xs text-gray-500 mb-2">
                <strong>Note:</strong> All foods added through bulk add will be automatically approved.
              </div>
              <textarea
                id="bulkText"
                rows={10}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={bulkText}
                onChange={handleTextChange}
                placeholder="Apple 52kcal / 0.3g prot / 14g carb / 0.2g fat / 2.4g fiber
Avocado 160kcal / 2g prot / 9g carb / 15g fat / 6.7g fiber
Almonds 579kcal / 21g prot / 22g carb / 50g fat / 12.5g fiber"
                disabled={isSubmitting}
              />
            </div>
            
            {showResults && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Results:</h4>
                
                {parseResults.success.length > 0 && (
                  <div className="mb-3">
                    <div className="text-success font-medium">
                      Successfully added and approved {parseResults.success.length} food{parseResults.success.length !== 1 ? 's' : ''}:
                    </div>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {parseResults.success.map((item, index) => (
                        <li key={index} className="text-gray-700">{item.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parseResults.duplicates.length > 0 && (
                  <div className="mb-3">
                    <div className="text-warning font-medium">
                      Skipped {parseResults.duplicates.length} duplicate food{parseResults.duplicates.length !== 1 ? 's' : ''}:
                    </div>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {parseResults.duplicates.map((item, index) => (
                        <li key={index} className="text-gray-700">{item.name} (already exists in database)</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {parseResults.errors.length > 0 && (
                  <div>
                    <div className="text-error font-medium">
                      Failed to add {parseResults.errors.length} food{parseResults.errors.length !== 1 ? 's' : ''}:
                    </div>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {parseResults.errors.map((item, index) => (
                        <li key={index} className="text-gray-700">{item.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleClose}
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
                {isSubmitting ? 'Adding Foods...' : 'Add Foods'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BulkFoodAddModal;
