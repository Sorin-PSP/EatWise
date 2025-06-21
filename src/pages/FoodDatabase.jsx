import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaHeart, FaRegHeart, FaSearch, FaPlus, FaSync, FaPaperPlane } from 'react-icons/fa';
import Layout from '../components/Layout';
import FoodSearchBar from '../components/FoodSearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';

function FoodDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { user, isAdmin } = useAuth();
  const { foods, refreshFoods } = useFood();
  const [displayFoods, setDisplayFoods] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'protein', name: 'Protein' },
    { id: 'carbs', name: 'Carbohydrates' },
    { id: 'fats', name: 'Fats' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'other', name: 'Other' }
  ];
  
  // Update displayFoods whenever foods from context changes
  useEffect(() => {
    console.log('FoodDatabase: Foods from context updated:', foods.length);
    setDisplayFoods(foods);
  }, [foods]);
  
  // Set up event listeners for food updates
  useEffect(() => {
    // Listen for custom events from FoodContext
    const handleFoodAdded = () => {
      console.log('FoodDatabase: Food added event received');
      refreshFoods();
    };
    
    const handleFoodUpdated = () => {
      console.log('FoodDatabase: Food updated event received');
      refreshFoods();
    };
    
    const handleFoodDeleted = () => {
      console.log('FoodDatabase: Food deleted event received');
      refreshFoods();
    };
    
    const handleFoodsUpdated = () => {
      console.log('FoodDatabase: Foods updated event received');
      refreshFoods();
    };
    
    // Add event listeners
    window.addEventListener('foodAdded', handleFoodAdded);
    window.addEventListener('foodUpdated', handleFoodUpdated);
    window.addEventListener('foodDeleted', handleFoodDeleted);
    window.addEventListener('foodsUpdated', handleFoodsUpdated);
    
    // Force refresh every 3 seconds
    const intervalId = setInterval(() => {
      refreshFoods();
    }, 3000);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('foodAdded', handleFoodAdded);
      window.removeEventListener('foodUpdated', handleFoodUpdated);
      window.removeEventListener('foodDeleted', handleFoodDeleted);
      window.removeEventListener('foodsUpdated', handleFoodsUpdated);
      clearInterval(intervalId);
    };
  }, [refreshFoods]);
  
  // Filter foods based on search query and category
  const filteredFoods = displayFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshFoods();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      // In a real app, you would send this to a server
      console.log('Food feedback submitted:', feedbackText);
      
      // Store feedback in localStorage for demo purposes
      try {
        const savedFeedback = localStorage.getItem('eatwise-food-feedback') || '[]';
        const feedbackList = JSON.parse(savedFeedback);
        
        feedbackList.push({
          text: feedbackText,
          date: new Date().toISOString(),
          user: user.email || 'anonymous'
        });
        
        localStorage.setItem('eatwise-food-feedback', JSON.stringify(feedbackList));
        
        // Show success message
        setFeedbackSubmitted(true);
        setFeedbackText('');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setFeedbackSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error('Error saving feedback:', error);
      }
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Food Database</h1>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            icon={FaSync} 
            onClick={handleManualRefresh}
            className={`${isRefreshing ? 'animate-spin' : ''}`}
          >
            Refresh
          </Button>
          
          {/* Only show Add Food button for admin users */}
          {isAdmin && (
            <Link to="/foods/add">
              <Button variant="primary" icon={FaPlus}>
                Add Food
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Feedback field */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          If you searched for a food, meal, food product or drink that you didn't find in the list, write it here and we will update the list with this product as soon as possible
        </h3>
        <div className="flex">
          <Input
            placeholder="Enter food item name..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="mb-0 flex-grow"
          />
          <Button
            variant="primary"
            icon={FaPaperPlane}
            onClick={handleFeedbackSubmit}
            className="ml-2"
            disabled={!feedbackText.trim()}
          >
            Submit
          </Button>
        </div>
        {feedbackSubmitted && (
          <p className="text-green-600 text-sm mt-2">Thank you for your feedback! We'll add this food item soon.</p>
        )}
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-800/80"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-2 text-white">Search Foods</h2>
            <p className="text-white/90 mb-4">Find nutritional information for any food</p>
            <FoodSearchBar onSearch={handleSearch} className="mb-0" />
          </div>
        </div>
      </div>
      
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map(food => (
            <Link to={`/foods/${food.id}`} key={food.id}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{food.name}</h3>
                  <button className="text-gray-400 hover:text-red-500">
                    <FaRegHeart />
                  </button>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-green-600">{food.calories} kcal</span>
                  <Badge variant={food.category === 'protein' ? 'primary' : 
                                food.category === 'carbs' ? 'secondary' : 
                                food.category === 'fats' ? 'warning' : 
                                'accent'}>
                    {categories.find(c => c.id === food.category)?.name || 'Other'}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.protein}g</div>
                    <div className="text-gray-500">Protein</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.carbs}g</div>
                    <div className="text-gray-500">Carbs</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.fat}g</div>
                    <div className="text-gray-500">Fats</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.fiber || 0}g</div>
                    <div className="text-gray-500">Fiber</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          <div className="text-gray-500 mb-4">
            <FaSearch className="text-4xl mx-auto mb-4 opacity-30" />
            <p className="text-lg">No foods found matching your search</p>
          </div>
          {/* Only show Add Food button for admin users */}
          {isAdmin && (
            <Link to="/foods/add">
              <Button variant="primary" icon={FaPlus}>
                Add a new food
              </Button>
            </Link>
          )}
        </Card>
      )}
    </Layout>
  );
}

export default FoodDatabase;
