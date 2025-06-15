import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import AddFoodModal from '../components/AddFoodModal';
import AddToMealModal from '../components/AddToMealModal';
import { useFood } from '../contexts/FoodContext';
import { useUser } from '../contexts/UserContext';

function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFood, deleteFood } = useFood();
  const { user } = useUser();
  const [food, setFood] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddToMealModalOpen, setIsAddToMealModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  
  useEffect(() => {
    const foodData = getFood(id);
    if (foodData) {
      setFood({
        ...foodData,
        image: defaultImages[foodData.category] || defaultImages.other
      });
    } else {
      // Food not found, redirect to food database
      navigate('/food-database');
    }
  }, [id, getFood, navigate]);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${food.name}?`)) {
      setIsDeleting(true);
      
      try {
        deleteFood(id);
        navigate('/food-database');
      } catch (error) {
        console.error('Error deleting food:', error);
        setIsDeleting(false);
        alert('Failed to delete food. Please try again.');
      }
    }
  };
  
  if (!food) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading food details...</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/food-database" className="inline-flex items-center text-primary hover:text-primary-dark">
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
                <div className="text-sm text-gray-500 mb-1">Per {food.serving}{food.unit} serving</div>
              </div>
              
              <div className="flex justify-between mb-4">
                <Button 
                  variant="primary" 
                  className="flex-1 mr-2"
                  onClick={() => setIsAddToMealModalOpen(true)}
                  icon={FaPlus}
                >
                  Add to Meal
                </Button>
                
                {user.isAdmin && (
                  <Button 
                    variant="outline" 
                    className="flex-1 ml-2"
                    onClick={() => setIsEditModalOpen(true)}
                    icon={FaEdit}
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {user.isAdmin && (
                <Button 
                  variant="error" 
                  className="w-full"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  icon={FaTrash}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Food'}
                </Button>
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
      
      {isEditModalOpen && (
        <AddFoodModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          editFood={food}
        />
      )}
      
      {isAddToMealModalOpen && (
        <AddToMealModal 
          isOpen={isAddToMealModalOpen} 
          onClose={() => setIsAddToMealModalOpen(false)} 
          food={food}
        />
      )}
    </div>
  );
}

export default FoodDetailPage;
