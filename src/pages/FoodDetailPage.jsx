import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaPlus, FaUtensils, FaInfoCircle } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

function FoodDetailPage() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(100);
  
  // Sample food data - in a real app, you would fetch this based on the ID
  const food = {
    id: parseInt(id),
    name: 'Piept de pui',
    description: 'Piept de pui fără piele, gătit la grătar fără ulei adăugat.',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: 100,
    servingUnit: 'g',
    category: 'protein',
    image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  };
  
  // Calculate nutrition based on quantity
  const calculateNutrition = (value) => {
    return (value * quantity / food.servingSize).toFixed(1);
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(parseFloat(e.target.value));
  };
  
  // Add to meal
  const addToMeal = (mealType) => {
    console.log(`Add ${food.name} to ${mealType}`);
    // In a real app, you would add this to your meal tracking system
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/food-database" className="mr-4">
          <Button variant="outline" icon={FaArrowLeft}>
            Înapoi
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{food.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden mb-6">
            <img 
              src={food.image} 
              alt={food.name} 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{food.name}</h2>
                <Badge variant="primary" className="mt-1">
                  {food.category === 'protein' ? 'Proteine' : 
                   food.category === 'carbs' ? 'Carbohidrați' : 
                   food.category === 'fats' ? 'Grăsimi' : 
                   food.category === 'vegetables' ? 'Legume' :
                   food.category === 'fruits' ? 'Fructe' : 'Altele'}
                </Badge>
              </div>
              <button 
                onClick={toggleFavorite}
                className={`text-2xl ${isFavorite ? 'text-error' : 'text-gray-400 hover:text-error'}`}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">{food.description}</p>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="label">Cantitate ({food.servingUnit})</label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="quantity"
                  min="0"
                  max="500"
                  step="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="ml-4 w-20 px-2 py-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-primary-light/20 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Calorii</div>
                <div className="font-bold text-xl text-primary-dark">{calculateNutrition(food.calories)}</div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Proteine</div>
                <div className="font-bold text-xl text-blue-700">{calculateNutrition(food.protein)}</div>
                <div className="text-xs text-gray-500">g</div>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Carbohidrați</div>
                <div className="font-bold text-xl text-yellow-700">{calculateNutrition(food.carbs)}</div>
                <div className="text-xs text-gray-500">g</div>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Grăsimi</div>
                <div className="font-bold text-xl text-red-700">{calculateNutrition(food.fat)}</div>
                <div className="text-xs text-gray-500">g</div>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Adaugă la masă</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                icon={FaCoffee}
                onClick={() => addToMeal('breakfast')}
                className="text-yellow-600"
              >
                Mic dejun
              </Button>
              
              <Button 
                variant="outline" 
                icon={FaUtensils}
                onClick={() => addToMeal('lunch')}
                className="text-green-600"
              >
                Prânz
              </Button>
              
              <Button 
                variant="outline" 
                icon={FaUtensils}
                onClick={() => addToMeal('dinner')}
                className="text-blue-600"
              >
                Cină
              </Button>
              
              <Button 
                variant="outline" 
                icon={FaPlus}
                onClick={() => addToMeal('snacks')}
                className="text-orange-600"
              >
                Gustare
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <h3 className="font-medium mb-4">Informații nutriționale</h3>
            <p className="text-sm text-gray-600 mb-1">Per {quantity} {food.servingUnit}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Calorii</span>
                <span className="font-medium">{calculateNutrition(food.calories)} kcal</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Proteine</span>
                <span className="font-medium">{calculateNutrition(food.protein)} g</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Carbohidrați</span>
                <span className="font-medium">{calculateNutrition(food.carbs)} g</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100 pl-4">
                <span className="text-gray-600">- din care zaharuri</span>
                <span className="font-medium">{calculateNutrition(food.sugar)} g</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100 pl-4">
                <span className="text-gray-600">- din care fibre</span>
                <span className="font-medium">{calculateNutrition(food.fiber)} g</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Grăsimi</span>
                <span className="font-medium">{calculateNutrition(food.fat)} g</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span>Sodiu</span>
                <span className="font-medium">{calculateNutrition(food.sodium)} mg</span>
              </div>
            </div>
          </Card>
          
          <div className="relative rounded-xl overflow-hidden h-64">
            <img 
              src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy food" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Sfat nutrițional</h3>
              <p>Proteinele sunt esențiale pentru construirea și repararea țesuturilor musculare.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetailPage;
