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
  
  // Update form data when user data changes
  useEffect(() => {
    setFormData({
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
  }, [user]);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save user data
    const result = await updateUser({ ...formData });
    
    if (result.success) {
      alert('Profile saved successfully!');
    } else {
      alert(`Error saving profile: ${result.error}`);
    }
  };
  
  // Get the appropriate weight and height units based on the selected measurement system
  const weightUnit = formData.measurementSystem === 'metric' ? 'kg' : 'lb';
  const heightUnit = formData.measurementSystem === 'metric' ? 'cm' : 'in';
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
                  <FaUser className="text-primary text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <p className="text-gray-600">Update your data for accurate calorie calculations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                
                <Input
                  label="Age"
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  icon={FaBirthdayCake}
                />
                
                <div className="mb-4">
                  <label htmlFor="gender" className="label">Gender</label>
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
                      Female
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
                      Male
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="measurementSystem" className="label">Measurement System</label>
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
                      Imperial (lb, in)
                    </label>
                  </div>
                </div>
                
                <Input
                  label={`Weight (${weightUnit})`}
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder={`Your weight in ${weightUnit}`}
                  icon={FaWeight}
                  helperText={formData.measurementSystem === 'metric' ? 
                    'Enter weight in kilograms' : 
                    'Enter weight in pounds'}
                />
                
                <Input
                  label={`Height (${heightUnit})`}
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder={`Your height in ${heightUnit}`}
                  icon={FaRulerVertical}
                  helperText={formData.measurementSystem === 'metric' ? 
                    'Enter height in centimeters' : 
                    'Enter height in inches'}
                />
                
                <div className="mb-4">
                  <label htmlFor="activityLevel" className="label">Activity Level</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="sedentary">Sedentary (minimal activity)</option>
                    <option value="light">Lightly active (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
                    <option value="active">Very active (intense exercise 6-7 days/week)</option>
                    <option value="veryActive">Extremely active (intense daily exercise + physical job)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="goal" className="label">Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="lose">Weight loss</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Weight gain</option>
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
                  Calculate calorie needs
                </Button>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  icon={FaSave}
                  className="flex-1"
                >
                  Save profile
                </Button>
              </div>
              
              {calculatedCalories && (
                <div className="bg-primary-light/20 p-4 rounded-lg border border-primary-light">
                  <h3 className="font-medium text-primary-dark mb-2">Your daily calorie needs</h3>
                  <p>Based on your data and chosen goal, your daily calorie needs are approximately:</p>
                  <p className="text-2xl font-bold text-primary mt-2">{calculatedCalories} calories</p>
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
              <h3 className="text-xl font-semibold mb-2">Tips for Success</h3>
              <p>Set realistic goals and track your progress consistently.</p>
            </div>
          </div>
          
          <Card>
            <h3 className="font-medium mb-4">About Calorie Calculation</h3>
            <p className="text-gray-700 mb-3">
              The calorie calculation is based on the Mifflin-St Jeor formula, which is considered one of the most accurate methods for estimating basal metabolic rate (BMR).
            </p>
            <p className="text-gray-700">
              Then, based on your activity level and chosen goal, this number is adjusted to obtain your total daily calorie needs.
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaGlobe className="text-blue-500" />
              </div>
              <h3 className="font-medium">Measurement Systems</h3>
            </div>
            <p className="text-gray-700 mb-3">
              You can choose between the metric system (kg, cm) and the imperial system (lb, in) for your measurements.
            </p>
            <p className="text-gray-700">
              All calculations will be automatically adapted based on the chosen system, so you get accurate results regardless of your preference.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
