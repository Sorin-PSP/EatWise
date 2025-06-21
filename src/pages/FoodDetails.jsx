import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useFood } from '../contexts/FoodContext';
import { useAuth } from '../contexts/AuthContext';

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFood, deleteFood, addFoodToLog } = useFood();
  const { user } = useAuth();
  const [food, setFood] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [isAddingToLog, setIsAddingToLog] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  
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
  
  // Categories mapping
  const categories = {
    protein: 'Protein',
    carbs: 'Carbohydrates',
    fats: 'Fats',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    dairy: 'Dairy',
    other: 'Other'
  };
  
  // Meal types
  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snacks', name: 'Snacks' }
  ];
  
  useEffect(() => {
    const foodData = getFood(id);
    if (foodData) {
      setFood({
        ...foodData,
        image: foodData.image || defaultImages[foodData.category] || defaultImages.other
      });
    } else {
      // Food not found, redirect to food database
      navigate('/foods');
    }
  }, [id, getFood, navigate]);
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${food.name}?`)) {
      setIsDeleting(true);
      
      try {
        await deleteFood(id);
        navigate('/foods');
      } catch (error) {
        console.error('Error deleting food:', error);
        setIsDeleting(false);
        alert('Failed to delete food. Please try again.');
      }
    }
  };
  
  const handleAddToLog = async () => {
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setIsAddingToLog(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      await addFoodToLog(today, selectedMeal, food, quantity);
      
      // Show success message
      setAddSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setAddSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding food to log:', error);
      alert('Failed to add food to log. Please try again.');
    } finally {
      setIsAddingToLog(false);
    }
  };
  
  if (!food) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading food details...</div>
        </div>
      </Layout>
    );
  }
  
  // Calculate nutrition for current quantity
  const calculatedNutrition = {
    calories: Math.round((food.calories * quantity) / food.serving),
    protein: Math.round((food.protein * quantity) / food.serving * 10) / 10,
    carbs: Math.round((food.carbs * quantity) / food.serving * 10) / 10,
    fat: Math.round((food.fat * quantity) / food.serving * 10) / 10,
    fiber: Math.round((food.fiber * quantity) / food.serving * 10) / 10
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/foods" className="inline-flex items-center text-primary hover:text-primary-dark">
          <FaArrowLeft className="mr-2" />
          Back to Food Database
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden h-full">
            <div className="h-48 md:h-64 overflow-hidden">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold">{food.name}</h1>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-primary">{food.calories} kcal</span>
                <Badge variant={food.category === 'protein' ? 'primary' : 
                              food.category === 'carbs' ? 'secondary' : 
                              food.category === 'fats' ? 'warning' : 
                              'accent'}>
                  {categories[food.category] || 'Other'}
                </Badge>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Per {food.serving} {food.unit} serving</div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Add to Today's Log</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label htmlFor="quantity" className="block text-xs text-gray-500 mb-1">
                      Quantity ({food.unit})
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="mealType" className="block text-xs text-gray-500 mb-1">
                      Meal
                    </label>
                    <select
                      id="mealType"
                      value={selectedMeal}
                      onChange={(e) => setSelectedMeal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      {mealTypes.map(meal => (
                        <option key={meal.id} value={meal.id}>{meal.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleAddToLog}
                  disabled={isAddingToLog}
                  icon={FaPlus}
                >
                  {isAddingToLog ? 'Adding...' : 'Add to Log'}
                </Button>
                
                {addSuccess && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded-md text-center">
                    Added to your daily log!
                  </div>
                )}
              </div>
              
              {user?.isAdmin && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/foods/${id}/edit`)}
                    icon={FaEdit}
                  >
                    Edit
                  </Button>
                  
                  <Button 
                    variant="error" 
                    className="flex-1"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    icon={FaTrash}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Nutritional Information</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{food.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{food.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-secondary">{food.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-warning">{food.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
              
              {quantity !== food.serving && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Nutrition for {quantity} {food.unit}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-primary">{calculatedNutrition.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">{calculatedNutrition.protein}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-secondary">{calculatedNutrition.carbs}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-warning">{calculatedNutrition.fat}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Detailed Nutrition</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span>Protein</span>
                    <span className="font-medium">{food.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span>Carbohydrates</span>
                    <span className="font-medium">{food.carbs}g</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="pl-4 text-gray-600">Fiber</span>
                    <span className="font-medium">{food.fiber || 0}g</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="pl-4 text-gray-600">Net Carbs</span>
                    <span className="font-medium">{Math.max(0, food.carbs - (food.fiber || 0))}g</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span>Fat</span>
                    <span className="font-medium">{food.fat}g</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Macronutrient Ratio</h3>
                <div className="h-6 rounded-full overflow-hidden bg-gray-200 mb-2">
                  {food.calories > 0 && (
                    <>
                      <div 
                        className="h-full bg-blue-500 float-left" 
                        style={{ width: `${(food.protein * 4 / food.calories) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-secondary float-left" 
                        style={{ width: `${(food.carbs * 4 / food.calories) * 100}%` }}
                      ></div>
                      <div 
                        className="h-full bg-warning float-left" 
                        style={{ width: `${(food.fat * 9 / food.calories) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Protein ({Math.round((food.protein * 4 / food.calories) * 100) || 0}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
                    <span>Carbs ({Math.round((food.carbs * 4 / food.calories) * 100) || 0}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-1"></div>
                    <span>Fat ({Math.round((food.fat * 9 / food.calories) * 100) || 0}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default FoodDetails;
