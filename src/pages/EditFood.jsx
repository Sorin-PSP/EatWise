import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useFood } from '../contexts/FoodContext';

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFood, updateFood } = useFood();
  
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    serving: '',
    unit: 'g',
    category: 'protein'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load food data on component mount
  useEffect(() => {
    const foodData = getFood(id);
    if (foodData) {
      setFormData({
        name: foodData.name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        fiber: foodData.fiber || 0,
        serving: foodData.serving,
        unit: foodData.unit,
        category: foodData.category
      });
      setIsLoading(false);
    } else {
      // Food not found, redirect to food database
      navigate('/foods');
    }
  }, [id, getFood, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'unit' || name === 'category' ? value : value === '' ? '' : Number(value)
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    
    if (!formData.calories) {
      newErrors.calories = 'Calories are required';
    } else if (formData.calories < 0) {
      newErrors.calories = 'Calories cannot be negative';
    }
    
    if (!formData.serving) {
      newErrors.serving = 'Serving size is required';
    } else if (formData.serving <= 0) {
      newErrors.serving = 'Serving size must be greater than 0';
    }
    
    // Optional fields validation (if provided)
    if (formData.protein !== '' && formData.protein < 0) {
      newErrors.protein = 'Protein cannot be negative';
    }
    
    if (formData.carbs !== '' && formData.carbs < 0) {
      newErrors.carbs = 'Carbs cannot be negative';
    }
    
    if (formData.fat !== '' && formData.fat < 0) {
      newErrors.fat = 'Fat cannot be negative';
    }
    
    if (formData.fiber !== '' && formData.fiber < 0) {
      newErrors.fiber = 'Fiber cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const foodData = {
        ...formData,
        // Convert empty strings to 0 for numeric fields
        protein: formData.protein === '' ? 0 : formData.protein,
        carbs: formData.carbs === '' ? 0 : formData.carbs,
        fat: formData.fat === '' ? 0 : formData.fat,
        fiber: formData.fiber === '' ? 0 : formData.fiber
      };
      
      await updateFood(id, foodData);
      
      // Show success message
      alert('Food updated successfully!');
      
      // Navigate to the food details page
      navigate(`/foods/${id}`);
    } catch (error) {
      console.error('Error updating food:', error);
      setErrors({
        submit: 'Failed to update food. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading food data...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link to={`/foods/${id}`} className="mr-4 text-gray-600 hover:text-gray-900">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Edit Food</h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          
          <div className="mb-4">
            <Input
              label="Food Name *"
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Chicken Breast"
              error={errors.name}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Calories (kcal) *"
              id="calories"
              name="calories"
              type="number"
              min="0"
              step="1"
              required
              value={formData.calories}
              onChange={handleChange}
              placeholder="e.g., 165"
              error={errors.calories}
            />
            
            <div className="mb-4">
              <label htmlFor="serving" className="block text-sm font-medium text-gray-700 mb-1">
                Serving Size *
              </label>
              <div className="flex">
                <input
                  id="serving"
                  name="serving"
                  type="number"
                  min="1"
                  required
                  value={formData.serving}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.serving ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  } rounded-l-md shadow-sm focus:outline-none`}
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="piece">piece</option>
                  <option value="serving">serving</option>
                </select>
              </div>
              {errors.serving && (
                <p className="mt-1 text-sm text-red-600">{errors.serving}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Protein (g)"
              id="protein"
              name="protein"
              type="number"
              min="0"
              step="0.1"
              value={formData.protein}
              onChange={handleChange}
              placeholder="e.g., 31"
              error={errors.protein}
            />
            
            <Input
              label="Carbohydrates (g)"
              id="carbs"
              name="carbs"
              type="number"
              min="0"
              step="0.1"
              value={formData.carbs}
              onChange={handleChange}
              placeholder="e.g., 0"
              error={errors.carbs}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Fat (g)"
              id="fat"
              name="fat"
              type="number"
              min="0"
              step="0.1"
              value={formData.fat}
              onChange={handleChange}
              placeholder="e.g., 3.6"
              error={errors.fat}
            />
            
            <Input
              label="Fiber (g)"
              id="fiber"
              name="fiber"
              type="number"
              min="0"
              step="0.1"
              value={formData.fiber}
              onChange={handleChange}
              placeholder="e.g., 0"
              error={errors.fiber}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              icon={FaTimes}
              onClick={() => navigate(`/foods/${id}`)}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              icon={FaSave}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default EditFood;
