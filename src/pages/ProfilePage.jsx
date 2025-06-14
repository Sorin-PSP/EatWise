import React, { useState, useEffect } from 'react';
import { FaUser, FaWeight, FaRulerVertical, FaBirthdayCake, FaVenusMars, FaRunning, FaSave, FaGlobe } from 'react-icons/fa';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser } from '../contexts/UserContext';

function ProfilePage() {
  const { user, updateUser, getWeightUnit, getHeightUnit, convertWeight, convertHeight } = useUser();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || '',
    gender: user.gender || 'female',
    weight: user.weight || '',
    height: user.height || '',
    activityLevel: user.activityLevel || 'moderate',
    goal: user.goal || 'maintain',
    dailyCalorieGoal: user.dailyCalorieGoal || '',
    measurementSystem: user.measurementSystem || 'metric'
  });
  
  const [calculatedCalories, setCalculatedCalories] = useState(null);
  
  // Update form data when measurement system changes
  useEffect(() => {
    if (formData.weight && formData.height) {
      const newWeight = formData.measurementSystem === 'metric' 
        ? (user.measurementSystem === 'imperial' ? convertWeight(formData.weight, 'metric') : formData.weight)
        : (user.measurementSystem === 'metric' ? convertWeight(formData.weight, 'imperial') : formData.weight);
        
      const newHeight = formData.measurementSystem === 'metric'
        ? (user.measurementSystem === 'imperial' ? convertHeight(formData.height, 'metric') : formData.height)
        : (user.measurementSystem === 'metric' ? convertHeight(formData.height, 'imperial') : formData.height);
        
      setFormData(prev => ({
        ...prev,
        weight: newWeight,
        height: newHeight
      }));
    }
  }, [formData.measurementSystem, user.measurementSystem]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'measurementSystem') {
      // When changing measurement system, we need to convert the values
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const calculateBMR = () => {
    // Mifflin-St Jeor formula
    const { weight, height, age, gender, measurementSystem } = formData;
    
    if (!weight || !height || !age) {
      return null;
    }
    
    // Convert to metric for calculation if using imperial
    let weightInKg = weight;
    let heightInCm = height;
    
    if (measurementSystem === 'imperial') {
      weightInKg = weight * 0.453592; // Convert lbs to kg
      heightInCm = height * 2.54; // Convert inches to cm
    }
    
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }
    
    return bmr;
  };
  
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    if (!bmr) return null;
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[formData.activityLevel]);
  };
  
  const calculateCalories = () => {
    const tdee = calculateTDEE();
    if (!tdee) return null;
    
    const goalAdjustments = {
      lose: -500,
      maintain: 0,
      gain: 500
    };
    
    const calories = tdee + goalAdjustments[formData.goal];
    setCalculatedCalories(calories);
    setFormData(prev => ({ ...prev, dailyCalorieGoal: calories }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save user data
    updateUser({ ...formData });
    
    alert('Profilul a fost salvat cu succes!');
  };
  
  // Get the appropriate weight and height units based on the selected measurement system
  const weightUnit = formData.measurementSystem === 'metric' ? 'kg' : 'lb';
  const heightUnit = formData.measurementSystem === 'metric' ? 'cm' : 'in';
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profilul meu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
                  <FaUser className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Informații personale</h2>
                  <p className="text-gray-600">Actualizează-ți datele pentru un calcul precis al caloriilor</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Nume"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Numele tău"
                />
                
                <Input
                  label="Vârstă"
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Vârsta ta"
                  icon={FaBirthdayCake}
                />
                
                <div className="mb-4">
                  <label htmlFor="gender" className="label">Gen</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Feminin
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Masculin
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="measurementSystem" className="label">Sistem de măsurare</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="measurementSystem"
                        value="metric"
                        checked={formData.measurementSystem === 'metric'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Metric (kg, cm)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="measurementSystem"
                        value="imperial"
                        checked={formData.measurementSystem === 'imperial'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      American (lb, in)
                    </label>
                  </div>
                </div>
                
                <Input
                  label={`Greutate (${weightUnit})`}
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder={`Greutatea ta în ${weightUnit}`}
                  icon={FaWeight}
                  helperText={formData.measurementSystem === 'metric' ? 
                    'Introduceți greutatea în kilograme' : 
                    'Introduceți greutatea în livre (pounds)'}
                />
                
                <Input
                  label={`Înălțime (${heightUnit})`}
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder={`Înălțimea ta în ${heightUnit}`}
                  icon={FaRulerVertical}
                  helperText={formData.measurementSystem === 'metric' ? 
                    'Introduceți înălțimea în centimetri' : 
                    'Introduceți înălțimea în inchi (inches)'}
                />
                
                <div className="mb-4">
                  <label htmlFor="activityLevel" className="label">Nivel de activitate</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="sedentary">Sedentar (activitate minimă)</option>
                    <option value="light">Ușor activ (exerciții ușoare 1-3 zile/săptămână)</option>
                    <option value="moderate">Moderat activ (exerciții moderate 3-5 zile/săptămână)</option>
                    <option value="active">Foarte activ (exerciții intense 6-7 zile/săptămână)</option>
                    <option value="veryActive">Extrem de activ (exerciții intense zilnic + muncă fizică)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="goal" className="label">Obiectiv</label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="lose">Pierdere în greutate</option>
                    <option value="maintain">Menținere greutate</option>
                    <option value="gain">Creștere în greutate</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <Button 
                  type="button" 
                  variant="secondary" 
                  icon={FaRunning}
                  onClick={calculateCalories}
                  className="flex-1"
                >
                  Calculează necesarul caloric
                </Button>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  icon={FaSave}
                  className="flex-1"
                >
                  Salvează profilul
                </Button>
              </div>
              
              {calculatedCalories && (
                <div className="bg-primary-light/20 p-4 rounded-lg border border-primary-light">
                  <h3 className="font-medium text-primary-dark mb-2">Necesarul tău caloric zilnic</h3>
                  <p>În funcție de datele tale și de obiectivul ales, necesarul tău caloric zilnic este de aproximativ:</p>
                  <p className="text-2xl font-bold text-primary mt-2">{calculatedCalories} calorii</p>
                </div>
              )}
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden h-64">
            <img 
              src="https://images.pexels.com/photos/3757954/pexels-photo-3757954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Healthy lifestyle" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Sfaturi pentru succes</h3>
              <p>Setează-ți obiective realiste și urmărește-ți progresul constant.</p>
            </div>
          </div>
          
          <Card>
            <h3 className="font-medium mb-4">Despre calculul caloriilor</h3>
            <p className="text-gray-700 mb-3">
              Calculul necesarului caloric se bazează pe formula Mifflin-St Jeor, care este considerată una dintre cele mai precise metode de estimare a metabolismului bazal (BMR).
            </p>
            <p className="text-gray-700">
              Apoi, în funcție de nivelul tău de activitate și obiectivul ales, se ajustează acest număr pentru a obține necesarul caloric zilnic total.
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaGlobe className="text-blue-500" />
              </div>
              <h3 className="font-medium">Sisteme de măsurare</h3>
            </div>
            <p className="text-gray-700 mb-3">
              Poți alege între sistemul metric (kg, cm) și sistemul american/imperial (lb, in) pentru măsurătorile tale.
            </p>
            <p className="text-gray-700">
              Toate calculele vor fi adaptate automat în funcție de sistemul ales, astfel încât să obții rezultate precise indiferent de preferința ta.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
