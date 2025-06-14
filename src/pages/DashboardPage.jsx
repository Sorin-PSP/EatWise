import { FaCoffee, FaUtensils, FaMoon, FaCookie } from 'react-icons/fa'
import DateSelector from '../components/DateSelector'
import NutritionSummary from '../components/NutritionSummary'
import MealSection from '../components/MealSection'
import NutritionChart from '../components/NutritionChart'
import { useFood } from '../contexts/FoodContext'
import CalorieProgressCard from '../components/CalorieProgressCard'
import NutrientsSummary from '../components/NutrientsSummary'
import DailyWaterTracker from '../components/DailyWaterTracker'
import WeightTracker from '../components/WeightTracker'

function DashboardPage() {
  const { currentDate, setCurrentDate } = useFood()
  
  // Sample data for demonstration
  const handleWaterIncrement = () => {
    console.log('Water increment')
  }
  
  const handleWaterDecrement = () => {
    console.log('Water decrement')
  }
  
  const handleUpdateWeight = () => {
    console.log('Update weight')
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        
        <DateSelector 
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </div>
      
      <div className="relative rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80"></div>
        <div className="relative z-10 p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
          <p className="mb-4">Keep maintaining healthy habits!</p>
          <NutritionSummary date={currentDate} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <CalorieProgressCard 
          consumed={1450} 
          goal={2000} 
          remaining={550}
        />
        
        <NutrientsSummary 
          protein={65} 
          proteinGoal={120}
          carbs={180} 
          carbsGoal={250}
          fat={45} 
          fatGoal={70}
        />
        
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center opacity-10" 
               style={{backgroundImage: "url('https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"}}></div>
          <h3 className="font-medium mb-4 relative z-10">Tip of the Day</h3>
          <div className="relative z-10">
            <p className="text-gray-700 mb-3">
              <span className="font-medium text-primary">Did you know?</span> Consuming protein helps you feel full for longer and reduces cravings for snacks.
            </p>
            <p className="text-gray-700">
              Try to include a source of protein with each meal to maintain your energy levels throughout the day.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DailyWaterTracker 
          current={5} 
          goal={8}
          onIncrement={handleWaterIncrement}
          onDecrement={handleWaterDecrement}
        />
        
        <WeightTracker 
          currentWeight={72.5} 
          startWeight={75}
          goalWeight={68}
          onUpdateWeight={handleUpdateWeight}
        />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Meals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MealSection 
            date={currentDate}
            mealType="breakfast"
            title="Breakfast"
            icon={<FaCoffee className="text-yellow-600" />}
          />
          
          <MealSection 
            date={currentDate}
            mealType="lunch"
            title="Lunch"
            icon={<FaUtensils className="text-green-600" />}
          />
          
          <MealSection 
            date={currentDate}
            mealType="dinner"
            title="Dinner"
            icon={<FaMoon className="text-blue-600" />}
          />
          
          <MealSection 
            date={currentDate}
            mealType="snacks"
            title="Snacks"
            icon={<FaCookie className="text-orange-600" />}
          />
        </div>
      </div>
      
      <div className="card">
        <h3 className="font-medium mb-4">Nutrient Evolution</h3>
        <NutritionChart />
      </div>
    </div>
  )
}

export default DashboardPage
