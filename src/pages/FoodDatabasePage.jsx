import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaHeart, FaRegHeart, FaSearch, FaPlus, FaSync } from 'react-icons/fa';
import FoodSearchBar from '../components/FoodSearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useUser } from '../contexts/UserContext';
import { useFood } from '../contexts/FoodContext';

function FoodDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { user } = useUser();
  const { foods, refreshFoods } = useFood();
  const [displayFoods, setDisplayFoods] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
  
  // Platform leaf logo (fallback image)
  const platformLogo = 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';
  
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
    'pork': 'https://images.pexels.com/photos/8308126/pexels-photo-8308126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'spinach': 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'kale': 'https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'banana': 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'orange': 'https://images.pexels.com/photos/42059/citrus-diet-food-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'strawberry': 'https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'blueberry': 'https://images.pexels.com/photos/1153655/pexels-photo-1153655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'milk': 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'cheese': 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'yogurt': 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'butter': 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'bread': 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'pasta': 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'quinoa': 'https://images.pexels.com/photos/7421240/pexels-photo-7421240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'oats': 'https://images.pexels.com/photos/216951/pexels-photo-216951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'potato': 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'sweet potato': 'https://images.pexels.com/photos/89247/pexels-photo-89247.png?auto=compress&cs=tinysrgb&w=1260&h=750',
    'tofu': 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'lentils': 'https://images.pexels.com/photos/8108209/pexels-photo-8108209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'chickpeas': 'https://images.pexels.com/photos/8108212/pexels-photo-8108212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'peanut butter': 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    'honey': 'https://images.pexels.com/photos/1427888/pexels-photo-1427888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  };
  
  // Function to get the best image for a food
  const getFoodImage = (food) => {
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
  
  // Update displayFoods whenever foods from context changes
  useEffect(() => {
    console.log('FoodDatabasePage: Foods from context updated:', foods.length);
    
    // Prepare foods for display with images
    const foodsWithImages = foods.map(food => ({
      ...food,
      image: getFoodImage(food)
    }));
    
    setDisplayFoods(foodsWithImages);
  }, [foods]);
  
  // Set up event listeners for food updates
  useEffect(() => {
    // Listen for custom events from FoodContext
    const handleFoodAdded = () => {
      console.log('FoodDatabasePage: Food added event received');
      refreshFoods();
    };
    
    const handleFoodUpdated = () => {
      console.log('FoodDatabasePage: Food updated event received');
      refreshFoods();
    };
    
    const handleFoodDeleted = () => {
      console.log('FoodDatabasePage: Food deleted event received');
      refreshFoods();
    };
    
    const handleFoodsUpdated = () => {
      console.log('FoodDatabasePage: Foods updated event received');
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
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Food Database</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            icon={FaSync} 
            onClick={handleManualRefresh}
            className={`${isRefreshing ? 'animate-spin' : ''}`}
          >
            Refresh
          </Button>
          
          {/* Only show Add Food button for admin users */}
          {user.isAdmin && (
            <Link to="/add-food">
              <Button variant="primary" icon={FaPlus}>
                Add Food
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary-dark/80"></div>
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
                  ? 'bg-secondary text-white'
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
            <Link to={`/food/${food.id}`} key={food.id}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="h-40 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, use platform logo as fallback
                      e.target.src = platformLogo;
                    }}
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{food.name}</h3>
                  <button className="text-gray-400 hover:text-error">
                    <FaRegHeart />
                  </button>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-primary">{food.calories} kcal</span>
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
          {user.isAdmin && (
            <Link to="/add-food">
              <Button variant="primary" icon={FaPlus}>
                Add a new food
              </Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}

export default FoodDatabasePage;
