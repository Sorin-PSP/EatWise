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

  // Completely new approach using direct localStorage manipulation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    if (!foods) {
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
    
    if (lines.length === 0) {
      setErrors({
        general: "Please enter at least one food item."
      });
      setIsSubmitting(false);
      return;
    }
    
    const results = { success: [], errors: [], duplicates: [] };
    
    // Get current foods from localStorage directly
    let currentFoods = [];
    try {
      const savedFoods = localStorage.getItem('eatwise-foods');
      if (savedFoods) {
        currentFoods = JSON.parse(savedFoods);
      } else {
        // If no foods in localStorage, use the foods from context
        currentFoods = [...foods];
      }
    } catch (error) {
      console.error("Error reading foods from localStorage:", error);
      currentFoods = [...foods]; // Fallback to context
    }
    
    // Process all lines and create food objects
    const newFoods = [];
    const existingFoodNames = new Set(currentFoods.map(food => food.name.toLowerCase().trim()));
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const result = parseFood(line);
      
      if (result.success) {
        const foodName = result.food.name.toLowerCase().trim();
        
        // Check for duplicates
        if (existingFoodNames.has(foodName)) {
          results.duplicates.push({
            name: result.food.name,
            line
          });
          continue;
        }
        
        // Add to our tracking set to prevent duplicates within the batch
        existingFoodNames.add(foodName);
        
        // Generate a unique ID
        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`;
        
        // Get an image for the food
        const foodImage = getFoodImage(result.food);
        
        // Create the complete food object
        const newFood = {
          ...result.food,
          id: uniqueId,
          image: foodImage
        };
        
        // Add to our list of new foods
        newFoods.push(newFood);
        
        // Track success
        results.success.push({
          name: result.food.name,
          id: uniqueId
        });
      } else if (result.error !== 'Empty line') {
        results.errors.push({
          line,
          error: result.error
        });
      }
    }
    
    // If we have new foods to add, update localStorage directly
    if (newFoods.length > 0) {
      try {
        // Combine current foods with new foods
        const updatedFoods = [...currentFoods, ...newFoods];
        
        // Save directly to localStorage
        localStorage.setItem('eatwise-foods', JSON.stringify(updatedFoods));
        
        console.log(`Added ${newFoods.length} new foods directly to localStorage`);
        
        // Force a refresh of the foods in the context
        if (refreshFoods) {
          setTimeout(() => {
            refreshFoods();
          }, 100);
        }
      } catch (error) {
        console.error("Error saving foods to localStorage:", error);
        results.errors.push({
          line: "General error",
          error: `Error saving foods: ${error?.message || 'Unknown error'}`
        });
      }
    }
    
    // Update UI with results
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
  
  // Function to get the best image for a food
  const getFoodImage = (food) => {
    // Platform leaf logo (fallback image)
    const platformLogo = 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';
    
    // Default food images by category
    const defaultImages = {
      protein: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      carbs: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      fats: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      vegetables: 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      fruits: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      dairy: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      other: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    };
    
    // Specific food images mapping
    const specificFoodImages = {
      'chicken breast': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'white rice': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'broccoli': 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'olive oil': 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'apples': 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'avocado': 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'almonds': 'https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'eggs': 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'salmon': 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'beef': 'https://images.pexels.com/photos/618775/pexels-photo-618775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
      'pork': 'https://images.pexels.com/photos/8308126/pexels-photo-8308126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    };
    
    // First try to find a specific image for this food by name
    const foodNameLower = food.name.toLowerCase();
    
    // Check if we have an exact match
    if (specificFoodImages[foodNameLower]) {
      return specificFoodImages[foodNameLower];
    }
    
    // Check if we have a partial match (food name contains one of our keys)
    for (const [key, imageUrl] of Object.entries(specificFoodImages)) {
      if (foodNameLower.includes(key)) {
        return imageUrl;
      }
    }
    
    // If no specific image, use category image
    if (defaultImages[food.category]) {
      return defaultImages[food.category];
    }
    
    // If all else fails, use platform logo
    return platformLogo;
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
