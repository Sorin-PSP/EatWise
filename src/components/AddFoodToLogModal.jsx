import { useState, useEffect } from 'react';
import { useFood } from '../contexts/FoodContext';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AddFoodToLogModal({ isOpen, onClose, mealType, date }) {
  const { foods, addFoodToLog, refreshFoods } = useFood();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [isAdding, setIsAdding] = useState(false);

  // Set the modal title based on meal type
  const getMealTitle = () => {
    switch (mealType) {
      case 'breakfast':
        return 'Mic Dejun';
      case 'lunch':
        return 'Prânz';
      case 'dinner':
        return 'Cină';
      case 'snacks':
        return 'Gustări';
      case 'all':
        return 'Adaugă Aliment';
      default:
        return 'Adaugă Aliment';
    }
  };

  // Filter foods based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFoods(foods);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = foods.filter(food => 
        food.name.toLowerCase().includes(lowercasedSearch) ||
        food.category.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredFoods(filtered);
    }
  }, [searchTerm, foods]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedFood(null);
      setQuantity(100);
      setFilteredFoods(foods);
      refreshFoods(); // Refresh foods when modal opens
    }
  }, [isOpen, foods, refreshFoods]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setQuantity(food.serving); // Set default quantity to the food's serving size
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;
    
    setIsAdding(true);
    try {
      await addFoodToLog(date, mealType, selectedFood, quantity);
      onClose();
    } catch (error) {
      console.error('Error adding food to log:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {`Adaugă Aliment la ${getMealTitle()}`}
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Caută alimente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Food List */}
          {selectedFood ? (
            <div className="mb-4">
              <div className="flex items-center p-3 border rounded-md bg-green-50 border-green-200">
                <img 
                  src={selectedFood.image} 
                  alt={selectedFood.name} 
                  className="h-12 w-12 rounded-full object-cover mr-3" 
                />
                <div>
                  <h4 className="font-medium">{selectedFood.name}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedFood.calories} kcal / {selectedFood.serving}g
                  </p>
                </div>
                <button 
                  className="ml-auto text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedFood(null)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Quantity Input */}
              <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Cantitate (g)
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                />
              </div>

              {/* Nutrition Preview */}
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Nutrienți pentru {quantity}g:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Calorii:</span>{' '}
                    <span className="font-medium">{Math.round((selectedFood.calories * quantity) / selectedFood.serving)} kcal</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Proteine:</span>{' '}
                    <span className="font-medium">{((selectedFood.protein * quantity) / selectedFood.serving).toFixed(1)}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbohidrați:</span>{' '}
                    <span className="font-medium">{((selectedFood.carbs * quantity) / selectedFood.serving).toFixed(1)}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Grăsimi:</span>{' '}
                    <span className="font-medium">{((selectedFood.fat * quantity) / selectedFood.serving).toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto mb-4">
              {filteredFoods.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  Nu s-au găsit alimente. Încearcă un alt termen de căutare.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredFoods.map((food) => (
                    <li 
                      key={food.id}
                      className="py-2 px-1 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleFoodSelect(food)}
                    >
                      <div className="flex items-center">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="h-10 w-10 rounded-full object-cover mr-3" 
                        />
                        <div>
                          <h4 className="font-medium">{food.name}</h4>
                          <p className="text-sm text-gray-600">
                            {food.calories} kcal / {food.serving}g
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={onClose}
            >
              Anulează
            </button>
            <button
              type="button"
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md ${
                selectedFood ? 'hover:bg-green-700' : 'opacity-50 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              onClick={handleAddFood}
              disabled={!selectedFood || isAdding}
            >
              {isAdding ? 'Se adaugă...' : 'Adaugă'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
