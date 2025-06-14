import { useState } from 'react'
import { useFood } from '../contexts/FoodContext'
import { FaSearch, FaTimes } from 'react-icons/fa'

function FoodSelector({ date, mealType, onClose }) {
  const { foods, addFoodToLog } = useFood()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [quantity, setQuantity] = useState(100)
  
  const filteredFoods = searchTerm
    ? foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : foods
  
  const handleAddFood = () => {
    if (selectedFood && quantity > 0) {
      addFoodToLog(date, mealType, selectedFood, quantity)
      onClose()
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Adaugă aliment</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Caută aliment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          <ul className="divide-y divide-gray-200">
            {filteredFoods.map(food => (
              <li 
                key={food.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedFood?.id === food.id ? 'bg-primary-light bg-opacity-20' : ''}`}
                onClick={() => setSelectedFood(food)}
              >
                <div className="flex justify-between">
                  <p className="font-medium">{food.name}</p>
                  <p className="text-gray-600">{food.calories} kcal/{food.serving}{food.unit}</p>
                </div>
                <p className="text-sm text-gray-500">
                  P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                </p>
              </li>
            ))}
            
            {filteredFoods.length === 0 && (
              <li className="p-4 text-center text-gray-500">
                Nu s-au găsit alimente. Încearcă alt termen de căutare.
              </li>
            )}
          </ul>
        </div>
        
        {selectedFood && (
          <div className="p-4 border-t">
            <div className="mb-4">
              <label htmlFor="quantity" className="label">
                Cantitate ({selectedFood.unit})
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="input"
              />
            </div>
            
            <div className="text-sm mb-4">
              <p>Calorii: {Math.round((selectedFood.calories * quantity) / selectedFood.serving)} kcal</p>
              <p>Proteine: {Math.round((selectedFood.protein * quantity) / selectedFood.serving * 10) / 10}g</p>
              <p>Carbohidrați: {Math.round((selectedFood.carbs * quantity) / selectedFood.serving * 10) / 10}g</p>
              <p>Grăsimi: {Math.round((selectedFood.fat * quantity) / selectedFood.serving * 10) / 10}g</p>
            </div>
            
            <button 
              onClick={handleAddFood}
              className="btn-primary w-full"
            >
              Adaugă
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodSelector
