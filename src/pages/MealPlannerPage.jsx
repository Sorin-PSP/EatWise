import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaUtensils, FaCoffee, FaMoon, FaCookie, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import MealCard from '../components/MealCard';
import FoodSelector from '../components/FoodSelector';
import AddToMealModal from '../components/AddToMealModal';
import { useFood } from '../contexts/FoodContext';
import { formatCalories, formatNutrient, formatPercentage } from '../utils/formatters';

function MealPlannerPage() {
  const { dailyLog, getDailyNutrition, addFoodToLog, removeFoodFromLog, foods } = useFood();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealTargets, setMealTargets] = useState({
    breakfast: { calories: 400, time: '07:30' },
    lunch: { calories: 600, time: '13:00' },
    dinner: { calories: 550, time: '19:30' },
    snacks: { calories: 200, time: '15:00' }
  });
  
  // Get current day's data
  const currentDayLog = dailyLog[selectedDate] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
  const dailyNutrition = getDailyNutrition(selectedDate);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  // Handle date change
  const changeDate = (days) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };
  
  // Handle add food to specific meal
  const handleAddFood = (mealType) => {
    setSelectedMealType(mealType);
    setShowFoodSelector(true);
  };
  
  // Handle remove food from meal
  const handleRemoveFood = (mealType, logItemId) => {
    removeFoodFromLog(selectedDate, mealType, logItemId);
  };
  
  // Handle quick add from food database
  const handleQuickAdd = (food) => {
    setSelectedFood(food);
    setShowAddModal(true);
  };
  
  // Calculate meal nutrition
  const getMealNutrition = (mealType) => {
    const mealItems = currentDayLog[mealType] || [];
    return mealItems.reduce((totals, item) => {
      totals.calories += item.calories;
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fat += item.fat;
      totals.fiber += (item.fiber || 0);
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };
  
  // Get meal completion percentage
  const getMealCompletion = (mealType) => {
    const mealNutrition = getMealNutrition(mealType);
    const target = mealTargets[mealType].calories;
    return Math.min((mealNutrition.calories / target) * 100, 100);
  };
  
  // Handle meal target editing
  const handleEditMealTarget = (mealType) => {
    setEditingMeal(mealType);
  };
  
  const handleSaveMealTarget = (mealType, newTarget) => {
    setMealTargets(prev => ({
      ...prev,
      [mealType]: { ...prev[mealType], ...newTarget }
    }));
    setEditingMeal(null);
  };
  
  // Get popular foods for quick add
  const getPopularFoods = () => {
    return foods.slice(0, 6); // Show first 6 foods as popular
  };
  
  const mealIcons = {
    breakfast: FaCoffee,
    lunch: FaUtensils,
    dinner: FaMoon,
    snacks: FaCookie
  };
  
  const mealColors = {
    breakfast: 'bg-yellow-500',
    lunch: 'bg-green-500',
    dinner: 'bg-blue-500',
    snacks: 'bg-purple-500'
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meal Planner</h1>
      
      {/* Date Header */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/80"></div>
        <div className="relative z-10 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <FaCalendarAlt className="text-2xl mr-3" />
              <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => changeDate(-1)}
              >
                Previous Day
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => changeDate(1)}
              >
                Next Day
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center mr-3">
              <FaUtensils className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Daily Nutrition Summary</h3>
              <p className="text-sm text-gray-500">Total for {formatDate(selectedDate)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total calories</div>
              <div className="font-bold text-2xl text-primary">
                {formatCalories(dailyNutrition.calories)} kcal
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Meals logged</div>
              <div className="font-bold text-2xl">
                {Object.values(currentDayLog).filter(meal => meal.length > 0).length}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-primary-light/20 rounded-lg">
              <div className="font-medium text-primary-dark">
                {formatNutrient(dailyNutrition.protein)}g
              </div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            
            <div className="p-3 bg-secondary-light/20 rounded-lg">
              <div className="font-medium text-secondary-dark">
                {formatNutrient(dailyNutrition.carbs)}g
              </div>
              <div className="text-xs text-gray-600">Carbs</div>
            </div>
            
            <div className="p-3 bg-warning-light/20 rounded-lg">
              <div className="font-medium text-warning-dark">
                {formatNutrient(dailyNutrition.fat)}g
              </div>
              <div className="text-xs text-gray-600">Fat</div>
            </div>
          </div>
        </div>
        
        {/* Quick Add Foods */}
        <div className="card">
          <h3 className="font-medium mb-4">Quick Add Popular Foods</h3>
          <div className="grid grid-cols-2 gap-2">
            {getPopularFoods().map(food => (
              <button
                key={food.id}
                onClick={() => handleQuickAdd(food)}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
              >
                <div className="font-medium text-sm">{food.name}</div>
                <div className="text-xs text-gray-500">{formatCalories(food.calories)} kcal/{food.serving}{food.unit}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(mealTargets).map(([mealType, target]) => {
          const mealNutrition = getMealNutrition(mealType);
          const completion = getMealCompletion(mealType);
          const MealIcon = mealIcons[mealType];
          
          return (
            <div key={mealType} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${mealColors[mealType]} flex items-center justify-center mr-3`}>
                    <MealIcon className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{mealType}</h3>
                    <p className="text-sm text-gray-500">
                      {editingMeal === mealType ? (
                        <input
                          type="time"
                          defaultValue={target.time}
                          className="text-xs border rounded px-1"
                          onBlur={(e) => handleSaveMealTarget(mealType, { time: e.target.value })}
                        />
                      ) : (
                        <span onClick={() => handleEditMealTarget(mealType)} className="cursor-pointer">
                          {target.time}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditMealTarget(mealType)}
                    icon={FaEdit}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddFood(mealType)}
                    icon={FaPlus}
                  >
                    Add Food
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories: {formatCalories(mealNutrition.calories)} / {target.calories}</span>
                  <span>{formatPercentage(completion)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${mealColors[mealType]} transition-all duration-300`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Target Editing */}
              {editingMeal === mealType && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Target calories:</label>
                    <input
                      type="number"
                      defaultValue={target.calories}
                      className="w-20 px-2 py-1 text-sm border rounded"
                      onBlur={(e) => handleSaveMealTarget(mealType, { calories: parseInt(e.target.value) })}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMeal(null)}
                      icon={FaTimes}
                    />
                  </div>
                </div>
              )}
              
              {/* Food Items */}
              <div className="space-y-2">
                {currentDayLog[mealType]?.length > 0 ? (
                  currentDayLog[mealType].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatNutrient(item.quantity)}g • {formatCalories(item.calories)} kcal
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveFood(mealType, item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaUtensils className="mx-auto mb-2 text-2xl opacity-50" />
                    <p>No foods added yet</p>
                    <p className="text-sm">Click "Add Food" to start planning</p>
                  </div>
                )}
              </div>
              
              {/* Nutrition Summary */}
              {currentDayLog[mealType]?.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="font-medium">{formatNutrient(mealNutrition.protein)}g</div>
                      <div className="text-gray-500">Protein</div>
                    </div>
                    <div>
                      <div className="font-medium">{formatNutrient(mealNutrition.carbs)}g</div>
                      <div className="text-gray-500">Carbs</div>
                    </div>
                    <div>
                      <div className="font-medium">{formatNutrient(mealNutrition.fat)}g</div>
                      <div className="text-gray-500">Fat</div>
                    </div>
                    <div>
                      <div className="font-medium">{formatNutrient(mealNutrition.fiber)}g</div>
                      <div className="text-gray-500">Fiber</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Food Selector Modal */}
      {showFoodSelector && (
        <FoodSelector
          date={selectedDate}
          mealType={selectedMealType}
          onClose={() => {
            setShowFoodSelector(false);
            setSelectedMealType('');
          }}
        />
      )}
      
      {/* Add to Meal Modal */}
      {showAddModal && selectedFood && (
        <AddToMealModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedFood(null);
          }}
          food={selectedFood}
        />
      )}
    </div>
  );
}

export default MealPlannerPage;
