import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFood } from '../contexts/FoodContext'
import { FaArrowLeft } from 'react-icons/fa'

function AddFoodPage() {
  const navigate = useNavigate()
  const { addFood } = useFood()
  
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    serving: '100',
    unit: 'g',
    category: 'protein'
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'unit' || name === 'category' ? value : Number(value)
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.calories || !formData.serving) {
      alert('Completează toate câmpurile obligatorii!')
      return
    }
    
    const newFood = addFood(formData)
    navigate(`/food/${newFood.id}`)
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/food-database" className="mr-4 text-gray-600 hover:text-gray-900">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Adaugă Aliment Nou</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Nume Aliment *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="ex: Piept de pui"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="calories" className="label">
                Calorii (kcal) *
              </label>
              <input
                id="calories"
                name="calories"
                type="number"
                min="0"
                step="1"
                required
                value={formData.calories}
                onChange={handleChange}
                className="input"
                placeholder="ex: 165"
              />
            </div>
            
            <div>
              <label htmlFor="serving" className="label">
                Porție *
              </label>
              <div className="flex">
                <input
                  id="serving"
                  name="serving"
                  type="number"
                  min="1"
                  required
                  value={formData.serving}
                  onChange={handleChange}
                  className="input rounded-r-none flex-1"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="input rounded-l-none w-20 border-l-0"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="buc">buc</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="protein" className="label">
                Proteine (g)
              </label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={handleChange}
                className="input"
                placeholder="ex: 31"
              />
            </div>
            
            <div>
              <label htmlFor="carbs" className="label">
                Carbohidrați (g)
              </label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={handleChange}
                className="input"
                placeholder="ex: 0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fat" className="label">
                Grăsimi (g)
              </label>
              <input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={handleChange}
                className="input"
                placeholder="ex: 3.6"
              />
            </div>
            
            <div>
              <label htmlFor="fiber" className="label">
                Fibre (g)
              </label>
              <input
                id="fiber"
                name="fiber"
                type="number"
                min="0"
                step="0.1"
                value={formData.fiber}
                onChange={handleChange}
                className="input"
                placeholder="ex: 0"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="label">
              Categorie
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
            >
              <option value="protein">Proteine</option>
              <option value="carbs">Carbohidrați</option>
              <option value="fats">Grăsimi</option>
              <option value="vegetables">Legume</option>
              <option value="fruits">Fructe</option>
              <option value="dairy">Lactate</option>
              <option value="other">Altele</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/food-database')}
              className="btn-outline flex-1"
            >
              Anulează
            </button>
            
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFoodPage
