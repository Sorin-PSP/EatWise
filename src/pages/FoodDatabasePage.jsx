import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaHeart, FaRegHeart, FaSearch } from 'react-icons/fa';
import FoodSearchBar from '../components/FoodSearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

function FoodDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample food data
  const foods = [
    { 
      id: 1, 
      name: 'Piept de pui', 
      calories: 165, 
      protein: 31, 
      carbs: 0, 
      fat: 3.6, 
      category: 'protein',
      image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
    { 
      id: 2, 
      name: 'Orez brun', 
      calories: 112, 
      protein: 2.6, 
      carbs: 23.5, 
      fat: 0.9, 
      category: 'carbs',
      image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
    { 
      id: 3, 
      name: 'Avocado', 
      calories: 160, 
      protein: 2, 
      carbs: 8.5, 
      fat: 14.7, 
      category: 'fats',
      image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
    { 
      id: 4, 
      name: 'Broccoli', 
      calories: 34, 
      protein: 2.8, 
      carbs: 6.6, 
      fat: 0.4, 
      category: 'vegetables',
      image: 'https://images.pexels.com/photos/399629/pexels-photo-399629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
    { 
      id: 5, 
      name: 'Mere', 
      calories: 52, 
      protein: 0.3, 
      carbs: 13.8, 
      fat: 0.2, 
      category: 'fruits',
      image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
    { 
      id: 6, 
      name: 'Iaurt grecesc', 
      calories: 59, 
      protein: 10, 
      carbs: 3.6, 
      fat: 0.4, 
      category: 'dairy',
      image: 'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
    },
  ];
  
  // Filter foods based on search query and category
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Categories
  const categories = [
    { id: 'all', name: 'Toate' },
    { id: 'protein', name: 'Proteine' },
    { id: 'carbs', name: 'Carbohidrați' },
    { id: 'fats', name: 'Grăsimi' },
    { id: 'vegetables', name: 'Legume' },
    { id: 'fruits', name: 'Fructe' },
    { id: 'dairy', name: 'Lactate' },
  ];
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Bază de Date Alimente</h1>
        
        <Link to="/add-food">
          <Button variant="primary" icon={FaPlus}>
            Adaugă aliment
          </Button>
        </Link>
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-80" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary-dark/80"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-2 text-white">Caută alimente</h2>
            <p className="text-white/90 mb-4">Găsește informații nutriționale pentru orice aliment</p>
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
                    {categories.find(c => c.id === food.category)?.name}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.protein}g</div>
                    <div className="text-gray-500">Proteine</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.carbs}g</div>
                    <div className="text-gray-500">Carbo</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">{food.fat}g</div>
                    <div className="text-gray-500">Grăsimi</div>
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
            <p className="text-lg">Nu am găsit alimente care să corespundă căutării tale</p>
          </div>
          <Link to="/add-food">
            <Button variant="primary" icon={FaPlus}>
              Adaugă un aliment nou
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

export default FoodDatabasePage;
