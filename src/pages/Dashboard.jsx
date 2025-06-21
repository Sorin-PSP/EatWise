import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFood } from '../contexts/FoodContext';
import Layout from '../components/Layout';
import DateSelector from '../components/DateSelector';
import NutritionSummary from '../components/NutritionSummary';
import MealSection from '../components/MealSection';
import NutritionChart from '../components/NutritionChart';
import CalorieProgressCard from '../components/CalorieProgressCard';
import NutrientsSummary from '../components/NutrientsSummary';
import DailyWaterTracker from '../components/DailyWaterTracker';
import WeightTracker from '../components/WeightTracker';

function Dashboard() {
  const { user } = useAuth();
  const { currentDate, setCurrentDate, getDailyNutrition } = useFood();
  const [waterIntake, setWaterIntake] = useState(0);
  const navigate = useNavigate();
  
  // Use default goals if user profile data is not available
  const calorieGoal = 2000;
  const proteinGoal = 120;
  const carbsGoal = 250;
  const fatGoal = 70;
  const waterGoal = 8;
  
  // Get daily nutrition data
  const dailyNutrition = getDailyNutrition(currentDate);
  
  // Load water data from localStorage on component mount
  useEffect(() => {
    const loadWaterData = () => {
      const savedWaterData = localStorage.getItem('eatwise-water');
      if (savedWaterData) {
        try {
          const parsedData = JSON.parse(savedWaterData);
          if (parsedData[currentDate]) {
            setWaterIntake(parsedData[currentDate]);
          } else {
            setWaterIntake(0);
          }
        } catch (error) {
          console.error('Error parsing water data:', error);
          setWaterIntake(0);
        }
      }
    };
    
    loadWaterData();
  }, [currentDate]);
  
  // Handle water intake changes
  const handleWaterIncrement = () => {
    const newValue = waterIntake + 1;
    setWaterIntake(newValue);
    saveWaterData(newValue);
  };
  
  const handleWaterDecrement = () => {
    if (waterIntake > 0) {
      const newValue = waterIntake - 1;
      setWaterIntake(newValue);
      saveWaterData(newValue);
    }
  };
  
  const saveWaterData = (value) => {
    try {
      const savedWaterData = localStorage.getItem('eatwise-water');
      const waterData = savedWaterData ? JSON.parse(savedWaterData) : {};
      
      waterData[currentDate] = value;
      
      localStorage.setItem('eatwise-water', JSON.stringify(waterData));
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };
  
  // Handle weight update
  const handleUpdateWeight = (weight) => {
    // Save to localStorage for now
    try {
      const weightData = {
        current: weight,
        start: weight, // For now, just use the current weight as start
        goal: Math.round(weight * 0.9 * 10) / 10, // Default goal is 10% less than current weight
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('eatwise-weight', JSON.stringify(weightData));
    } catch (error) {
      console.error('Error saving weight data:', error);
    }
  };
  
  // Calculate remaining calories
  const remainingCalories = calorieGoal - dailyNutrition.calories;
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        
        <DateSelector 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Meals</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <MealSection 
            date={currentDate}
            mealType="breakfast"
            title="Breakfast"
          />
          
          <MealSection 
            date={currentDate}
            mealType="lunch"
            title="Lunch"
          />
          
          <MealSection 
            date={currentDate}
            mealType="dinner"
            title="Dinner"
          />
          
          <MealSection 
            date={currentDate}
            mealType="snacks"
            title="Snacks"
          />
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate('/log')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add Food to Log
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CalorieProgressCard 
          consumed={dailyNutrition.calories} 
          goal={calorieGoal} 
          remaining={remainingCalories}
        />
        
        <NutrientsSummary 
          protein={dailyNutrition.protein} 
          proteinGoal={proteinGoal}
          carbs={dailyNutrition.carbs} 
          carbsGoal={carbsGoal}
          fat={dailyNutrition.fat} 
          fatGoal={fatGoal}
        />
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center opacity-10" 
                 style={{backgroundImage: "url('https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
            <h3 className="font-medium mb-4 relative z-10">Tip of the Day</h3>
            <div className="relative z-10">
              <p className="text-gray-700 mb-3">
                <span className="font-medium text-green-600">Did you know?</span> Consuming protein helps you feel full for longer and reduces cravings for snacks.
              </p>
              <p className="text-gray-700">
                Try to include a source of protein with each meal to maintain your energy levels throughout the day.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DailyWaterTracker 
          current={waterIntake} 
          goal={waterGoal}
          onIncrement={handleWaterIncrement}
          onDecrement={handleWaterDecrement}
        />
        
        <WeightTracker 
          currentWeight={75} // Default value, should be replaced with actual user data
          startWeight={75}
          goalWeight={70}
          onUpdateWeight={handleUpdateWeight}
        />
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-800/80"></div>
        <div className="relative z-10 p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
          <p className="mb-4">Keep maintaining healthy habits!</p>
          <NutritionSummary date={currentDate} />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium mb-4">Nutrient Evolution</h3>
        <NutritionChart />
      </div>
    </Layout>
  );
}

export default Dashboard;
