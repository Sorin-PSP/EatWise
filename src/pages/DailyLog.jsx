import { useState, useEffect } from 'react';
import { useFood } from '../contexts/FoodContext';
import Layout from '../components/Layout';
import DatePicker from '../components/DatePicker';
import MealSection from '../components/MealSection';
import NutritionSummary from '../components/NutritionSummary';
import AddFoodToLogModal from '../components/AddFoodToLogModal';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function DailyLog() {
  const { 
    currentDate, 
    setCurrentDate, 
    dailyLog, 
    getDailyNutrition,
    refreshDailyLogs,
    isOnline,
    user
  } = useFood();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [dailyNutrition, setDailyNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Get the daily log for the current date
  const dateLog = dailyLog[currentDate] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  // Calculate daily nutrition whenever the date or log changes
  useEffect(() => {
    const fetchNutrition = async () => {
      setIsLoading(true);
      try {
        const nutrition = await getDailyNutrition(currentDate);
        setDailyNutrition(nutrition);
      } catch (error) {
        console.error('Error fetching nutrition:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutrition();
  }, [currentDate, dailyLog, getDailyNutrition]);

  // Refresh daily logs when the date changes
  useEffect(() => {
    if (user && isOnline) {
      refreshDailyLogs();
    }
  }, [currentDate, user, isOnline, refreshDailyLogs]);

  const openAddModal = (mealType) => {
    setSelectedMealType(mealType);
    setIsAddModalOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Jurnal Zilnic</h1>
          <DatePicker 
            selectedDate={currentDate} 
            onChange={setCurrentDate} 
          />
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Rezumat Nutrițional</h2>
          <NutritionSummary nutrition={dailyNutrition} isLoading={isLoading} />
        </div>

        {/* Meal Sections */}
        <div className="space-y-6">
          {/* Breakfast */}
          <MealSection 
            title="Mic Dejun" 
            items={dateLog.breakfast} 
            mealType="breakfast"
            onAddClick={() => openAddModal('breakfast')}
            date={currentDate}
          />

          {/* Lunch */}
          <MealSection 
            title="Prânz" 
            items={dateLog.lunch} 
            mealType="lunch"
            onAddClick={() => openAddModal('lunch')}
            date={currentDate}
          />

          {/* Dinner */}
          <MealSection 
            title="Cină" 
            items={dateLog.dinner} 
            mealType="dinner"
            onAddClick={() => openAddModal('dinner')}
            date={currentDate}
          />

          {/* Snacks */}
          <MealSection 
            title="Gustări" 
            items={dateLog.snacks} 
            mealType="snacks"
            onAddClick={() => openAddModal('snacks')}
            date={currentDate}
          />
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => openAddModal('all')}
          className="fixed bottom-20 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Adaugă aliment"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </button>

        {/* Add Food Modal */}
        <AddFoodToLogModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          mealType={selectedMealType}
          date={currentDate}
        />
      </div>
    </Layout>
  );
}
