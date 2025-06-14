import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaUtensils, FaCoffee, FaMoon, FaCookie } from 'react-icons/fa';
import Card from '../components/Card';
import Button from '../components/Button';
import MealCard from '../components/MealCard';

function MealPlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sample meal data
  const meals = {
    breakfast: {
      title: 'Mic Dejun',
      time: '07:30',
      calories: 420,
      foods: [
        { name: 'Iaurt grecesc', amount: 200, unit: 'g', calories: 120, protein: 20, carbs: 7, fat: 0.8 },
        { name: 'Granola', amount: 50, unit: 'g', calories: 220, protein: 5, carbs: 30, fat: 8 },
        { name: 'Afine', amount: 100, unit: 'g', calories: 80, protein: 1, carbs: 18, fat: 0.5 }
      ]
    },
    lunch: {
      title: 'Prânz',
      time: '13:00',
      calories: 650,
      foods: [
        { name: 'Piept de pui', amount: 150, unit: 'g', calories: 250, protein: 47, carbs: 0, fat: 5.4 },
        { name: 'Orez brun', amount: 100, unit: 'g', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9 },
        { name: 'Broccoli', amount: 150, unit: 'g', calories: 51, protein: 4.2, carbs: 9.9, fat: 0.6 },
        { name: 'Ulei de măsline', amount: 10, unit: 'ml', calories: 90, protein: 0, carbs: 0, fat: 10 }
      ]
    },
    dinner: {
      title: 'Cină',
      time: '19:30',
      calories: 580,
      foods: [
        { name: 'Somon', amount: 150, unit: 'g', calories: 280, protein: 39, carbs: 0, fat: 13.5 },
        { name: 'Cartofi dulci', amount: 150, unit: 'g', calories: 135, protein: 2.1, carbs: 31.5, fat: 0.1 },
        { name: 'Salată mixtă', amount: 100, unit: 'g', calories: 25, protein: 1.5, carbs: 4, fat: 0.3 },
        { name: 'Dressing de iaurt', amount: 30, unit: 'g', calories: 45, protein: 1.5, carbs: 2, fat: 3 }
      ]
    },
    snacks: {
      title: 'Gustări',
      time: '',
      calories: 280,
      foods: [
        { name: 'Mere', amount: 1, unit: 'buc', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        { name: 'Migdale', amount: 30, unit: 'g', calories: 185, protein: 6, carbs: 6, fat: 16 }
      ]
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  // Handle date change
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };
  
  // Handle add food
  const handleAddFood = (mealType) => {
    console.log(`Add food to ${mealType}`);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Planificator Mese</h1>
      
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
                Ziua anterioară
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                onClick={() => changeDate(1)}
              >
                Ziua următoare
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center mr-3">
              <FaUtensils className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Rezumat nutrițional</h3>
              <p className="text-sm text-gray-500">Total pentru {formatDate(selectedDate)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total calorii</div>
              <div className="font-bold text-2xl text-primary">
                {Object.values(meals).reduce((sum, meal) => sum + meal.calories, 0)} kcal
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Mese planificate</div>
              <div className="font-bold text-2xl">{Object.keys(meals).length}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-primary-light/20 rounded-lg">
              <div className="font-medium text-primary-dark">
                {Object.values(meals).reduce((sum, meal) => 
                  sum + meal.foods.reduce((s, food) => s + food.protein, 0), 0).toFixed(0)}g
              </div>
              <div className="text-xs text-gray-600">Proteine</div>
            </div>
            
            <div className="p-3 bg-secondary-light/20 rounded-lg">
              <div className="font-medium text-secondary-dark">
                {Object.values(meals).reduce((sum, meal) => 
                  sum + meal.foods.reduce((s, food) => s + food.carbs, 0), 0).toFixed(0)}g
              </div>
              <div className="text-xs text-gray-600">Carbohidrați</div>
            </div>
            
            <div className="p-3 bg-warning-light/20 rounded-lg">
              <div className="font-medium text-warning-dark">
                {Object.values(meals).reduce((sum, meal) => 
                  sum + meal.foods.reduce((s, food) => s + food.fat, 0), 0).toFixed(0)}g
              </div>
              <div className="text-xs text-gray-600">Grăsimi</div>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl h-64 md:h-auto">
          <img 
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
            alt="Meal planning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Planifică-ți mesele în avans</h3>
            <p className="mb-4">Planificarea meselor te ajută să menții o alimentație echilibrată și să economisești timp.</p>
            <Button variant="secondary" icon={FaPlus}>
              Creează un plan săptămânal
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MealCard 
          title={meals.breakfast.title}
          time={meals.breakfast.time}
          calories={meals.breakfast.calories}
          foods={meals.breakfast.foods}
          onAddFood={() => handleAddFood('breakfast')}
          className="relative overflow-hidden"
        />
        
        <MealCard 
          title={meals.lunch.title}
          time={meals.lunch.time}
          calories={meals.lunch.calories}
          foods={meals.lunch.foods}
          onAddFood={() => handleAddFood('lunch')}
          className="relative overflow-hidden"
        />
        
        <MealCard 
          title={meals.dinner.title}
          time={meals.dinner.time}
          calories={meals.dinner.calories}
          foods={meals.dinner.foods}
          onAddFood={() => handleAddFood('dinner')}
          className="relative overflow-hidden"
        />
        
        <MealCard 
          title={meals.snacks.title}
          time={meals.snacks.time}
          calories={meals.snacks.calories}
          foods={meals.snacks.foods}
          onAddFood={() => handleAddFood('snacks')}
          className="relative overflow-hidden"
        />
      </div>
    </div>
  );
}

export default MealPlannerPage;
