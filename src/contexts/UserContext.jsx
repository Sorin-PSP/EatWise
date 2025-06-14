import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: '',
    email: '',
    isLoggedIn: false,
    age: 0,
    gender: '',
    weight: 0,
    height: 0,
    activityLevel: 'sedentary',
    goal: 'maintain',
    dailyCalorieGoal: 2000,
    dailyProteinGoal: 100,
    dailyCarbsGoal: 250,
    dailyFatGoal: 65,
    measurementSystem: 'metric', // Default to metric system
  })

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedAuth = localStorage.getItem('eatwise-auth')
    const savedProfile = localStorage.getItem('eatwise-user')
    
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      setUser(prev => ({ ...prev, ...authData }))
    }
    
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile)
      setUser(prev => ({ ...prev, ...profileData }))
    }
  }, [])

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    
    // Store auth data separately from profile data
    if ('isLoggedIn' in userData) {
      localStorage.setItem('eatwise-auth', JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email,
        isLoggedIn: updatedUser.isLoggedIn
      }))
    } else {
      localStorage.setItem('eatwise-user', JSON.stringify({
        age: updatedUser.age,
        gender: updatedUser.gender,
        weight: updatedUser.weight,
        height: updatedUser.height,
        activityLevel: updatedUser.activityLevel,
        goal: updatedUser.goal,
        dailyCalorieGoal: updatedUser.dailyCalorieGoal,
        dailyProteinGoal: updatedUser.dailyProteinGoal,
        dailyCarbsGoal: updatedUser.dailyCarbsGoal,
        dailyFatGoal: updatedUser.dailyFatGoal,
        measurementSystem: updatedUser.measurementSystem
      }))
    }
  }

  const logout = () => {
    setUser({
      ...user,
      isLoggedIn: false,
      email: ''
    })
    localStorage.removeItem('eatwise-auth')
  }

  // Convert weight between metric and imperial
  const convertWeight = (weight, toSystem) => {
    if (!weight) return 0
    
    if (toSystem === 'metric') {
      // Convert from lbs to kg
      return Math.round(weight * 0.453592 * 10) / 10
    } else {
      // Convert from kg to lbs
      return Math.round(weight * 2.20462 * 10) / 10
    }
  }

  // Convert height between metric and imperial
  const convertHeight = (height, toSystem) => {
    if (!height) return 0
    
    if (toSystem === 'metric') {
      // Convert from inches to cm
      return Math.round(height * 2.54)
    } else {
      // Convert from cm to inches
      return Math.round(height / 2.54 * 10) / 10
    }
  }

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (!user.weight || !user.height || !user.age) return 0
    
    // Convert measurements to metric for calculation if needed
    let weight = user.weight
    let height = user.height
    
    if (user.measurementSystem === 'imperial') {
      weight = convertWeight(weight, 'metric')
      height = convertHeight(height, 'metric')
    }
    
    if (user.gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * user.age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * user.age - 161
    }
  }

  const calculateTDEE = () => {
    const bmr = calculateBMR()
    const activityMultipliers = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extraActive: 1.9
    }
    
    return Math.round(bmr * activityMultipliers[user.activityLevel])
  }

  const calculateCalorieGoal = () => {
    const tdee = calculateTDEE()
    const goalAdjustments = {
      loseWeight: -500,
      maintain: 0,
      gainWeight: 500
    }
    
    return tdee + goalAdjustments[user.goal]
  }

  // Get weight unit based on measurement system
  const getWeightUnit = () => {
    return user.measurementSystem === 'metric' ? 'kg' : 'lb'
  }

  // Get height unit based on measurement system
  const getHeightUnit = () => {
    return user.measurementSystem === 'metric' ? 'cm' : 'in'
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      updateUser,
      logout, 
      calculateBMR, 
      calculateTDEE,
      calculateCalorieGoal,
      convertWeight,
      convertHeight,
      getWeightUnit,
      getHeightUnit
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
