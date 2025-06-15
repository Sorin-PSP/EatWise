import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useFood } from '../contexts/FoodContext';
import Button from './Button';

function BulkFoodAddModal({ isOpen, onClose }) {
  const foodContext = useFood();
  const { addFood, refreshFoods } = foodContext || {};
  const [bulkText, setBulkText] = useState('');
  const [parseResults, setParseResults] = useState({ success: [], errors: [] });
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        category: determineCategory(parseFloat(protein), parseFloat(carbs), parseFloat(fat))
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || !addFood) {
      setErrors({
        general: "Food context not available. Please try again later."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Split by newlines and filter out empty lines
    const lines = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    console.log("Processing lines:", lines);
    
    const results = { success: [], errors: [] };
    
    // Process each line one by one with proper async handling
    for (const line of lines) {
      const result = parseFood(line);
      console.log("Parsing result for line:", line, result);
      
      if (result.success) {
        try {
          // Add the food to the database
          const newFood = await Promise.resolve(addFood(result.food));
          results.success.push({
            name: result.food.name,
            id: newFood.id
          });
          
          // Important: Wait a small amount of time between additions to ensure unique IDs
          // and prevent race conditions in localStorage updates
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error("Error adding food:", error);
          results.errors.push({
            line,
            error: `Error adding food: ${error.message || 'Unknown error'}`
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
    
    // Force a refresh of the food context to ensure all clients see the new foods
    if (refreshFoods) {
      refreshFoods();
    }
    
    setParseResults(results);
    setShowResults(true);
    setIsSubmitting(false);
    
    // If all foods were added successfully, clear the text area
    if (results.errors.length === 0 && results.success.length > 0) {
      setBulkText('');
      
      // Close the modal after a short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setBulkText('');
    setParseResults({ success: [], errors: [] });
    setShowResults(false);
    setIsSubmitting(false);
    
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
                      Successfully added {parseResults.success.length} food{parseResults.success.length !== 1 ? 's' : ''}:
                    </div>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {parseResults.success.map((item, index) => (
                        <li key={index} className="text-gray-700">{item.name}</li>
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
